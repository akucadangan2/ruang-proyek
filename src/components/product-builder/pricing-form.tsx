"use client";

import { SectionCard } from "@/components/ui/section-card";
import { IconTag } from "@/components/ui/icons";

interface PricingFormProps {
  normalPrice: number;
  discountPrice: number | null;
  costPrice: number | null;
  sku: string;
  onChange: (field: string, value: number | string | null) => void;
}

export function PricingForm({ normalPrice, discountPrice, costPrice, sku, onChange }: PricingFormProps) {
  return (
    <SectionCard icon={<IconTag className="w-4 h-4" />} title="Harga Produk">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[12px] text-ink-soft mb-1 block">Harga Normal</label>
          <div className="flex items-center border border-line rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent">
            <span className="px-3 text-[13px] text-ink-soft bg-paper h-full flex items-center py-2.5">Rp</span>
            <input
              type="number"
              value={normalPrice}
              onChange={(e) => onChange("normal_price", Number(e.target.value))}
              className="px-2 py-2.5 w-full text-[13px] outline-none tabular-nums"
            />
          </div>
        </div>
        <div>
          <label className="text-[12px] text-ink-soft mb-1 block">Harga Diskon / Coret</label>
          <div className="flex items-center border border-line rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent">
            <span className="px-3 text-[13px] text-ink-soft bg-paper h-full flex items-center py-2.5">Rp</span>
            <input
              type="number"
              value={discountPrice ?? ""}
              onChange={(e) => onChange("discount_price", e.target.value ? Number(e.target.value) : null)}
              className="px-2 py-2.5 w-full text-[13px] outline-none tabular-nums"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[12px] text-ink-soft mb-1 block">Harga Jual / HPP</label>
        <div className="flex items-center border border-line rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent">
          <span className="px-3 text-[13px] text-ink-soft bg-paper h-full flex items-center py-2.5">Rp</span>
          <input
            type="number"
            value={costPrice ?? ""}
            onChange={(e) => onChange("cost_price", e.target.value ? Number(e.target.value) : null)}
            className="px-2 py-2.5 w-full text-[13px] outline-none tabular-nums"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-line">
        <label className="text-[12px] text-ink-soft mb-1 block">SKU (Stock Keeping Unit)</label>
        <input
          type="text"
          value={sku}
          placeholder="Kode SKU Produk, Contoh PROD001"
          onChange={(e) => onChange("sku", e.target.value)}
          className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
        />
      </div>
    </SectionCard>
  );
}
