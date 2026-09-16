import type { CheckoutContentConfig, EPaymentChannel, AdminFeeBearer } from "@/types/checkout-component";
import { Toggle } from "@/components/ui/toggle";
import { IconChevronUp, IconChevronDown } from "@/components/ui/icons";

interface PaymentMethodSettingsProps {
  config: CheckoutContentConfig["payment_methods"];
  onChange: (config: CheckoutContentConfig["payment_methods"]) => void;
}

const CHANNEL_LABELS: Record<EPaymentChannel, string> = {
  bri_va: "BRI Virtual Account",
  bca_va: "BCA Virtual Account",
  qris: "QRIS",
  mandiri_va: "Mandiri VA",
  bni_va: "BNI Virtual Account",
};

export function PaymentMethodSettings({ config, onChange }: PaymentMethodSettingsProps) {
  function toggleChannel(channel: EPaymentChannel) {
    const exists = config.e_payment_channels.includes(channel);
    onChange({
      ...config,
      e_payment_channels: exists
        ? config.e_payment_channels.filter((c) => c !== channel)
        : [...config.e_payment_channels, channel],
    });
  }

  function moveChannel(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= config.e_payment_channels.length) return;
    const next = [...config.e_payment_channels];
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...config, e_payment_channels: next });
  }

  return (
    <div className="border border-line rounded-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[13px] font-semibold text-ink">Metode Pembayaran</h4>
      </div>

      <label className="flex items-center gap-2.5 text-[13px] text-ink mb-3">
        <input
          type="checkbox"
          checked={config.bank_transfer_enabled}
          onChange={(e) => onChange({ ...config, bank_transfer_enabled: e.target.checked })}
          className="accent-ink"
        />
        Bank Transfer
      </label>

      <div>
        <label className="flex items-center gap-2.5 text-[13px] text-ink mb-3">
          <input
            type="checkbox"
            checked={config.e_payment_enabled}
            onChange={(e) => onChange({ ...config, e_payment_enabled: e.target.checked })}
            className="accent-ink"
          />
          E-Payment
        </label>

        {config.e_payment_enabled && (
          <div className="ml-6 space-y-3">
            <div>
              <p className="text-[12px] text-ink-soft mb-1.5">Biaya admin pembayaran ditanggung min:</p>
              <div className="flex gap-1 bg-paper border border-line rounded-md p-1 w-fit">
                {(["seller", "buyer"] as AdminFeeBearer[]).map((bearer) => (
                  <button
                    key={bearer}
                    onClick={() => onChange({ ...config, admin_fee_bearer: bearer })}
                    className={`px-3 py-1.5 rounded text-[12px] font-medium capitalize transition-colors ${
                      config.admin_fee_bearer === bearer ? "bg-ink text-white" : "text-ink-soft"
                    }`}
                  >
                    {bearer}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              {config.e_payment_channels.map((channel, index) => (
                <div key={channel} className="flex items-center justify-between border border-line rounded-md px-3 py-2">
                  <label className="flex items-center gap-2.5 text-[13px] text-ink">
                    <input type="checkbox" checked onChange={() => toggleChannel(channel)} className="accent-ink" />
                    {CHANNEL_LABELS[channel]}
                  </label>
                  <div className="flex flex-col text-ink-soft">
                    <button onClick={() => moveChannel(index, -1)}>
                      <IconChevronUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => moveChannel(index, 1)}>
                      <IconChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {(Object.keys(CHANNEL_LABELS) as EPaymentChannel[])
                .filter((c) => !config.e_payment_channels.includes(c))
                .map((channel) => (
                  <label key={channel} className="flex items-center gap-2.5 text-[13px] text-ink-soft px-3 py-2">
                    <input type="checkbox" checked={false} onChange={() => toggleChannel(channel)} className="accent-ink" />
                    {CHANNEL_LABELS[channel]}
                  </label>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}