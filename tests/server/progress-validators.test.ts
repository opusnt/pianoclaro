import assert from "node:assert/strict";
import test from "node:test";
import { ServerAppError } from "@/server/errors";
import { parseProgressMutationInput } from "@/server/progress/validators";

test("acepta payload mínimo de progreso oficial", () => {
  const parsed = parseProgressMutationInput({
    moduleId: "chord-construction",
    exerciseId: "build-c-major",
    score: 900,
    accuracy: 0.85,
    status: "completed",
  });

  assert.deepEqual(parsed, {
    moduleId: "chord-construction",
    exerciseId: "build-c-major",
    score: 900,
    accuracy: 0.85,
    status: "completed",
  });
});

test("rechaza campos de seguridad enviados por el navegador", () => {
  assertValidationErrors(
    () =>
      parseProgressMutationInput({
        moduleId: "chord-construction",
        exerciseId: "build-c-major",
        score: 900,
        accuracy: 0.85,
        status: "completed",
        userId: "victim",
        role: "admin",
      }),
    ["userId no puede ser enviado por el cliente", "role no puede ser enviado por el cliente"],
  );
});

test("rechaza score, accuracy y status inválidos", () => {
  assertValidationErrors(
    () =>
      parseProgressMutationInput({
        moduleId: "chord-construction",
        exerciseId: "build-c-major",
        score: -1,
        accuracy: 1.4,
        status: "admin",
      }),
    ["score no puede ser negativo", "accuracy debe estar entre 0 y 1", "status inválido"],
  );
});

function assertValidationErrors(fn: () => unknown, expectedErrors: string[]) {
  try {
    fn();
    assert.fail("Expected validation error");
  } catch (error) {
    assert.ok(error instanceof ServerAppError);
    assert.equal(error.code, "VALIDATION_ERROR");
    assert.deepEqual(error.details?.errors, expectedErrors);
  }
}
