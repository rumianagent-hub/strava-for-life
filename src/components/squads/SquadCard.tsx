"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { InviteLinkButton } from "./InviteLinkButton";
import type { Squad } from "@/lib/schemas";

interface SquadCardProps {
  squad: Squad;
  isOwner: boolean;
}

export function SquadCard({ squad, isOwner }: SquadCardProps) {
  return (
    <Card className="border-gray-100 hover:shadow-md transition-shadow">
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
          {isOwner && (
            <Badge variant="secondary" className="text-xs">Owner</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/app/squads/${squad.id}`} className="flex-1">
            <Button variant="outline" className="w-full rounded-lg text-sm">
              View Squad
            </Button>
          </Link>
          <InviteLinkButton squad={squad} />
        </div>
      </CardContent>
    </Card>
  );
}
