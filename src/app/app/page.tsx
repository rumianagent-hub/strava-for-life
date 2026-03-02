"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUserGoals } from "@/lib/hooks/use-goals";
import { useUserSquads } from "@/lib/hooks/use-squads";
import { useTodayCheckinStatus } from "@/lib/hooks/use-checkins";
import { todayStr } from "@/lib/dates";
import { getTimeOfDay } from "@/lib/utils";
import { GoalCard } from "@/components/GoalCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Spinner } from "@/components/feedback/Spinner";
import { Button } from "@/components/ui/button";
import { Plus, Flame } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const today = todayStr();

  const { data: ownGoals = [], isLoading: goalsLoading } = useUserGoals(user?.uid);
  const { isLoading: squadsLoading } = useUserSquads(user?.uid);

  const allGoals = useMemo(() => ownGoals, [ownGoals]);

  const { data: checkedInToday = {} } = useTodayCheckinStatus(
    allGoals.map((g) => g.id),
    today,
  );

  const loading = goalsLoading || squadsLoading;
  if (loading) return <Spinner />;

  const pendingToday = allGoals.filter((g) => !checkedInToday[g.id]);
  const doneToday = allGoals.filter((g) => checkedInToday[g.id]);

  return (
    <div>
      <PageHeader
        title={`Good ${getTimeOfDay()}, ${user?.displayName?.split(" ")[0]} \u{1F44B}`}
        subtitle={
          pendingToday.length === 0
            ? "All caught up for today!"
            : `${pendingToday.length} goal${pendingToday.length > 1 ? "s" : ""} waiting for today's check-in`
        }
        actions={
          <Link href="/app/goals/new">
            <Button className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Goal</span>
            </Button>
          </Link>
        }
      />

      {allGoals.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="No goals yet"
          description="Start your journey by creating your first goal."
          action={{ href: "/app/goals/new", label: "Create your first goal" }}
        />
      ) : (
        <>
          {pendingToday.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Today&apos;s Check-ins
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {pendingToday.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} checkedInToday={false} />
                ))}
              </div>
            </section>
          )}

          {doneToday.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Done Today {"\u2713"}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {doneToday.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} checkedInToday={true} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
