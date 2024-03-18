import { AirconDrawer } from "@/components/AirconDrawer";
import { FoodDrawer } from "@/components/FoodDrawer";
import { HomeIcon } from "@/components/HomeIcon";
import { NavBar } from "@/components/NavBar";
import { RoomDrawer } from "@/components/RoomDrawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CustomerDashboard: React.FC = () => {
  return (
    <>
      <NavBar title={<HomeIcon />} />
      <Card className="w-11/12 ml-auto mr-auto mt-10">
        <CardHeader>
          <CardTitle>欢迎您</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-5">
            <AirconDrawer />
            <FoodDrawer />
            <RoomDrawer />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
