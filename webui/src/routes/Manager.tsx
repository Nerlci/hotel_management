import { DataTable } from "@/components/DataTable/data-table";
import { NavBar } from "@/components/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAirconDataTableData } from "@/hooks/useAirconDataTableData";
import { TokensIcon } from "@radix-ui/react-icons";
import {
  columns,
  filterableColumns,
  getDisplayName,
} from "@/lib/aircon-data/data";
import { useQuery } from "@tanstack/react-query";
import { dataFetch } from "shared";
import ReceptionCheckinCheckout from "@/components/ReceptionCheckinCheckout";
import { HotelStats } from "@/components/HotelStats";
import { useLocalStorage } from "usehooks-ts";

const Aircons = () => {
  const aircons = useAirconDataTableData();

  return (
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
  );
};

export const Manager = () => {
  const roomsQuery = useQuery({
    queryKey: ["receptionRooms"],
    queryFn: dataFetch.getReceptionAllRooms,
    refetchInterval: 5000,
  });
  const rooms = roomsQuery.data;
  const [tab, setTab] = useLocalStorage("manager-tab", "stats");

  return (
    <>
      <NavBar title={<TokensIcon />} />
      <div>
        <div className="mt-3 justify-center">
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="top-3 mx-auto w-10/12"
          >
            <TabsList>
              <TabsTrigger value="stats">报表查看</TabsTrigger>
              <TabsTrigger value="aircons">空调控制</TabsTrigger>
              <TabsTrigger value="rooms">房间管理</TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
              <HotelStats />
            </TabsContent>
            <TabsContent value="aircons">
              <Aircons />
            </TabsContent>
            <TabsContent value="rooms">
              <div className="mb-4 hidden h-full flex-1 flex-col md:flex">
                {rooms === undefined ? (
                  <Skeleton />
                ) : (
                  <ReceptionCheckinCheckout rooms={rooms} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};
