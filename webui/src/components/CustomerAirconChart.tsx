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
  time: number;
  cost: number;
};

type AirconDataItem = {
  温度?: number;
  time: number;
  风速?: number;
  cool?: boolean;
  on: boolean;
};

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
const AirconTooltip = ({ active, payload }) => {
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

// @ts-expect-error recharts api is not well typed
const PriceTooltip = ({ active, payload }) => {
  if (
    active &&
    payload &&
    payload.length &&
    payload[0].payload.time !== undefined &&
    payload[0].payload.cost !== undefined
  ) {
    const date = new Date(payload[0].payload.time);
    return (
      <Card className="bg-card/70 dark:bg-card/40">
        <div className="m-3 flex flex-col gap-2">
          <div>时间：{date.toLocaleString()}</div>
          <div>费用：{payload[0].payload.cost}</div>
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

export default function CustomerAirconChart(props: { roomId: string }) {
  const { width } = useWindowSize();
  const MAX_CHART_DATA = width < 700 ? 10 : 40;
  const { logout } = useAuth()!;
  const {
    isLoading,
    error,
    data: airconDetail,
  } = useQuery({
    queryKey: ["customerAirconChartData", props.roomId],
    queryFn: dataFetch.generateGetUserAirconDetail(props.roomId),
    enabled: !!props.roomId,
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
        温度: item.target,
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

  const costData: CostDataItem[] = [];
  airconDetail?.payload.details.forEach((item) => {
    costData.push({
      time: new Date(item.timestamp).getTime(),
      cost: item.total,
    });
  });

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
            <CardDescription>
              当前小计：{airconDetail?.payload.subtotal || 0}￥
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="aircon">
          <TabsList>
            <TabsTrigger value="price">费用</TabsTrigger>
            <TabsTrigger value="aircon">空调</TabsTrigger>
          </TabsList>
          <TabsContent value="price">
            {isLoading || error ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={costData}
                  margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="time" hide />
                  <YAxis
                    domain={["dataMin", "dataMax + 10"]}
                    interval="preserveStart"
                  />
                  <Line
                    type="linear"
                    dataKey="cost"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={3}
                    dot={{ strokeWidth: 1 }}
                    isAnimationActive={false}
                  />
                  <Tooltip
                    // @ts-expect-error recharts api is not well typed
                    content={<PriceTooltip />}
                    cursor={false}
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
                    content={<AirconTooltip />}
                    cursor={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
