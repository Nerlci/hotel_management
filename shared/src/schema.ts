import { z } from "zod";

export const DateRange = z
  .object({
    start: z.date(),
    end: z.date(),
  })
  .refine((d) => d.end >= d.start, {
    message: "End date must be later than or equal to the start date",
  });

export const UserOrderResponse = z.object({
  code: z.string().min(2, "A status code is required"),
  error: z.object({
    msg: z.string(),
  }),
  payload: z.object({
    roomId: z.string(),
  }),
});

export const UserAvailablityResponse = z.object({
  code: z.string().min(2, "A status code is required"),
  error: z.object({
    msg: z.string(),
  }),
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
    code: z.string().min(2, "A status code is required"),
    error: z.object({
      msg: z.string(),
    }),
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
