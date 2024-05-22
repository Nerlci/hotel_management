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

  const interval = Math.ceil(
    (timestamp.getTime() - temp.timestamp.getTime()) / 1000,
  );

  const rate = temp.rate;

  if (!temp.on) {
    const initTemp = configService
      .getConfig()
      .rooms.find((room) => room.roomId === roomId)!.initTemp;
    if (temp.temp < initTemp) {
      temp.temp = Math.min(initTemp, temp.temp + rate * interval);
    } else {
      temp.temp = Math.max(initTemp, temp.temp - rate * interval);
    }
  } else {
    temp.temp += rate * interval;
  }

  return temp.temp;
};

const updateTemp = (temp: Temp) => {
  const tempIdx = roomTemps.findIndex(
    (roomTemp) => roomTemp.roomId === temp.roomId,
  );
  if (tempIdx === -1) {
    throw new Error("Room not found");
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
