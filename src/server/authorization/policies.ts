import { forbidden, unauthenticated } from "@/server/errors";
import { hasRole, isSessionExpired } from "@/server/auth/types";
import type { ServerSession, UserRole } from "@/server/auth/types";

export type OwnableResource = {
  id: string;
  ownerUserId: string;
};

export function requireAuthenticated(session: ServerSession | null | undefined) {
  if (!session || isSessionExpired(session)) {
    throw unauthenticated();
  }

  return session.user;
}

export function requireRole(session: ServerSession | null | undefined, role: UserRole) {
  const user = requireAuthenticated(session);

  if (!hasRole(user, role)) {
    throw forbidden(`Se requiere rol ${role}`);
  }

  return user;
}

export function requireAnyRole(session: ServerSession | null | undefined, roles: UserRole[]) {
  const user = requireAuthenticated(session);

  if (!roles.some((role) => hasRole(user, role))) {
    throw forbidden("Rol insuficiente");
  }

  return user;
}

export function requireResourceOwnerOrRole({
  session,
  resource,
  elevatedRoles = ["admin"],
}: {
  session: ServerSession | null | undefined;
  resource: OwnableResource;
  elevatedRoles?: UserRole[];
}) {
  const user = requireAuthenticated(session);
  const isOwner = resource.ownerUserId === user.id;
  const isElevated = elevatedRoles.some((role) => hasRole(user, role));

  if (!isOwner && !isElevated) {
    throw forbidden("No puedes acceder a un recurso de otro usuario");
  }

  return user;
}
