import { CustomerBooking } from "@/components/CustomerBooking";
import { CustomerDashboard } from "@/components/CustomerDashboard";
import { HomeIcon } from "@/components/HomeIcon";
import { NavBar } from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { dataFetch } from "shared";

export const Customer: React.FC = () => {
  const bookingQuery = useQuery({
    queryKey: ["userBooking"],
    queryFn: dataFetch.getUserRoomOrder,
  });
  const { logout } = useAuth()!;
  if (bookingQuery.error) {
    if (bookingQuery.error.message === "401") {
      logout();
    }
  }
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
  }, [bookingQuery.data]);

  return (
    <>
      <NavBar title={<HomeIcon />} />
      <div className="mt-3 justify-center">
        <Tabs
          value={tabVal}
          onValueChange={setTabVal}
          className="top-3 mx-auto w-10/12"
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
            <CustomerDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
