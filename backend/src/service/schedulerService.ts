import { ACUpdateRequest, acStatus } from "shared";
import { prisma } from "../prisma";
import { statusService } from "./statusService";

interface SchedulerItem extends ACUpdateRequest {
  timestamp: Date;
}

const schedulerList:SchedulerItem[] = [];

const addUpdateRequest = async (request: ACUpdateRequest) => {
  const { userId, ...rest } = request;
  const now = new Date();

  const data = {
    user: {
      connect: {
        id: userId,
      },
    },
    ...rest,
    type: 0,
    timestamp: now,
  };
  await prisma.aCRecord.create({
    data: data,
  });

  const schedulerItem: SchedulerItem = {
    ...request,
    timestamp: now,
  };
  schedulerList.push(schedulerItem);
  
  schedulerStep();
}

const schedulerStep = async () => {
  const now = new Date();
  const next = schedulerList[0];
  const { userId, ...rest } = next;

  schedulerList.shift();

  const data = {
    user: {
      connect: {
        id: userId,
      },
    },
    ...rest,
    type: 1,
    timestamp: now,
  };
  await prisma.aCRecord.create({
    data: data,
  });

  const status = acStatus.parse(data);
  statusService.updateStatus(status);
}

const schedulerService = { 
  addUpdateRequest: addUpdateRequest,
};

export { schedulerService };