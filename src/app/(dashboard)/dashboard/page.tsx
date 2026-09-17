"use client";

import { useEffect, useState, useCallback } from "react";
import { RevenueCard } from "@/components/dashboard/revenue-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { OrderStatusGrid } from "@/components/dashboard/order-status-grid";
import { IconCalendar, IconChevronDown } from "@/components/ui/icons";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";

interface DashboardSummary {
  gross_revenue: number;
  count: number;
  daily_trend: { date: string; amount: number; count: number }[];
  status_summary: { status: string; total_amount: number; count: number }[];
}

function getDefaultRange() {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 1);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

export default function DashboardPage() {
  const [range, setRange] = useState(getDefaultRange());
  const [dateField, setDateField] = useState("created_at");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ from: range.from, to: range.to, date_field: dateField });
    const res = await fetch(`/api/dashboard/summary?${params.toString()}`);
    const data = await res.json();
    setSummary(data);
    setLoading(false);
  }, [range, dateField]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">Dashboard</h1>

      <div className="flex gap-3">
        <DateRangePicker value={range} onChange={setRange} />

        <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 bg-white">
          <select
            value={dateField}
            onChange={(e) => setDateField(e.target.value)}
            className="text-[13px] outline-none appearance-none bg-transparent pr-1"
          >
            <option value="created_at">Waktu Dibuat</option>
            <option value="updated_at">Waktu Diupdate</option>
          </select>
          <IconChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      {loading || !summary ? (
        <p className="text-[13px] text-gray-400 py-8 text-center">Memuat...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-5">
          <div className="grid grid-cols-[200px_1fr] gap-4">
            <RevenueCard grossRevenue={summary.gross_revenue} count={summary.count} />
            <TrendChart data={summary.daily_trend} />
          </div>
          <OrderStatusGrid data={summary.status_summary as any} />
        </div>
      )}
    </div>
  );
}