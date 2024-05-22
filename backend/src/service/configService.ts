import fs from "fs";

type Room = {
  roomId: string;
  initTemp: number;
  type: number;
  price: number;
};

type Config = {
  ac: {
    minTarget: number;
    maxTarget: number;
    serveLimit: number;
    roundRobinInterval: number;
    rate: number[];
    priceRate: number[];
  };
  rooms: Room[];
};

const configFilePath = process.env.CONFIG_FILE_PATH || "./config.json";
let config: Config;
let rooms: Map<string, Room>;

const loadConfig = () => {
  const conf = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));

  config = conf;
  config.ac.rate = config.ac.rate.map((rate) => rate / 60);
  config.ac.priceRate = config.ac.priceRate.map((price) => price / 60);

  rooms = new Map();
  for (const room of config.rooms) {
    rooms.set(room.roomId, room);
  }

  return conf;
};

const getConfig = () => {
  if (!config) {
    loadConfig();
  }

  return { ...config };
};

const modifyConfig = (conf: any) => {
  config = conf;
};

const saveConfig = () => {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
};

const getRoom = (roomId: string) => {
  return rooms.get(roomId);
};

const getRooms = () => {
  return config.rooms;
};

const getRate = (fanSpeed: number) => {
  return config.ac.rate[fanSpeed];
};

const setPriceRate = (priceRate: number[]) => {
  config.ac.priceRate = priceRate;
};

const getPriceRate = (fanSpeed: number) => {
  return config.ac.priceRate[fanSpeed];
};

const setTargetRange = (
  minTarget: number | undefined,
  maxTarget: number | undefined,
) => {
  config.ac.minTarget = minTarget || config.ac.minTarget;
  config.ac.maxTarget = maxTarget || config.ac.maxTarget;
};

const getTargetRange = () => {
  return { min: config.ac.minTarget, max: config.ac.maxTarget };
};

const configService = {
  loadConfig,
  getConfig,
  modifyConfig,
  saveConfig,
  getRoom,
  getRooms,
  getRate,
  setPriceRate,
  getPriceRate,
  setTargetRange,
  getTargetRange,
};

export { configService };
