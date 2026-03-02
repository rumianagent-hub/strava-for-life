import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description: string;
  action?: { href: string; label: string };
}

export function EmptyState({
  icon: Icon,
  iconBg = "bg-orange-50",
  iconColor = "text-orange-400",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
      <div
        className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
      >
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm mb-6">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button className="rounded-xl">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
