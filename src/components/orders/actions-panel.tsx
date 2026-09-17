"use client";

import { useState } from "react";
import { IconMessageCircle, IconDollarSign, IconPackage, IconChevronDown } from "@/components/ui/icons";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";

interface ActionsPanelProps {
  order: Order;
  onUpdateStatus: (status: OrderStatus) => void;
  onUpdatePaymentStatus: (paymentStatus: PaymentStatus) => void;
  saving: boolean;
}

const STATUS_OPTIONS: OrderStatus[] = [
  "created", "pending", "confirmed", "processing",
  "ready_to_ship", "shipped", "completed", "rts", "canceled", "refund",
];

function toWaLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

export function ActionsPanel({ order, onUpdateStatus, onUpdatePaymentStatus, saving }: ActionsPanelProps) {
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  async function handleResend() {
    setResending(true);
    setResendMessage(null);
    const res = await fetch(`/api/orders/${order.id}/resend`, { method: "POST" });
    if (res.ok) {
      setResendMessage("Berhasil dikirim ulang.");
    } else {
      const err = await res.json();
      setResendMessage(err.error ?? "Gagal kirim ulang.");
    }
    setResending(false);
    setTimeout(() => setResendMessage(null), 4000);
  }

  return (
    <div className="border border-line rounded-lg bg-white p-4 space-y-4">
      <h3 className="font-semibold text-[13px] text-ink">Actions</h3>

      {/* BAGIAN YANG DIPERBAIKI: Menambahkan tag pembuka <a */}
      <a
        href={toWaLink(order.buyer_phone)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-positive-soft text-positive rounded-lg py-3 text-[13px] font-medium hover:opacity-90 transition-opacity"
      >
        <IconMessageCircle className="w-4 h-4" />
        Chat WhatsApp Buyer
      </a>

      <div>
        <label className="text-[12px] text-ink-soft mb-1.5 block">Change Status</label>
        <div className="relative">
          <select
            value={order.status}
            onChange={(e) => onUpdateStatus(e.target.value as OrderStatus)}
            disabled={saving}
            className="w-full appearance-none bg-paper border border-line rounded-lg px-3 py-2.5 text-[13px] text-ink outline-none focus:ring-2 focus:ring-accent/30"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <IconChevronDown className="w-4 h-4 text-ink-soft absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="text-[12px] text-ink-soft mb-1.5 block">Change Payment Status</label>
        <div className="relative">
          <select
            value={order.payment_status}
            onChange={(e) => onUpdatePaymentStatus(e.target.value as PaymentStatus)}
            disabled={saving}
            className="w-full appearance-none bg-paper border border-line rounded-lg px-3 py-2.5 text-[13px] text-ink outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="belum_dibayar">Belum Dibayar</option>
            <option value="terbayar">Terbayar</option>
          </select>
          <IconChevronDown className="w-4 h-4 text-ink-soft absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <button
        disabled
        title="Nonaktif — menunggu Midtrans aktif"
        className="w-full flex items-center justify-center gap-2 border border-line rounded-lg py-2.5 text-[13px] font-medium text-ink-soft opacity-50 cursor-not-allowed"
      >
        <IconDollarSign className="w-4 h-4" />
        Check Settlement Status
      </button>

      <button
        onClick={handleResend}
        disabled={resending}
        className="w-full flex items-center justify-center gap-2 border border-positive text-positive rounded-lg py-2.5 text-[13px] font-medium hover:bg-positive-soft transition-colors disabled:opacity-50"
      >
        <IconPackage className="w-4 h-4" />
        {resending ? "Mengirim..." : "Send Digital File"}
      </button>

      {resendMessage && (
        <p className="text-[12px] text-center text-ink-soft">{resendMessage}</p>
      )}
    </div>
  );
}