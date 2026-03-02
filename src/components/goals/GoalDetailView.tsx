"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useGoal, useArchiveGoal } from "@/lib/hooks/use-goals";
import { useCheckinHistory, useDoCheckin } from "@/lib/hooks/use-checkins";
import { todayStr, last14Days } from "@/lib/dates";
import { Spinner } from "@/components/feedback/Spinner";
import { NotFoundState } from "@/components/feedback/NotFoundState";
import { PageShell } from "@/components/layout/PageShell";
import { GoalHeader } from "./GoalHeader";
import { StreakStats } from "./StreakStats";
import { CheckinForm } from "./CheckinForm";
import { CheckinGrid } from "@/components/CheckinGrid";
import { Card, CardContent } from "@/components/ui/card";

interface GoalDetailViewProps {
  goalId: string;
}

export function GoalDetailView({ goalId }: GoalDetailViewProps) {
  const { user } = useAuth();
  const today = todayStr();
  const dates = last14Days();

  const { data: goal, isLoading: goalLoading } = useGoal(goalId);
  const { data: checkins, isLoading: checkinsLoading } = useCheckinHistory(goalId, dates);
  const doCheckin = useDoCheckin();
  const archiveGoal = useArchiveGoal();

  const loading = goalLoading || checkinsLoading;

  if (loading) return <Spinner />;
  if (!goal) return <NotFoundState entity="Goal" backHref="/app" backLabel="Back to dashboard" />;

  const isOwner = user?.uid === goal.ownerUid;

  function handleCheckin(done: boolean, note: string) {
    if (!user || !goal) return;
    doCheckin.mutate({ goalId: goal.id, ownerUid: user.uid, done, note });
  }

  function handleArchive() {
    if (!goal) return;
    archiveGoal.mutate(goal.id);
  }

  return (
    <PageShell backHref="/app" backLabel="Back to dashboard">
      <GoalHeader
        goal={goal}
        isOwner={isOwner}
        onArchive={handleArchive}
        archiving={archiveGoal.isPending}
      />

      <StreakStats currentStreak={goal.currentStreak} bestStreak={goal.bestStreak} />

      <Card className="border-gray-100 mb-6">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Last 14 Days</h2>
          <CheckinGrid dates={dates} checkins={checkins ?? {}} />
        </CardContent>
      </Card>

      {isOwner && (
        <CheckinForm
          todayCheckin={checkins?.[today]}
          currentStreak={goal.currentStreak}
          saving={doCheckin.isPending}
          onSave={handleCheckin}
        />
      )}
    </PageShell>
  );
}
