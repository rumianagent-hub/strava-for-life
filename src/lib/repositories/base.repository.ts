import { z } from "zod";
import { AppError, ErrorCode, type Result, ok, err } from "@/lib/errors";

/** Validate a Firestore document with an `id` field injected. */
export function parseDoc<T>(
  schema: z.ZodType<T>,
  id: string,
  data: unknown,
): Result<T> {
  const result = schema.safeParse({ ...(data as Record<string, unknown>), id });
  if (result.success) return ok(result.data);
  return err(
    ErrorCode.VALIDATION_FAILED,
    `Invalid document ${id}: ${result.error.message}`,
  );
}

/** Validate a Firestore subcollection document (no id injection). */
export function parseSubDoc<T>(
  schema: z.ZodType<T>,
  data: unknown,
): Result<T> {
  const result = schema.safeParse(data);
  if (result.success) return ok(result.data);
  return err(
    ErrorCode.VALIDATION_FAILED,
    `Invalid subdocument: ${result.error.message}`,
  );
}

/** Wrap an unknown thrown value into an AppError. */
export function wrapFirestoreError(e: unknown): AppError {
  if (e instanceof AppError) return e;
  const message = e instanceof Error ? e.message : String(e);
  return new AppError(ErrorCode.FIRESTORE_ERROR, message, e);
}
