import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new workspace
export const create = mutation({
  args: {
    name: v.string(),
    ownerId: v.id("users"),
    icon: v.optional(v.string()),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Create the workspace
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      icon: args.icon,
      slug: args.slug,
      ownerId: args.ownerId,
      plan: "free",
      createdAt: now,
      updatedAt: now,
    });

    // Add owner as first member
    await ctx.db.insert("workspace_members", {
      workspaceId,
      userId: args.ownerId,
      role: "owner",
      joinedAt: now,
    });

    return workspaceId;
  },
});

// Get workspace by ID
export const getById = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.workspaceId);
  },
});

// Get workspace by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get all workspaces for a user
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get all workspace memberships for this user
    const memberships = await ctx.db
      .query("workspace_members")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Fetch the actual workspace data for each membership
    const workspaces = await Promise.all(
      memberships.map(async (membership) => {
        const workspace = await ctx.db.get(membership.workspaceId);
        return workspace
          ? {
              ...workspace,
              role: membership.role,
              joinedAt: membership.joinedAt,
            }
          : null;
      })
    );

    // Filter out any null values and sort by joinedAt (most recent first)
    return workspaces
      .filter((w) => w !== null)
      .sort((a, b) => b!.joinedAt - a!.joinedAt);
  },
});

// Update workspace
export const update = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { workspaceId, ...updates } = args;

    await ctx.db.patch(workspaceId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return workspaceId;
  },
});

// Delete workspace
export const remove = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    // Delete all members first
    const members = await ctx.db
      .query("workspace_members")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Delete all invites
    const invites = await ctx.db
      .query("workspace_invites")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    for (const invite of invites) {
      await ctx.db.delete(invite._id);
    }

    // Delete the workspace
    await ctx.db.delete(args.workspaceId);

    return { success: true };
  },
});
