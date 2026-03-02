import { z } from "zod";
import { GOAL_CATEGORIES } from "@/lib/constants";

export const GoalCategorySchema = z.enum(GOAL_CATEGORIES);
export const GoalPrivacySchema = z.enum(["private", "squad"]);
export const GoalStatusSchema = z.enum(["active", "paused", "archived"]);

/** Firestore document shape (no `id` field). */
export const GoalFirestoreSchema = z.object({
  ownerUid: z.string(),
  title: z.string(),
  description: z.string(),
  category: GoalCategorySchema,
  privacy: GoalPrivacySchema,
  status: GoalStatusSchema,
  startDate: z.string(),
  squadId: z.string().nullable().optional(),
  currentStreak: z.number(),
  bestStreak: z.number(),
  lastCheckinDate: z.string().nullable().optional(),
});

/** App-level shape with document `id`. */
export const GoalSchema = GoalFirestoreSchema.extend({
  id: z.string(),
});

export type GoalCategory = z.infer<typeof GoalCategorySchema>;
export type GoalPrivacy = z.infer<typeof GoalPrivacySchema>;
export type GoalStatus = z.infer<typeof GoalStatusSchema>;
export type GoalFirestore = z.infer<typeof GoalFirestoreSchema>;
export type Goal = z.infer<typeof GoalSchema>;
