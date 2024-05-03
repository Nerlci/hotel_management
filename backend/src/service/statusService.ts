import { Request, Response } from "express";
import { ACStatus, acStatus } from "shared";
import { prisma } from "../prisma";
import SseChannel from "sse-channel";

const channels: Map<string, SseChannel> = new Map();
const globalChannel = new SseChannel();

const getChannel = (roomId: string) => {
  // TODO: Check if the room is valid
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
    ? acStatus.parse(status)
    : acStatus.parse({
        roomId: roomId,
        temp: 25,
        mode: 0,
        fanSpeed: 1,
        on: false,
        timestamp: new Date(),
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
    for (const roomId of channels.keys()) {
      status.push(await getInitialStatus(roomId));
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
