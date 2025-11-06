import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    defaultWorkspaceId: v.optional(v.id("workspaces")),
    createdAt: v.number(),
    lastLoginAt: v.number(),
  }).index("by_email", ["email"]),

  workspaces: defineTable({
    name: v.string(),
    icon: v.optional(v.string()),
    slug: v.string(),
    ownerId: v.id("users"),
    plan: v.optional(v.string()), // "free", "pro", "enterprise"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_ownerId", ["ownerId"]),

  workspace_members: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.string(), // "owner", "admin", "member", "guest"
    joinedAt: v.number(),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_userId", ["userId"])
    .index("by_workspace_and_user", ["workspaceId", "userId"]),

  workspace_invites: defineTable({
    workspaceId: v.id("workspaces"),
    invitedBy: v.id("users"),
    email: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_email", ["email"])
    .index("by_workspaceId", ["workspaceId"])
    .index("by_expiresAt", ["expiresAt"]),

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

  pages: defineTable({
    workspaceId: v.id("workspaces"),
    parentPageId: v.optional(v.id("pages")),
    title: v.string(),
    icon: v.optional(v.string()), // emoji or icon identifier
    coverImage: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastOpenedAt: v.optional(v.number()),
    // Permissions and visibility
    visibility: v.string(), // "private", "workspace", "public"
    // Metadata flags
    isFavorite: v.optional(v.boolean()),
    isArchived: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
    // Position for ordering (within same parent)
    position: v.number(),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_parentPageId", ["parentPageId"])
    .index("by_createdBy", ["createdBy"])
    .index("by_workspace_and_parent", ["workspaceId", "parentPageId"])
    .index("by_workspace_and_archived", ["workspaceId", "isArchived"])
    .index("by_workspace_and_favorite", ["workspaceId", "isFavorite"]),
});
