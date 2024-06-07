import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useQuery } from "@tanstack/react-query";
import { RoomStatistic, StatisticItem, dataFetch } from "shared";
import { Skeleton } from "./ui/skeleton";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { Switch } from "./ui/switch";
import { getAWeekAgoStart } from "@/lib/utils";

const dataItems = [
  "开关次数",
  "调度次数",
  "详单条数",
  "调温次数",
  "调风次数",
  "请求时长",
  "总费用",
];

// @ts-expect-error ignore type
const ActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="hsl(var(--primary))"
      >{`${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="hsl(var(--muted-foreground))"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

const ThePieChart = (props: { statistics: RoomStatistic[] }) => {
  const data01 = props.statistics.map((s) => {
    return {
      name: s.roomId,
      value: s.statistic.reduce((acc, cur) => acc + cur.onOffCount, 0),
    };
  });
  const data02 = props.statistics.map((s) => {
    return {
      name: s.roomId,
      value: s.statistic.reduce((acc, cur) => acc + cur.scheduleCount, 0),
    };
  });
  const data03 = props.statistics.map((s) => {
    return {
      name: s.roomId,
      value: s.statistic.reduce((acc, cur) => acc + cur.statementCount, 0),
    };
  });
  const data04 = props.statistics.map((s) => {
    return {
      name: s.roomId,
      value: s.statistic.reduce((acc, cur) => acc + cur.targetCount, 0),
    };
  });
  const data05 = props.statistics.map((s) => {
    return {
      name: s.roomId,
      value: s.statistic.reduce((acc, cur) => acc + cur.fanSpeedCount, 0),
    };
  });
  const data06 = props.statistics.map((s) => {
    return {
      name: s.roomId,
      value: s.statistic.reduce((acc, cur) => acc + cur.requestDuration, 0),
    };
  });
  const data07 = props.statistics.map((s) => {
    return {
      name: s.roomId,
      value: parseFloat(
        s.statistic.reduce((acc, cur) => acc + cur.totalPrice, 0).toFixed(2),
      ),
    };
  });
  const [displayItem, setDisplayItem] = useState(dataItems[0]);
  const [activeItem, setActiveItem] = useState(0);

  let pieData;
  switch (displayItem) {
    case dataItems[0]:
      pieData = data01;
      break;
    case dataItems[1]:
      pieData = data02;
      break;
    case dataItems[2]:
      pieData = data03;
      break;
    case dataItems[3]:
      pieData = data04;
      break;
    case dataItems[4]:
      pieData = data05;
      break;
    case dataItems[5]:
      pieData = data06;
      break;
    case dataItems[6]:
      pieData = data07;
      break;
    default:
      pieData = data01;
      break;
  }

  return (
    <div className="flex flex-row">
      <div className="flex w-32">
        <RadioGroup
          value={displayItem}
          onValueChange={setDisplayItem}
          className="my-auto"
        >
          {dataItems.map((i, index) => (
            <div key={index} className="flex items-center gap-1">
              <RadioGroupItem value={i} id={i} />
              <Label>{i}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart width={250} height={250}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={70}
            innerRadius={40}
            fill="hsl(var(--primary))"
            paddingAngle={10}
            animationDuration={500}
            activeShape={ActiveShape}
            onMouseEnter={(_, index) => {
              setActiveItem(index);
            }}
            activeIndex={activeItem}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

function getDisplayValue(value: StatisticItem, displayItem: string) {
  switch (displayItem) {
    case dataItems[0]:
      return value.onOffCount;
    case dataItems[1]:
      return value.scheduleCount;
    case dataItems[2]:
      return value.statementCount;
    case dataItems[3]:
      return value.targetCount;
    case dataItems[4]:
      return value.fanSpeedCount;
    case dataItems[5]:
      return value.requestDuration;
    case dataItems[6]:
      return value.totalPrice;
    default:
      return value.totalPrice;
  }
}

const TheBarChart = ({ data }: { data: RoomStatistic[] }) => {
  const [displayItem, setDisplayItem] = useState(dataItems[0]);
  const groupByDay: StatisticItem[] = [];
  const defaultNewDay: StatisticItem = {
    onOffCount: 0,
    scheduleCount: 0,
    statementCount: 0,
    targetCount: 0,
    fanSpeedCount: 0,
    requestDuration: 0,
    totalPrice: 0,
    timestamp: "",
  };
  for (let i = 0; i < 7; i++) {
    groupByDay.push({ ...defaultNewDay });
  }
  data.forEach((item) => {
    item.statistic.forEach((value) => {
      const index =
        (new Date(value.timestamp).getTime() - getAWeekAgoStart().getTime()) /
        (24 * 60 * 60 * 1000);
      groupByDay[7 - index].onOffCount += value.onOffCount;
      groupByDay[7 - index].scheduleCount += value.scheduleCount;
      groupByDay[7 - index].statementCount += value.statementCount;
      groupByDay[7 - index].targetCount += value.targetCount;
      groupByDay[7 - index].fanSpeedCount += value.fanSpeedCount;
      groupByDay[7 - index].requestDuration += value.requestDuration;
      groupByDay[7 - index].totalPrice += value.totalPrice;
    });
  });
  const dat = groupByDay.map((value, index) => {
    return {
      x: index,
      y: getDisplayValue(value, displayItem),
    };
  });
  return (
    <div className="flex flex-row">
      <div className="flex w-32">
        <RadioGroup
          value={displayItem}
          onValueChange={setDisplayItem}
          className="my-auto"
        >
          {dataItems.map((i, index) => (
            <div key={index} className="flex items-center gap-1">
              <RadioGroupItem value={i} id={i} />
              <Label>{i}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dat}>
          <XAxis dataKey="x" />
          <YAxis />
          <Bar
            type="linear"
            dataKey="y"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const HotelStats = () => {
  const [date, setDate] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(),
  });
  const [allDate, setAllDate] = useState(true);
  const statsQuery = useQuery({
    queryKey: ["hotel-stats", allDate, date.from, date.to],
    queryFn: async () =>
      await dataFetch.getRoomStatistics(
        "day",
        allDate ? undefined : date.from,
        allDate ? undefined : date.to ? date.to : date.from,
      ),
    refetchInterval: 5000,
  });
  const query = useQuery({
    queryKey: ["hotel-stats", "day"],
    queryFn: async () =>
      await dataFetch.getRoomStatistics(
        "day",
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        new Date(),
      ),
  });
  const lastWeek = query.data?.statistic;

  return (
    <div className="my-3 flex flex-wrap gap-3">
      <div className="flex flex-row items-center gap-2">
        <DatePickerWithRange
          date={date}
          // @ts-expect-error newVal is never a function
          setDate={(newVal: DateRange | undefined) => {
            setDate({
              from: newVal?.from ? newVal.from : new Date(),
              to: newVal?.to,
            });
          }}
          disabledDays={[
            {
              before: new Date(),
            },
          ]}
          className="w-[300px]"
          disabled={allDate}
        />
        <Switch checked={allDate} onCheckedChange={setAllDate} />
        <Label>全部日期</Label>
      </div>
      <Card className="w-[34rem]">
        <CardHeader>
          <CardTitle>分布占比</CardTitle>
        </CardHeader>
        <CardContent>
          {statsQuery.data ? (
            <ThePieChart statistics={statsQuery.data.statistic} />
          ) : (
            <Skeleton className="w-70 h-10" />
          )}
        </CardContent>
      </Card>
      <Card className="w-[34rem]">
        <CardHeader>
          <CardTitle>变化趋势：周报</CardTitle>
        </CardHeader>
        <CardContent>
          {lastWeek ? (
            <TheBarChart data={lastWeek} />
          ) : (
            <Skeleton className="w-70 h-10" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
