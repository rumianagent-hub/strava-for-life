"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getGoal, getCheckins, doCheckin, archiveGoal } from "@/lib/firestore";
import { Goal, Checkin } from "@/lib/types";
import { CheckinGrid } from "@/components/CheckinGrid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { todayStr, last14Days, formatDisplayDate } from "@/lib/dates";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function GoalDetailClient() {
  const { goalId } = useParams<{ goalId: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [checkins, setCheckins] = useState<Record<string, Checkin>>({});
  const [todayNote, setTodayNote] = useState("");
  const [todayDone, setTodayDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);

  const today = todayStr();
  const dates = last14Days();

  const loadData = useCallback(async () => {
    if (!goalId) return;
    const [g, c] = await Promise.all([
      getGoal(goalId),
      getCheckins(goalId, dates),
    ]);
    setGoal(g);
    setCheckins(c);
    if (c[today]) {
      setTodayNote(c[today].note || "");
      setTodayDone(c[today].done);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId, today]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCheckin() {
    if (!user || !goal) return;
    setSaving(true);
    try {
      await doCheckin(goal.id, user.uid, todayDone, todayNote);
      await loadData();
      toast.success(todayDone ? "Checked in! 🔥" : "Note saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save check-in");
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive() {
    if (!goal) return;
    setArchiving(true);
    try {
      await archiveGoal(goal.id);
      toast.success("Goal archived");
      router.push("/app");
    } catch {
      toast.error("Failed to archive goal");
      setArchiving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Goal not found.</p>
        <Link href="/app">
          <Button variant="ghost" className="mt-4">Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const isOwner = user?.uid === goal.ownerUid;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/app"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      {/* Goal Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="capitalize">
                {goal.category}
              </Badge>
              <Badge variant={goal.privacy === "squad" ? "outline" : "secondary"}>
                {goal.privacy === "squad" ? "👥 Squad" : "🔒 Private"}
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Archive this goal?</DialogTitle>
                  <DialogDescription>
                    This will move the goal to archived. You can&apos;t undo this.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={handleArchive}
                    disabled={archiving}
                  >
                    {archiving ? "Archiving..." : "Archive"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="border-gray-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{goal.currentStreak}</p>
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
              <p className="text-2xl font-bold text-gray-900">{goal.bestStreak}</p>
              <p className="text-xs text-gray-500">Best streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last 14 Days */}
      <Card className="border-gray-100 mb-6">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Last 14 Days</h2>
          <CheckinGrid dates={dates} checkins={checkins} />
        </CardContent>
      </Card>

      {/* Today's Check-in */}
      {isOwner && (
        <Card className="border-gray-100">
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Today&apos;s Check-in
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTodayDone(!todayDone)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                    todayDone
                      ? "bg-green-500 text-white scale-105"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {todayDone ? "✓" : "○"}
                </button>
                <div>
                  <p className="font-medium text-gray-900">
                    {todayDone ? "Done!" : "Mark as done"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {today} · {checkins[today]?.done ? `Streak: ${goal.currentStreak} days 🔥` : "Not checked in yet"}
                  </p>
                </div>
              </div>

              <Textarea
                placeholder="Add a note (optional)..."
                value={todayNote}
                onChange={(e) => setTodayNote(e.target.value)}
                rows={3}
                className="resize-none rounded-xl"
              />

              <Button
                onClick={handleCheckin}
                disabled={saving}
                className="w-full rounded-xl"
              >
                {saving ? "Saving..." : "Save Check-in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
