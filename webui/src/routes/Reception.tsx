import { NavBar } from "@/components/NavBar";
import { PersonIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceptionBill from "@/components/ReceptionBill";
import ReceptionCheckinCheckout from "@/components/ReceptionCheckinCheckout";
import { useQuery } from "@tanstack/react-query";
import { dataFetch } from "shared";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "usehooks-ts";

export default function Reception() {
  const roomsQuery = useQuery({
    queryKey: ["receptionRooms"],
    queryFn: dataFetch.getReceptionAllRooms,
    refetchInterval: 5000,
  });
  const rooms = roomsQuery.data;
  const [tab, setTab] = useLocalStorage("reception-tab", "bill");

  return (
    <>
      <NavBar title={<PersonIcon />} />
      <div className="mt-3 justify-center">
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="top-3 mx-auto w-10/12"
        >
          <TabsList>
            <TabsTrigger value="checkinout">入住与退房</TabsTrigger>
            <TabsTrigger value="bill">详单与账单</TabsTrigger>
          </TabsList>
          <TabsContent value="checkinout">
            <div className="mb-4 hidden h-full flex-1 flex-col md:flex">
              {rooms === undefined ? (
                <Skeleton />
              ) : (
                <ReceptionCheckinCheckout rooms={rooms} showCheckin />
              )}
            </div>
          </TabsContent>
          <TabsContent value="bill">
            <div className="mb-4 hidden h-full flex-1 flex-col md:flex">
              {rooms === undefined ? (
                <Skeleton />
              ) : (
                <ReceptionBill
                  roomIds={rooms.payload.rooms.map((r) => {
                    return {
                      value: r.roomId,
                    };
                  })}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
