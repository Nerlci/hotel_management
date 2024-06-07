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
    const interval = Math.ceil((Date.now() - timestamp.getTime()) / 1000);
    if (!on) {
      const theRate = Math.abs(rate);
      if (temp < initTemp) {
        setCurrentTemp(() => Math.min(initTemp, temp + theRate * interval));
      } else {
        setCurrentTemp(() => Math.max(initTemp, temp - theRate * interval));
      }
    } else {
      setCurrentTemp(() => temp + rate * interval);
    }
  }, 1000);

  return currentTemp.toFixed(2);
};
