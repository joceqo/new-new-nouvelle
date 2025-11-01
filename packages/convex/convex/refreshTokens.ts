import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store refresh token
export const store = mutation({
  args: {
    userId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("refreshTokens", {
      userId: args.userId,
      token: args.token,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
      revoked: false,
    });
  },
});

// Get refresh token by token string
export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("refreshTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
  },
});

// Revoke refresh token
export const revoke = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const refreshToken = await ctx.db
      .query("refreshTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (refreshToken) {
      await ctx.db.patch(refreshToken._id, {
        revoked: true,
      });
    }
  },
});

// Revoke all tokens for a user
export const revokeAllForUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const tokens = await ctx.db
      .query("refreshTokens")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    for (const token of tokens) {
      await ctx.db.patch(token._id, {
        revoked: true,
      });
    }

    return tokens.length;
  },
});

// Delete refresh token (permanent removal)
export const deleteToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const refreshToken = await ctx.db
      .query("refreshTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (refreshToken) {
      await ctx.db.delete(refreshToken._id);
    }
  },
});

// Clear expired tokens
export const clearExpired = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("refreshTokens")
      .withIndex("by_expiresAt")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const token of expired) {
      await ctx.db.delete(token._id);
    }

    return expired.length;
  },
});
