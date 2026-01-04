import { type DefaultSession, type DefaultUser } from 'next-auth';

export interface AuthUser extends DefaultUser {
  id: string;
  role: string;
}

declare module 'next-auth' {
  interface User extends AuthUser {}

  interface Session extends DefaultSession {
    user: AuthUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}
