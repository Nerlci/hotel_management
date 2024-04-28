import { ACUpdateRequest } from "shared";
import { prisma } from "../prisma";

const addUpdateRequest = async (request: ACUpdateRequest) => {
  const data = {
    roomId: request.roomId,
    temp: request.temp,
    windspeed: request.windspeed,
    mode: request.mode,
    on: request.on,
    type: 0
  };

  await prisma.aCRecord.create({
    data: data,
  });
}

const schedulerService = {
  addUpdateRequest: addUpdateRequest,
};

export { schedulerService };