import { ACStatus, StatementItem, acStatus, statementItem } from "shared";
import { prisma } from "../prisma";
import { configService } from "./configService";
import { parse } from "json2csv";

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

  const priceRates = configService.getConfig().acPriceRate;

  const statement: StatementItem[] = [];
  let lastRequest: ACStatus | null = null; // 上一个状态对应的请求
  let lastStatus: ACStatus | null = null; // 上一个状态
  let currentRequest: ACStatus | null = null; // 当前状态对应的请求

  for (const acRecord of acRecords) {
    if (acRecord.type === 0) {
      currentRequest = acStatus.parse(acRecord);
      continue;
    }

    // 结算上一个状态
    if (lastStatus) {
      const duration = Math.ceil(
        (acRecord.timestamp.getTime() - lastStatus.timestamp.getTime()) / 1000,
      );
      const priceRate = priceRates[lastStatus.fanSpeed];

      statement.push(
        statementItem.parse({
          roomId: roomId,
          requestTime: lastRequest?.timestamp,
          startTime: lastStatus.timestamp,
          endTime: acRecord.timestamp,
          duration,
          fanSpeed: lastStatus.fanSpeed,
          price: duration * priceRate,
          priceRate,
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
    lastStatus = acStatus.parse(acRecord);
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
      item.requestTime?.toISOString() || "",
      item.startTime.toISOString(),
      item.endTime.toISOString(),
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

const statementService = {
  getStatement,
  getStatementTable,
};

export { statementService };
