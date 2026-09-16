"use client";

import { useEffect, useState } from "react";
import { formatRupiah, formatDate } from "@/lib/utils";

interface BalanceTransaction {
  id: string;
  type: "topup" | "withdraw" | "order_income";
  amount: number;
  status: "pending" | "completed" | "failed";
  note: string | null;
  created_at: string;
}

const TYPE_LABEL: Record<string, string> = {
  topup: "Top Up",
  withdraw: "Penarikan",
  order_income: "Pendapatan Order",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-accent-soft text-accent",
  completed: "bg-positive-soft text-positive",
  failed: "bg-negative-soft text-negative",
};

export default function BalancePage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([]);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function fetchBalance() {
    fetch("/api/balance")
      .then((res) => res.json())
      .then(({ data }) => {
        setBalance(data.balance);
        setTransactions(data.transactions ?? []);
      });
  }

  useEffect(() => {
    fetchBalance();
  }, []);

  async function handleWithdraw() {
    if (!amount || Number(amount) <= 0) return;
    setSubmitting(true);
    await fetch("/api/balance", {
      method: "POST",
      body: JSON.stringify({ type: "withdraw", amount: Number(amount) }),
    });
    setAmount("");
    setShowWithdraw(false);
    setSubmitting(false);
    fetchBalance();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-ink tracking-tight">Balance</h1>
        <p className="text-[12px] text-ink-soft mt-0.5">Saldo dari hasil penjualan produk kamu.</p>
      </div>

      <div className="bg-ink text-white rounded-lg p-5">
        <p className="text-[12px] text-white/50">Saldo Tersedia</p>
        <p className="text-[26px] font-bold mt-1 tabular-nums">{formatRupiah(balance)}</p>
        <button
          onClick={() => setShowWithdraw(!showWithdraw)}
          className="mt-3 bg-white text-ink px-4 py-2 rounded-md text-[13px] font-medium"
        >
          Tarik Saldo
        </button>
      </div>

      {showWithdraw && (
        <div className="border border-line rounded-lg p-4 bg-white">
          <label className="text-[12px] text-ink-soft mb-1 block">Jumlah Penarikan</label>
          <div className="flex gap-2">
            <div className="flex items-center border border-line rounded-md overflow-hidden flex-1 focus-within:ring-2 focus-within:ring-accent/30">
              <span className="px-3 text-[13px] text-ink-soft bg-paper h-full flex items-center py-2.5">Rp</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="px-2 py-2.5 w-full text-[13px] outline-none tabular-nums"
              />
            </div>
            <button
              onClick={handleWithdraw}
              disabled={submitting}
              className="bg-ink hover:bg-ink/90 text-white px-4 py-2.5 rounded-md text-[13px] font-medium disabled:opacity-40 whitespace-nowrap"
            >
              {submitting ? "Memproses..." : "Ajukan"}
            </button>
          </div>
          <p className="text-[11px] text-ink-soft mt-2">
            Penarikan butuh verifikasi manual, status akan berubah jadi "Pending" dulu.
          </p>
        </div>
      )}

      <div>
        <h3 className="text-[13px] font-semibold text-ink mb-2">Riwayat Balance</h3>
        {transactions.length === 0 ? (
          <p className="text-[13px] text-ink-soft text-center py-8">Belum ada riwayat transaksi.</p>
        ) : (
          <div className="border border-line rounded-lg divide-y divide-line bg-white">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-[13px] text-ink">{TYPE_LABEL[t.type]}</p>
                  <p className="text-[12px] text-ink-soft mt-0.5">{formatDate(t.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium text-[13px] tabular-nums ${t.type === "withdraw" ? "text-negative" : "text-positive"}`}>
                    {t.type === "withdraw" ? "-" : "+"}
                    {formatRupiah(t.amount)}
                  </p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[t.status]}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}