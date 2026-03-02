import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkinRepository } from "@/lib/repositories/checkin.repository";
import { goalRepository } from "@/lib/repositories/goal.repository";
import { queryKeys } from "./query-keys";
import { unwrap } from "@/lib/errors";
import { toast } from "sonner";

export function useCheckinHistory(goalId: string, dates: string[]) {
  return useQuery({
    queryKey: queryKeys.checkins.history(goalId),
    queryFn: () => checkinRepository.getMany(goalId, dates).then(unwrap),
    enabled: !!goalId && dates.length > 0,
  });
}

export function useTodayCheckinStatus(goalIds: string[], today: string) {
  return useQuery({
    queryKey: queryKeys.checkins.todayStatus(goalIds, today),
    queryFn: () => checkinRepository.getTodayStatusForGoals(goalIds, today).then(unwrap),
    enabled: goalIds.length > 0,
  });
}

export function useDoCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      goalId: string;
      ownerUid: string;
      done: boolean;
      note: string;
    }) =>
      goalRepository
        .doCheckin(input.goalId, input.ownerUid, input.done, input.note)
        .then(unwrap),
    onSuccess: (updatedGoal) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.goals.detail(updatedGoal.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.checkins.history(updatedGoal.id),
      });
      queryClient.invalidateQueries({
        queryKey: ["checkins", "status"],
      });
      toast.success(updatedGoal.lastCheckinDate ? "Checked in!" : "Note saved");
    },
    onError: () => {
      toast.error("Failed to save check-in");
    },
  });
}
