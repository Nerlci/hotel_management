import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  generateGetUserAirconDetail,
  getUserRoomNumber,
} from "@/lib/dataFetch";
import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Skeleton } from "./ui/skeleton";

type CostDataItem = {
  date: string;
  cost: number;
  aircon: number;
  food: number;
};

function calcTotalCost(costData: CostDataItem[]): number {
  let res = 0;
  for (const item of costData) {
    res += item.cost;
  }
  return res;
}

function ChartSkeleton() {
  return (
    <>
      <div className="h-80 w-full">
        <Skeleton className="h-60 w-full rounded-xl" />
        <div className="mt-5 space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </>
  );
}

export default function CustomerAirconChart() {
  const roomNumberQuery = useQuery({
    queryKey: ["customerRoomNumber"],
    queryFn: getUserRoomNumber,
  });
  const roomId = roomNumberQuery?.data;
  const {
    isLoading,
    error,
    data: airconDetail,
  } = useQuery({
    queryKey: ["customerAirconChartData"],
    queryFn: generateGetUserAirconDetail(roomId!),
    enabled: !!roomId,
  });

  airconDetail && console.log(airconDetail);

  // TODO: generate costData from airconDetail
  const costData: CostDataItem[] = [
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

  return (
    <Card className="ml-auto mr-auto mt-5">
      <CardHeader>
        <div className="flex flex-row">
          <CardTitle className="text-base">消费</CardTitle>
          <div className="grow" />
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : error ? (
            <div className="text-destructive">获取详单信息失败</div>
          ) : (
            <CardDescription>{calcTotalCost(costData)}￥</CardDescription>
          )}
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
            {isLoading || error ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={costData}
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
            )}
          </TabsContent>
          <TabsContent value="aircon">
            {isLoading || error ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={costData}
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
            )}
          </TabsContent>
          <TabsContent value="food">
            {isLoading || error ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={costData}
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
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
