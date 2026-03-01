"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserGoals, getCheckin } from "@/lib/firestore";
import { Goal } from "@/lib/types";
import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { Plus, Flame } from "lucide-react";
import Link from "next/link";
import { todayStr } from "@/lib/dates";

export default function DashboardPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [checkedInToday, setCheckedInToday] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchGoals = async () => {
      const g = await getUserGoals(user.uid);
      setGoals(g);

      // Check today's checkin status for each goal
      const today = todayStr();
      const statusMap: Record<string, boolean> = {};
      await Promise.all(
        g.map(async (goal) => {
          const checkin = await getCheckin(goal.id, today);
          statusMap[goal.id] = checkin?.done ?? false;
        })
      );
      setCheckedInToday(statusMap);
      setLoading(false);
    };
    fetchGoals();
  }, [user]);

  const pendingToday = goals.filter((g) => !checkedInToday[g.id]);
  const doneToday = goals.filter((g) => checkedInToday[g.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good {getTimeOfDay()}, {user?.displayName?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {pendingToday.length === 0
              ? "All caught up for today!"
              : `${pendingToday.length} goal${pendingToday.length > 1 ? "s" : ""} waiting for today's check-in`}
          </p>
        </div>
        <Link href="/app/goals/new">
          <Button className="gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            New Goal
          </Button>
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Flame className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No goals yet
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Start your journey by creating your first goal.
          </p>
          <Link href="/app/goals/new">
            <Button className="rounded-xl">Create your first goal</Button>
          </Link>
        </div>
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
                Done Today ✓
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

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
