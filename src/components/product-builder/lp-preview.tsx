"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { IconShieldCheck, IconCheckCircle } from "@/components/ui/icons";
import type { Product, ProductImage, OrderFormField } from "@/types/product";

interface LpPreviewProps {
  product: Partial<Product>;
  images: ProductImage[];
  formFields: OrderFormField[];
}

export function LpPreview({ product, images, formFields }: LpPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="bg-white border border-line rounded-lg overflow-hidden">
      <div className="flex justify-end gap-1 p-2.5 border-b border-line bg-paper">
        <button
          onClick={() => setDevice("desktop")}
          className={`text-[12px] px-3 py-1.5 rounded-md font-medium transition-colors ${
            device === "desktop" ? "bg-ink text-white" : "text-ink-soft hover:bg-white"
          }`}
        >
          Desktop
        </button>
        <button
          onClick={() => setDevice("mobile")}
          className={`text-[12px] px-3 py-1.5 rounded-md font-medium transition-colors ${
            device === "mobile" ? "bg-ink text-white" : "text-ink-soft hover:bg-white"
          }`}
        >
          Mobile
        </button>
      </div>

      <div className={`p-5 mx-auto transition-all ${device === "mobile" ? "max-w-[375px]" : "max-w-full"}`}>
        <div className="flex items-center justify-center gap-5 text-[11px] text-ink-soft mb-4">
          <span className="flex items-center gap-1.5">
            <IconShieldCheck className="w-3.5 h-3.5" /> Garansi Uang Kembali
          </span>
          <span className="flex items-center gap-1.5">
            <IconCheckCircle className="w-3.5 h-3.5" /> Jaminan Kepuasan
          </span>
        </div>

        {images.length > 0 ? (
          <img
            src={images[0].url}
            alt={product.name ?? "Produk"}
            className="w-full aspect-video object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full aspect-video bg-paper border border-line rounded-md mb-4 flex items-center justify-center text-ink-soft text-[12px]">
            Belum ada foto produk
          </div>
        )}

        <h2 className="font-bold text-[17px] text-ink">{product.name || "Nama Produk"}</h2>

        <div className="flex items-center gap-2 mt-1.5">
          {product.discount_price ? (
            <>
              <span className="font-bold text-accent tabular-nums">{formatRupiah(product.discount_price)}</span>
              <span className="text-[13px] text-ink-soft line-through tabular-nums">
                {formatRupiah(product.normal_price ?? 0)}
              </span>
            </>
          ) : (
            <span className="font-bold text-accent tabular-nums">{formatRupiah(product.normal_price ?? 0)}</span>
          )}
        </div>

        {product.description && (
          <p className="text-[13px] text-ink-soft mt-2 leading-relaxed">{product.description}</p>
        )}

        <div className="border border-line rounded-lg p-4 mt-5 space-y-2.5 bg-paper">
          <p className="text-[13px] font-semibold text-ink">Data Penerima:</p>
          {formFields
            .filter((f) => f.enabled)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((field) => (
              <div
                key={field.id}
                className="bg-white border border-line rounded-md px-3 py-2.5 text-[13px] text-ink-soft"
              >
                {field.label} {field.required && <span className="text-negative">*</span>}
              </div>
            ))}
        </div>

        <button className="w-full bg-ink hover:bg-ink/90 text-white rounded-lg py-3 mt-4 font-medium text-[13px] transition-colors">
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}
