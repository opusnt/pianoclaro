import type { AuthenticatedUser } from "@/server/auth/types";

export type AuditEventName =
  | "auth.login"
  | "auth.logout"
  | "auth.access_denied"
  | "progress.save_attempt"
  | "admin.content_mutation";

export type AuditEvent = {
  name: AuditEventName;
  actorUserId?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export function createAuditEvent({
  name,
  actor,
  resourceId,
  metadata,
}: {
  name: AuditEventName;
  actor?: AuthenticatedUser;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}): AuditEvent {
  return {
    name,
    actorUserId: actor?.id,
    resourceId,
    metadata,
    createdAt: new Date().toISOString(),
  };
}
