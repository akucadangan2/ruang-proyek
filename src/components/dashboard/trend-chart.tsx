"use client";

import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatDate } from "@/lib/utils";

interface TrendChartProps {
  data: { date: string; amount: number; count: number }[];
}

export function TrendChart({ data }: TrendChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: formatDate(d.date).split(" ")[0],
  }));

  return (
    <div className="bg-white border border-line rounded-lg p-4 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <XAxis dataKey="label" fontSize={11} stroke="#63677A" />
          <YAxis fontSize={11} stroke="#63677A" />
          <Tooltip
            contentStyle={{ borderRadius: 6, border: "1px solid #E4E2DC", fontSize: 12 }}
            formatter={(value: number, name: string) => (name === "amount" ? [value, "Nominal"] : [value, "Jumlah"])}
          />
          <Bar dataKey="count" fill="#B4740E" radius={[3, 3, 0, 0]} />
          <Line type="monotone" dataKey="count" stroke="#14161F" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}