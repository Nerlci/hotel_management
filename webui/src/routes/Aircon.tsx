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

const tasks = JSON.parse(`
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
  return (
    <>
      <NavBar title={<GearIcon />} />
      <div className="mt-3 justify-center">
        <Tabs defaultValue="overview" className="top-3 mx-auto w-10/12">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="aircon">空调管理</TabsTrigger>
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
        </Tabs>
      </div>
    </>
  );
};
