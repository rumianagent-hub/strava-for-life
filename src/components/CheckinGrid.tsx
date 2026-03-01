"use client";

import { Checkin } from "@/lib/types";
import { formatDayLabel, todayStr } from "@/lib/dates";

interface CheckinGridProps {
  dates: string[];
  checkins: Record<string, Checkin>;
}

export function CheckinGrid({ dates, checkins }: CheckinGridProps) {
  const today = todayStr();

  return (
    <div className="flex gap-1.5 flex-wrap">
      {dates.map((date) => {
        const checkin = checkins[date];
        const isToday = date === today;
        const done = checkin?.done;

        return (
          <div key={date} className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                done
                  ? "bg-green-500 text-white"
                  : checkin && !done
                  ? "bg-red-100 text-red-400"
                  : isToday
                  ? "bg-orange-50 border-2 border-orange-200 text-orange-500"
                  : "bg-gray-100 text-gray-300"
              }`}
              title={date}
            >
              {done ? "✓" : isToday ? "○" : "·"}
            </div>
            <span className="text-xs text-gray-400">{formatDayLabel(date)}</span>
          </div>
        );
      })}
    </div>
  );
}
