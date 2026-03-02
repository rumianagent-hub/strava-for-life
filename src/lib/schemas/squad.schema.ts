import { z } from "zod";

/** Firestore document shape (no `id` field). */
export const SquadFirestoreSchema = z.object({
  name: z.string(),
  ownerUid: z.string(),
  memberUids: z.array(z.string()),
  maxMembers: z.number(),
  inviteCode: z.string(),
  privacy: z.enum(["public", "private"]),
});

/** App-level shape with document `id`. */
export const SquadSchema = SquadFirestoreSchema.extend({
  id: z.string(),
});

export type SquadFirestore = z.infer<typeof SquadFirestoreSchema>;
export type Squad = z.infer<typeof SquadSchema>;
