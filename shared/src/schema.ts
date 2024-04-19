import { z } from "zod";

export const DateRange = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "End date must be later than or equal to the start date",
  });

export const StatusCode = z
  .union([z.literal("200"), z.literal("400"), z.literal("500")])
  .default("200");

export const Error = z.object({
  msg: z.string().default(""),
});

export const UserOrderResponse = z.object({
  code: StatusCode,
  error: Error,
  payload: z.object({
    roomId: z.string(),
  }),
});

export const UserAvailablityResponse = z.object({
  code: StatusCode,
  error: Error,
  payload: z.object({
    rooms: z.array(
      z.object({
        type: z.string().min(1),
        status: z.boolean(),
      }),
    ),
  }),
});

export const ReceptionAvailableResponse = z
  .object({
    code: StatusCode,
    error: Error,
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
