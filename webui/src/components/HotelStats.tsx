import { Pie, PieChart, ResponsiveContainer } from "recharts";
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
