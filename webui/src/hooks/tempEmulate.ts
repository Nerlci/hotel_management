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
  const { startTemp, targetTemp, start, windSpeed, mode } = props;
  const [currentTemp, setCurrentTemp] = useState(startTemp);

  const speed = 0.1;

  useInterval(() => {
    if (start) {
      if (Math.abs(currentTemp - targetTemp) <= 0.1) {
        setCurrentTemp(targetTemp);
        props.onTempTied && props.onTempTied();
      } else if (mode === "cool" && currentTemp > targetTemp) {
        setCurrentTemp(
          (prev) => prev - windSpeed * (prev - targetTemp) * speed,
        );
      } else if (mode === "heat" && currentTemp < targetTemp) {
        setCurrentTemp(
          (prev) => prev + windSpeed * (targetTemp - prev) * speed,
        );
      }
    }
  }, 1000);

  return currentTemp;
};
