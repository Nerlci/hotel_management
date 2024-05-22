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

const initTasks: AirconType[] = JSON.parse(`
[
  {
    "id": "8101",
    "temperature": "30",
    "windspeed": "3",
    "mode": "heat",
    "status": "on"
  },
  {
    "id": "8102",
    "temperature": "30",
    "windspeed": "4",
    "mode": "heat",
    "status": "on"
  },
  {
    "id": "8103",
    "temperature": "30",
    "windspeed": "2",
    "mode": "heat",
    "status": "on"
  },
  {
    "id": "8104",
    "temperature": "30",
    "windspeed": "1",
    "mode": "heat",
    "status": "on"
  },
  {
    "id": "8105",
    "temperature": "-",
    "windspeed": "-",
    "mode": "-",
    "status": "off"
  },
  {
    "id": "8106",
    "temperature": "-",
    "windspeed": "-",
    "mode": "-",
    "status": "off"
  },
  {
    "id": "8201",
    "temperature": "-",
    "windspeed": "-",
    "mode": "-",
    "status": "off"
  },
  {
    "id": "8202",
    "temperature": "20",
    "windspeed": "2",
    "mode": "cool",
    "status": "on"
  }
]
`);

export const Aircon = () => {
  const { sseData, sseReadyState, closeSource } = useSSE<ACStatus>(
    `${dataFetch.BASE_URL}/api/ac/status`,
  );
  useEffect(() => closeSource, [closeSource]);
  const [tasks, setTasks] = useState(initTasks);
  useEffect(() => {
    if (sseReadyState.key === 1 && sseData) {
      // console.log(sseData);
      setTasks((prevTasks) => {
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
  }, [sseData, sseReadyState]);

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
              <DataTable
                data={tasks}
                columns={columns}
                getDisplayName={getDisplayName}
                searchPlaceholder="搜索房间号..."
                filterableColumns={filterableColumns}
              />
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
