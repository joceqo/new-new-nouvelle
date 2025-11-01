import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { convexClient, api } from '../lib/convex-client';
import { authLogger } from '../lib/logger';
import {
  generateInviteToken,
  validateWorkspaceName,
  validateWorkspaceSlug,
  sanitizeWorkspaceName,
  sanitizeWorkspaceIcon,
  generateSlugFromName,
  getInviteExpiryTimestamp,
} from '../lib/workspace-utils';

export function createWorkspaceRoutes() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return new Elysia({ prefix: '/workspaces' })
    .use(
      jwt({
        name: 'jwt',
        secret: jwtSecret,
      })
    )
    .derive(async ({ headers, jwt, set }) => {
      // Auth middleware - extract user from token
      const authorization = headers['authorization'];
      if (!authorization || !authorization.startsWith('Bearer ')) {
        set.status = 401;
        throw new Error('Unauthorized');
      }

      const token = authorization.substring(7);
      const payload = await jwt.verify(token);

      if (!payload || typeof payload.userId !== 'string') {
        set.status = 401;
        throw new Error('Invalid token');
      }

      return {
        userId: payload.userId,
        userEmail: payload.email,
      };
    })
    .get('/', async ({ userId }) => {
      try {
        const workspaces = await convexClient.query(api.workspaces.listByUser, {
          userId: userId as any,
        });

        return {
          success: true,
          workspaces: workspaces.map((w: any) => ({
            id: w._id,
            name: w.name,
            icon: w.icon,
            slug: w.slug,
            plan: w.plan,
            role: w.role,
            ownerId: w.ownerId,
            createdAt: w.createdAt,
            updatedAt: w.updatedAt,
            joinedAt: w.joinedAt,
          })),
        };
      } catch (error) {
        authLogger.error({ err: error, userId }, 'List workspaces error');
        throw new Error('Failed to list workspaces');
      }
    })
    .get('/:workspaceId', async ({ params, userId, set }) => {
      try {
        const { workspaceId } = params;

        // Check if user is a member
        const isMember = await convexClient.query(api.workspace_members.isMember, {
          workspaceId: workspaceId as any,
          userId: userId as any,
        });

        if (!isMember) {
          set.status = 403;
          return { error: 'Access denied' };
        }

        const workspace = await convexClient.query(api.workspaces.getById, {
          workspaceId: workspaceId as any,
        });

        if (!workspace) {
          set.status = 404;
          return { error: 'Workspace not found' };
        }

        // Get member count
        const memberCount = await convexClient.query(api.workspace_members.count, {
          workspaceId: workspaceId as any,
        });

        // Get user's role
        const role = await convexClient.query(api.workspace_members.getRole, {
          workspaceId: workspaceId as any,
          userId: userId as any,
        });

        return {
          success: true,
          workspace: {
            id: workspace._id,
            name: workspace.name,
            icon: workspace.icon,
            slug: workspace.slug,
            plan: workspace.plan,
            ownerId: workspace.ownerId,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
            memberCount,
            role,
          },
        };
      } catch (error) {
        authLogger.error({ err: error, userId, workspaceId: params.workspaceId }, 'Get workspace error');
        throw new Error('Failed to get workspace');
      }
    })
    .post(
      '/',
      async ({ body, userId, set }) => {
        try {
          const { name, icon, slug } = body;

          // Sanitize inputs
          const sanitizedName = sanitizeWorkspaceName(name);
          const sanitizedIcon = sanitizeWorkspaceIcon(icon);

          // Validate workspace name
          const nameValidation = validateWorkspaceName(sanitizedName);
          if (!nameValidation.valid) {
            set.status = 400;
            return { error: nameValidation.error };
          }

          // Generate or validate slug
          let finalSlug: string;
          if (slug) {
            const slugValidation = validateWorkspaceSlug(slug);
            if (!slugValidation.valid) {
              set.status = 400;
              return { error: slugValidation.error };
            }
            finalSlug = slug;
          } else {
            finalSlug = generateSlugFromName(sanitizedName);
          }

          const workspaceId = await convexClient.mutation(api.workspaces.create, {
            name: sanitizedName,
            icon: sanitizedIcon,
            slug: finalSlug,
            ownerId: userId as any,
          });

          return {
            success: true,
            workspaceId,
          };
        } catch (error) {
          authLogger.error({ err: error, userId, body }, 'Create workspace error');

          // Handle duplicate slug error
          if (error instanceof Error && error.message.includes('duplicate') || error.message.includes('unique')) {
            set.status = 409;
            return { error: 'A workspace with this slug already exists' };
          }

          throw new Error('Failed to create workspace');
        }
      },
      {
        body: t.Object({
          name: t.String(),
          icon: t.Optional(t.String()),
          slug: t.Optional(t.String()),
        }),
      }
    )
    .patch(
      '/:workspaceId',
      async ({ params, body, userId, set }) => {
        try {
          const { workspaceId } = params;

          // Check if user is owner or admin
          const role = await convexClient.query(api.workspace_members.getRole, {
            workspaceId: workspaceId as any,
            userId: userId as any,
          });

          if (!role || (role !== 'owner' && role !== 'admin')) {
            set.status = 403;
            return { error: 'Only owners and admins can update workspace settings' };
          }

          // Sanitize and validate inputs
          const updates: any = {};

          if (body.name !== undefined) {
            const sanitizedName = sanitizeWorkspaceName(body.name);
            const nameValidation = validateWorkspaceName(sanitizedName);
            if (!nameValidation.valid) {
              set.status = 400;
              return { error: nameValidation.error };
            }
            updates.name = sanitizedName;
          }

          if (body.icon !== undefined) {
            updates.icon = sanitizeWorkspaceIcon(body.icon);
          }

          if (body.slug !== undefined) {
            const slugValidation = validateWorkspaceSlug(body.slug);
            if (!slugValidation.valid) {
              set.status = 400;
              return { error: slugValidation.error };
            }
            updates.slug = body.slug;
          }

          await convexClient.mutation(api.workspaces.update, {
            workspaceId: workspaceId as any,
            ...updates,
          });

          return { success: true };
        } catch (error) {
          authLogger.error({ err: error, userId, workspaceId: params.workspaceId }, 'Update workspace error');

          // Handle duplicate slug error
          if (error instanceof Error && (error.message.includes('duplicate') || error.message.includes('unique'))) {
            set.status = 409;
            return { error: 'A workspace with this slug already exists' };
          }

          throw new Error('Failed to update workspace');
        }
      },
      {
        body: t.Object({
          name: t.Optional(t.String()),
          icon: t.Optional(t.String()),
          slug: t.Optional(t.String()),
        }),
      }
    )
    .delete('/:workspaceId', async ({ params, userId, set }) => {
      try {
        const { workspaceId } = params;

        // Check if user is owner
        const role = await convexClient.query(api.workspace_members.getRole, {
          workspaceId: workspaceId as any,
          userId: userId as any,
        });

        if (!role || role !== 'owner') {
          set.status = 403;
          return { error: 'Only owners can delete workspace' };
        }

        await convexClient.mutation(api.workspaces.remove, {
          workspaceId: workspaceId as any,
        });

        return { success: true };
      } catch (error) {
        authLogger.error({ err: error, userId, workspaceId: params.workspaceId }, 'Delete workspace error');
        throw new Error('Failed to delete workspace');
      }
    })
    .get('/:workspaceId/members', async ({ params, userId, set }) => {
      try {
        const { workspaceId } = params;

        // Check if user is a member
        const isMember = await convexClient.query(api.workspace_members.isMember, {
          workspaceId: workspaceId as any,
          userId: userId as any,
        });

        if (!isMember) {
          set.status = 403;
          return { error: 'Access denied' };
        }

        const members = await convexClient.query(api.workspace_members.listByWorkspace, {
          workspaceId: workspaceId as any,
        });

        return {
          success: true,
          members,
        };
      } catch (error) {
        authLogger.error({ err: error, userId, workspaceId: params.workspaceId }, 'List members error');
        throw new Error('Failed to list members');
      }
    })
    .post(
      '/:workspaceId/invite',
      async ({ params, body, userId, set }) => {
        try {
          const { workspaceId } = params;
          const { email } = body;

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            set.status = 400;
            return { error: 'Invalid email address' };
          }

          // Check if user can invite (owner or admin)
          const role = await convexClient.query(api.workspace_members.getRole, {
            workspaceId: workspaceId as any,
            userId: userId as any,
          });

          if (!role || (role !== 'owner' && role !== 'admin')) {
            set.status = 403;
            return { error: 'Only owners and admins can invite members' };
          }

          // Generate cryptographically secure invite token
          const token = generateInviteToken();
          const expiresAt = getInviteExpiryTimestamp();

          // Create invite
          const inviteId = await convexClient.mutation(api.workspace_invites.create, {
            workspaceId: workspaceId as any,
            invitedBy: userId as any,
            email: email.toLowerCase().trim(),
            token,
            expiresAt,
          });

          // Get workspace for invite email
          const workspace = await convexClient.query(api.workspaces.getById, {
            workspaceId: workspaceId as any,
          });

          if (workspace) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const inviteLink = `${frontendUrl}/invite/${token}`;

            // Log invite creation (email sending not yet implemented)
            authLogger.info({ inviteLink, email, workspaceId, workspaceName: workspace.name }, 'Workspace invite created');

            // TODO: Implement email sending
            // try {
            //   await sendWorkspaceInviteEmail(email, workspace.name, inviteLink);
            // } catch (emailError) {
            //   authLogger.error({ err: emailError, email }, 'Failed to send invite email');
            // }
          }

          return {
            success: true,
            inviteId,
            inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite/${token}`,
          };
        } catch (error) {
          authLogger.error({ err: error, userId, workspaceId: params.workspaceId }, 'Create invite error');
          throw new Error('Failed to create invite');
        }
      },
      {
        body: t.Object({
          email: t.String(),
        }),
      }
    )
    .post(
      '/invite/:token/accept',
      async ({ params, userId }) => {
        try {
          const { token } = params;

          const workspaceId = await convexClient.mutation(api.workspace_invites.accept, {
            token,
            userId: userId as any,
          });

          return {
            success: true,
            workspaceId,
          };
        } catch (error) {
          authLogger.error({ err: error, userId, token: params.token }, 'Accept invite error');
          throw new Error('Failed to accept invite');
        }
      }
    )
    .get('/invites/pending', async ({ userEmail }) => {
      try {
        if (!userEmail || typeof userEmail !== 'string') {
          throw new Error('Invalid user email');
        }

        const invites = await convexClient.query(api.workspace_invites.listByEmail, {
          email: userEmail.toLowerCase(),
        });

        return {
          success: true,
          invites,
        };
      } catch (error) {
        authLogger.error({ err: error, email: userEmail }, 'List pending invites error');
        throw new Error('Failed to list pending invites');
      }
    });
}
