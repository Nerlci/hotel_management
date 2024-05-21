import { prisma } from "../prisma";
import { configService } from "./configService";

type Temp = {
  roomId: string;
  temp: number;
  rate: number;
  timestamp: Date;
};

const roomTemps: Temp[] = [];

const initTemp = () => {
  const timestamp = new Date();
  const config = configService.getConfig();

  for (let room of config.rooms) {
    roomTemps.push({
      roomId: room.roomId,
      temp: room.initTemp,
      rate: config.rate[0],
      timestamp,
    });
  }
};

const getTemp = (roomId: string, timestamp: Date) => {
  const temp = roomTemps.find((temp) => temp.roomId === roomId);
  if (!temp) {
    throw new Error("Room not found");
  }

  const interval = Math.ceil(
    (timestamp.getTime() - temp.timestamp.getTime()) / 1000,
  );

  if (temp.rate == configService.getConfig().rate[0]) {
    const initTemp = configService
      .getConfig()
      .rooms.find((room) => room.roomId === roomId)!.initTemp;
    temp.temp = Math.min(initTemp, temp.temp + temp.rate * interval);
  } else {
    temp.temp += (temp.rate * interval) / 10;
  }

  return temp.temp;
};

const updateTemp = (
  roomId: string,
  temp: number,
  rate: number,
  timestamp: Date,
) => {
  const tempIdx = roomTemps.findIndex((temp) => temp.roomId === roomId);
  if (tempIdx === -1) {
    throw new Error("Room not found");
  }

  roomTemps[tempIdx] = {
    roomId,
    temp,
    rate,
    timestamp,
  };
};

const tempService = {
  initTemp,
  getTemp,
  updateTemp,
};

export { tempService };
