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
    priceRate: number;
  };
  rooms: Room[];
};

const defaultConfigFilePath = "./config.default.json";
const configFilePath = process.env.CONFIG_FILE_PATH || "./config.json";
let config: Config;
let rooms: Map<string, Room>;

const loadConfig = () => {
  const defaultConf = JSON.parse(
    fs.readFileSync(defaultConfigFilePath, "utf-8"),
  );
  let conf = {};
  if (fs.existsSync(configFilePath)) {
    conf = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
  } else {
    conf = defaultConf;
  }

  config = { ...defaultConf, ...conf };
  config.ac.rate = config.ac.rate.map((rate) => rate / 60);

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

const getRoomPrice = (roomId: string) => {
  return rooms.get(roomId)?.price;
};

const getRate = (fanSpeed: number) => {
  return config.ac.rate[fanSpeed];
};

const setPriceRate = (priceRate: number) => {
  config.ac.priceRate = priceRate;
};

const getFanSpeedPriceRate = (fanSpeed: number) => {
  return config.ac.rate[fanSpeed] * config.ac.priceRate;
};

const getPriceRate = () => {
  return config.ac.priceRate;
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
  getRoomPrice,
  getRooms,
  getRate,
  setPriceRate,
  getFanSpeedPriceRate,
  getPriceRate,
  setTargetRange,
  getTargetRange,
};

export { configService };
