import { validationError } from "@/server/errors";

export type ValidationResult<TValue> =
  | {
      ok: true;
      value: TValue;
    }
  | {
      ok: false;
      errors: string[];
    };

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function assertValid<TValue>(result: ValidationResult<TValue>) {
  if (!result.ok) {
    throw validationError("Entrada inválida", { errors: result.errors });
  }

  return result.value;
}

export function readString(input: Record<string, unknown>, key: string, errors: string[]) {
  const value = input[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${key} debe ser un string no vacío`);
    return "";
  }

  return value.trim();
}

export function readNumber(input: Record<string, unknown>, key: string, errors: string[]) {
  const value = input[key];

  if (typeof value !== "number" || !Number.isFinite(value)) {
    errors.push(`${key} debe ser un número válido`);
    return 0;
  }

  return value;
}

export function rejectClientControlledSecurityFields(
  input: Record<string, unknown>,
  errors: string[],
) {
  ["userId", "ownerUserId", "role", "roles", "isAdmin", "admin", "permissions"].forEach((field) => {
    if (field in input) {
      errors.push(`${field} no puede ser enviado por el cliente`);
    }
  });
}
