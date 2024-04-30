import { AirconOverview } from "@/components/AirconOverview";
import { NavBar } from "@/components/NavBar";
import { columns } from "@/components/aircon-datatable-components/columns";
import { DataTable } from "@/components/aircon-datatable-components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GearIcon } from "@radix-ui/react-icons";

const tasks = JSON.parse(`
[
  {
    "id": "1001",
    "temperature": "30",
    "windspeed": "3",
    "mode": "heat",
    "status": "on"
  },
  {
    "id": "1002",
    "temperature": "30",
    "windspeed": "4",
    "mode": "heat",
    "status": "on"
  },
  {
    "id": "1003",
    "temperature": "30",
    "windspeed": "2",
    "mode": "heat",
    "status": "on"
  },
  {
    "id": "1004",
    "temperature": "30",
    "windspeed": "1",
    "mode": "heat",
    "status": "on"
  },
  {
    "id": "1005",
    "temperature": "-",
    "windspeed": "-",
    "mode": "-",
    "status": "off"
  },
  {
    "id": "2001",
    "temperature": "-",
    "windspeed": "-",
    "mode": "-",
    "status": "off"
  },
  {
    "id": "2002",
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
          <TabsList className="overview">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="aircon">空调管理</TabsTrigger>
          </TabsList>
          <TabsContent value="aircon">
            <div className="mb-4 hidden h-full flex-1 flex-col md:flex">
              <DataTable data={tasks} columns={columns} />
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
