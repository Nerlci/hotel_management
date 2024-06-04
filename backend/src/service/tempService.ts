import { prisma } from "../prisma";
import { configService } from "./configService";

type Temp = {
  roomId: string;
  temp: number;
  rate: number;
  on: boolean;
  timestamp: Date;
};

const roomTemps: Temp[] = [];

const initTemp = () => {
  const timestamp = new Date();
  const rooms = configService.getRooms();

  for (let room of rooms) {
    roomTemps.push({
      roomId: room.roomId,
      temp: room.initTemp,
      rate: configService.getRate(0),
      on: false,
      timestamp,
    });
  }
};

const getTemp = (roomId: string, timestamp: Date) => {
  const temp = roomTemps.find((temp) => temp.roomId === roomId);
  if (!temp) {
    throw new Error("Room not found");
  }

  const newTemp = { ...temp };

  const interval = Math.ceil(
    (timestamp.getTime() - newTemp.timestamp.getTime()) / 1000,
  );

  const rate = temp.rate;

  if (!temp.on) {
    const initTemp = configService
      .getConfig()
      .rooms.find((room) => room.roomId === roomId)!.initTemp;
    if (newTemp.temp < initTemp) {
      newTemp.temp = Math.min(initTemp, newTemp.temp + rate * interval);
    } else {
      newTemp.temp = Math.max(initTemp, newTemp.temp - rate * interval);
    }
  } else {
    newTemp.temp += rate * interval;
  }

  return newTemp.temp;
};

const updateTemp = (temp: Temp) => {
  const tempIdx = roomTemps.findIndex(
    (roomTemp) => roomTemp.roomId === temp.roomId,
  );
  if (tempIdx === -1) {
    throw new Error("Room not found");
  }

  if (temp.timestamp.getTime() < roomTemps[tempIdx].timestamp.getTime()) {
    return;
  }

  roomTemps[tempIdx] = {
    ...temp,
  };
};

const tempService = {
  initTemp,
  getTemp,
  updateTemp,
};

export { tempService };
