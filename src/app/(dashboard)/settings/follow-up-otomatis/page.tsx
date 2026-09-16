"use client";

import { useEffect, useState } from "react";
import type { FollowUpRule, NotificationScenario } from "@/types/notification";

const SCENARIO_LABELS: Record<NotificationScenario, string> = {
  order_masuk: "Order Masuk",
  reminder_belum_bayar: "Reminder Belum Bayar",
  pembayaran_berhasil: "Pembayaran Berhasil",
  produk_terkirim: "Produk Terkirim",
};

export default function FollowUpOtomatisPage() {
  const [rules, setRules] = useState<FollowUpRule[]>([]);

  useEffect(() => {
    fetch("/api/follow-up-rules")
      .then((res) => res.json())
      .then(({ data }) => setRules(data ?? []));
  }, []);

  async function updateRule(scenario: NotificationScenario, patch: Partial<FollowUpRule>) {
    const res = await fetch("/api/follow-up-rules", {
      method: "PUT",
      body: JSON.stringify({ scenario, ...patch }),
    });
    const { data } = await res.json();
    setRules((prev) => {
      const exists = prev.find((r) => r.scenario === scenario);
      return exists
        ? prev.map((r) => (r.scenario === scenario ? data : r))
        : [...prev, data];
    });
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold mb-2">Follow Up WA Otomatis (Fonnte)</h1>
      <p className="text-sm text-gray-500 mb-4">
        Atur kapan pesan WA dikirim otomatis berdasarkan trigger order.
      </p>

      {(Object.keys(SCENARIO_LABELS) as NotificationScenario[]).map((scenario) => {
        const rule = rules.find((r) => r.scenario === scenario);
        return (
          <div
            key={scenario}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-sm">{SCENARIO_LABELS[scenario]}</p>
              <p className="text-xs text-gray-400">
                Dikirim {rule?.delay_minutes ?? 0} menit setelah trigger
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={rule?.delay_minutes ?? 0}
                onChange={(e) =>
                  updateRule(scenario, { delay_minutes: Number(e.target.value) })
                }
                className="border rounded-lg px-3 py-2 w-24 text-sm"
              />
              <span className="text-xs text-gray-400">menit</span>
              <input
                type="checkbox"
                checked={rule?.is_active ?? false}
                onChange={(e) => updateRule(scenario, { is_active: e.target.checked })}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}