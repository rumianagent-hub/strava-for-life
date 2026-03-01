"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createSquad, getUserSquads, getSquadByInviteCode, joinSquad } from "@/lib/firestore";
import { Squad } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SquadsPage() {
  const { user } = useAuth();
  const [squads, setSquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSquadName, setNewSquadName] = useState("");
  const [creating, setCreating] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserSquads(user.uid).then((s) => {
      setSquads(s);
      setLoading(false);
    });
  }, [user]);

  async function handleCreateSquad(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newSquadName.trim()) return;
    setCreating(true);
    try {
      const squad = await createSquad(user.uid, newSquadName.trim());
      setSquads((prev) => [squad, ...prev]);
      setNewSquadName("");
      setCreateOpen(false);
      toast.success("Squad created!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create squad");
    } finally {
      setCreating(false);
    }
  }

  async function handleJoinSquad(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !inviteCode.trim()) return;
    setJoining(true);
    try {
      const squad = await getSquadByInviteCode(inviteCode.trim());
      if (!squad) {
        toast.error("Invalid invite code");
        return;
      }
      const result = await joinSquad(squad.id, user.uid);
      if (!result.success) {
        toast.error(result.error || "Failed to join squad");
        return;
      }
      // Reload squads
      const updated = await getUserSquads(user.uid);
      setSquads(updated);
      setInviteCode("");
      setJoinOpen(false);
      toast.success(`Joined "${squad.name}"!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to join squad");
    } finally {
      setJoining(false);
    }
  }

  function copyInviteLink(squad: Squad) {
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Squads</h1>
          <p className="text-gray-500 mt-1">Build habits with your crew</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-xl">
                Join Squad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a Squad</DialogTitle>
                <DialogDescription>Enter an invite code to join a squad.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleJoinSquad} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite code</Label>
                  <Input
                    id="inviteCode"
                    placeholder="Paste invite code here"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={joining}>
                  {joining ? "Joining..." : "Join Squad"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl">
                <Plus className="w-4 h-4" />
                New Squad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a Squad</DialogTitle>
                <DialogDescription>Give your squad a name. You can invite others after creating it.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSquad} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="squadName">Squad name</Label>
                  <Input
                    id="squadName"
                    placeholder="e.g. Morning Hustlers"
                    value={newSquadName}
                    onChange={(e) => setNewSquadName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? "Creating..." : "Create Squad"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {squads.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No squads yet
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Create a squad or join one with an invite code.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {squads.map((squad) => (
            <Card key={squad.id} className="border-gray-100 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{squad.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {squad.memberUids.length} / {squad.maxMembers} members
                      </span>
                    </div>
                  </div>
                  {squad.ownerUid === user?.uid && (
                    <Badge variant="secondary" className="text-xs">Owner</Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/app/squads/${squad.id}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-lg text-sm">
                      View Squad
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyInviteLink(squad)}
                    title="Copy invite link"
                    className="rounded-lg"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
