"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSquad, getSquadGoals, getCheckin, getUserSquads, getUsers } from "@/lib/firestore";
import { Squad, Goal, UserDoc } from "@/lib/types";
import { GoalCard } from "@/components/GoalCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Link as LinkIcon, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { todayStr } from "@/lib/dates";

export default function SquadDetailClient() {
  const { squadId } = useParams<{ squadId: string }>();
  const { user } = useAuth();
  const [squad, setSquad] = useState<Squad | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [checkedInToday, setCheckedInToday] = useState<Record<string, boolean>>({});
  const [memberProfiles, setMemberProfiles] = useState<Record<string, UserDoc>>({});
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  const loadData = useCallback(async () => {
    if (!squadId || !user) return;
    const [s, userSquads] = await Promise.all([
      getSquad(squadId),
      getUserSquads(user.uid),
    ]);
    setSquad(s);
    setIsMember(userSquads.some((sq) => sq.id === squadId));

    if (s) {
      const profiles = await getUsers(s.memberUids);
      setMemberProfiles(profiles);

      const g = await getSquadGoals(squadId);
      setGoals(g);

      const today = todayStr();
      const statusMap: Record<string, boolean> = {};
      await Promise.all(
        g.map(async (goal) => {
          const checkin = await getCheckin(goal.id, today);
          statusMap[goal.id] = checkin?.done ?? false;
        })
      );
      setCheckedInToday(statusMap);
    }
    setLoading(false);
  }, [squadId, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function copyInviteLink() {
    if (!squad) return;
    const url = `${window.location.origin}/join/${squad.inviteCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied!");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full" />
      </div>
    );
  }

  if (!squad) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Squad not found.</p>
        <Link href="/app/squads">
          <Button variant="ghost" className="mt-4">Back to squads</Button>
        </Link>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">You are not a member of this squad.</p>
        <Link href="/app/squads">
          <Button variant="ghost" className="mt-4">Back to squads</Button>
        </Link>
      </div>
    );
  }

  const myGoalsInSquad = goals.filter((g) => g.ownerUid === user?.uid);
  const othersGoals = goals.filter((g) => g.ownerUid !== user?.uid);

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/app/squads"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to squads
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{squad.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {squad.memberUids.length} / {squad.maxMembers} members
            </span>
            {squad.ownerUid === user?.uid && (
              <Badge variant="secondary" className="text-xs">You own this</Badge>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={copyInviteLink}
          className="gap-2 rounded-xl text-sm"
        >
          <LinkIcon className="w-4 h-4" />
          Copy invite
        </Button>
      </div>

      {/* Members */}
      <Card className="border-gray-100 mb-6">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Members</h2>
          <div className="flex gap-3 flex-wrap">
            {squad.memberUids.map((uid) => (
              <div key={uid} className="flex flex-col items-center gap-1">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                    {(memberProfiles[uid]?.displayName || "?")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {uid === user?.uid && (
                  <span className="text-xs text-gray-400">You</span>
                )}
                {uid === squad.ownerUid && uid !== user?.uid && (
                  <span className="text-xs text-gray-400">Owner</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Status */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Today&apos;s Status
        </h2>
        {goals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">
              No squad goals yet. Create a goal and set it to &quot;Squad&quot; privacy, then link your squad.
            </p>
            <Link href="/app/goals/new">
              <Button className="mt-4 rounded-xl">Add a squad goal</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {myGoalsInSquad.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Your goals</h3>
                <div className="grid gap-3">
                  {myGoalsInSquad.map((goal) => (
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
        )}
      </div>
    </div>
  );
}
