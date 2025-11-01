import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add member to workspace
export const add = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.string(), // "owner", "admin", "member", "guest"
  },
  handler: async (ctx, args) => {
    // Check if member already exists
    const existing = await ctx.db
      .query("workspace_members")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", args.userId)
      )
      .first();

    if (existing) {
      // Update role if member already exists
      await ctx.db.patch(existing._id, {
        role: args.role,
      });
      return existing._id;
    }

    // Add new member
    return await ctx.db.insert("workspace_members", {
      workspaceId: args.workspaceId,
      userId: args.userId,
      role: args.role,
      joinedAt: Date.now(),
    });
  },
});

// Remove member from workspace
export const remove = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("workspace_members")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", args.userId)
      )
      .first();

    if (member) {
      await ctx.db.delete(member._id);
    }

    return { success: true };
  },
});

// Update member role
export const updateRole = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("workspace_members")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", args.userId)
      )
      .first();

    if (!member) {
      throw new Error("Member not found");
    }

    await ctx.db.patch(member._id, {
      role: args.role,
    });

    return member._id;
  },
});

// Get all members of a workspace
export const listByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("workspace_members")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    // Fetch user details for each member
    const members = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        return user
          ? {
              ...membership,
              user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
              },
            }
          : null;
      })
    );

    return members.filter((m) => m !== null);
  },
});

// Get member's role in a workspace
export const getRole = query({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("workspace_members")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", args.userId)
      )
      .first();

    return member?.role || null;
  },
});

// Check if user is member of workspace
export const isMember = query({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("workspace_members")
      .withIndex("by_workspace_and_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", args.userId)
      )
      .first();

    return member !== null;
  },
});

// Get member count for a workspace
export const count = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("workspace_members")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return members.length;
  },
});
