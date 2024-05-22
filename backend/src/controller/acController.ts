import { Request, Response } from "express";
import { acUpdateRequest, responseBase } from "shared";
import { schedulerService } from "../service/schedulerService";
import { statusService } from "../service/statusService";
import { acService } from "../service/acService";
import { handleErrors } from "../utils/utils";
import { tempService } from "../service/tempService";

const updateAC = async (req: Request, res: Response) => {
  // TODO: Call service to check if the user has permission to update the AC
  const ac = acUpdateRequest.parse({
    userId: res.locals.user.userId,
    ...req.body,
  });

  schedulerService.addUpdateRequest(ac);

  const response = responseBase.parse({
    code: "200",
    error: {
      msg: "",
    },
    payload: {},
  });

  res.json(response);
};

const statusAC = async (req: Request, res: Response) => {
  try {
    const roomId = req.query.roomId;

    if (typeof roomId !== "string" && roomId !== undefined) {
      const response = responseBase.parse({
        code: "400",
        error: {
          msg: "Invalid room ID",
        },
        payload: {},
      });
      res.json(response);
      return;
    }

    if (roomId === undefined) {
      if (res.locals.user.type !== 1) {
        const response = responseBase.parse({
          code: "400",
          error: {
            msg: "Permission denied",
          },
          payload: {},
        });
        res.json(response);
        return;
      }
    }

    statusService.listenStatus(req, res, roomId);
  } catch (e) {
    handleErrors(e, res);
  }
};

const detailAC = async (req: Request, res: Response) => {
  const roomId = req.query.roomId;

  if (typeof roomId !== "string") {
    const response = responseBase.parse({
      code: "400",
      error: {
        msg: "Invalid room ID",
      },
      payload: {},
    });
    res.json(response);
    return;
  }

  const details = await acService.getDetailByRoomId(roomId);

  const response = responseBase.parse({
    code: "200",
    error: {
      msg: "",
    },
    payload: {
      roomId: roomId,
      details,
    },
  });
  res.json(response);
};

const tempAC = async (req: Request, res: Response) => {
  const roomId = req.query.roomId;

  if (typeof roomId !== "string") {
    const response = responseBase.parse({
      code: "400",
      error: {
        msg: "Invalid room ID",
      },
      payload: {},
    });
    res.json(response);
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
};

const statementAC = async (req: Request, res: Response) => {
  const roomId = req.query.roomId;
  const startTime = req.query.startTime
    ? new Date(req.query.startTime as string)
    : undefined;
  const endTime = req.query.endTime
    ? new Date(req.query.endTime as string)
    : undefined;

  if (typeof roomId !== "string") {
    const response = responseBase.parse({
      code: "400",
      error: {
        msg: "Invalid room ID",
      },
      payload: {},
    });
    res.json(response);
    return;
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
};

const statementTableAC = async (req: Request, res: Response) => {
  const roomId = req.query.roomId;
  const startTime = req.query.startTime
    ? new Date(req.query.startTime as string)
    : undefined;
  const endTime = req.query.endTime
    ? new Date(req.query.endTime as string)
    : undefined;

  if (typeof roomId !== "string") {
    const response = responseBase.parse({
      code: "400",
      error: {
        msg: "Invalid room ID",
      },
      payload: {},
    });
    res.json(response);
    return;
  }

  const csv = await acService.getStatementTable(roomId, startTime, endTime);

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="statement_${roomId}_${Date.now()}.csv"`,
  );
  res.status(200).send(csv);
};

const acController = {
  updateAC,
  statusAC,
  detailAC,
  tempAC,
  statementAC,
  statementTableAC,
};
export { acController };
