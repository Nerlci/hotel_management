// Temperature emulation for user aircon control

import { useState } from "react";
import { useInterval } from "usehooks-ts";

export const useTempEmulate = (props: {
  startTemp: number;
  targetTemp: number;
  windSpeed: number;
  mode: "cool" | "heat";
  start: boolean;
}) => {
  const { startTemp, targetTemp, windSpeed, mode } = props;
  const [currentTemp, setCurrentTemp] = useState(startTemp);

  useInterval(
    () => {
      setCurrentTemp((prev) => prev + 1);
    },
    currentTemp < targetTemp ? 1000 : null,
  );

  return currentTemp;
};
