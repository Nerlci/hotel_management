import { FoodDrawer } from "@/components/FoodDrawer";
// import { RoomDrawer } from "@/components/RoomDrawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import CustomerAirconChart from "./CustomerAirconChart";
import AirconDrawer from "./AirconDrawer";

export const CustomerDashboard = (props: { roomId: string }) => {
  const { user } = useAuth()!;

  return (
    <>
      <Card className="ml-auto mr-auto mt-5">
        <CardHeader className="flex flex-row">
          <CardTitle>欢迎回来，{user && user.username}</CardTitle>
          <div className="grow" />
          <CardDescription>{props.roomId}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 lg:flex-row">
            <AirconDrawer roomId={props.roomId} />
            <div className="my-[-4px] h-0 grow" />
            <FoodDrawer roomId={props.roomId} />
            <RoomDrawer />
          </div>
        </CardContent>
      </Card>
      <CustomerAirconChart roomId={props.roomId} />
    </>
  );
};
