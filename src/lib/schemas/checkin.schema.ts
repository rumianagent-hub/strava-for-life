import { z } from "zod";

export const CheckinSchema = z.object({
  date: z.string(),
  done: z.boolean(),
  note: z.string(),
});

export type Checkin = z.infer<typeof CheckinSchema>;
