import { useQuery } from "@tanstack/react-query";
import { userRepository } from "@/lib/repositories/user.repository";
import { queryKeys } from "./query-keys";
import { unwrap } from "@/lib/errors";

export function useUsers(uids: string[]) {
  return useQuery({
    queryKey: queryKeys.users.batch(uids),
    queryFn: () => userRepository.getMany(uids).then(unwrap),
    enabled: uids.length > 0,
  });
}
