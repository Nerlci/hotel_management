import { Request, Response } from "express";
import {
  DateRange,
  UserRoomOrderResponse,
  responseBase,
  userAvailablityResponse,
  userRoomOrderResponse,
} from "shared";
import { roomService } from "../service/roomService";
import { prisma } from "../prisma";

const bookRoom = async (req: Request, res: Response) => {
  let reqBody: DateRange;
  try {
    reqBody = DateRange.parse(req.body);
  } catch (e: any) {
    const response = responseBase.parse({
      error: {
        msg: e.message,
      },
      code: "400",
      payload: {},
    });
    res.json(response);
    return;
  }
  const startDate = new Date(reqBody.startDate);
  const endDate = new Date(reqBody.endDate);
  const userId = res.locals.user.userId;

  // 一个用户只能订一间房
  const userRoom = await prisma.reservation.findMany({
    where: {
      userId: userId,
    },
  });

  if (userRoom.length > 0) {
    const response = responseBase.parse({
      error: {
        msg: "You have already booked a room",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
    return;
  }

  if (!(await roomService.checkRoomAvailability(startDate, endDate))) {
    const response = responseBase.parse({
      error: {
        msg: "No room available. Please choose another date.",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
  } else {
    await prisma.reservation.create({
      data: {
        userId: userId,
        startDate: startDate,
        endDate: endDate,
      },
    });

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {},
    });

    res.json(response);
  }
};

// 订单查询
const checkOrder = async (req: Request, res: Response) => {
  const userId = res.locals.user.userId;
  const reservation = await prisma.reservation.findMany({
    where: {
      userId: userId,
    },
  });

  if (reservation.length === 0) {
    const response: UserRoomOrderResponse = {
      error: {
        msg: "No reservation",
      },
      code: "400",
      payload: {
        roomId: "",
        startDate: "",
        endDate: "",
      },
    };

    res.json(response);
    return;
  } else {
    const response: UserRoomOrderResponse = {
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        roomId: reservation[0].roomId ? reservation[0].roomId : "",
        startDate: reservation[0].startDate.toISOString(),
        endDate: reservation[0].endDate.toISOString(),
      },
    };

    res.json(response);
  }
};

const checkDaysAvailability = async (req: Request, res: Response) => {
  let reqBody: DateRange;
  try {
    reqBody = DateRange.parse(req.query);
  } catch (e: any) {
    console.log(e);
    const response = responseBase.parse({
      error: {
        msg: e.message,
      },
      code: "400",
      payload: {},
    });
    res.json(response);
    return;
  }
  const startDate = new Date(reqBody.startDate);
  const endDate = new Date(reqBody.endDate);

  const busyDays = await roomService.findBusyDays(startDate, endDate);

  const response = userAvailablityResponse.parse({
    error: {
      msg: "",
    },
    code: "200",
    payload: {
      unavailableDates: busyDays,
    },
  });

  res.json(response);
};

// 客房退订
const cancelOrder = async (req: Request, res: Response) => {
  const userId = res.locals.user.userId;

  const reservation = await prisma.reservation.findMany({
    where: {
      userId: userId,
    },
  });

  if (reservation.length === 0) {
    const response = responseBase.parse({
      error: {
        msg: "No reservation",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
    return;
  } else if (reservation[0].roomId !== null) {
    const response = responseBase.parse({
      error: {
        msg: "You have already checked in",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
    return;
  } else {
    await prisma.reservation.delete({
      where: {
        userId: userId,
      },
    });

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {},
    });

    res.json(response);
  }
};

const getAvailableRooms = async (req: Request, res: Response) => {
  const startDate = new Date(req.query.startDate as string);
  const endDate = new Date(req.query.endDate as string);
  const availableRooms = await roomService.getAvailableRooms(
    startDate,
    endDate,
  );

  if (availableRooms.length === 0) {
    const response = userRoomOrderResponse.parse({
      error: {
        msg: "No room available. Please choose another date.",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
  } else {
    const response = userRoomOrderResponse.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        recommended: availableRooms[0].roomId,
        available: availableRooms.map((room) => room.roomId),
      },
    });

    res.json(response);
  }
};

const checkIn = async (req: Request, res: Response) => {
  const email = req.query.email;
  const roomId = req.query.roomId;

  const room = await prisma.room.findUnique({
    where: {
      roomId: roomId as string,
    },
  });

  if (!room) {
    const response = responseBase.parse({
      error: {
        msg: "Room not found",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
    return;
  } else if (room.status === "occupied") {
    const response = responseBase.parse({
      error: {
        msg: "Room is occupied",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
    return;
  } else {
    const user = await prisma.user.findUnique({
      where: {
        email: email as string,
      },
    });

    if (!user) {
      const response = responseBase.parse({
        error: {
          msg: "User not found",
        },
        code: "400",
        payload: {},
      });

      res.json(response);
      return;
    }

    const reservation = await prisma.reservation.findMany({
      where: {
        userId: user?.id,
      },
    });

    // 是否有预定
    if (reservation.length === 0) {
      const response = responseBase.parse({
        error: {
          msg: "No reservation",
        },
        code: "400",
        payload: {},
      });

      res.json(response);
      return;
    } else {
      // 是否已经入住
      if (reservation[0].roomId !== null) {
        const response = responseBase.parse({
          error: {
            msg: "You have already checked in",
          },
          code: "400",
          payload: {},
        });

        res.json(response);
        return;
      }
    }

    await prisma.room.update({
      where: {
        roomId: roomId as string,
      },
      data: {
        status: "occupied",
      },
    });

    await prisma.reservation.update({
      where: {
        userId: user?.id,
      },
      data: {
        room: {
          connect: {
            roomId: room.roomId,
          },
        },
      },
    });

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {},
    });

    res.json(response);
  }
};

const roomController = {
  bookRoom,
  checkOrder,
  checkDaysAvailability,
  cancelOrder,
  getAvailableRooms,
  checkIn,
};

export { roomController };
