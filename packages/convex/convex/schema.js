import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
    users: defineTable({
        email: v.string(),
        createdAt: v.number(),
        lastLoginAt: v.number(),
    })
        .index("by_email", ["email"]),
    sessions: defineTable({
        userId: v.id("users"),
        token: v.string(),
        expiresAt: v.number(),
        createdAt: v.number(),
    })
        .index("by_token", ["token"])
        .index("by_userId", ["userId"]),
    otps: defineTable({
        email: v.string(),
        code: v.string(),
        expiresAt: v.number(),
        attempts: v.number(),
        createdAt: v.number(),
    })
        .index("by_email", ["email"])
        .index("by_expiresAt", ["expiresAt"]),
    refreshTokens: defineTable({
        userId: v.string(), // Store as string for compatibility
        token: v.string(),
        expiresAt: v.number(),
        createdAt: v.number(),
        revoked: v.optional(v.boolean()),
    })
        .index("by_token", ["token"])
        .index("by_userId", ["userId"])
        .index("by_expiresAt", ["expiresAt"]),
});
