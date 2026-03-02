import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { UserDoc } from "@/lib/schemas";

interface SquadMembersProps {
  memberUids: string[];
  profiles: Record<string, UserDoc>;
  currentUid: string | undefined;
  ownerUid: string;
}

export function SquadMembers({ memberUids, profiles, currentUid, ownerUid }: SquadMembersProps) {
  return (
    <Card className="border-gray-100 mb-6">
      <CardContent className="p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Members</h2>
        <div className="flex gap-3 flex-wrap">
          {memberUids.map((uid) => (
            <div key={uid} className="flex flex-col items-center gap-1">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                  {(profiles[uid]?.displayName || "?")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {uid === currentUid && (
                <span className="text-xs text-gray-400">You</span>
              )}
              {uid === ownerUid && uid !== currentUid && (
                <span className="text-xs text-gray-400">Owner</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
