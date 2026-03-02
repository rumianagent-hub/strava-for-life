import { z } from "zod";

export const UserSettingsSchema = z.object({
  weeklyEmailEnabled: z.boolean(),
});

export const UserDocSchema = z.object({
  uid: z.string(),
  displayName: z.string(),
  photoURL: z.string(),
  email: z.string(),
  timezone: z.string(),
  settings: UserSettingsSchema,
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type UserDoc = z.infer<typeof UserDocSchema>;
