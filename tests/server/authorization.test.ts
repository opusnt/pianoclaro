import assert from "node:assert/strict";
import test from "node:test";
import type { ServerSession } from "@/server/auth/types";
import {
  requireAuthenticated,
  requireResourceOwnerOrRole,
  requireRole,
} from "@/server/authorization/policies";
import { ServerAppError } from "@/server/errors";

const futureSession: ServerSession = {
  user: {
    id: "user_1",
    roles: ["student"],
  },
  expiresAt: new Date("2099-01-01T00:00:00.000Z"),
};

test("rechaza sesiones ausentes o expiradas", () => {
  assert.throws(() => requireAuthenticated(null), ServerAppError);
  assert.throws(
    () =>
      requireAuthenticated({
        user: { id: "user_1", roles: ["student"] },
        expiresAt: new Date("2020-01-01T00:00:00.000Z"),
      }),
    /Sesión requerida/,
  );
});

test("valida roles desde sesión server-side", () => {
  assert.throws(() => requireRole(futureSession, "admin"), /Se requiere rol admin/);

  const adminSession: ServerSession = {
    user: { id: "admin_1", roles: ["admin"] },
    expiresAt: new Date("2099-01-01T00:00:00.000Z"),
  };

  assert.equal(requireRole(adminSession, "admin").id, "admin_1");
});

test("permite acceso por propiedad del recurso o rol elevado", () => {
  const owned = requireResourceOwnerOrRole({
    session: futureSession,
    resource: { id: "progress_1", ownerUserId: "user_1" },
  });
  assert.equal(owned.id, "user_1");

  assert.throws(
    () =>
      requireResourceOwnerOrRole({
        session: futureSession,
        resource: { id: "progress_2", ownerUserId: "other_user" },
      }),
    /otro usuario/,
  );

  const adminSession: ServerSession = {
    user: { id: "admin_1", roles: ["admin"] },
    expiresAt: new Date("2099-01-01T00:00:00.000Z"),
  };
  const elevated = requireResourceOwnerOrRole({
    session: adminSession,
    resource: { id: "progress_2", ownerUserId: "other_user" },
  });

  assert.equal(elevated.id, "admin_1");
});
