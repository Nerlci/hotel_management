import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import {
  MAX_AIRCON_SPEED,
  MAX_AIRCON_TEMP,
  MIN_AIRCON_SPEED,
  MIN_AIRCON_TEMP,
  dataFetch,
} from "shared";
import { useAuth } from "@/hooks/useAuth";
import { useWindowSize } from "usehooks-ts";

type CostDataItem = {
  date: string;
  cost: number;
  aircon: number;
  food: number;
};

type AirconDataItem = {
  温度?: number;
  time: number;
  风速?: number;
  cool?: boolean;
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
    const date = new Date(payload[0].payload.time);
    return (
      <Card className="bg-card/70 dark:bg-card/40">
        <div className="m-3 flex flex-col gap-2">
          <div>时间：{date.toLocaleString()}</div>
          <div>温度：{payload[0].payload.温度}</div>
          <div>风速：{payload[0].payload.风速}</div>
        </div>
      </Card>
    );
  } else {
    // smh if null or empty string is returned,
    // the previous tooltip will show up in the
    // top left corner of the chart, wtf?
    return <div>...</div>;
  }
};

export default function CustomerAirconChart() {
  const { width } = useWindowSize();
  const MAX_CHART_DATA = width < 700 ? 10 : 40;
  const { logout } = useAuth()!;
  const roomNumberQuery = useQuery({
    queryKey: ["customerRoomNumber"],
    queryFn: dataFetch.getUserRoomNumber,
  });
  const roomId = roomNumberQuery?.data;
  if (roomNumberQuery.error) {
    if (roomNumberQuery.error.message === "401") {
      logout();
    }
  }
  const {
    isLoading,
    error,
    data: airconDetail,
  } = useQuery({
    queryKey: ["customerAirconChartData"],
    queryFn: dataFetch.generateGetUserAirconDetail(roomId!),
    enabled: !!roomId,
    refetchInterval: 1000,
  });
  if (error) {
    if (error.message === "401") {
      logout();
    } else {
      toast.error("获取详单信息失败");
      console.log(error.message);
    }
  }

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
      if (airconData.length > MAX_CHART_DATA) {
        // limit airconData length to 100
        airconData.shift();
      }
      if (!item.on) {
        airconData.push({
          ...item,
          time: item.time + 1,
          温度: undefined,
          风速: undefined,
          cool: undefined,
        });
        if (airconData.length > MAX_CHART_DATA) {
          airconData.shift();
        }
      }
    });

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
                <AreaChart
                  data={airconData}
                  margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="time" hide />
                  <YAxis
                    yAxisId="left"
                    domain={[MIN_AIRCON_TEMP - 4, MAX_AIRCON_TEMP + 1]}
                    ticks={[
                      ...Array(MAX_AIRCON_TEMP - MIN_AIRCON_TEMP + 1).keys(),
                    ].map((i) => i + MIN_AIRCON_TEMP)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0.5, 7]}
                    ticks={[
                      ...Array(MAX_AIRCON_SPEED - MIN_AIRCON_SPEED + 1).keys(),
                    ].map((i) => i + MIN_AIRCON_SPEED)}
                  />
                  <Area
                    yAxisId="left"
                    type="linear"
                    dataKey="温度"
                    stroke="hsl(var(--foreground))"
                    isAnimationActive={false}
                  />
                  <Area
                    yAxisId="right"
                    type="linear"
                    dataKey="风速"
                    fill="hsl(var(--destructive))"
                    stroke="hsl(var(--foreground))"
                    isAnimationActive={false}
                  />
                  <Tooltip
                    // @ts-expect-error recharts api is not well typed
                    content={<CustomTooltip />}
                    cursor={false}
                  />
                </AreaChart>
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
