import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Goal } from "@/lib/schemas";

interface SquadGoalSectionsProps {
  goals: Goal[];
  checkedInToday: Record<string, boolean>;
  currentUid: string | undefined;
}

export function SquadGoalSections({ goals, checkedInToday, currentUid }: SquadGoalSectionsProps) {
  const myGoals = goals.filter((g) => g.ownerUid === currentUid);
  const othersGoals = goals.filter((g) => g.ownerUid !== currentUid);

  if (goals.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
        <p className="text-gray-500 text-sm">
          No squad goals yet. Create a goal and set it to &quot;Squad&quot; privacy, then link your squad.
        </p>
        <Link href="/app/goals/new">
          <Button className="mt-4 rounded-xl">Add a squad goal</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {myGoals.length > 0 && (
        <div>
          <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Your goals</h3>
          <div className="grid gap-3">
            {myGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} checkedInToday={checkedInToday[goal.id]} />
            ))}
          </div>
        </div>
      )}
      {othersGoals.length > 0 && (
        <div>
          <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Squad goals</h3>
          <div className="grid gap-3">
            {othersGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} checkedInToday={checkedInToday[goal.id]} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
