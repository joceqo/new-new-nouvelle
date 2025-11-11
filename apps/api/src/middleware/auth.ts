import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { logger } from "../lib/logger";

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

// Create authentication middleware (with built-in auth requirement)
export function createAuthMiddleware() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET environment variable is required. Please set it in your .env file."
    );
  }

  return new Elysia({ name: "auth-middleware" })
    .use(
      jwt({
        name: "jwt",
        secret: jwtSecret,
      })
    )
    .derive(async ({ headers, jwt, set }) => {
      console.log("[auth.ts] Auth middleware running");

      // Extract token from Authorization header
      const authHeader = headers.authorization;
      console.log("[auth.ts] Authorization header:", authHeader ? "present" : "missing");

      if (!authHeader) {
        logger.debug("No authorization header found");
        return { user: null };
      }

      // Check for Bearer token format
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      if (!token) {
        logger.debug("No token found in authorization header");
        console.log("[auth.ts] No token extracted");
        return { user: null };
      }

      try {
        // Verify JWT token
        console.log("[auth.ts] Verifying token:", token.substring(0, 20) + "...");
        logger.debug({ token: token.substring(0, 20) + "..." }, "Verifying JWT token");
        const payload = (await jwt.verify(token)) as JWTPayload | false;

        console.log("[auth.ts] JWT verify result:", payload);

        if (!payload) {
          logger.warn("JWT verification failed - invalid token");
          console.log("[auth.ts] JWT verification returned false");
          return { user: null };
        }

        logger.info({ userId: payload.userId, email: payload.email }, "User authenticated successfully");
        console.log("[auth.ts] User authenticated:", { userId: payload.userId, email: payload.email });

        // Return user info
        return {
          user: {
            id: payload.userId,
            email: payload.email,
          },
        };
      } catch (error) {
        logger.error({ error }, "JWT verification error");
        console.error("[auth.ts] JWT verification error:", error);
        return { user: null };
      }
    })
    .onBeforeHandle(({ user, set }) => {
      console.log("[auth.ts] Checking authentication - user:", user);
      if (!user) {
        console.log("[auth.ts] User is null, returning 401");
        set.status = 401;
        return { error: "Unauthorized - Authentication required" };
      }
      console.log("[auth.ts] User authenticated, proceeding");
    });
}
