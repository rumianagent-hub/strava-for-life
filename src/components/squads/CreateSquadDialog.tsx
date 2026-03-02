"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateSquad } from "@/lib/hooks/use-squads";
import { CreateSquadInputSchema, type CreateSquadInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateSquadDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const createSquad = useCreateSquad();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSquadInput>({
    resolver: zodResolver(CreateSquadInputSchema),
    defaultValues: { name: "" },
  });

  function onSubmit(data: CreateSquadInput) {
    if (!user) return;
    createSquad.mutate(
      { ownerUid: user.uid, name: data.name },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          New Squad
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Squad</DialogTitle>
          <DialogDescription>
            Give your squad a name. You can invite others after creating it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="squadName">Squad name</Label>
            <Input
              id="squadName"
              placeholder="e.g. Morning Hustlers"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={createSquad.isPending}>
            {createSquad.isPending ? "Creating..." : "Create Squad"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
