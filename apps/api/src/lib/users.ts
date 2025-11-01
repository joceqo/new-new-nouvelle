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

  // Fetch the user to return full data
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('Failed to create or fetch user');
  }

  return user;
}
