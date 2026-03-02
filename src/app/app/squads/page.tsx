"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUserSquads } from "@/lib/hooks/use-squads";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Spinner } from "@/components/feedback/Spinner";
import { SquadCard } from "@/components/squads/SquadCard";
import { CreateSquadDialog } from "@/components/squads/CreateSquadDialog";
import { JoinSquadDialog } from "@/components/squads/JoinSquadDialog";
import { Users } from "lucide-react";

export default function SquadsPage() {
  const { user } = useAuth();
  const { data: squads = [], isLoading } = useUserSquads(user?.uid);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Squads"
        subtitle="Build habits with your crew"
        actions={
          <>
            <JoinSquadDialog />
            <CreateSquadDialog />
          </>
        }
      />

      {squads.length === 0 ? (
        <EmptyState
          icon={Users}
          iconBg="bg-purple-50"
          iconColor="text-purple-400"
          title="No squads yet"
          description="Create a squad or join one with an invite code."
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {squads.map((squad) => (
            <SquadCard
              key={squad.id}
              squad={squad}
              isOwner={squad.ownerUid === user?.uid}
            />
          ))}
        </div>
      )}
    </div>
  );
}
