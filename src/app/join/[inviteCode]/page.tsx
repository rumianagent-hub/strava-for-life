"use client";

import { useParams } from "next/navigation";
import { JoinCard } from "@/components/join/JoinCard";

export default function JoinPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  return <JoinCard inviteCode={inviteCode} />;
}
