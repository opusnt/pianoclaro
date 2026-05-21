import { assertValid, isPlainObject, readNumber, readString, rejectClientControlledSecurityFields } from "@/server/validators/common";
import type { ProgressMutationInput, OfficialProgressStatus } from "@/server/progress/types";

const allowedStatuses = new Set<OfficialProgressStatus>(["started", "completed", "review"]);

export function parseProgressMutationInput(input: unknown) {
  if (!isPlainObject(input)) {
    return assertValid<ProgressMutationInput>({
      ok: false,
      errors: ["El payload debe ser un objeto"],
    });
  }

  const errors: string[] = [];
  rejectClientControlledSecurityFields(input, errors);

  const moduleId = readString(input, "moduleId", errors);
  const exerciseId = readString(input, "exerciseId", errors);
  const score = readNumber(input, "score", errors);
  const accuracy = readNumber(input, "accuracy", errors);
  const statusRaw = readString(input, "status", errors);

  if (score < 0) {
    errors.push("score no puede ser negativo");
  }

  if (accuracy < 0 || accuracy > 1) {
    errors.push("accuracy debe estar entre 0 y 1");
  }

  if (!allowedStatuses.has(statusRaw as OfficialProgressStatus)) {
    errors.push("status inválido");
  }

  return assertValid<ProgressMutationInput>(
    errors.length
      ? { ok: false, errors }
      : {
          ok: true,
          value: {
            moduleId,
            exerciseId,
            score,
            accuracy,
            status: statusRaw as OfficialProgressStatus,
          },
        },
  );
}
