import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@nouvelle/convex";
import type { Id } from "@nouvelle/convex";

const convex = new ConvexHttpClient(
  process.env.CONVEX_URL || "http://127.0.0.1:3210"
);

export function createPagesRoutes() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  return new Elysia({ prefix: "/workspaces/:workspaceId" })
    .use(
      jwt({
        name: "jwt",
        secret: jwtSecret,
      })
    )
    .derive(async ({ headers, jwt, set }) => {
      console.log("[pages.ts] Auth derive running");

      // Extract token from Authorization header
      const authorization = headers["authorization"];
      if (!authorization || !authorization.startsWith("Bearer ")) {
        set.status = 401;
        throw new Error("Unauthorized");
      }

      const token = authorization.substring(7);
      console.log("[pages.ts] Verifying token:", token.substring(0, 20) + "...");

      const payload = await jwt.verify(token);
      console.log("[pages.ts] JWT payload:", payload);

      if (!payload || typeof payload.userId !== "string") {
        set.status = 401;
        throw new Error("Invalid token");
      }

      console.log("[pages.ts] User authenticated:", { userId: payload.userId, email: payload.email });

      return {
        user: {
          id: payload.userId,
          email: payload.email,
        },
      };
    })
  // Get all pages in a workspace
  .get(
    "/pages",
    async ({ params, query }) => {
      const { workspaceId } = params;
      const { includeArchived } = query;

      const pages = await convex.query(api.pages.list, {
        workspaceId: workspaceId as Id<"workspaces">,
        includeArchived: includeArchived === "true",
      });

      return {
        success: true,
        pages,
      };
    },
    {
      params: t.Object({
        workspaceId: t.String(),
      }),
      query: t.Object({
        includeArchived: t.Optional(t.String()),
      }),
    }
  )

  // Get favorite pages
  .get(
    "/pages/favorites",
    async ({ params }) => {
      const { workspaceId } = params;

      const pages = await convex.query(api.pages.getFavorites, {
        workspaceId: workspaceId as Id<"workspaces">,
      });

      return {
        success: true,
        pages,
      };
    },
    {
      params: t.Object({
        workspaceId: t.String(),
      }),
    }
  )

  // Get recent pages
  .get(
    "/pages/recent",
    async ({ params, query }) => {
      const { workspaceId } = params;
      const { limit } = query;

      const pages = await convex.query(api.pages.getRecent, {
        workspaceId: workspaceId as Id<"workspaces">,
        limit: limit ? parseInt(limit) : undefined,
      });

      return {
        success: true,
        pages,
      };
    },
    {
      params: t.Object({
        workspaceId: t.String(),
      }),
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
    }
  )

  // Create a new page
  .post(
    "/pages",
    async ({ params, body, user, set }) => {
      try {
        const { workspaceId } = params;
        const { title, parentId, icon, visibility } = body;

        // Log for debugging
        console.log("[pages.ts] POST /pages - user:", user);

        if (!user) {
          set.status = 401;
          return {
            success: false,
            error: "User not authenticated",
          };
        }

        const pageId = await convex.mutation(api.pages.create, {
          workspaceId: workspaceId as Id<"workspaces">,
          title: title || "Untitled",
          parentPageId: parentId as Id<"pages"> | undefined,
          icon,
          visibility: visibility || "private",
          createdBy: user.id as Id<"users">,
        });

        return {
          success: true,
          pageId,
        };
      } catch (error) {
        console.error("[pages.ts] Error creating page:", error);
        set.status = 500;
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to create page",
        };
      }
    },
    {
      params: t.Object({
        workspaceId: t.String(),
      }),
      body: t.Object({
        title: t.String(),
        parentId: t.Optional(t.String()),
        icon: t.Optional(t.String()),
        visibility: t.Optional(t.String()),
      }),
    }
  );

}

// Routes for individual pages
export function createPageRoutes() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  return new Elysia({ prefix: "/pages" })
    .use(
      jwt({
        name: "jwt",
        secret: jwtSecret,
      })
    )
    .derive(async ({ headers, jwt, set }) => {
      // Extract token from Authorization header
      const authorization = headers["authorization"];
      if (!authorization || !authorization.startsWith("Bearer ")) {
        set.status = 401;
        throw new Error("Unauthorized");
      }

      const token = authorization.substring(7);
      const payload = await jwt.verify(token);

      if (!payload || typeof payload.userId !== "string") {
        set.status = 401;
        throw new Error("Invalid token");
      }

      return {
        user: {
          id: payload.userId,
          email: payload.email,
        },
      };
    })
  // Get a single page
  .get(
    "/:pageId",
    async ({ params }) => {
      const { pageId } = params;

      const page = await convex.query(api.pages.get, {
        pageId: pageId as Id<"pages">,
      });

      if (!page) {
        return {
          success: false,
          error: "Page not found",
        };
      }

      return {
        success: true,
        page,
      };
    },
    {
      params: t.Object({
        pageId: t.String(),
      }),
    }
  )

  // Update a page
  .patch(
    "/:pageId",
    async ({ params, body }) => {
      const { pageId } = params;

      await convex.mutation(api.pages.update, {
        pageId: pageId as Id<"pages">,
        ...body,
      });

      return {
        success: true,
      };
    },
    {
      params: t.Object({
        pageId: t.String(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        icon: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
        visibility: t.Optional(t.String()),
        isFavorite: t.Optional(t.Boolean()),
        isPinned: t.Optional(t.Boolean()),
      }),
    }
  )

  // Delete a page
  .delete(
    "/:pageId",
    async ({ params }) => {
      const { pageId } = params;

      await convex.mutation(api.pages.remove, {
        pageId: pageId as Id<"pages">,
      });

      return {
        success: true,
      };
    },
    {
      params: t.Object({
        pageId: t.String(),
      }),
    }
  )

  // Toggle favorite
  .post(
    "/:pageId/favorite",
    async ({ params }) => {
      const { pageId } = params;

      await convex.mutation(api.pages.toggleFavorite, {
        pageId: pageId as Id<"pages">,
      });

      return {
        success: true,
      };
    },
    {
      params: t.Object({
        pageId: t.String(),
      }),
    }
  )

  // Archive a page
  .post(
    "/:pageId/archive",
    async ({ params }) => {
      const { pageId } = params;

      await convex.mutation(api.pages.archive, {
        pageId: pageId as Id<"pages">,
      });

      return {
        success: true,
      };
    },
    {
      params: t.Object({
        pageId: t.String(),
      }),
    }
  )

  // Restore a page
  .post(
    "/:pageId/restore",
    async ({ params }) => {
      const { pageId } = params;

      await convex.mutation(api.pages.restore, {
        pageId: pageId as Id<"pages">,
      });

      return {
        success: true,
      };
    },
    {
      params: t.Object({
        pageId: t.String(),
      }),
    }
  );
}
