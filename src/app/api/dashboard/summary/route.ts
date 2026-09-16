import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types/order";

const ALL_STATUSES: OrderStatus[] = [
  "created",
  "pending",
  "confirmed",
  "processing",
  "ready_to_ship",
  "shipped",
  "completed",
  "rts",
  "canceled",
];

// GET /api/dashboard/summary?from=2026-08-14&to=2026-09-14&date_field=created_at
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const dateField = searchParams.get("date_field") ?? "created_at"; // "Waktu Dibuat" dll

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let query = supabase
    .from("orders")
    .select("id, status, total, created_at, product_id, products!inner(owner_id)")
    .eq("products.owner_id", user.id);

  if (from) query = query.gte(dateField, from);
  if (to) query = query.lte(dateField, to);

  const { data: orders, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Gross revenue & count (hitung dari order yang completed)
  const completedOrders = orders.filter((o) => o.status === "completed");
  const grossRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const count = completedOrders.length;

  // Tren harian (bar+line) — group by tanggal
  const dailyMap: Record<string, { amount: number; count: number }> = {};
  for (const order of completedOrders) {
    const day = order.created_at.slice(0, 10); // YYYY-MM-DD
    if (!dailyMap[day]) dailyMap[day] = { amount: 0, count: 0 };
    dailyMap[day].amount += order.total;
    dailyMap[day].count += 1;
  }
  const dailyTrend = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }));

  // Grid status — nominal + jumlah per status
  const statusSummary = ALL_STATUSES.map((status) => {
    const filtered = orders.filter((o) => o.status === status);
    return {
      status,
      total_amount: filtered.reduce((sum, o) => sum + o.total, 0),
      count: filtered.length,
    };
  });
  statusSummary.unshift({
    status: "all" as const,
    total_amount: orders.reduce((sum, o) => sum + o.total, 0),
    count: orders.length,
  });

  return NextResponse.json({
    gross_revenue: grossRevenue,
    count,
    daily_trend: dailyTrend,
    status_summary: statusSummary,
  });
}