import { FoodDrawer } from "@/components/FoodDrawer";
import { RoomDrawer } from "@/components/RoomDrawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import CustomerAirconChart from "./CustomerAirconChart";
import AirconDrawer from "./AirconDrawer";

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth()!;

  return (
    <>
      <Card className="ml-auto mr-auto mt-5">
        <CardHeader>
          <CardTitle>欢迎回来，{user && user.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 lg:flex-row">
            <AirconDrawer />
            <div className="my-[-4px] h-0 grow" />
            <FoodDrawer />
            <RoomDrawer />
          </div>
        </CardContent>
      </Card>
      <CustomerAirconChart />
    </>
  );
};
