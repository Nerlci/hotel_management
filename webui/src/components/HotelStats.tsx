import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

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
        {`(占比 ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const ThePieChart = () => {
  const data01 = [
    {
      name: "Group A",
      value: 400,
    },
    {
      name: "Group B",
      value: 300,
    },
    {
      name: "Group C",
      value: 300,
    },
    {
      name: "Group D",
      value: 200,
    },
    {
      name: "Group E",
      value: 278,
    },
    {
      name: "Group F",
      value: 189,
    },
  ];
  const data02 = [
    {
      name: "Group A",
      value: 2400,
    },
    {
      name: "Group B",
      value: 4567,
    },
    {
      name: "Group C",
      value: 1398,
    },
    {
      name: "Group D",
      value: 9800,
    },
    {
      name: "Group E",
      value: 3908,
    },
    {
      name: "Group F",
      value: 4800,
    },
  ];

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
    // TODO
    default:
      pieData = data01;
      break;
  }

  return (
    <div className="flex flex-row">
      <div className="grow">
        <RadioGroup value={displayItem} onValueChange={setDisplayItem}>
          {dataItems.map((i, index) => (
            <div key={index} className="flex items-center gap-1">
              <RadioGroupItem value={i} id={i} />
              <Label>{i}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <ResponsiveContainer width="50%" height={250}>
        <PieChart width={250} height={250}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            innerRadius={50}
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

export const HotelStats = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>分布占比</CardTitle>
        </CardHeader>
        <CardContent>
          <ThePieChart />
        </CardContent>
      </Card>
    </div>
  );
};
