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
import { Skeleton } from "@/components/ui/skeleton";
import { useAirconDataTableData } from "@/hooks/useAirconDataTableData";

export const Aircon = () => {
  const aircons = useAirconDataTableData();

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
              {aircons === undefined ? (
                <Skeleton className="h-4 w-20" />
              ) : (
                <DataTable
                  data={aircons}
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
