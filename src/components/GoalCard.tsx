"use client";

import Link from "next/link";
import { Goal } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Calendar } from "lucide-react";
import { todayStr } from "@/lib/dates";

const CATEGORY_COLORS: Record<string, string> = {
  health: "bg-green-100 text-green-700",
  fitness: "bg-blue-100 text-blue-700",
  learning: "bg-purple-100 text-purple-700",
  mindfulness: "bg-teal-100 text-teal-700",
  productivity: "bg-yellow-100 text-yellow-700",
  social: "bg-pink-100 text-pink-700",
  creativity: "bg-orange-100 text-orange-700",
  other: "bg-gray-100 text-gray-700",
};

interface GoalCardProps {
  goal: Goal;
  checkedInToday?: boolean;
}

export function GoalCard({ goal, checkedInToday }: GoalCardProps) {
  const today = todayStr();
  const isCheckedToday = checkedInToday ?? goal.lastCheckinDate === today;

  return (
    <Link href={`/app/goals/${goal.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-100">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.other
                  }`}
                >
                  {goal.category}
                </span>
                {goal.privacy === "squad" && (
                  <span className="text-xs text-gray-400">squad</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 truncate">{goal.title}</h3>
              {goal.description && (
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                  {goal.description}
                </p>
              )}
            </div>

            {isCheckedToday && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-gray-800">
                {goal.currentStreak}
              </span>
              <span className="text-xs text-gray-400">streak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-800">
                {goal.bestStreak}
              </span>
              <span className="text-xs text-gray-400">best</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <Calendar className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-xs text-gray-400">{goal.startDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
