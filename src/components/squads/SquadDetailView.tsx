"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSquad, useUserSquads } from "@/lib/hooks/use-squads";
import { useSquadGoals } from "@/lib/hooks/use-goals";
import { useTodayCheckinStatus } from "@/lib/hooks/use-checkins";
import { useUsers } from "@/lib/hooks/use-users";
import { todayStr } from "@/lib/dates";
import { Spinner } from "@/components/feedback/Spinner";
import { NotFoundState } from "@/components/feedback/NotFoundState";
import { PageShell } from "@/components/layout/PageShell";
import { SquadHeader } from "./SquadHeader";
import { SquadMembers } from "./SquadMembers";
import { SquadGoalSections } from "./SquadGoalSections";

interface SquadDetailViewProps {
  squadId: string;
}

export function SquadDetailView({ squadId }: SquadDetailViewProps) {
  const { user } = useAuth();
  const today = todayStr();

  const { data: squad, isLoading: squadLoading } = useSquad(squadId);
  const { data: userSquads, isLoading: userSquadsLoading } = useUserSquads(user?.uid);
  const { data: goals = [], isLoading: goalsLoading } = useSquadGoals(squadId);
  const { data: profiles = {} } = useUsers(squad?.memberUids ?? []);
  const { data: checkedInToday = {} } = useTodayCheckinStatus(
    goals.map((g) => g.id),
    today,
  );

  const loading = squadLoading || userSquadsLoading || goalsLoading;

  if (loading) return <Spinner />;
  if (!squad) return <NotFoundState entity="Squad" backHref="/app/squads" backLabel="Back to squads" />;

  const isMember = userSquads?.some((s) => s.id === squadId) ?? false;
  if (!isMember) {
    return <NotFoundState entity="You are not a member of this squad" backHref="/app/squads" backLabel="Back to squads" />;
  }

  const isOwner = squad.ownerUid === user?.uid;

  return (
    <PageShell backHref="/app/squads" backLabel="Back to squads">
      <SquadHeader squad={squad} isOwner={isOwner} />
      <SquadMembers
        memberUids={squad.memberUids}
        profiles={profiles}
        currentUid={user?.uid}
        ownerUid={squad.ownerUid}
      />
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Today&apos;s Status
        </h2>
        <SquadGoalSections
          goals={goals}
          checkedInToday={checkedInToday}
          currentUid={user?.uid}
        />
      </div>
    </PageShell>
  );
}
