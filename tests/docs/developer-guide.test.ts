import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const guide = readFileSync("docs/developer-guide.md", "utf8");
const checklist = readFileSync("docs/developer-guide-checklist.md", "utf8");

test("la guía de desarrolladores documenta las fronteras críticas", () => {
  [
    "src/lib/modules/playable-module-registry.tsx",
    "docs/responsive-policy.md",
    ".responsive-scroll",
    "src/server/auth",
    "src/server/authorization",
    "src/server/validators",
    "src/server/progress",
    "src/lib/content",
    "src/lib/progress",
    "src/data/learning-path.ts",
    "src/lib/learning-path/learning-path.ts",
    "localStorage",
    "pnpm typecheck",
    "pnpm test",
    "pnpm run build",
  ].forEach((requiredText) => {
    assert.equal(guide.includes(requiredText), true, `Falta en developer-guide: ${requiredText}`);
  });
});

test("el checklist exige actualizar guía, seguridad y registry", () => {
  [
    "docs/developer-guide.md",
    "docs/responsive-policy.md",
    "tests/docs/responsive-policy.test.ts",
    "tests/responsive/static-responsive-guards.test.ts",
    "src/lib/modules/playable-module-registry.tsx",
    "No se acepta `userId`, `role`, `roles`, `isAdmin` ni `ownerUserId` desde cliente",
    "tests/modules/playable-module-registry.test.ts",
    "tests/content/learning-path.test.ts",
    "tests/server",
  ].forEach((requiredText) => {
    assert.equal(checklist.includes(requiredText), true, `Falta en checklist: ${requiredText}`);
  });
});
