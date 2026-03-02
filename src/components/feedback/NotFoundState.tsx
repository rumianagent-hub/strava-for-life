import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NotFoundStateProps {
  entity: string;
  backHref: string;
  backLabel: string;
}

export function NotFoundState({ entity, backHref, backLabel }: NotFoundStateProps) {
  return (
    <div className="text-center py-20">
      <p className="text-gray-500">{entity} not found.</p>
      <Link href={backHref}>
        <Button variant="ghost" className="mt-4">
          {backLabel}
        </Button>
      </Link>
    </div>
  );
}
