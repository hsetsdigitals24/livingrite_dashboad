// Mock user database (replace with actual database like Prisma)
// This is stored in memory for demo purposes
export const usersDB: Record<
  string,
  {
    id: string;
    email: string;
    name: string;
    password: string;
    role: string;
  }
> = {
  'demo@example.com': {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    password: '$2a$10$9VJrUwGhKHOWQczTnMT9YO0O7Z5L1Zn7W7P4Q1Q1Q1Q1Q1Q1Q1Q1Q', // password: "demo123"
    role: 'family',
  },
};

export function getUserByEmail(email: string) {
  return usersDB[email];
}

export function createUser(email: string, name: string, password: string, role: string = 'family') {
  const newUser = {
    id: Date.now().toString(),
    email,
    name,
    password,
    role,
  };
  usersDB[email] = newUser;
  return newUser;
}

export function userExists(email: string) {
  return !!usersDB[email];
}
