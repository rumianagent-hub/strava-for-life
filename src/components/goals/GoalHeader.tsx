"use client";

import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/dates";
import type { Goal } from "@/lib/schemas";
import { ArchiveDialog } from "./ArchiveDialog";

interface GoalHeaderProps {
  goal: Goal;
  isOwner: boolean;
  onArchive: () => void;
  archiving: boolean;
}

export function GoalHeader({ goal, isOwner, onArchive, archiving }: GoalHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="capitalize">
              {goal.category}
            </Badge>
            <Badge variant={goal.privacy === "squad" ? "outline" : "secondary"}>
              {goal.privacy === "squad" ? "\u{1F465} Squad" : "\u{1F512} Private"}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{goal.title}</h1>
          {goal.description && (
            <p className="text-gray-500 mt-1">{goal.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Started {formatDisplayDate(goal.startDate)}
          </p>
        </div>
        {isOwner && (
          <ArchiveDialog onArchive={onArchive} archiving={archiving} />
        )}
      </div>
    </div>
  );
}
