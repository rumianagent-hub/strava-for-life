"use client";

import { ErrorState } from "@/components/feedback/ErrorState";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState onRetry={reset} backHref="/app" />;
}
