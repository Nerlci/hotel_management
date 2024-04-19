import { z } from "zod";

export const responseBase = z.object({
  code: z
    .union([z.literal("200"), z.literal("400"), z.literal("500")])
    .default("200"),
  error: z.object({
    msg: z.string().default(""),
  }),
});

export const UserOrderResponse = responseBase.extend({
  payload: z.object({
    roomId: z.string().min(1, "Room ID can't be empty"),
  }),
});
export type UserOrderResponse = z.infer<typeof UserOrderResponse>;

export const UserAvailablityResponse = responseBase.extend({
  payload: z.object({
    rooms: z.array(
      z.object({
        type: z.string().min(1),
        status: z.boolean(),
      }),
    ),
  }),
});
export type UserAvailablityResponse = z.infer<typeof UserAvailablityResponse>;

export const ReceptionAvailableResponse = responseBase
  .extend({
    payload: z.object({
      recommended: z.string(),
      available: z.array(z.string()),
    }),
  })
  .refine(
    (d) =>
      (d.payload.recommended === "" && // if nothing to recommend
        d.payload.available.length === 0) || // available should also be empty
      (d.payload.recommended !== "" && d.payload.available.length !== 0),
    {
      message:
        "Recommanded and available should be both empty or both have values",
    },
  );
export type ReceptionAvailableResponse = z.infer<
  typeof ReceptionAvailableResponse
>;

export const CheckinRequest = z.object({
  roomId: z.string().min(1, "Room ID can't be empty"),
  userName: z.string().min(1, "User name can't be empty"),
});
export type CheckinRequest = z.infer<typeof CheckinRequest>;

export const DateRange = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "End date must be later than or equal to the start date",
  });
export type DateRange = z.infer<typeof DateRange>;
