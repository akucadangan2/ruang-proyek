import type { CheckoutFooterConfig } from "@/types/checkout-component";
import { SectionCard } from "@/components/ui/section-card";
import { Toggle } from "@/components/ui/toggle";
import { IconLayoutBottom } from "@/components/ui/icons";

interface FooterSettingsProps {
  config: CheckoutFooterConfig;
  onChange: (config: CheckoutFooterConfig) => void;
}

export function FooterSettings({ config, onChange }: FooterSettingsProps) {
  function toggle(key: keyof CheckoutFooterConfig) {
    if (typeof config[key] !== "boolean") return;
    onChange({ ...config, [key]: !config[key] });
  }

  return (
    <SectionCard
      icon={<IconLayoutBottom className="w-4 h-4" />}
      title="Footer"
      description="Informasi pendukung yang meyakinkan pembeli dari produk yang kamu jual"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[13px] text-ink">Kupon</span>
            <p className="text-[11px] text-ink-soft mt-0.5">Tampil dari kode kupon yang kamu buat</p>
          </div>
          <Toggle checked={config.coupon} onChange={() => toggle("coupon")} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] text-ink">Teks Lainnya</span>
          <Toggle checked={config.other_text} onChange={() => toggle("other_text")} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] text-ink">Hitungan Pesanan</span>
          <Toggle checked={config.order_count_social_proof} onChange={() => toggle("order_count_social_proof")} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-ink">Tombol Beli Sekarang</span>
            <Toggle checked={config.buy_button_enabled} onChange={() => toggle("buy_button_enabled")} />
          </div>
          {config.buy_button_enabled && (
            <input
              type="text"
              value={config.buy_button_text}
              onChange={(e) => onChange({ ...config, buy_button_text: e.target.value })}
              className="border border-line rounded-md px-3 py-2.5 mt-2 w-full text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] text-ink">Label Produk Digital</span>
          <Toggle checked={config.digital_product_label} onChange={() => toggle("digital_product_label")} />
        </div>
      </div>
    </SectionCard>
  );
}