import { Request, Response } from "express";
import {
  ACDetailResponse,
  acDetailResponse,
  acUpdateRequest,
  responseBase,
} from "shared";
import { schedulerService } from "../service/schedulerService";
import { statusService } from "../service/statusService";
import { acService } from "../service/acService";
import { CustomError, handleErrors } from "../utils/utils";
import { tempService } from "../service/tempService";
import { configService } from "../service/configService";
import { roomService } from "../service/roomService";

const updateAC = async (req: Request, res: Response) => {
  try {
    const ac = acUpdateRequest.parse({
      userId: res.locals.user.userId,
      ...req.body,
    });

    if (res.locals.user.type !== 3 && res.locals.user.type !== 1) {
      const userRoom = await roomService.findUserRoom(res.locals.user.userId);

      if (userRoom === undefined || userRoom !== ac.roomId) {
        throw new CustomError("400", "Permission denied");
      }
    }

    const targetRange = configService.getTargetRange();

    if (ac.target > targetRange.max || ac.target < targetRange.min) {
      throw new CustomError("400", "Target temperature out of range");
    }

    schedulerService.addUpdateRequest(ac);

    const response = responseBase.parse({
      code: "200",
      error: {
        msg: "",
      },
      payload: {},
    });

    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const statusAC = async (req: Request, res: Response) => {
  try {
    const roomId = req.query.roomId;

    if (typeof roomId !== "string" && roomId !== undefined) {
      throw new CustomError("400", "Invalid room ID");
    }

    if (roomId === undefined) {
      if (res.locals.user.type !== 3 && res.locals.user.type !== 1) {
        throw new CustomError("400", "Permission denied");
      }
    }

    statusService.listenStatus(req, res, roomId);
  } catch (e) {
    handleErrors(e, res);
  }
};

const detailAC = async (req: Request, res: Response) => {
  try {
    const roomId = req.query.roomId;

    if (typeof roomId !== "string") {
      throw new CustomError("400", "Invalid room ID");
    }

    const detail = await acService.getDetailByRoomId(roomId);

    const response = acDetailResponse.parse({
      code: "200",
      error: {
        msg: "",
      },
      payload: {
        ...detail,
        details: detail.details.map((d) => {
          return {
            ...d,
            timestamp: d.timestamp.toISOString(),
          };
        }),
      },
    });
    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const tempAC = async (req: Request, res: Response) => {
  try {
    const roomId = req.query.roomId;

    if (typeof roomId !== "string") {
      throw new CustomError("400", "Invalid room ID");
      return;
    }

    const now = new Date();

    const temp = tempService.getTemp(roomId, now);

    const response = responseBase.parse({
      code: "200",
      error: {
        msg: "",
      },
      payload: {
        roomId: roomId,
        temp,
        timestamp: now,
      },
    });
    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const statementAC = async (req: Request, res: Response) => {
  try {
    const roomId = req.query.roomId;
    const startTime = req.query.startTime
      ? new Date(req.query.startTime as string)
      : undefined;
    const endTime = req.query.endTime
      ? new Date(req.query.endTime as string)
      : undefined;

    if (typeof roomId !== "string") {
      throw new CustomError("400", "Invalid room ID");
    }

    const statement = await acService.getStatement(roomId, startTime, endTime);

    const response = responseBase.parse({
      code: "200",
      error: {
        msg: "",
      },
      payload: {
        roomId: roomId,
        statement,
      },
    });
    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const statementFileAC = async (req: Request, res: Response) => {
  try {
    const roomId = req.query.roomId;
    const startTime = req.query.startTime
      ? new Date(req.query.startTime as string)
      : undefined;
    const endTime = req.query.endTime
      ? new Date(req.query.endTime as string)
      : undefined;

    if (typeof roomId !== "string") {
      throw new CustomError("400", "Invalid room ID");
    }

    const doc = await acService.getStatementTable(roomId, startTime, endTime);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="statement_${roomId}_${Date.now()}.pdf"`,
    );
    doc.pipe(res);
  } catch (e) {
    handleErrors(e, res);
  }
};

const getPriceRateAC = async (req: Request, res: Response) => {
  try {
    const priceRate = await configService.getPriceRate();

    const response = responseBase.parse({
      code: "200",
      error: {
        msg: "",
      },
      payload: {
        priceRate,
      },
    });
    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const setPriceRateAC = async (req: Request, res: Response) => {
  try {
    const priceRate = req.body.priceRate;

    if (typeof priceRate !== "number") {
      throw new CustomError("400", "Invalid price rate");
    }

    configService.setPriceRate(priceRate);

    const response = responseBase.parse({
      code: "200",
      error: {
        msg: "",
      },
      payload: {},
    });
    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const getTargetRangeAC = async (req: Request, res: Response) => {
  try {
    const targetRange = await configService.getTargetRange();

    const response = responseBase.parse({
      code: "200",
      error: {
        msg: "",
      },
      payload: {
        minTarget: targetRange.min,
        maxTarget: targetRange.max,
      },
    });
    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const setTargetRangeAC = async (req: Request, res: Response) => {
  try {
    const minTarget = req.body.minTarget;
    const maxTarget = req.body.maxTarget;

    if (
      typeof minTarget !== "number" ||
      typeof maxTarget !== "number" ||
      minTarget > maxTarget
    ) {
      throw new CustomError("400", "Invalid target range");
    }

    configService.setTargetRange(minTarget, maxTarget);

    const response = responseBase.parse({
      code: "200",
      error: {
        msg: "",
      },
      payload: {
        minTarget,
        maxTarget,
      },
    });
    res.json(response);
  } catch (e) {
    handleErrors(e, res);
  }
};

const acController = {
  updateAC,
  statusAC,
  detailAC,
  tempAC,
  statementAC,
  statementFileAC,
  getPriceRateAC,
  setPriceRateAC,
  getTargetRangeAC,
  setTargetRangeAC,
};
export { acController };
