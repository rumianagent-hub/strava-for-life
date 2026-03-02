"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSquadByInviteCode, useJoinSquad } from "@/lib/hooks/use-squads";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Flame } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/feedback/Spinner";

interface JoinCardProps {
  inviteCode: string;
}

export function JoinCard({ inviteCode }: JoinCardProps) {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { data: squad, isLoading } = useSquadByInviteCode(inviteCode);
  const joinSquad = useJoinSquad();

  async function handleJoin() {
    if (!user || !squad) return;
    joinSquad.mutate(
      { squadId: squad.id, uid: user.uid },
      { onSuccess: () => router.push(`/app/squads/${squad.id}`) },
    );
  }

  if (authLoading || isLoading) return <Spinner variant="fullscreen" />;

  const notFound = !isLoading && !squad;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-gray-900">
            <Flame className="w-5 h-5 text-orange-500" />
            Strava for Life
          </Link>
        </div>

        {notFound ? (
          <Card className="border-gray-100">
            <CardContent className="p-8 text-center">
              <p className="text-gray-900 font-semibold mb-2">Invalid invite link</p>
              <p className="text-gray-500 text-sm mb-4">
                This invite code doesn&apos;t exist or has expired.
              </p>
              <Link href="/">
                <Button variant="outline">Go home</Button>
              </Link>
            </CardContent>
          </Card>
        ) : squad ? (
          <Card className="border-gray-100">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-500" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                You&apos;re invited to join
              </h1>
              <p className="text-2xl font-bold text-gray-900 mb-2">{squad.name}</p>
              <p className="text-sm text-gray-500 mb-6">
                {squad.memberUids.length} / {squad.maxMembers} members
              </p>

              {!user ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Sign in to join this squad</p>
                  <Button onClick={signInWithGoogle} className="w-full rounded-xl">
                    Sign in with Google
                  </Button>
                </div>
              ) : squad.memberUids.includes(user.uid) ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-600 font-medium">
                    You&apos;re already a member!
                  </p>
                  <Link href={`/app/squads/${squad.id}`}>
                    <Button className="w-full rounded-xl">View squad</Button>
                  </Link>
                </div>
              ) : squad.memberUids.length >= squad.maxMembers ? (
                <p className="text-sm text-red-500 font-medium">
                  This squad is full (max {squad.maxMembers} members)
                </p>
              ) : (
                <Button
                  onClick={handleJoin}
                  disabled={joinSquad.isPending}
                  className="w-full rounded-xl"
                >
                  {joinSquad.isPending ? "Joining..." : `Join ${squad.name}`}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
