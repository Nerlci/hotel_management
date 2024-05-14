import { Request, Response } from "express";
import {
  DateRange,
  ReceptionAvailableResponse,
  UserRoomOrderResponse,
  responseBase,
  userAvailablityResponse,
  userRoomOrderResponse,
} from "shared";
import { roomService } from "../service/roomService";
import { prisma } from "../prisma";
import { handleErrors } from "../utils/utils";

const bookRoom = async (req: Request, res: Response) => {
  let reqBody: DateRange;
  try {
    reqBody = DateRange.parse(req.body);
    const startDate = new Date(reqBody.startDate);
    const endDate = new Date(reqBody.endDate);
    const userId = res.locals.user.userId;

    const result = await roomService.bookRoom(userId, startDate, endDate);

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {},
    });

    res.json(response);
  } catch (e: any) {
    handleErrors(e, res);
  }
};

// 订单查询
const checkOrder = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.userId;

    const reservation = await roomService.checkOrder(userId);

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
  } catch (error) {
    handleErrors(error, res);
  }
};

const checkDaysAvailability = async (req: Request, res: Response) => {
  let reqBody: DateRange;
  try {
    reqBody = DateRange.parse(req.query);
    const startDate = new Date(reqBody.startDate);
    const endDate = new Date(reqBody.endDate);

    const result = await roomService.checkDaysAvailability(startDate, endDate);

    const response = userAvailablityResponse.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: result,
    });

    res.json(response);
  } catch (e: any) {
    handleErrors(e, res);
    return;
  }
};

// 客房退订
const cancelOrder = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.userId;

    const result = await roomService.cancelOrder(userId);

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {},
    });

    res.json(response);
  } catch (error) {
    handleErrors(error, res);
  }
};

const getAvailableRooms = async (req: Request, res: Response) => {
  try {
    let reqBody: DateRange;
    reqBody = DateRange.parse(req.query);

    const startDate = new Date(reqBody.startDate);
    const endDate = new Date(reqBody.endDate);

    const availableRooms = await roomService.getAvailableRooms(
      startDate,
      endDate,
    );
    const response: ReceptionAvailableResponse = {
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        recommended: availableRooms[0].roomId,
        available: availableRooms.map((room) => room.roomId),
      },
    };

    res.json(response);
  } catch (error) {
    handleErrors(error, res);
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

const getRoom = async (req: Request, res: Response) => {
  try {
    const email = String(req.query.email);
    const result = await roomService.getRoom(email);

    const response = responseBase.parse({
      code: "200",
      payload: { available: result },
      error: {
        msg: "",
      },
    });

    res.json(response);
  } catch (error: any) {
    handleErrors(error, res);
  }
};

const roomController = {
  bookRoom,
  checkOrder,
  checkDaysAvailability,
  cancelOrder,
  getAvailableRooms,
  checkIn,
  getRoom,
};

export { roomController };
