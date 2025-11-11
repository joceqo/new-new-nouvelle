import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Query: Get all pages in a workspace
export const list = query({
  args: {
    workspaceId: v.id("workspaces"),
    includeArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    if (!args.includeArchived) {
      return pages.filter((page) => !page.isArchived);
    }

    return pages;
  },
});

// Query: Get a single page by ID
export const get = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.pageId);
  },
});

// Query: Get child pages of a parent (or root pages if no parent)
export const getChildren = query({
  args: {
    workspaceId: v.id("workspaces"),
    parentPageId: v.optional(v.id("pages")),
  },
  handler: async (ctx, args) => {
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_workspace_and_parent", (q) =>
        q
          .eq("workspaceId", args.workspaceId)
          .eq("parentPageId", args.parentPageId)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("asc")
      .collect();

    // Sort by position
    return pages.sort((a, b) => a.position - b.position);
  },
});

// Query: Get favorite pages
export const getFavorites = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_workspace_and_favorite", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("isFavorite", true)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
  },
});

// Query: Get recently opened pages
export const getRecent = query({
  args: {
    workspaceId: v.id("workspaces"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.neq(q.field("lastOpenedAt"), undefined))
      .collect();

    // Sort by lastOpenedAt descending
    const sorted = pages
      .filter((p) => !p.isArchived)
      .sort((a, b) => (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0));

    return args.limit ? sorted.slice(0, args.limit) : sorted;
  },
});

// Query: Get archived pages
export const getArchived = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_workspace_and_archived", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("isArchived", true)
      )
      .collect();
  },
});

// Mutation: Create a new page
export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    parentPageId: v.optional(v.id("pages")),
    title: v.string(),
    icon: v.optional(v.string()),
    visibility: v.optional(v.string()),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = args.createdBy;

    // Get the position for the new page
    const siblings = await ctx.db
      .query("pages")
      .withIndex("by_workspace_and_parent", (q) =>
        q
          .eq("workspaceId", args.workspaceId)
          .eq("parentPageId", args.parentPageId)
      )
      .collect();

    const maxPosition =
      siblings.length > 0 ? Math.max(...siblings.map((s) => s.position)) : 0;

    const now = Date.now();

    const pageId = await ctx.db.insert("pages", {
      workspaceId: args.workspaceId,
      parentPageId: args.parentPageId,
      title: args.title || "Untitled",
      icon: args.icon,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      visibility: args.visibility || "workspace",
      position: maxPosition + 1,
    });

    return pageId;
  },
});

// Mutation: Update a page
export const update = mutation({
  args: {
    pageId: v.id("pages"),
    title: v.optional(v.string()),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    visibility: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { pageId, ...updates } = args;

    await ctx.db.patch(pageId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return pageId;
  },
});

// Mutation: Move a page to a new parent
export const move = mutation({
  args: {
    pageId: v.id("pages"),
    newParentPageId: v.optional(v.id("pages")),
    position: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");

    // Get siblings at the new location
    const siblings = await ctx.db
      .query("pages")
      .withIndex("by_workspace_and_parent", (q) =>
        q
          .eq("workspaceId", page.workspaceId)
          .eq("parentPageId", args.newParentPageId)
      )
      .collect();

    const position = args.position ?? siblings.length + 1;

    await ctx.db.patch(args.pageId, {
      parentPageId: args.newParentPageId,
      position,
      updatedAt: Date.now(),
    });

    return args.pageId;
  },
});

// Mutation: Archive a page
export const archive = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.pageId, {
      isArchived: true,
      updatedAt: Date.now(),
    });

    return args.pageId;
  },
});

// Mutation: Restore a page from archive
export const restore = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.pageId, {
      isArchived: false,
      updatedAt: Date.now(),
    });

    return args.pageId;
  },
});

// Mutation: Delete a page permanently
export const remove = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    // TODO: Also delete all child pages
    // For now, just delete the page
    await ctx.db.delete(args.pageId);
  },
});

// Mutation: Update last opened timestamp
export const markAsOpened = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.pageId, {
      lastOpenedAt: Date.now(),
    });
  },
});

// Mutation: Toggle favorite status
export const toggleFavorite = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");

    await ctx.db.patch(args.pageId, {
      isFavorite: !page.isFavorite,
      updatedAt: Date.now(),
    });

    return args.pageId;
  },
});

// Mutation: Reorder pages
export const reorder = mutation({
  args: {
    pageIds: v.array(v.id("pages")),
  },
  handler: async (ctx, args) => {
    // Update position for each page
    for (let i = 0; i < args.pageIds.length; i++) {
      await ctx.db.patch(args.pageIds[i], {
        position: i,
        updatedAt: Date.now(),
      });
    }
  },
});
