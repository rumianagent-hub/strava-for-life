"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSquadByInviteCode, joinSquad } from "@/lib/firestore";
import { Squad } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Flame } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function JoinClient() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [squad, setSquad] = useState<Squad | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!inviteCode) return;
    getSquadByInviteCode(inviteCode).then((s) => {
      if (!s) setNotFound(true);
      setSquad(s);
      setLoading(false);
    });
  }, [inviteCode]);

  async function handleJoin() {
    if (!user || !squad) return;
    setJoining(true);
    try {
      const result = await joinSquad(squad.id, user.uid);
      if (!result.success) {
        toast.error(result.error || "Failed to join");
        return;
      }
      toast.success(`Welcome to ${squad.name}!`);
      router.push(`/app/squads/${squad.id}`);
    } catch {
      toast.error("Failed to join squad");
    } finally {
      setJoining(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
                  disabled={joining}
                  className="w-full rounded-xl"
                >
                  {joining ? "Joining..." : `Join ${squad.name}`}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
