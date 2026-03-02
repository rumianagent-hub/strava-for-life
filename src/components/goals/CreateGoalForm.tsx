"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateGoal } from "@/lib/hooks/use-goals";
import { useUserSquads } from "@/lib/hooks/use-squads";
import { CreateGoalInputSchema, type CreateGoalInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryPicker } from "./CategoryPicker";
import { PrivacyPicker } from "./PrivacyPicker";
import Link from "next/link";

export function CreateGoalForm() {
  const { user } = useAuth();
  const { data: squads = [] } = useUserSquads(user?.uid);
  const createGoal = useCreateGoal();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateGoalInput>({
    resolver: zodResolver(CreateGoalInputSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "health",
      privacy: "private",
      squadId: undefined,
    },
  });

  const privacy = watch("privacy");

  function onSubmit(data: CreateGoalInput) {
    if (!user) return;
    createGoal.mutate({
      ownerUid: user.uid,
      title: data.title,
      description: data.description ?? "",
      category: data.category,
      privacy: data.privacy,
      squadId: data.privacy === "squad" ? data.squadId : undefined,
    });
  }

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <CardTitle className="text-xl">Create a new goal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Goal title *</Label>
            <Input
              id="title"
              placeholder="e.g. Read for 20 minutes"
              {...register("title")}
              className="rounded-lg"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal..."
              {...register("description")}
              rows={3}
              className="rounded-lg resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CategoryPicker value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Privacy</Label>
            <Controller
              name="privacy"
              control={control}
              render={({ field }) => (
                <PrivacyPicker value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          {privacy === "squad" && (
            <div className="space-y-2">
              <Label>Link to Squad *</Label>
              {squads.length === 0 ? (
                <p className="text-sm text-gray-500">
                  You need to{" "}
                  <Link href="/app/squads" className="underline text-gray-700">
                    create or join a squad
                  </Link>{" "}
                  first.
                </p>
              ) : (
                <>
                  <select
                    {...register("squadId")}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Select a squad...</option>
                    {squads.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.squadId && (
                    <p className="text-sm text-red-500">{errors.squadId.message}</p>
                  )}
                </>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={createGoal.isPending}
          >
            {createGoal.isPending ? "Creating..." : "Create Goal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
