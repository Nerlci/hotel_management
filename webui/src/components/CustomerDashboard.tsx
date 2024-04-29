import { AirconDrawer } from "@/components/AirconDrawer";
import { FoodDrawer } from "@/components/FoodDrawer";
import { RoomDrawer } from "@/components/RoomDrawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type CostDataItem = {
  date: string;
  cost: number;
  aircon: number;
  food: number;
};

const fakeCostData: CostDataItem[] = [
  {
    date: "2021-01-01",
    cost: 100,
    aircon: 0,
    food: 0,
  },
  {
    date: "2021-01-02",
    cost: 120,
    aircon: 10,
    food: 10,
  },
  {
    date: "2021-01-03",
    cost: 300,
    aircon: 150,
    food: 50,
  },
  {
    date: "2021-01-04",
    cost: 300,
    aircon: 50,
    food: 150,
  },
];

function calcTotalCost(costData: CostDataItem[]): number {
  let res = 0;
  for (const item of costData) {
    res += item.cost;
  }
  return res;
}

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth()!;

  return (
    <>
      <Card className="ml-auto mr-auto mt-5">
        <CardHeader>
          <CardTitle>欢迎回来，{user && user.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-5">
            <AirconDrawer />
            <div className="grow" />
            <FoodDrawer />
            <RoomDrawer />
          </div>
        </CardContent>
      </Card>
      <Card className="ml-auto mr-auto mt-5">
        <CardHeader>
          <div className="flex flex-row">
            <CardTitle className="text-base">消费</CardTitle>
            <div className="grow" />
            <CardDescription>{calcTotalCost(fakeCostData)}￥</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="total">
            <TabsList>
              <TabsTrigger value="total">总计</TabsTrigger>
              <TabsTrigger value="aircon">空调</TabsTrigger>
              <TabsTrigger value="food">食物</TabsTrigger>
            </TabsList>
            <TabsContent value="total">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={fakeCostData}
                  margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="date" hide />
                  <YAxis
                    domain={["dataMin", "dataMax + 10"]}
                    interval="preserveStart"
                  />
                  <Line
                    type="linear"
                    dataKey="cost"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={3}
                    dot={{ strokeWidth: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="aircon">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={fakeCostData}
                  margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="date" hide />
                  <YAxis
                    domain={["dataMin", "dataMax + 10"]}
                    interval="preserveStart"
                  />
                  <Line
                    type="linear"
                    dataKey="aircon"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={3}
                    dot={{ strokeWidth: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="food">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={fakeCostData}
                  margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="date" hide />
                  <YAxis
                    domain={["dataMin", "dataMax + 10"]}
                    interval="preserveStart"
                  />
                  <Line
                    type="linear"
                    dataKey="food"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={3}
                    dot={{ strokeWidth: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};
