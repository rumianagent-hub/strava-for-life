"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  backHref?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
  backHref,
}: ErrorStateProps) {
  return (
    <div className="text-center py-20">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm mb-6">{description}</p>
      <div className="flex items-center justify-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="rounded-xl">
            Try again
          </Button>
        )}
        {backHref && (
          <Link href={backHref}>
            <Button variant="outline" className="rounded-xl">
              Go back
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
