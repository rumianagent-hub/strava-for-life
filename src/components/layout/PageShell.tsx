import { type ReactNode } from "react";
import { BackLink } from "./BackLink";

interface PageShellProps {
  backHref?: string;
  backLabel?: string;
  maxWidth?: string;
  children: ReactNode;
}

export function PageShell({
  backHref,
  backLabel = "Go back",
  maxWidth = "max-w-2xl",
  children,
}: PageShellProps) {
  return (
    <div className={`${maxWidth} mx-auto`}>
      {backHref && <BackLink href={backHref} label={backLabel} />}
      {children}
    </div>
  );
}
