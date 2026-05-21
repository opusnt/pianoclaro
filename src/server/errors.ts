export type ServerErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class ServerAppError extends Error {
  readonly code: ServerErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor({
    code,
    status,
    message,
    details,
  }: {
    code: ServerErrorCode;
    status: number;
    message: string;
    details?: Record<string, unknown>;
  }) {
    super(message);
    this.name = "ServerAppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function unauthenticated(message = "Sesión requerida") {
  return new ServerAppError({ code: "UNAUTHENTICATED", status: 401, message });
}

export function forbidden(message = "No tienes permisos para esta operación") {
  return new ServerAppError({ code: "FORBIDDEN", status: 403, message });
}

export function validationError(message: string, details?: Record<string, unknown>) {
  return new ServerAppError({ code: "VALIDATION_ERROR", status: 400, message, details });
}

export function notFound(message = "Recurso no encontrado") {
  return new ServerAppError({ code: "NOT_FOUND", status: 404, message });
}

export function toSafeErrorResponse(error: unknown) {
  if (error instanceof ServerAppError) {
    return {
      status: error.status,
      body: {
        error: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  return {
    status: 500,
    body: {
      error: "INTERNAL_ERROR" as const,
      message: "Error interno",
    },
  };
}
