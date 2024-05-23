import { parse } from "json2csv";
import { prisma } from "../prisma";
import { StatementItem, statementItem } from "shared";
import { ACRecord } from "@prisma/client";
import { configService } from "./configService";

const getDetailByRoomId = async (roomId: string) => {
  const ac = await prisma.aCRecord.findMany({
    orderBy: {
      timestamp: "desc",
    },
    take: 1,
    where: {
      roomId: roomId,
      type: 1,
    },
  });

  const now = new Date();
  const { id, temp, priceRate, ...rest } = ac[0];
  const subtotal =
    Math.ceil((now.getTime() - rest.timestamp.getTime()) / 1000) *
    priceRate *
    (rest.on ? 1 : 0);
  const total =
    (await getStatement(roomId, undefined, undefined)).reduce(
      (sum, item) => sum + item.price,
      0,
    ) + subtotal;

  const detail = {
    ...rest,
    timestamp: now,
    subtotal,
    total,
  };

  return detail;
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

const acService = {
  getDetailByRoomId,
  getStatement,
  getStatementTable,
  getInvoice,
};
export { acService };
