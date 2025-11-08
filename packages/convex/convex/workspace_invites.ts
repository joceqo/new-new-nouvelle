import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new invite
export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    invitedBy: v.id("users"),
    email: v.string(),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if there's already a pending invite for this email to this workspace
    const existing = await ctx.db
      .query("workspace_invites")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) => q.eq(q.field("acceptedAt"), undefined))
      .first();

    if (existing) {
      // Update the existing invite with new token and expiry
      await ctx.db.patch(existing._id, {
        token: args.token,
        expiresAt: args.expiresAt,
        invitedBy: args.invitedBy,
      });
      return existing._id;
    }

    // Create new invite
    return await ctx.db.insert("workspace_invites", {
      workspaceId: args.workspaceId,
      invitedBy: args.invitedBy,
      email: args.email,
      token: args.token,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
  },
});

// Get invite by token
export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("workspace_invites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invite) {
      return null;
    }

    // Fetch workspace details
    const workspace = await ctx.db.get(invite.workspaceId);

    // Fetch inviter details
    const inviter = await ctx.db.get(invite.invitedBy);

    return {
      ...invite,
      workspace: workspace ? {
        id: workspace._id,
        name: workspace.name,
        icon: workspace.icon,
      } : null,
      inviter: inviter ? {
        id: inviter._id,
        email: inviter.email,
        name: inviter.name,
      } : null,
    };
  },
});

// Accept an invite
export const accept = mutation({
  args: {
    token: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("workspace_invites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invite) {
      throw new Error("Invite not found");
    }

    // Check if already accepted
    if (invite.acceptedAt) {
      throw new Error("Invite already accepted");
    }

    // Check if expired
    if (Date.now() > invite.expiresAt) {
      throw new Error("Invite has expired");
    }

    // Mark invite as accepted
    await ctx.db.patch(invite._id, {
      acceptedAt: Date.now(),
    });

    // Add user as member to workspace
    await ctx.db.insert("workspace_members", {
      workspaceId: invite.workspaceId,
      userId: args.userId,
      role: "member",
      joinedAt: Date.now(),
    });

    return invite.workspaceId;
  },
});

// Revoke an invite
export const revoke = mutation({
  args: { inviteId: v.id("workspace_invites") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.inviteId);
    return { success: true };
  },
});

// List all pending invites for a workspace
export const listByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const invites = await ctx.db
      .query("workspace_invites")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("acceptedAt"), undefined))
      .collect();

    // Fetch inviter details for each invite
    const invitesWithDetails = await Promise.all(
      invites.map(async (invite) => {
        const inviter = await ctx.db.get(invite.invitedBy);
        return {
          ...invite,
          inviter: inviter ? {
            id: inviter._id,
            email: inviter.email,
            name: inviter.name,
          } : null,
        };
      })
    );

    return invitesWithDetails;
  },
});

// List all pending invites for an email
export const listByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const invites = await ctx.db
      .query("workspace_invites")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("acceptedAt"), undefined))
      .filter((q) => q.gt(q.field("expiresAt"), Date.now()))
      .collect();

    // Fetch workspace details for each invite
    const invitesWithDetails = await Promise.all(
      invites.map(async (invite) => {
        const workspace = await ctx.db.get(invite.workspaceId);
        const inviter = await ctx.db.get(invite.invitedBy);

        return {
          ...invite,
          workspace: workspace ? {
            id: workspace._id,
            name: workspace.name,
            icon: workspace.icon,
          } : null,
          inviter: inviter ? {
            id: inviter._id,
            email: inviter.email,
            name: inviter.name,
          } : null,
        };
      })
    );

    return invitesWithDetails.filter(i => i.workspace !== null);
  },
});

// Clean up expired invites (to be called periodically)
export const cleanupExpired = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("workspace_invites")
      .withIndex("by_expiresAt")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .filter((q) => q.eq(q.field("acceptedAt"), undefined))
      .collect();

    for (const invite of expired) {
      await ctx.db.delete(invite._id);
    }

    return { deleted: expired.length };
  },
});
