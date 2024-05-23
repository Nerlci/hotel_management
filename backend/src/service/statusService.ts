import { prisma } from "../prisma";
import { Request, Response } from "express";
import SseChannel from "sse-channel";

import { ACStatus, acStatus } from "shared";
import { tempService } from "./tempService";
import { configService } from "./configService";

const channels: Map<string, SseChannel> = new Map();
const globalChannel = new SseChannel();

const getChannel = (roomId: string) => {
  const roomIds = configService.getConfig().rooms.map((room) => room.roomId);
  if (roomIds.indexOf(roomId) === -1) {
    throw new Error("Room not found");
  }

  if (!channels.has(roomId)) {
    channels.set(roomId, new SseChannel());
  }

  return channels.get(roomId)!;
};

const getInitialStatus = async (roomId: string) => {
  const status = await prisma.aCRecord.findFirst({
    where: {
      roomId: roomId,
      type: 1,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return status
    ? acStatus.parse({
        ...status,
        rate:
          configService.getRate(status.fanSpeed * (status.on ? 1 : 0)) *
          (!status.on || status.mode === 0 ? 1 : -1),
        initTemp: configService.getRoom(roomId)?.initTemp,
        timestamp: status.timestamp.toISOString(),
      })
    : acStatus.parse({
        roomId: roomId,
        target: 25,
        temp: tempService.getTemp(roomId, new Date()),
        mode: 0,
        fanSpeed: 2,
        on: false,
        rate: configService.getRate(2),
        initTemp: configService.getRoom(roomId)?.initTemp,
        timestamp: new Date().toISOString(),
      });
};

const listenStatus = async (
  req: Request,
  res: Response,
  roomId: string | undefined,
) => {
  if (!roomId) {
    globalChannel.addClient(req, res);

    const status: ACStatus[] = [];
    for (const room of configService.getRooms()) {
      status.push(await getInitialStatus(room.roomId));
    }
    globalChannel.send(JSON.stringify(status), [res]);

    return;
  }

  const channel = getChannel(roomId);
  channel.addClient(req, res);

  const status = await getInitialStatus(roomId);
  channel.send(JSON.stringify(status), [res]);
};

const updateStatus = async (status: ACStatus) => {
  const channel = getChannel(status.roomId);
  channel.send(JSON.stringify(status));
  globalChannel.send(JSON.stringify(status));
};

const statusService = {
  listenStatus: listenStatus,
  updateStatus: updateStatus,
};
export { statusService };
