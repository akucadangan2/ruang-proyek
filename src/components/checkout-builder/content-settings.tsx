import type { CheckoutContentConfig } from "@/types/checkout-component";
import { PaymentMethodSettings } from "./payment-method-settings";
import { SectionCard } from "@/components/ui/section-card";
import { Toggle } from "@/components/ui/toggle";
import { IconSliders } from "@/components/ui/icons";

interface ContentSettingsProps {
  config: CheckoutContentConfig;
  onChange: (config: CheckoutContentConfig) => void;
}

export function ContentSettings({ config, onChange }: ContentSettingsProps) {
  function toggle(key: keyof CheckoutContentConfig) {
    onChange({ ...config, [key]: !config[key] } as CheckoutContentConfig);
  }

  return (
    <SectionCard
      icon={<IconSliders className="w-4 h-4" />}
      title="Content"
      description="Informasi utama dari produk yang dijual, lengkapi informasi menarik dan promosinya"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-ink">Simpan Data Member</span>
          <Toggle checked={config.save_member_data} onChange={() => toggle("save_member_data")} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] text-ink">Produk Bump</span>
          <Toggle checked={config.order_bump} onChange={() => toggle("order_bump")} />
        </div>

        <PaymentMethodSettings
          config={config.payment_methods}
          onChange={(payment_methods) => onChange({ ...config, payment_methods })}
        />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[13px] text-ink">Pelacakan (Tracking)</span>
            <p className="text-[11px] text-ink-soft mt-0.5">
              Melacak interaksi pengguna agar performa dapat dievaluasi
            </p>
          </div>
          <Toggle checked={config.tracking_enabled} onChange={() => toggle("tracking_enabled")} />
        </div>

        <label className="flex items-center gap-2.5 text-[13px] text-ink">
          <input
            type="checkbox"
            checked={config.unique_code_enabled}
            onChange={() => toggle("unique_code_enabled")}
            className="accent-ink"
          />
          Kode unik untuk setiap pembayaran
        </label>

        <div>
          <label className="flex items-center gap-2.5 text-[13px] text-ink">
            <input
              type="checkbox"
              checked={config.ppn_enabled}
              onChange={() => toggle("ppn_enabled")}
              className="accent-ink"
            />
            Pengaturan PPN pembelian
          </label>
          {config.ppn_enabled && (
            <input
              type="number"
              placeholder="Persentase PPN (%)"
              value={config.ppn_percentage ?? ""}
              onChange={(e) => onChange({ ...config, ppn_percentage: Number(e.target.value) })}
              className="border border-line rounded-md px-3 py-2.5 mt-2 w-full text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
            />
          )}
        </div>
      </div>
    </SectionCard>
  );
}