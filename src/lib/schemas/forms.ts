import { z } from "zod";
import { GoalCategorySchema, GoalPrivacySchema } from "./goal.schema";

export const CreateGoalInputSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be under 100 characters")
      .transform((s) => s.trim()),
    description: z
      .string()
      .max(500, "Description must be under 500 characters")
      .transform((s) => s.trim()),
    category: GoalCategorySchema,
    privacy: GoalPrivacySchema,
    squadId: z.string().optional(),
  })
  .refine((data) => data.privacy !== "squad" || !!data.squadId, {
    message: "Please select a squad for this goal",
    path: ["squadId"],
  });

export type CreateGoalInput = z.infer<typeof CreateGoalInputSchema>;

export const CheckinInputSchema = z.object({
  done: z.boolean(),
  note: z
    .string()
    .max(500, "Note must be under 500 characters")
    .transform((s) => s.trim()),
});

export type CheckinInput = z.infer<typeof CheckinInputSchema>;

export const CreateSquadInputSchema = z.object({
  name: z
    .string()
    .min(1, "Squad name is required")
    .max(50, "Squad name must be under 50 characters")
    .transform((s) => s.trim()),
});

export type CreateSquadInput = z.infer<typeof CreateSquadInputSchema>;

export const JoinSquadInputSchema = z.object({
  inviteCode: z
    .string()
    .min(1, "Invite code is required")
    .transform((s) => s.trim()),
});

export type JoinSquadInput = z.infer<typeof JoinSquadInputSchema>;
