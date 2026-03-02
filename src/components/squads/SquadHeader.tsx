"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import type { Squad } from "@/lib/schemas";

interface SquadHeaderProps {
  squad: Squad;
  isOwner: boolean;
}

export function SquadHeader({ squad, isOwner }: SquadHeaderProps) {
  function copyInviteLink() {
    const url = `${window.location.origin}/join/${squad.inviteCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied!");
  }

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{squad.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {squad.memberUids.length} / {squad.maxMembers} members
          </span>
          {isOwner && (
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
  );
}
