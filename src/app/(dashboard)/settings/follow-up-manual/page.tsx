"use client";

import { useEffect, useState } from "react";
import type { NotificationScenario } from "@/types/notification";

const SCENARIOS: { key: NotificationScenario; label: string; placeholder: string }[] = [
  {
    key: "order_masuk",
    label: "Order Masuk",
    placeholder: "Halo {nama}, order {no_order} kamu sudah kami terima...",
  },
  {
    key: "reminder_belum_bayar",
    label: "Reminder Belum Bayar",
    placeholder: "Halo {nama}, pesanan {no_order} kamu senilai {total_bayar} belum dibayar...",
  },
  {
    key: "pembayaran_berhasil",
    label: "Pembayaran Berhasil",
    placeholder: "Terima kasih {nama}, pembayaran {no_order} sudah kami terima...",
  },
  {
    key: "produk_terkirim",
    label: "Produk Terkirim",
    placeholder: "Halo {nama}, produk {nama_produk} kamu bisa diakses di: {link_produk}",
  },
];

export default function FollowUpManualPage() {
  const [templates, setTemplates] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then(({ data }) => {
        const map: Record<string, string> = {};
        data?.forEach((t: any) => (map[t.scenario] = t.content));
        setTemplates(map);
      });
  }, []);

  async function saveTemplate(scenario: string) {
    setSaving(scenario);
    const res = await fetch("/api/templates", {
      method: "PUT",
      body: JSON.stringify({ scenario, content: templates[scenario] ?? "" }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(`Gagal simpan template: ${err.error ?? "unknown error"}`);
    }
    setSaving(null);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold mb-2">Follow Up Manual — Template Text</h1>
      <p className="text-sm text-gray-500 mb-4">
        Variable yang bisa dipakai: <code>{"{nama}"}</code> <code>{"{no_order}"}</code>{" "}
        <code>{"{nama_produk}"}</code> <code>{"{total_bayar}"}</code>{" "}
        <code>{"{link_produk}"}</code>
      </p>

      {SCENARIOS.map((s) => (
        <div key={s.key} className="border rounded-lg p-4 space-y-2">
          <h3 className="font-medium text-sm">{s.label}</h3>
          <textarea
            rows={3}
            placeholder={s.placeholder}
            value={templates[s.key] ?? ""}
            onChange={(e) => setTemplates((prev) => ({ ...prev, [s.key]: e.target.value }))}
            className="border rounded-lg px-3 py-2 w-full text-sm"
          />
          <button
            onClick={() => saveTemplate(s.key)}
            disabled={saving === s.key}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {saving === s.key ? "Menyimpan..." : "Simpan Template"}
          </button>
        </div>
      ))}
    </div>
  );
}