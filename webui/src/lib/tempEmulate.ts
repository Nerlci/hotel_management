// Temperature emulation for user aircon control

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
  const { startTemp, targetTemp, start } = props;
  const [currentTemp, setCurrentTemp] = useState(startTemp);

  useInterval(() => {
    if (currentTemp === targetTemp) {
      props.onTempTied && props.onTempTied();
    }
    if (start && currentTemp < targetTemp) {
      setCurrentTemp((prev) => prev + 1);
    }
  }, 1000);

  return currentTemp;
};
