// ─── Error codes ─────────────────────────────────────────────────────────────

export enum ErrorCode {
  NOT_FOUND = "NOT_FOUND",
  SQUAD_FULL = "SQUAD_FULL",
  ALREADY_MEMBER = "ALREADY_MEMBER",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  FIRESTORE_ERROR = "FIRESTORE_ERROR",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  UNKNOWN = "UNKNOWN",
}

const USER_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.NOT_FOUND]: "The requested item was not found.",
  [ErrorCode.SQUAD_FULL]: "This squad is full.",
  [ErrorCode.ALREADY_MEMBER]: "You are already a member of this squad.",
  [ErrorCode.VALIDATION_FAILED]: "Invalid input. Please check your data.",
  [ErrorCode.FIRESTORE_ERROR]: "A database error occurred. Please try again.",
  [ErrorCode.PERMISSION_DENIED]: "You don't have permission to do that.",
  [ErrorCode.UNKNOWN]: "Something went wrong. Please try again.",
};

// ─── AppError ────────────────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }

  get userMessage(): string {
    return USER_MESSAGES[this.code];
  }
}

// ─── Result type ─────────────────────────────────────────────────────────────

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError };

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function err<T = never>(code: ErrorCode, message: string, cause?: unknown): Result<T> {
  return { ok: false, error: new AppError(code, message, cause) };
}

export function unwrap<T>(result: Result<T>): T {
  if (result.ok) return result.data;
  throw result.error;
}
