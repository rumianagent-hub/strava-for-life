"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { Checkin } from "@/lib/schemas";

interface CheckinFormProps {
  todayCheckin: Checkin | undefined;
  currentStreak: number;
  saving: boolean;
  onSave: (done: boolean, note: string) => void;
}

export function CheckinForm({ todayCheckin, currentStreak, saving, onSave }: CheckinFormProps) {
  const [todayDone, setTodayDone] = useState(false);
  const [todayNote, setTodayNote] = useState("");

  useEffect(() => {
    if (todayCheckin) {
      setTodayDone(todayCheckin.done);
      setTodayNote(todayCheckin.note || "");
    }
  }, [todayCheckin]);

  return (
    <Card className="border-gray-100">
      <CardContent className="p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Today&apos;s Check-in
        </h2>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setTodayDone(!todayDone)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              todayDone
                ? "bg-green-50 border-green-400"
                : "bg-gray-50 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-100"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-all ${
                todayDone
                  ? "bg-green-500 text-white"
                  : "bg-white border-2 border-gray-300 text-gray-300"
              }`}
            >
              {todayDone ? "\u2713" : "\u25CB"}
            </div>
            <div className="text-left">
              <p className={`font-semibold ${todayDone ? "text-green-700" : "text-gray-700"}`}>
                {todayDone ? "Done today!" : "Mark today as done"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {todayCheckin?.done ? `Streak: ${currentStreak} days` : "Tap to check in"}
              </p>
            </div>
          </button>

          <Textarea
            placeholder="Add a note (optional)..."
            value={todayNote}
            onChange={(e) => setTodayNote(e.target.value)}
            rows={2}
            className="resize-none rounded-xl"
          />

          <Button
            onClick={() => onSave(todayDone, todayNote)}
            disabled={saving}
            className="w-full rounded-xl"
          >
            {saving ? "Saving..." : "Save Check-in"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
