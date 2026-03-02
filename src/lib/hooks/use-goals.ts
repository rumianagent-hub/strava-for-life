import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalRepository } from "@/lib/repositories/goal.repository";
import { queryKeys } from "./query-keys";
import { unwrap } from "@/lib/errors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUserGoals(uid: string | undefined) {
  return useQuery({
    queryKey: queryKeys.goals.userGoals(uid ?? ""),
    queryFn: () => goalRepository.getUserGoals(uid!).then(unwrap),
    enabled: !!uid,
  });
}

export function useGoal(goalId: string) {
  return useQuery({
    queryKey: queryKeys.goals.detail(goalId),
    queryFn: () => goalRepository.get(goalId).then(unwrap),
    enabled: !!goalId,
  });
}

export function useSquadGoals(squadId: string) {
  return useQuery({
    queryKey: queryKeys.goals.squadGoals(squadId),
    queryFn: () => goalRepository.getSquadGoals(squadId).then(unwrap),
    enabled: !!squadId,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: {
      ownerUid: string;
      title: string;
      description: string;
      category: string;
      privacy: string;
      squadId?: string;
    }) => goalRepository.create(input.ownerUid, input).then(unwrap),
    onSuccess: (goalId, { ownerUid }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.userGoals(ownerUid) });
      toast.success("Goal created!");
      router.push(`/app/goals/${goalId}`);
    },
    onError: () => {
      toast.error("Failed to create goal");
    },
  });
}

export function useArchiveGoal() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (goalId: string) => goalRepository.archive(goalId).then(unwrap),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal archived");
      router.push("/app");
    },
    onError: () => {
      toast.error("Failed to archive goal");
    },
  });
}
