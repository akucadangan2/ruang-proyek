"use client";

import { ComposedChart, Bar, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
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
    <div className="bg-white border border-gray-200 rounded-lg p-3 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <XAxis dataKey="label" fontSize={11} stroke="#9CA3AF" axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 6, border: "1px solid #E5E7EB", fontSize: 12 }}
            formatter={(value: number, name: string) => (name === "amount" ? [value, "Nominal"] : [value, "Jumlah"])}
          />
          <Bar dataKey="count" fill="#38BDF8" radius={[3, 3, 0, 0]} barSize={18} />
          <Line type="monotone" dataKey="count" stroke="#F97316" strokeWidth={2.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}