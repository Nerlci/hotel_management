import { AirconOverview } from "@/components/AirconOverview";
import { NavBar } from "@/components/NavBar";
import { DataTable } from "@/components/DataTable/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  columns,
  filterableColumns,
  getDisplayName,
} from "@/lib/aircon-data/data";
import { GearIcon } from "@radix-ui/react-icons";
import AirconConfig from "@/components/AirconConfig";
import { useSSE } from "@/hooks/useSSE";
import { ACStatus, dataFetch } from "shared";
import { useEffect, useState } from "react";
import { Aircon as AirconType } from "@/lib/aircon-data/schema";
import { Skeleton } from "@/components/ui/skeleton";

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
}[];

export const Aircon = () => {
  const { sseData, firstData, sseReadyState, closeSource } = useSSE<
    ACStatus,
    RoomsData
  >(`${dataFetch.BASE_URL}/api/ac/status`, true);
  useEffect(() => closeSource, [closeSource]);
  const [tasks, setTasks] = useState<AirconType[]>();
  useEffect(() => {
    if (firstData) {
      setTasks(
        firstData.map((value) => {
          return {
            id: value.roomId,
            temperature: value.on ? `${value.target}` : "-",
            windspeed: value.on ? `${value.fanSpeed}` : "-",
            mode: value.on ? (value.mode === 1 ? "cool" : "heat") : "-",
            status: value.on ? "on" : "off",
          };
        }),
      );
    }
  }, [firstData]);
  useEffect(() => {
    if (sseReadyState.key === 1 && sseData && tasks) {
      // console.log(JSON.stringify(sseData));
      setTasks((prevTasks) => {
        if (prevTasks === undefined || prevTasks.length === 0) {
          return undefined;
        }
        return prevTasks.map((task) => {
          if (task.id === sseData.roomId) {
            task.status = sseData.on ? "on" : "off";
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
  }, [sseData, sseReadyState, tasks]);

  return (
    <>
      <NavBar title={<GearIcon />} />
      <div className="mt-3 justify-center">
        <Tabs defaultValue="config" className="top-3 mx-auto w-10/12">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="aircon">空调管理</TabsTrigger>
            <TabsTrigger value="config">空调配置</TabsTrigger>
          </TabsList>
          <TabsContent value="aircon">
            <div className="mb-4 hidden h-full flex-1 flex-col md:flex">
              {tasks === undefined ? (
                <Skeleton className="h-4 w-20" />
              ) : (
                <DataTable
                  data={tasks}
                  columns={columns}
                  getDisplayName={getDisplayName}
                  searchPlaceholder="搜索房间号..."
                  filterableColumns={filterableColumns}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="overview">
            <div className="mb-4 hidden h-full flex-1 flex-col md:flex">
              <AirconOverview />
            </div>
          </TabsContent>
          <TabsContent value="config">
            <div className="mb-4 hidden h-full flex-1 flex-col md:flex">
              <AirconConfig />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
