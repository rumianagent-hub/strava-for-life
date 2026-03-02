"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useJoinSquad } from "@/lib/hooks/use-squads";
import { JoinSquadInputSchema, type JoinSquadInput } from "@/lib/schemas";
import { squadRepository } from "@/lib/repositories/squad.repository";
import { unwrap } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function JoinSquadDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [resolving, setResolving] = useState(false);
  const joinSquad = useJoinSquad();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JoinSquadInput>({
    resolver: zodResolver(JoinSquadInputSchema),
    defaultValues: { inviteCode: "" },
  });

  async function onSubmit(data: JoinSquadInput) {
    if (!user) return;
    setResolving(true);
    try {
      const squad = unwrap(await squadRepository.getByInviteCode(data.inviteCode));
      if (!squad) {
        toast.error("Invalid invite code");
        return;
      }
      joinSquad.mutate(
        { squadId: squad.id, uid: user.uid },
        {
          onSuccess: () => {
            reset();
            setOpen(false);
          },
        },
      );
    } catch {
      toast.error("Failed to find squad");
    } finally {
      setResolving(false);
    }
  }

  const loading = resolving || joinSquad.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite code</Label>
            <Input
              id="inviteCode"
              placeholder="Paste invite code here"
              {...register("inviteCode")}
            />
            {errors.inviteCode && (
              <p className="text-sm text-red-500">{errors.inviteCode.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Joining..." : "Join Squad"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
