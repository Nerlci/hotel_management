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
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { MAX_AIRCON_SPEED, MAX_AIRCON_TEMP, MIN_AIRCON_SPEED } from "shared";

type CostDataItem = {
  date: string;
  cost: number;
  aircon: number;
  food: number;
};

type AirconDataItem = {
  温度: number | undefined;
  time: number;
  风速: number | undefined;
  cool: boolean | undefined;
  on: boolean;
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

// @ts-expect-error recharts api is not well typed
const CustomTooltip = ({ active, payload }) => {
  if (
    active &&
    payload &&
    payload.length &&
    payload[0].payload.温度 !== undefined &&
    payload[0].payload.风速 !== undefined
  ) {
    return (
      <div className="flex flex-col gap-2">
        <div>温度：{payload[0].payload.温度}</div>
        <div>风速：{payload[0].payload.风速}</div>
      </div>
    );
  }
  return null;
};

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
  if (error) {
    toast("获取详单信息失败", {
      description: error.message,
    });
  }
  // airconDetail && console.log(airconDetail);

  const airconData: AirconDataItem[] = [];
  airconDetail?.payload.details
    .map((item) => {
      return {
        温度: item.temp,
        time: new Date(item.timestamp).getTime(),
        风速: item.fanSpeed,
        cool: item.mode === 1,
        on: item.on,
      };
    })
    .forEach((item) => {
      airconData.push(item);
      if (!item.on) {
        airconData.push({
          ...item,
          time: item.time + 1,
          温度: undefined,
          风速: undefined,
          cool: undefined,
        });
      }
    });

  // console.log(JSON.stringify(airconData));

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
        <Tabs defaultValue="aircon">
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
                  data={airconData}
                  margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="time" hide />
                  <YAxis yAxisId="left" domain={[0, MAX_AIRCON_TEMP]} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[MIN_AIRCON_SPEED, MAX_AIRCON_SPEED]}
                  />
                  <Line
                    yAxisId="left"
                    type="linear"
                    dataKey="温度"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={3}
                    dot={{ strokeWidth: 5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="linear"
                    dataKey="风速"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={3}
                    dot={{ strokeWidth: 5 }}
                  />
                  <Tooltip
                    // @ts-expect-error recharts api is not well typed
                    content={<CustomTooltip />}
                    isAnimationActive={false}
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
