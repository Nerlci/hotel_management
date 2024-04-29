import { ACUpdateRequest, acStatus } from "shared";
import { prisma } from "../prisma";
import { statusService } from "./statusService";

interface SchedulerItem extends ACUpdateRequest {
  timestamp: Date;
}

const schedulerList:SchedulerItem[] = [];

const addUpdateRequest = async (request: ACUpdateRequest) => {
  const timestamp = new Date();

  const data = {
    user: {
      connect: {
        id: request.userId,
      },
    },
    roomId: request.roomId,
    temp: request.temp,
    windspeed: request.windspeed,
    mode: request.mode,
    on: request.on,
    type: 0,
    timestamp: timestamp,
  };

  await prisma.aCRecord.create({
    data: data,
  });

  const schedulerItem: SchedulerItem = {
    ...request,
    timestamp
  };

  schedulerList.push(schedulerItem);
  schedulerStep();
}

const schedulerStep = async () => {
  const now = new Date();
  const next = schedulerList[0];

  schedulerList.shift();
  const data = {
    user: {
      connect: {
        id: next.userId,
      },
    },
    roomId: next.roomId,
    temp: next.temp,
    windspeed: next.windspeed,
    mode: next.mode,
    on: next.on,
    type: 1,
    timestamp: next.timestamp,
  };
  await prisma.aCRecord.create({
    data: data,
  });

  const status = acStatus.parse({
    roomId: next.roomId,
    temp: next.temp,
    windspeed: next.windspeed,
    mode: next.mode,
    on: next.on,
    timestamp: now,
  });
  statusService.updateStatus(status);
}

const schedulerService = { 
  addUpdateRequest: addUpdateRequest,
};

export { schedulerService };