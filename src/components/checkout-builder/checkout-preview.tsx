"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import type { CheckoutComponentConfig, EPaymentChannel } from "@/types/checkout-component";
import type { Product, ProductImage, OrderFormField, OrderBump } from "@/types/product";

interface BumpProduct {
  id: string;
  name: string;
  normal_price: number;
  discount_price: number | null;
}

interface CheckoutPreviewProps {
  product: Partial<Product> & {
    product_images?: ProductImage[];
    order_bumps?: (OrderBump & { bump_product?: BumpProduct })[];
    order_form_fields?: OrderFormField[];
  };
  config: CheckoutComponentConfig;
}

const CHANNEL_LABELS: Record<EPaymentChannel, string> = {
  bri_va: "BRI Virtual Account",
  bca_va: "BCA Virtual Account",
  qris: "QRIS",
  mandiri_va: "Mandiri Bill",
  bni_va: "BNI Virtual Account",
};

const FEE_LABEL: Record<EPaymentChannel, string> = {
  bri_va: "Admin fee Rp4.440",
  bca_va: "Admin fee Rp4.440",
  qris: "Admin fee 0.7%",
  mandiri_va: "Admin fee Rp4.440",
  bni_va: "Admin fee Rp4.440",
};

const BADGE_COLOR: Record<EPaymentChannel, string> = {
  bri_va: "bg-blue-700",
  bca_va: "bg-sky-600",
  qris: "bg-red-600",
  mandiri_va: "bg-yellow-600",
  bni_va: "bg-orange-600",
};

export function CheckoutPreview({ product, config }: CheckoutPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const basePrice = product.discount_price ?? product.normal_price ?? 0;
  const image = product.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0];
  const formFields = product.order_form_fields ?? [];
  const bumps = product.order_bumps ?? [];

  return (
    <div className="border border-line rounded-lg overflow-hidden bg-white">
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

      <div className={`p-4 mx-auto transition-all ${device === "mobile" ? "max-w-[360px]" : "max-w-full"}`}>
        {/* Header */}
        {config.header.trust_badge && (
          <div className="flex items-center justify-center gap-6 text-[11px] text-ink-soft mb-3">
            <span>💰 Garansi Uang Kembali</span>
            <span>👍 Jaminan Kepuasan</span>
          </div>
        )}
        {config.header.product_image && (
          image ? (
            <img src={image.url} alt={product.name} className="w-full rounded-lg mb-2" />
          ) : (
            <div className="w-full aspect-video bg-paper border border-line rounded-lg mb-2 flex items-center justify-center text-ink-soft text-[11px]">
              Belum ada foto produk
            </div>
          )
        )}
        {config.header.description_points && (
          <div className="mb-4">
            <h2 className="font-bold text-[15px] text-ink">{product.name || "Nama Produk"}</h2>
            {product.description && <p className="text-[12px] text-ink-soft mt-1">{product.description}</p>}
          </div>
        )}

        {/* Formulir Pemesanan — selalu tampil */}
        <div className="mb-4">
          <p className="font-semibold text-ink text-[12px] mb-2 pb-1 border-b border-line">Data Penerima:</p>
          <div className="space-y-2">
            {formFields.length === 0 ? (
              <p className="text-[11px] text-negative">Belum ada field formulir diatur.</p>
            ) : (
              formFields
                .filter((f) => f.enabled)
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((f) => (
                  <div key={f.id} className="border border-line rounded-md px-3 py-2 text-[11px] text-ink-soft">
                    {f.label} {f.required && "*"}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Produk Bump */}
        {config.content.order_bump && bumps.length > 0 && (
          <div className="mb-4 space-y-2">
            {bumps.map((bump) => (
              <div key={bump.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
                <p className="text-[11px] font-semibold text-ink">{bump.bump_product?.name ?? "Produk Bump"}</p>
                <p className="text-[11px] font-bold text-ink">
                  {formatRupiah(bump.bump_product?.discount_price ?? bump.bump_product?.normal_price ?? 0)}
                </p>
                <div className="flex items-center gap-2 border border-dashed border-yellow-400 rounded px-2 py-1.5 mt-2">
                  <input type="checkbox" checked={bump.auto_checked} readOnly />
                  <span className="text-[11px] text-ink">Tambahkan Paket {bump.bump_product?.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Metode Pembayaran */}
        <div className="mb-4">
          <p className="font-semibold text-ink text-[12px] mb-2 pb-1 border-b border-line">Metode Pembayaran:</p>
          <div className="space-y-1.5">
            {config.content.payment_methods.bank_transfer_enabled && (
              <div className="border border-line rounded-md px-3 py-2 text-[11px] text-ink flex items-center gap-2">
                <input type="radio" readOnly />
                Bank Transfer
              </div>
            )}
            {config.content.payment_methods.e_payment_enabled &&
              config.content.payment_methods.e_payment_channels.map((channel) => (
                <div key={channel} className="border border-line rounded-md px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="radio" readOnly />
                    <span className={`w-7 h-5 rounded text-white text-[8px] font-bold flex items-center justify-center ${BADGE_COLOR[channel]}`}>
                      {channel.split("_")[0].toUpperCase().slice(0, 3)}
                    </span>
                    <div>
                      <p className="text-[11px] text-ink">{CHANNEL_LABELS[channel]}</p>
                      <p className="text-[10px] text-ink-soft">{FEE_LABEL[channel]}</p>
                    </div>
                  </div>
                </div>
              ))}
            {!config.content.payment_methods.bank_transfer_enabled &&
              !config.content.payment_methods.e_payment_enabled && (
                <p className="text-[11px] text-negative">Belum ada metode pembayaran diaktifkan.</p>
              )}
          </div>
        </div>

        {/* Rincian Pesanan */}
        <div className="border border-line rounded-lg p-3 mb-4">
          <p className="font-semibold text-ink text-[12px] mb-2 pb-1 border-b border-line">Rincian Pesanan</p>
          <div className="flex justify-between text-[11px]">
            <span className="text-ink-soft">(1x) {product.name || "Produk"}</span>
            <span className="text-ink font-medium">{formatRupiah(basePrice)}</span>
          </div>
          {config.content.ppn_enabled && config.content.ppn_percentage && (
            <div className="flex justify-between text-[11px] mt-1">
              <span className="text-ink-soft">PPN ({config.content.ppn_percentage}%)</span>
              <span className="text-ink font-medium">
                {formatRupiah(Math.round(basePrice * (config.content.ppn_percentage / 100)))}
              </span>
            </div>
          )}
          <div className="flex justify-between text-[12px] font-semibold pt-1.5 mt-1.5 border-t border-line">
            <span className="text-ink">Total</span>
            <span className="text-positive">{formatRupiah(basePrice)}</span>
          </div>
        </div>

        {/* Footer */}
        {config.footer.buy_button_enabled && (
          <div className="bg-positive text-white text-center rounded-lg py-2.5 text-[12px] font-semibold">
            {config.footer.buy_button_text || "Beli Sekarang"}
          </div>
        )}

        {config.footer.order_count_social_proof && (
          <p className="text-center text-[10px] text-ink-soft mt-2">🔥 587 orang sudah pesan produk ini</p>
        )}

        {config.footer.digital_product_label && (
          <div className="bg-positive-soft border border-positive-soft rounded-lg p-2.5 mt-3">
            <p className="text-[11px] font-semibold text-positive">Produk Digital</p>
            <p className="text-[10px] text-positive">Dikirim otomatis setelah pembayaran</p>
          </div>
        )}
      </div>
    </div>
  );
}