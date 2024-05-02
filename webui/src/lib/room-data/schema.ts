import { z } from "zod";

export const roomSchema = z
  .object({
    id: z.string().min(1).max(4),
    status: z.literal("occupied").or(z.literal("empty")),
    startDate: z.string().min(6).or(z.literal("-")),
    endDate: z.string().min(6).or(z.literal("-")),
  })
  .refine((d) => {
    if (d.status === "occupied") {
      return (
        d.startDate !== "-" &&
        d.endDate !== "-" &&
        new Date(d.startDate) < new Date(d.endDate)
      );
    } else {
      return d.startDate === "-" && d.endDate === "-";
    }
  });

export type Room = z.infer<typeof roomSchema>;
