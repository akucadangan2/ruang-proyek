"use client";

import { useEffect, useState } from "react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { SectionCard } from "@/components/ui/section-card";
import { IconReceipt } from "@/components/ui/icons";
import { ActionsPanel } from "@/components/orders/actions-panel";
import { PixelEventLog } from "@/components/orders/pixel-event-log";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then(({ data }) => setOrder(data));
  }, [id]);

  async function updateOrder(patch: Partial<Order>) {
    setSaving(true);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    const { data } = await res.json();
    setOrder(data);
    setSaving(false);
  }

  if (!order) return <p className="p-6 text-[13px] text-ink-soft">Memuat...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <IconReceipt className="w-4 h-4 text-ink-soft" />
          <h1 className="text-[16px] font-semibold text-ink tracking-tight">{order.order_number}</h1>
        </div>
        <span className="text-[12px] text-ink-soft">{formatDate(order.created_at)}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="space-y-4">
          <SectionCard title="Data Pembeli">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] text-ink-soft mb-1 block">Nama</label>
                <input
                  value={order.buyer_name}
                  onChange={(e) => setOrder({ ...order, buyer_name: e.target.value })}
                  className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <div>
                <label className="text-[12px] text-ink-soft mb-1 block">No. Telepon</label>
                <input
                  value={order.buyer_phone}
                  onChange={(e) => setOrder({ ...order, buyer_phone: e.target.value })}
                  className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            </div>
            <button
              onClick={() => updateOrder({ buyer_name: order.buyer_name, buyer_phone: order.buyer_phone })}
              className="text-accent text-[12px] font-medium mt-3"
            >
              Simpan perubahan data
            </button>
          </SectionCard>

          <SectionCard title="Ringkasan">
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span><span className="tabular-nums text-ink">{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Bump</span><span className="tabular-nums text-ink">{formatRupiah(order.bump_total)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Biaya Admin</span><span className="tabular-nums text-ink">{formatRupiah(order.admin_fee)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>PPN</span><span className="tabular-nums text-ink">{formatRupiah(order.ppn)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-line pt-2 mt-2 text-ink">
                <span>Total</span><span className="tabular-nums">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </SectionCard>

          <PixelEventLog orderId={order.id} />
        </div>

        <div>
          <ActionsPanel
            order={order}
            saving={saving}
            onUpdateStatus={(status) => updateOrder({ status })}
            onUpdatePaymentStatus={(payment_status) => updateOrder({ payment_status })}
          />
        </div>
      </div>
    </div>
  );
}