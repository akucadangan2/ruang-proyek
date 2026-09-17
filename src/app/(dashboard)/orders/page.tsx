"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { IconReceipt, IconExternalLink } from "@/components/ui/icons";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_TABS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "completed", label: "Completed" },
  { key: "canceled", label: "Canceled" },
];

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-accent-soft text-accent",
  confirmed: "bg-paper text-ink-soft border border-line",
  processing: "bg-paper text-ink-soft border border-line",
  shipped: "bg-paper text-ink-soft border border-line",
  completed: "bg-positive text-white",
  canceled: "bg-negative-soft text-negative",
  created: "bg-paper text-ink-soft border border-line",
  rts: "bg-negative-soft text-negative",
  refund: "bg-negative-soft text-negative",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  canceled: "Canceled",
  created: "Created",
  rts: "RTS",
  refund: "Refund",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);

    const res = await fetch(`/api/orders?${params.toString()}`);
    const { data } = await res.json();
    setOrders(data ?? []);
    setLoading(false);
  }, [status, search]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  function toggleSelectAll() {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o.id)));
    }
  }

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-5">
        <h1 className="text-[18px] font-semibold text-ink tracking-tight">Semua Order</h1>
        <p className="text-[12px] text-ink-soft mt-0.5">Pantau dan kelola pesanan yang masuk.</p>
      </div>

      <div className="flex gap-1 border-b border-line mb-4 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatus(tab.key)}
            className={`relative px-3 py-2.5 text-[13px] whitespace-nowrap transition-colors ${
              status === tab.key ? "text-ink font-medium" : "text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
            {status === tab.key && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-accent" />}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Cari nama, no order, atau no HP..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-line rounded-md px-3 py-2.5 w-full mb-4 text-[13px] bg-white outline-none focus:ring-2 focus:ring-accent/30"
      />

      {loading ? (
        <p className="text-[13px] text-ink-soft py-8 text-center">Memuat...</p>
      ) : orders.length === 0 ? (
        <div className="border border-dashed border-line rounded-lg py-16 flex flex-col items-center gap-3 text-center">
          <IconReceipt className="w-8 h-8 text-ink-soft" />
          <p className="text-[13px] text-ink-soft">Belum ada order untuk filter ini.</p>
        </div>
      ) : (
        <div className="border border-line rounded-lg overflow-hidden bg-white">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-ink-soft bg-paper border-b border-line text-[12px]">
                <th className="py-2.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedIds.size === orders.length}
                    onChange={toggleSelectAll}
                    className="accent-ink"
                  />
                </th>
                <th className="font-medium">Order ID</th>
                <th className="font-medium">Customer</th>
                <th className="font-medium text-right pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 px-4 align-top">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={() => toggleSelectOne(order.id)}
                      className="accent-ink"
                    />
                  </td>
                  <td className="align-top py-3">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/orders/${order.id}`} className="text-accent font-medium hover:underline">
                        {order.order_number}
                      </Link>
                      <Link href={`/orders/${order.id}`} target="_blank" className="text-ink-soft hover:text-ink">
                        <IconExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-[11px] text-ink-soft mt-0.5">{formatDateTime(order.created_at)}</p>
                  </td>
                  <td className="align-top py-3">
                    <p className="font-medium text-ink">{order.buyer_name}</p>
                    <p className="text-[12px] text-ink-soft">{order.buyer_email}</p>
                    <p className="text-[12px] text-ink-soft">{order.buyer_phone}</p>
                  </td>
                  <td className="align-top py-3 pr-4 text-right">
                    <span
                      className={`inline-block text-[11px] px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[order.status]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}