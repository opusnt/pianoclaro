export type UserRole = "student" | "teacher" | "admin";

export type AuthenticatedUser = {
  id: string;
  email?: string;
  roles: UserRole[];
};

export type ServerSession = {
  user: AuthenticatedUser;
  expiresAt: Date;
};

export function hasRole(user: AuthenticatedUser, role: UserRole) {
  return user.roles.includes(role);
}

export function isSessionExpired(session: ServerSession, now = new Date()) {
  return session.expiresAt.getTime() <= now.getTime();
}
