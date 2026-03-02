"use client";

import { ErrorState } from "@/components/feedback/ErrorState";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState onRetry={reset} backHref="/" />;
}
