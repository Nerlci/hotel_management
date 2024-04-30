import { AirconDrawer } from "@/components/AirconDrawer";
import { FoodDrawer } from "@/components/FoodDrawer";
import { RoomDrawer } from "@/components/RoomDrawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import CustomerAirconChart from "./CustomerAirconChart";

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth()!;

  return (
    <>
      <Card className="ml-auto mr-auto mt-5">
        <CardHeader>
          <CardTitle>欢迎回来，{user && user.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-5 xs:flex-col sm:flex-row">
            <AirconDrawer />
            <div className="grow xs:mt-[-20px]" />
            <FoodDrawer />
            <RoomDrawer />
          </div>
        </CardContent>
      </Card>
      <CustomerAirconChart />
    </>
  );
};
