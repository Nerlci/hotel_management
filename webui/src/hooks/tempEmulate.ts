import { useState } from "react";
import { useInterval } from "usehooks-ts";

export const useTempEmulate = (props: {
  startTemp: number;
  targetTemp: number;
  windSpeed: number;
  mode: "cool" | "heat";
  start: boolean;
  onTempTied?: () => void;
}) => {
  /* 功能：
   * 1. startTemp 如何设定？
   * 2. 以 1 秒为时间间隔，根据当前空调参数调整温度，
   *    温度可以是浮点数。
   * 3. 当温度达到 targetTemp 时，调用 onTempTied 回调。
   * 4. 可能会增加其他的回调函数。
   */
  const { startTemp } = props;
  const { temp, timestamp, on, rate, initTemp } = {
    on: true,
    temp: 25,
    rate: -0.5,
    initTemp: 30,
    timestamp: new Date("2024-05-21T14:51:00.260Z"),
  };
  const [currentTemp, setCurrentTemp] = useState(startTemp);

  useInterval(() => {
    const interval = Math.ceil((timestamp.getTime() - Date.now()) / 1000);
    if (!on) {
      if (temp < initTemp) {
        setCurrentTemp(() => Math.min(initTemp, temp + rate * interval));
      } else {
        setCurrentTemp(() => Math.max(initTemp, temp - rate * interval));
      }
    } else {
      setCurrentTemp(() => temp + rate * interval);
    }
  }, 1000);

  return currentTemp;
};
