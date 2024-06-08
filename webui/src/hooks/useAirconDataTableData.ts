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
  const [aircons, setAircons] = useState<AirconType[]>();
  const { firstData, closeSource } = useSSE<ACStatus, RoomsData>(
    `${dataFetch.BASE_URL}/api/ac/status`,
    true,
    (data) => {
      setAircons((prevTasks) => {
        if (prevTasks === undefined || prevTasks.length === 0) {
          return undefined;
        }
        return prevTasks.map((task) => {
          if (task.id === data.roomId) {
            task.status = data.on ? "on" : "off";
            if (data.waiting) {
              task.status = "waiting";
            }
            if (data.on) {
              task.temperature = `${data.target}`;
              task.windspeed = `${data.fanSpeed}`;
              task.mode = data.mode === 1 ? "cool" : "heat";
            } else {
              task.temperature = "-";
              task.windspeed = "-";
              task.mode = "-";
            }
          }
          return task;
        });
      });
    },
  );
  useEffect(() => closeSource, [closeSource]);
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

  return aircons;
}
