import { z } from "zod";

export const responseBase = z.object({
  code: z
    .union([z.literal("200"), z.literal("400"), z.literal("500")])
    .default("200"),
  error: z.object({
    msg: z.string().default(""),
  }),
  payload: z.object({}).passthrough(),
});

export const UserOrderResponse = responseBase.extend({
  payload: z.object({
    roomId: z.string().min(1, "Room ID can't be empty"),
  }),
});
export type UserOrderResponse = z.infer<typeof UserOrderResponse>;

export const UserAvailablityResponse = responseBase.extend({
  payload: z.object({
    unavailableDates: z.array(z.string().datetime()),
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

export const acUpdateRequest = z.object({
  userId: z.string().min(1, "User ID can't be empty"),
  roomId: z.string().min(1, "Room ID can't be empty"),
  temp: z.number().min(18).max(30).step(0.5),
  fanSpeed: z.number().int().min(1).max(3),
  mode: z.union([z.literal(0), z.literal(1)]),
  on: z.boolean(),
});
export type ACUpdateRequest = z.infer<typeof acUpdateRequest>;

export const acUpdateRequestBody = acUpdateRequest.omit({
  userId: true,
});
export type ACUpdateRequestBody = z.infer<typeof acUpdateRequestBody>;

export const acStatus = acUpdateRequest.omit({ userId: true }).extend({
  timestamp: z.date(),
});
export type ACStatus = z.infer<typeof acStatus>;

export const acDetailResponse = responseBase.extend({
  payload: z.object({
    details: z.array(
      acUpdateRequest.omit({ userId: true }).extend({
        timestamp: z.string().datetime(),
      }),
    ),
    roomId: z.string().min(1, "Room ID can't be empty"),
  }),
});
export type ACDetailResponse = z.infer<typeof acDetailResponse>;
