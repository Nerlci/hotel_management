import { CustomerBooking } from "@/components/CustomerBooking";
import { CustomerDashboard } from "@/components/CustomerDashboard";
import { HomeIcon } from "@/components/HomeIcon";
import { NavBar } from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Customer: React.FC = () => {
  const customerBooked = true; // TODO: fetch this from server

  return (
    <>
      <NavBar title={<HomeIcon />} />
      <div className="mt-3 justify-center">
        <Tabs
          defaultValue={customerBooked ? "dashboard" : "booking"}
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
            <CustomerBooking />
          </TabsContent>
          <TabsContent value="dashboard">
            <CustomerDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
