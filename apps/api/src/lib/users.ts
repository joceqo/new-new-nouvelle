import { User } from '../types';
import { convexClient, api } from './convex-client';

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const user = await convexClient.query(api.users.getByEmail, {
    email: email.toLowerCase(),
  });

  if (!user) {
    return undefined;
  }

  return {
    id: user._id,
    email: user.email,
    createdAt: new Date(user.createdAt),
  };
}

export async function findUserById(id: string): Promise<User | undefined> {
  const user = await convexClient.query(api.users.getById, { userId: id as any });

  if (!user) {
    return undefined;
  }

  return {
    id: user._id,
    email: user.email,
    createdAt: new Date(user.createdAt),
  };
}

export async function findOrCreateUser(email: string): Promise<User> {
  const userId = await convexClient.mutation(api.users.createOrUpdate, {
    email: email.toLowerCase(),
  });

  // Check if user has any workspaces
  const workspaces = await convexClient.query(api.workspaces.listByUser, {
    userId: userId as any,
  });

  // If user has no workspaces, create a personal workspace
  if (workspaces.length === 0) {
    // Generate a slug from email (e.g., "john-doe" from "john.doe@example.com")
    const emailName = email.split('@')[0];
    const slug = emailName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const timestamp = Date.now().toString(36); // Add timestamp for uniqueness

    await convexClient.mutation(api.workspaces.create, {
      name: `${emailName}'s Workspace`,
      ownerId: userId as any,
      slug: `${slug}-${timestamp}`,
      icon: '👤', // Default workspace icon
    });
  }

  // Fetch the user to return full data
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('Failed to create or fetch user');
  }

  return user;
}
