import { CustomerBooking } from "@/components/CustomerBooking";
import { CustomerDashboard } from "@/components/CustomerDashboard";
import { HomeIcon } from "@/components/HomeIcon";
import { NavBar } from "@/components/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { dataFetch } from "shared";

export const Customer: React.FC = () => {
  const bookingQuery = useQuery({
    queryKey: ["userBooking"],
    queryFn: dataFetch.getUserRoomOrder,
  });
  const customerBooked = bookingQuery.data
    ? bookingQuery.data.payload.roomId.length > 0
    : false;
  const [tabVal, setTabVal] = useState<string | "booking" | "dashboard">(
    "booking",
  );

  useEffect(() => {
    if (bookingQuery.data) {
      if (bookingQuery.data.payload.roomId.length > 0) {
        setTabVal("dashboard");
      } else {
        setTabVal("booking");
      }
    }
  }, [bookingQuery]);

  const roomId = bookingQuery.data?.payload.roomId;

  if (bookingQuery.isError && bookingQuery.error.message === "401") {
    return <Navigate to="/login" />;
  } else {
    return (
      <>
        <NavBar title={<HomeIcon />} />
        <div className="mt-3 justify-center">
          <Tabs
            value={tabVal}
            onValueChange={setTabVal}
            className="top-3 mx-auto w-11/12 md:w-10/12"
          >
            <TabsList>
              <TabsTrigger disabled={customerBooked} value="booking">
                预定
              </TabsTrigger>
              <TabsTrigger disabled={!customerBooked} value="dashboard">
                控制台
              </TabsTrigger>
            </TabsList>
            <TabsContent value="booking">
              <CustomerBooking bookingQuery={bookingQuery} />
            </TabsContent>
            <TabsContent value="dashboard">
              {roomId ? (
                <CustomerDashboard roomId={roomId} />
              ) : (
                <Skeleton className="h-80 w-full rounded-xl" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </>
    );
  }
};
