import { z } from "zod";

export const roomSchema = z.object({
  id: z.string().min(1).max(4),
  status: z.literal("occupied").or(z.literal("empty")),
  startDate: z.string().min(6).or(z.literal("-")),
  endDate: z.string().min(6).or(z.literal("-")),
  userId: z.string(),
});

export type Room = z.infer<typeof roomSchema>;
