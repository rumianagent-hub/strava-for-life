"use client";

import { PageShell } from "@/components/layout/PageShell";
import { CreateGoalForm } from "@/components/goals/CreateGoalForm";

export default function NewGoalPage() {
  return (
    <PageShell backHref="/app" backLabel="Back to dashboard" maxWidth="max-w-xl">
      <CreateGoalForm />
    </PageShell>
  );
}
