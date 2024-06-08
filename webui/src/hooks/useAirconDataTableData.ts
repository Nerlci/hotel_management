import { useSSE } from "@/hooks/useSSE";
import { ACStatus, dataFetch } from "shared";
import { useEffect, useState } from "react";
import { Aircon as AirconType } from "@/lib/aircon-data/schema";

type RoomsData = {
  roomId: string;
  target: number;
  fanSpeed: number;
  mode: number;
  on: boolean;
  temp: number;
  initTemp: number;
  rate: number;
  timestamp: string;
  waiting: boolean;
}[];

export function useAirconDataTableData() {
  const { sseData, firstData, sseReadyState, closeSource } = useSSE<
    ACStatus,
    RoomsData
  >(`${dataFetch.BASE_URL}/api/ac/status`, true);
  useEffect(() => closeSource, [closeSource]);
  const [aircons, setAircons] = useState<AirconType[]>();
  useEffect(() => {
    if (firstData) {
      setAircons(
        firstData.map((value) => {
          return {
            id: value.roomId,
            temperature: value.on ? `${value.target}` : "-",
            windspeed: value.on ? `${value.fanSpeed}` : "-",
            mode: value.on ? (value.mode === 1 ? "cool" : "heat") : "-",
            status: value.on ? (value.waiting ? "waiting" : "on") : "off",
          };
        }),
      );
    }
  }, [firstData]);
  useEffect(() => {
    if (sseReadyState.key === 1 && sseData) {
      console.log("sseData", sseData);
      setAircons((prevTasks) => {
        if (prevTasks === undefined || prevTasks.length === 0) {
          return undefined;
        }
        return prevTasks.map((task) => {
          if (task.id === sseData.roomId) {
            task.status = sseData.on ? "on" : "off";
            if (sseData.waiting) {
              task.status = "waiting";
            }
            if (sseData.on) {
              task.temperature = `${sseData.target}`;
              task.windspeed = `${sseData.fanSpeed}`;
              task.mode = sseData.mode === 1 ? "cool" : "heat";
            } else {
              task.temperature = "-";
              task.windspeed = "-";
              task.mode = "-";
            }
          }
          return task;
        });
      });
    }
  }, [sseData, sseReadyState]);

  return aircons;
}
