import { parse } from "json2csv";
import { prisma } from "../prisma";
import { ACRecord } from "@prisma/client";
import { StatementItem, statementItem } from "shared";
import { configService } from "./configService";

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

      statement.push(
        statementItem.parse({
          roomId: roomId,
          requestTime: lastRequest?.timestamp,
          startTime: lastStatus.timestamp,
          endTime: acRecord.timestamp,
          duration,
          fanSpeed: lastStatus.fanSpeed,
          price: duration * lastStatus.priceRate,
          priceRate:
            lastStatus.priceRate / configService.getRate(lastStatus.fanSpeed),
          target: lastStatus.target,
          temp: acRecord.temp,
          mode: lastStatus.mode,
        }),
      );
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

  const table = [
    [
      "房间号",
      "请求时间",
      "开始时间",
      "结束时间",
      "持续时长",
      "风速",
      "费用",
      "费率",
      "目标温度",
      "结束温度",
    ],
  ];
  for (const item of statement) {
    table.push([
      item.roomId,
      item.requestTime?.toLocaleString() || "",
      item.startTime.toLocaleString(),
      item.endTime.toLocaleString(),
      item.duration.toString(),
      item.fanSpeed.toString(),
      item.price.toString(),
      item.priceRate.toString(),
      item.target.toString(),
      item.temp.toString(),
    ]);
  }

  const csv = parse(table, { header: false });

  return csv;
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
  getDays,
};
export { acService };
