import { User } from '../types';

// In-memory user storage (replace with a database in production)
const users = new Map<string, User>();

export function findUserByEmail(email: string): User | undefined {
  return Array.from(users.values()).find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export function createUser(email: string): User {
  const user: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    createdAt: new Date(),
  };
  users.set(user.id, user);
  return user;
}

export function findUserById(id: string): User | undefined {
  return users.get(id);
}

export function findOrCreateUser(email: string): User {
  const existing = findUserByEmail(email);
  if (existing) {
    return existing;
  }
  return createUser(email);
}
