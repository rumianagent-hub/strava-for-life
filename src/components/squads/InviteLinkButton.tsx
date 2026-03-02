"use client";

import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import type { Squad } from "@/lib/schemas";

interface InviteLinkButtonProps {
  squad: Squad;
}

export function InviteLinkButton({ squad }: InviteLinkButtonProps) {
  function copyInviteLink() {
    const url = `${window.location.origin}/join/${squad.inviteCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied!");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={copyInviteLink}
      title="Copy invite link"
      className="rounded-lg"
    >
      <LinkIcon className="w-4 h-4" />
    </Button>
  );
}
