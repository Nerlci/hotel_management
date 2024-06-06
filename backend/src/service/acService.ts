import { prisma } from "../prisma";
import { ACRecord } from "@prisma/client";
import { StatementItem } from "shared";
import { configService } from "./configService";
import { renderStatement } from "../utils/renderPdf";

const getDetailByRoomId = async (roomId: string) => {
  const ac = await prisma.aCRecord.findMany({
    where: {
      roomId: roomId,
      type: 1,
    },
  });

  const now = new Date();

  if (ac.length === 0) {
    return { roomId, subtotal: 0, details: [] };
  }

  const current = ac[ac.length - 1];
  const subtotal =
    Math.ceil((now.getTime() - current.timestamp.getTime()) / 1000) *
    current.priceRate *
    (current.on ? 1 : 0);
  let total = 0;

  const details = [];

  for (let i = 0; i < ac.length; i++) {
    const item = ac[i];

    if (i != 0) {
      const duration = Math.ceil(
        (item.timestamp.getTime() - ac[i - 1].timestamp.getTime()) / 1000,
      );
      total += duration * ac[i - 1].priceRate * (ac[i - 1].on ? 1 : 0);
    }

    details.push({
      target: item.target,
      fanSpeed: item.fanSpeed,
      mode: item.mode,
      on: item.on,
      waiting: item.waiting,
      timestamp: item.timestamp,
      total: total,
    });
  }

  return { roomId, subtotal, details };
};

const getStatement = async (
  roomId: string,
  startTime: Date | undefined,
  endTime: Date | undefined,
) => {
  const acRecords = await prisma.aCRecord.findMany({
    orderBy: {
      timestamp: "asc",
    },
    where: {
      roomId: roomId,
      timestamp: {
        gte: startTime,
        lte: endTime,
      },
    },
  });

  const statement: StatementItem[] = [];
  let lastRequest: ACRecord | null = null; // 上一个状态对应的请求
  let lastStatus: ACRecord | null = null; // 上一个状态
  let currentRequest: ACRecord | null = null; // 当前状态对应的请求

  for (const acRecord of acRecords) {
    if (acRecord.type === 0) {
      currentRequest = acRecord;
      continue;
    }

    // 结算上一个状态
    if (lastStatus) {
      const duration = Math.ceil(
        (acRecord.timestamp.getTime() - lastStatus.timestamp.getTime()) / 1000,
      );

      if (duration !== 0) {
        const newStatementItem: StatementItem = {
          roomId: roomId,
          requestTime: lastRequest?.timestamp
            ? lastRequest?.timestamp.toISOString()
            : null,
          startTime: lastStatus.timestamp.toISOString(),
          endTime: acRecord.timestamp.toISOString(),
          duration,
          fanSpeed: lastStatus.fanSpeed,
          price: duration * lastStatus.priceRate,
          priceRate:
            lastStatus.priceRate / configService.getRate(lastStatus.fanSpeed),
          target: lastStatus.target,
          temp: acRecord.temp,
        };
        statement.push(newStatementItem);
      }
    }

    if (!acRecord.on) {
      lastStatus = null;
      continue;
    }

    // 记录新的状态的开始
    lastStatus = acRecord;
    lastRequest = currentRequest;
  }

  return statement;
};

const getStatementTable = async (
  roomId: string,
  startTime: Date | undefined,
  endTime: Date | undefined,
) => {
  const statement = await getStatement(roomId, startTime, endTime);
  const headers = [
    "请求时间",
    "开始时间",
    "结束时间",
    "持续时长",
    "风速",
    "费用",
    "费率",
    "目标温度",
    "结束温度",
  ];
  return await renderStatement(headers, statement, roomId);
};

const getInvoice = async (
  roomId: string,
  startTime: Date | undefined,
  endTime: Date | undefined,
) => {
  const statement = await getStatement(roomId, startTime, endTime);

  const priceRates = new Set(statement.map((item) => item.priceRate));

  const invoice = [];

  for (const price of priceRates) {
    const items = statement.filter((item) => item.priceRate === price);
    const quantity = items.reduce((sum, item) => sum + item.duration, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    invoice.push({
      price,
      quantity,
      subtotal,
    });
  }

  if (invoice.length === 0) {
    invoice.push({
      price: 0,
      quantity: 0,
      subtotal: 0,
    });
  }

  return invoice;
};

const getStatistic = async (
  roomId: string | undefined,
  startTime: Date | undefined,
  endTime: Date | undefined,
) => {
  const record = await prisma.aCRecord.findMany({
    where: {
      roomId: roomId,
      timestamp: {
        gte: startTime,
        lte: endTime,
      },
    },
  });

  const rooms = roomId
    ? [roomId]
    : configService.getRooms().map((room) => room.roomId);

  const statistic = [];

  for (const room of rooms) {
    const statement = await getStatement(room, startTime, endTime);
    const roomRecord = record.filter((item) => item.roomId === room);
    const roomRequest = roomRecord.filter((item) => item.type === 0);

    let onOffCount = 0;
    const scheduleCount = roomRecord.filter((item) => item.type === 1).length;
    const statementCount = statement.length;
    let targetCount = 0;
    let fanSpeedCount = 0;
    let requestDuration = 0;
    const totalPrice = statement.reduce((sum, item) => sum + item.price, 0);

    let lastOnRequest = roomRequest[0];

    for (let i: number = 1; i < roomRequest.length; i++) {
      if (roomRequest[i].on != roomRequest[i - 1].on) {
        onOffCount++;

        if (roomRequest[i].on && !roomRequest[i - 1].on) {
          lastOnRequest = roomRequest[i];
        } else {
          requestDuration += Math.ceil(
            (roomRequest[i].timestamp.getTime() -
              lastOnRequest.timestamp.getTime()) /
              1000,
          );
        }
      }

      if (roomRequest[i].target != roomRequest[i - 1].target) {
        targetCount++;
      }

      if (roomRequest[i].fanSpeed != roomRequest[i - 1].fanSpeed) {
        fanSpeedCount++;
      }
    }

    const roomStatistic = {
      roomId: room,
      onOffCount,
      scheduleCount,
      statementCount,
      targetCount,
      fanSpeedCount,
      requestDuration,
      totalPrice,
    };

    statistic.push(roomStatistic);
  }

  return statistic;
};

const getDays = async (
  roomId: string,
  startTime: Date | undefined,
  endTime: Date | undefined,
) => {
  const requests = await prisma.aCRecord.findMany({
    where: {
      roomId: roomId,
      type: 0,
      timestamp: {
        gte: startTime,
        lte: endTime,
      },
    },
  });

  let days = 0;
  let on = false;

  for (const request of requests) {
    if (request.on) {
      on = true;
    } else {
      if (on) {
        days++;
        on = false;
      }
    }
  }

  return days;
};

const acService = {
  getDetailByRoomId,
  getStatement,
  getStatementTable,
  getInvoice,
  getStatistic,
  getDays,
};
export { acService };
