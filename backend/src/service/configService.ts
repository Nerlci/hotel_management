import fs from "fs";

type Config = {
  serveLimit: number;
  roundRobinInterval: number;
  rooms: {
    roomId: string;
    initTemp: number;
    type: number;
    price: number;
  }[];
  rate: number[];
};

let config: Config;
const configFilePath = process.env.CONFIG_FILE_PATH || "./config.json";

const loadConfig = () => {
  const conf = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));

  config = conf;
  config.rate = config.rate.map((rate) => rate / 60);

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

const configService = {
  loadConfig,
  getConfig,
  modifyConfig,
  saveConfig,
};

export { configService };
