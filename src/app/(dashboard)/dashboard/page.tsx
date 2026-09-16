"use client";

import { useEffect, useState, useCallback } from "react";
import { RevenueCard } from "@/components/dashboard/revenue-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { OrderStatusGrid } from "@/components/dashboard/order-status-grid";

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
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-ink tracking-tight">Dashboard</h1>
        <p className="text-[12px] text-ink-soft mt-0.5">Ringkasan performa penjualan kamu.</p>
      </div>

      <div className="flex gap-3">
        <input
          type="date"
          value={range.from}
          onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
          className="border border-line rounded-md px-3 py-2 text-[13px] bg-white"
        />
        <span className="self-center text-ink-soft text-[12px]">-</span>
        <input
          type="date"
          value={range.to}
          onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
          className="border border-line rounded-md px-3 py-2 text-[13px] bg-white"
        />
        <select
          value={dateField}
          onChange={(e) => setDateField(e.target.value)}
          className="border border-line rounded-md px-3 py-2 text-[13px] bg-white"
        >
          <option value="created_at">Waktu Dibuat</option>
          <option value="updated_at">Waktu Diupdate</option>
        </select>
      </div>

      {loading || !summary ? (
        <p className="text-[13px] text-ink-soft py-8 text-center">Memuat...</p>
      ) : (
        <>
          <div className="grid grid-cols-[200px_1fr] gap-4">
            <RevenueCard grossRevenue={summary.gross_revenue} count={summary.count} />
            <TrendChart data={summary.daily_trend} />
          </div>
          <OrderStatusGrid data={summary.status_summary as any} />
        </>
      )}
    </div>
  );
}