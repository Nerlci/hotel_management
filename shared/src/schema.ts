import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
});

export type LoginForm = z.infer<typeof loginFormSchema>;

const registerFormSchema = z.object({
  username: z.string().min(3, "用户名至少3个字符"),
  email: z.string().email("无效邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
});

export type RegisterForm = z.infer<typeof registerFormSchema>;

export const responseBase = z.object({
  code: z
    .union([
      z.literal("200"),
      z.literal("400"),
      z.literal("500"),
      z.literal("401"),
    ])
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

export const userAvailablityResponse = responseBase.extend({
  payload: z.object({
    unavailableDates: z.array(z.string().datetime()),
  }),
});
export type UserAvailablityResponse = z.infer<typeof userAvailablityResponse>;

export const receptionAvailableResponse = responseBase
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
  typeof receptionAvailableResponse
>;

export const receptionCheckinableResponse = responseBase.extend({
  payload: z.object({
    available: z.array(z.string()),
  }),
});
export type ReceptionCheckinableResponse = z.infer<
  typeof receptionCheckinableResponse
>;

export const CheckinRequest = z.object({
  roomId: z.string().min(1, "Room ID can't be empty"),
  userName: z.string().min(1, "User name can't be empty"),
});
export type CheckinRequest = z.infer<typeof CheckinRequest>;

export const DateRange = z
  .object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "End date must be later than or equal to the start date",
  });
export type DateRange = z.infer<typeof DateRange>;

export const acUpdateRequest = z.object({
  userId: z.string().min(1, "User ID can't be empty"),
  roomId: z.string().min(1, "Room ID can't be empty"),
  target: z.number().step(0.5),
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
  temp: z.number(),
  initTemp: z.number(),
  rate: z.number(),
  timestamp: z.string().datetime(),
});
export type ACStatus = z.infer<typeof acStatus>;

export const acDetailResponse = responseBase.extend({
  payload: z.object({
    roomId: z.string().min(1, "Room ID can't be empty"),
    subtotal: z.number(),
    details: z.array(
      acUpdateRequest.omit({ userId: true, roomId: true }).extend({
        timestamp: z.string().datetime(),
        total: z.number(),
      }),
    ),
  }),
});
export type ACDetailResponse = z.infer<typeof acDetailResponse>;

export const userRoomOrderResponse = responseBase
  .extend({
    payload: z.object({
      roomId: z.string(),
      startDate: z.string().datetime().or(z.literal("")),
      endDate: z.string().datetime().or(z.literal("")),
    }),
  })
  .refine(
    (d) => {
      if (d.payload.startDate === "" && d.payload.endDate === "") {
        return false;
      } else {
        return d.payload.startDate <= d.payload.endDate;
      }
    },
    {
      message: "Start date must be earlier than or equal to the end date",
    },
  );

export type UserRoomOrderResponse = z.infer<typeof userRoomOrderResponse>;

export const userLoginResponse = responseBase.extend({
  payload: z.object({
    username: z.string().min(1, "Username can't be empty"),
    type: z.union([
      z.literal("customer"),
      z.literal("admin"),
      z.literal("aircon-manager"),
      z.literal("reception"),
    ]),
  }),
});
export type UserLoginResponse = z.infer<typeof userLoginResponse>;

export const receptionCheckinRequest = z.object({
  roomId: z.string().min(1, "Room ID can't be empty"),
  userId: z.string().min(1, "User ID can't be empty"),
});
export type ReceptionCheckinRequest = z.infer<typeof receptionCheckinRequest>;

export const statementItem = z.object({
  roomId: z.string(),
  requestTime: z.string().datetime().nullable(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z.number(),
  fanSpeed: z.number(),
  price: z.number(),
  priceRate: z.number(),
  target: z.number(),
  temp: z.number(),
});
export type StatementItem = z.infer<typeof statementItem>;

export const getACDetailResponse = responseBase.extend({
  payload: z.object({
    roomId: z.string(),
    statement: z.array(statementItem),
  }),
});

export const receptionAllRooms = responseBase.extend({
  payload: z.object({
    rooms: z.array(
      z.object({
        roomId: z.string(),
        occupied: z.boolean(),
        start: z.string().datetime().nullable(),
        end: z.string().datetime().nullable(),
        userId: z.string().nullable(),
      }),
    ),
  }),
});
export type ReceptionAllRooms = z.infer<typeof receptionAllRooms>;

export const getRoomBillResponse = responseBase.extend({
  payload: z.object({
    statement: z.object({
      roomId: z.string(),
      checkInDate: z.string().datetime(),
      checkOutDate: z.string().datetime(),
      acTotalFee: z.number(),
      bill: z.array(
        z.object({
          name: z.string(),
          price: z.number(),
          quantity: z.number(),
          subtotal: z.number(),
        }),
      ),
    }),
  }),
});

export const getAvailableRoomsResponse = responseBase.extend({
  payload: z.object({
    available: z.array(z.string().min(1, "Room ID can't be empty")),
  }),
});

export const getTargetRangeResponse = responseBase.extend({
  payload: z.object({
    minTarget: z.number(),
    maxTarget: z.number(),
  }),
});
