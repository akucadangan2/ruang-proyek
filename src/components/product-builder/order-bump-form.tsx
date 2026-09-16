"use client";

import { useState } from "react";
import type { Product, OrderBump } from "@/types/product";
import { formatRupiah } from "@/lib/utils";
import { SectionCard } from "@/components/ui/section-card";
import { Toggle } from "@/components/ui/toggle";
import { IconGift, IconTrash } from "@/components/ui/icons";

interface OrderBumpFormProps {
  productId: string;
  availableProducts: Product[];
  bumps: OrderBump[];
  onAdd: (bumpProductId: string) => void;
  onRemove: (bumpId: string) => void;
  onToggleAutoChecked: (bumpId: string, value: boolean) => void;
}

export function OrderBumpForm({ availableProducts, bumps, onAdd, onRemove, onToggleAutoChecked }: OrderBumpFormProps) {
  const [selectedId, setSelectedId] = useState("");

  return (
    <SectionCard
      icon={<IconGift className="w-4 h-4" />}
      title="Bump Produk"
      description="Tawaran item tambahan di produk ini ketika di halaman checkout"
    >
      <div className="space-y-2 mb-3">
        {bumps.map((bump) => {
          const product = availableProducts.find((p) => p.id === bump.bump_product_id);
          if (!product) return null;
          return (
            <div key={bump.id} className="flex items-center justify-between bg-accent-soft/40 border border-accent-soft rounded-md p-3">
              <div>
                <p className="font-medium text-[13px] text-ink">{product.name}</p>
                <p className="text-[12px] text-ink-soft tabular-nums">
                  {formatRupiah(product.discount_price ?? product.normal_price)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ink-soft">Auto-checked</span>
                  <Toggle checked={bump.auto_checked} onChange={(v) => onToggleAutoChecked(bump.id, v)} />
                </div>
                <button onClick={() => onRemove(bump.id)} className="text-negative">
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="border border-line rounded-md px-3 py-2.5 flex-1 text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="">Pilih produk untuk dijadikan bump...</option>
          {availableProducts
            .filter((p) => !bumps.some((b) => b.bump_product_id === p.id))
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
        <button
          disabled={!selectedId}
          onClick={() => {
            onAdd(selectedId);
            setSelectedId("");
          }}
          className="bg-ink hover:bg-ink/90 text-white px-4 py-2.5 rounded-md text-[13px] disabled:opacity-40 transition-colors whitespace-nowrap"
        >
          Tambahkan
        </button>
      </div>
    </SectionCard>
  );
}
