import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { squadRepository } from "@/lib/repositories/squad.repository";
import { queryKeys } from "./query-keys";
import { unwrap } from "@/lib/errors";
import { toast } from "sonner";

export function useUserSquads(uid: string | undefined) {
  return useQuery({
    queryKey: queryKeys.squads.userSquads(uid ?? ""),
    queryFn: () => squadRepository.getUserSquads(uid!).then(unwrap),
    enabled: !!uid,
  });
}

export function useSquad(squadId: string) {
  return useQuery({
    queryKey: queryKeys.squads.detail(squadId),
    queryFn: () => squadRepository.get(squadId).then(unwrap),
    enabled: !!squadId,
  });
}

export function useSquadByInviteCode(code: string) {
  return useQuery({
    queryKey: queryKeys.squads.byInviteCode(code),
    queryFn: () => squadRepository.getByInviteCode(code).then(unwrap),
    enabled: !!code,
  });
}

export function useCreateSquad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { ownerUid: string; name: string }) =>
      squadRepository.create(input.ownerUid, input.name).then(unwrap),
    onSuccess: (_data, { ownerUid }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.squads.userSquads(ownerUid) });
      toast.success("Squad created!");
    },
    onError: () => {
      toast.error("Failed to create squad");
    },
  });
}

export function useJoinSquad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { squadId: string; uid: string }) =>
      squadRepository.join(input.squadId, input.uid).then(unwrap),
    onSuccess: (squad) => {
      queryClient.invalidateQueries({ queryKey: ["squads"] });
      toast.success(`Joined "${squad.name}"!`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to join squad");
    },
  });
}
