import type { CheckoutHeaderConfig } from "@/types/checkout-component";
import { SectionCard } from "@/components/ui/section-card";
import { Toggle } from "@/components/ui/toggle";
import { IconLayoutTop } from "@/components/ui/icons";

interface HeaderSettingsProps {
  config: CheckoutHeaderConfig;
  onChange: (config: CheckoutHeaderConfig) => void;
}

const LABELS: Record<keyof CheckoutHeaderConfig, string> = {
  trust_badge: "Segel Penambah Kepercayaan",
  product_image: "Gambar Produk",
  video: "Video",
  description_points: "Deskripsi dan Poin-Poin Produk",
};

export function HeaderSettings({ config, onChange }: HeaderSettingsProps) {
  function toggle(key: keyof CheckoutHeaderConfig) {
    onChange({ ...config, [key]: !config[key] });
  }

  return (
    <SectionCard
      icon={<IconLayoutTop className="w-4 h-4" />}
      title="Header"
      description="Informasi awal di checkout page, atur informasi produk agar lebih menarik"
    >
      <div className="space-y-1">
        {(Object.keys(LABELS) as (keyof CheckoutHeaderConfig)[]).map((key) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-line last:border-0">
            <span className="text-[13px] text-ink">{LABELS[key]}</span>
            <Toggle checked={config[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}