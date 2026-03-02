import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy } from "lucide-react";

interface StreakStatsProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakStats({ currentStreak, bestStreak }: StreakStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <Card className="border-gray-100">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{currentStreak}</p>
            <p className="text-xs text-gray-500">Current streak</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-gray-100">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{bestStreak}</p>
            <p className="text-xs text-gray-500">Best streak</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
