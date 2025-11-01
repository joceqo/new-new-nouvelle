import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store OTP
export const store = mutation({
  args: {
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Delete any existing OTP for this email
    const existing = await ctx.db
      .query("otps")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    // Insert new OTP
    return await ctx.db.insert("otps", {
      email: args.email,
      code: args.code,
      expiresAt: args.expiresAt,
      attempts: 0,
      createdAt: Date.now(),
    });
  },
});

// Get OTP by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("otps")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Increment attempts
export const incrementAttempts = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const otp = await ctx.db
      .query("otps")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!otp) {
      return null;
    }

    await ctx.db.patch(otp._id, {
      attempts: otp.attempts + 1,
    });

    return otp.attempts + 1;
  },
});

// Delete OTP
export const deleteOtp = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const otp = await ctx.db
      .query("otps")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (otp) {
      await ctx.db.delete(otp._id);
    }
  },
});

// Clear expired OTPs
export const clearExpired = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("otps")
      .withIndex("by_expiresAt")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const otp of expired) {
      await ctx.db.delete(otp._id);
    }

    return expired.length;
  },
});
