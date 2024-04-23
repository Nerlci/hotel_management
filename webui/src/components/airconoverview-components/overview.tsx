import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "一",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "二",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "三",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "四",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "五",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "六",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "七",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "八",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "九",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "十",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "十一",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "十二",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `¥${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
