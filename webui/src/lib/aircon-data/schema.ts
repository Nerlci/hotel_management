import { z } from "zod";

export const airconSchema = z.object({
  id: z.string().min(1).max(4),
  temperature: z.string().or(z.literal("-")),
  windspeed: z.string().or(z.literal("-")),
  status: z.literal("on").or(z.literal("off")).or(z.literal("waiting")),
  mode: z.literal("cool").or(z.literal("heat")).or(z.literal("-")),
});
// .refine((d) => {
//   if (d.temperature === "-" && d.windspeed === "-") {
//     return d.status === "off";
//   } else if (d.temperature !== "-" && d.windspeed !== "-") {
//     return d.status === "on";
//   } else {
//     return false;
//   }
// });

export type Aircon = z.infer<typeof airconSchema>;
