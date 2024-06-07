import { Request, Response } from "express";
import {
  DateRange,
  ReceptionAvailableResponse,
  ReceptionCheckinRequest,
  receptionCheckinRequest,
  UserRoomOrderResponse,
  responseBase,
  UserAvailablityResponse,
  ReceptionAllRooms,
  GetAvailableRoomsResponse,
} from "shared";
import { roomService } from "../service/roomService";
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

    const response: UserAvailablityResponse = {
      error: {
        msg: "",
      },
      code: "200",
      payload: result,
    };

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
  try {
    const data: ReceptionCheckinRequest = receptionCheckinRequest.parse(
      req.query,
    );

    const userId = data.userId;
    const roomId = data.roomId;

    const result = await roomService.checkIn(userId, roomId);

    const response = responseBase.parse({
      code: "200",
      payload: {},
      error: {
        msg: "",
      },
    });

    res.json(response);
  } catch (error) {
    handleErrors(error, res);
  }
};

const getRoom = async (req: Request, res: Response) => {
  try {
    const userId = String(req.query.userId);
    const result = await roomService.getRoom(userId);

    const response: GetAvailableRoomsResponse = {
      code: "200",
      payload: { available: result },
      error: {
        msg: "",
      },
    };

    res.json(response);
  } catch (error: any) {
    handleErrors(error, res);
  }
};

const checkOut = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    const result = await roomService.checkOut(userId);

    const response = responseBase.parse({
      code: "200",
      payload: {},
      error: {
        msg: "",
      },
    });

    res.json(response);
  } catch (error) {
    handleErrors(error, res);
  }
};

const getBill = async (req: Request, res: Response) => {
  try {
    const roomId = req.query.roomId as string;

    const result = await roomService.getBill(roomId);

    const response = responseBase.parse({
      code: "200",
      payload: { statement: result },
      error: {
        msg: "",
      },
    });

    res.json(response);
  } catch (error) {
    handleErrors(error, res);
  }
};

const getBillFile = async (req: Request, res: Response) => {
  try {
    const roomId = req.query.roomId as string;

    const doc = await roomService.getBillFile(roomId);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bill_${roomId}.pdf`,
    );
    doc.pipe(res);
  } catch (error) {
    handleErrors(error, res);
  }
};

const getAllRooms = async (req: Request, res: Response) => {
  try {
    const result = await roomService.getAllRooms();
    // console.log(result);

    const response: ReceptionAllRooms = {
      code: "200",
      payload: { rooms: result },
      error: {
        msg: "",
      },
    };

    res.json(response);
  } catch (error) {
    handleErrors(error, res);
  }
};

const orderDining = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.userId;
    const itemArray = req.body.item as Array<{
      foodId: string;
      quantity: number;
    }>;

    const result = await roomService.orderDining(userId, itemArray);

    const response = responseBase.parse({
      code: "200",
      payload: {},
      error: {
        msg: "",
      },
    });

    res.json(response);
  } catch (error) {
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
  checkOut,
  getBill,
  getBillFile,
  getAllRooms,
  orderDining,
};

export { roomController };
