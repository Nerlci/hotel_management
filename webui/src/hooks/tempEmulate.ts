import { useState } from "react";
import { useInterval } from "usehooks-ts";

export const useTempEmulate = (props: {
  startTemp: number;
  temp: number;
  timestamp: Date;
  on: boolean;
  rate: number;
  initTemp: number;
}) => {
  const { startTemp, temp, timestamp, on, rate, initTemp } = props;
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
