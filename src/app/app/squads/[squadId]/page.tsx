"use client";

import { useParams } from "next/navigation";
import { SquadDetailView } from "@/components/squads/SquadDetailView";

export default function SquadDetailPage() {
  const { squadId } = useParams<{ squadId: string }>();
  return <SquadDetailView squadId={squadId} />;
}
