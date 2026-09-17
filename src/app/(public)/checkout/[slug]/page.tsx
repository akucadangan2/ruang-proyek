"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import type { Product, ProductImage, OrderFormField, OrderBump } from "@/types/product";
import type { CheckoutComponentConfig, EPaymentChannel } from "@/types/checkout-component";

interface BumpProduct {
  id: string;
  name: string;
  normal_price: number;
  discount_price: number | null;
  description: string | null;
  product_images?: { url: string; sort_order: number }[];
}

interface CheckoutData {
  product: Product & {
    product_images: ProductImage[];
    order_bumps: (OrderBump & { bump_product: BumpProduct })[];
    order_form_fields: OrderFormField[];
  };
  checkoutConfig: CheckoutComponentConfig | null;
}

const CHANNEL_LABELS: Record<EPaymentChannel, string> = {
  bri_va: "BRI Virtual Account",
  bca_va: "BCA Virtual Account",
  qris: "QRIS",
  mandiri_va: "Mandiri Bill",
  bni_va: "BNI Virtual Account",
};

// BAGIAN YANG DIPERBAIKI: Menambahkan `<` setelah Record
const FEE_CONFIG: Record<
  EPaymentChannel,
  { badge: string; badgeColor: string; feeLabel: string; getFee: (base: number) => number }
> = {
  bri_va: { badge: "BRI", badgeColor: "bg-blue-700", feeLabel: "Admin fee Rp4.440", getFee: () => 4440 },
  bca_va: { badge: "BCA", badgeColor: "bg-sky-600", feeLabel: "Admin fee Rp4.440", getFee: () => 4440 },
  qris: { badge: "QRIS", badgeColor: "bg-red-600", feeLabel: "Admin fee 0.7%", getFee: (base) => Math.round(base * 0.007) },
  mandiri_va: { badge: "MDR", badgeColor: "bg-yellow-600", feeLabel: "Admin fee Rp4.440", getFee: () => 4440 },
  bni_va: { badge: "BNI", badgeColor: "bg-orange-600", feeLabel: "Admin fee Rp4.440", getFee: () => 4440 },
};

const FALLBACK_PAYMENT_METHODS = {
  bank_transfer_enabled: false,
  e_payment_enabled: true,
  e_payment_channels: ["qris"] as EPaymentChannel[],
  admin_fee_bearer: "seller" as const,
};

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();
  const [data, setData] = useState<CheckoutData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/public/products/${slug}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data?.product) {
          setLoadError(res.error ?? "Produk tidak ditemukan.");
          return;
        }
        setData(res.data);
        const autoChecked = (res.data.product.order_bumps ?? [])
          .filter((b: OrderBump) => b.auto_checked)
          .map((b: OrderBump) => b.id);
        setSelectedBumps(autoChecked);
      })
      .catch((err) => setLoadError(err.message ?? "Gagal memuat halaman."));
  }, [slug]);

  const bumpTotal = useMemo(() => {
    if (!data) return 0;
    return (data.product.order_bumps ?? [])
      .filter((b) => selectedBumps.includes(b.id))
      .reduce((sum, b) => sum + (b.bump_product.discount_price ?? b.bump_product.normal_price), 0);
  }, [data, selectedBumps]);

  const paymentMethodsConfig = data?.checkoutConfig?.content.payment_methods ?? FALLBACK_PAYMENT_METHODS;
  const formFields = data?.product.order_form_fields ?? [];
  const basePrice = data ? data.product.discount_price ?? data.product.normal_price : 0;

  const adminFee = useMemo(() => {
    if (paymentMethodsConfig.admin_fee_bearer === "seller") return 0;
    const config = FEE_CONFIG[paymentMethod as EPaymentChannel];
    if (!config) return 0;
    return config.getFee(basePrice + bumpTotal);
  }, [paymentMethodsConfig, paymentMethod, basePrice, bumpTotal]);

  const ppn = useMemo(() => {
    const cfg = data?.checkoutConfig?.content;
    if (!cfg?.ppn_enabled || !cfg.ppn_percentage) return 0;
    return Math.round((basePrice + bumpTotal) * (cfg.ppn_percentage / 100));
  }, [data, basePrice, bumpTotal]);

  const total = basePrice + bumpTotal + adminFee + ppn;

  async function handleSubmit() {
    if (!data) return;
    setSubmitting(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        product_id: data.product.id,
        buyer_name: formValues.nama,
        buyer_phone: formValues.no_hp,
        buyer_email: formValues.email,
        quantity: Number(formValues.jumlah_pesanan) || 1,
        note: formValues.catatan ?? null,
        payment_method: paymentMethod,
        bump_total: bumpTotal,
        admin_fee: adminFee,
        ppn,
      }),
    });

    if (res.ok) {
      const { data: order } = await res.json();
      router.push(`/checkout/${slug}/success?order=${order.order_number}`);
    } else {
      const err = await res.json();
      alert(err.error ?? "Gagal membuat order.");
    }
    setSubmitting(false);
  }

  if (loadError) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <p className="text-red-600 text-[14px] font-medium">{loadError}</p>
      </div>
    );
  }

  if (!data) return <p className="p-6 text-center text-gray-400 text-[13px]">Memuat...</p>;

  const { product } = data;
  const enabledChannels = paymentMethodsConfig.e_payment_channels ?? [];
  const selectedFeeConfig = FEE_CONFIG[paymentMethod as EPaymentChannel];

  return (
    <div className="max-w-xl mx-auto p-4 pb-10">
      {/* Header: trust badges + gambar produk */}
      <div className="flex items-center justify-center gap-8 text-[13px] text-gray-600 mb-4">
        <span className="flex items-center gap-1.5">💰 Garansi Uang Kembali</span>
        <span className="flex items-center gap-1.5">👍 Jaminan Kepuasan</span>
      </div>

      {product.product_images?.[0] && (
        <img
          src={product.product_images[0].url}
          alt={product.name}
          className="w-full rounded-lg mb-2"
        />
      )}

      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">{product.name}</h1>
        {product.description && <p className="text-sm text-gray-500 mt-1">{product.description}</p>}
      </div>

      {/* Data Penerima */}
      <div className="mb-6">
        <p className="font-semibold text-gray-800 text-[14px] mb-3 pb-1 border-b border-gray-200">
          Data Penerima:
        </p>
        <div className="space-y-3">
          {formFields
            .filter((f) => f.enabled)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((field) => (
              <input
                key={field.id}
                type={field.key === "email" ? "email" : "text"}
                placeholder={`${field.label}${field.required ? " *" : ""}`}
                value={formValues[field.key] ?? ""}
                onChange={(e) => setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                required={field.required}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            ))}
        </div>
      </div>

      {/* Order Bump */}
      {product.order_bumps?.length > 0 && (
        <div className="mb-6 space-y-3">
          {product.order_bumps.map((bump) => {
            const bp = bump.bump_product;
            const image = bp.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0];
            return (
              <div key={bump.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex gap-3">
                  {image ? (
                    <img src={image.url} alt={bp.name} className="w-14 h-14 rounded object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded bg-yellow-100 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-800">{bp.name}</p>
                    <p className="text-[13px] font-bold text-gray-800">
                      {formatRupiah(bp.discount_price ?? bp.normal_price)}
                    </p>
                    {bp.description && (
                      <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-3">{bp.description}</p>
                    )}
                  </div>
                </div>
                <label className="flex items-center gap-2 border border-dashed border-yellow-400 rounded-md px-3 py-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBumps.includes(bump.id)}
                    onChange={(e) =>
                      setSelectedBumps((prev) =>
                        e.target.checked ? [...prev, bump.id] : prev.filter((id) => id !== bump.id)
                      )
                    }
                  />
                  <span className="text-[13px] font-medium text-gray-700">Tambahkan Paket {bp.name}</span>
                </label>
              </div>
            );
          })}
        </div>
      )}

      {/* Metode Pembayaran */}
      <div className="mb-4">
        <p className="font-semibold text-gray-800 text-[14px] mb-3 pb-1 border-b border-gray-200">
          Metode Pembayaran:
        </p>
        <div className="space-y-2">
          {paymentMethodsConfig.bank_transfer_enabled && (
            <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer">
              <input
                type="radio"
                name="payment_method"
                checked={paymentMethod === "bank_transfer"}
                onChange={() => setPaymentMethod("bank_transfer")}
              />
              <span className="text-[13px] font-medium text-gray-700">Bank Transfer</span>
            </label>
          )}

          {paymentMethodsConfig.e_payment_enabled &&
            enabledChannels.map((channel) => {
              const cfg = FEE_CONFIG[channel];
              return (
                <label
                  key={channel}
                  className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer ${
                    paymentMethod === channel ? "border-green-500 bg-green-50/40" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === channel}
                      onChange={() => setPaymentMethod(channel)}
                    />
                    <span
                      className={`w-9 h-6 rounded text-white text-[9px] font-bold flex items-center justify-center shrink-0 ${cfg.badgeColor}`}
                    >
                      {cfg.badge}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-gray-800">{CHANNEL_LABELS[channel]}</p>
                      <p className="text-[11px] text-gray-400">{cfg.feeLabel}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-2 py-1 shrink-0">
                    🔒 Midtrans
                  </span>
                </label>
              );
            })}
        </div>
      </div>

      <p className="text-[12px] text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
        *Pastikan Email dengan benar. Produk akan terkirim secara otomatis melalui Email setelah pembayaran.
      </p>

      {/* Rincian Pesanan */}
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <p className="font-semibold text-gray-800 text-[14px] mb-3 pb-1 border-b border-gray-200">
          Rincian Pesanan
        </p>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-gray-600">
              (1x) {product.name}
              {product.discount_price && (
                <span className="text-red-400 line-through ml-2 text-[11px]">
                  {formatRupiah(product.normal_price)}
                </span>
              )}
            </span>
            <span className="font-medium text-gray-800">{formatRupiah(basePrice)}</span>
          </div>

          {product.order_bumps
            ?.filter((b) => selectedBumps.includes(b.id))
            .map((b) => (
              <div key={b.id} className="flex justify-between">
                <span className="text-gray-600">(1x) {b.bump_product.name}</span>
                <span className="font-medium text-gray-800">
                  {formatRupiah(b.bump_product.discount_price ?? b.bump_product.normal_price)}
                </span>
              </div>
            ))}

          {adminFee > 0 && selectedFeeConfig && (
            <div className="flex justify-between">
              <div>
                <span className="text-gray-600">{CHANNEL_LABELS[paymentMethod as EPaymentChannel]}</span>
                <p className="text-[11px] text-gray-400">{selectedFeeConfig.feeLabel}</p>
              </div>
              <span className="font-medium text-gray-800">{formatRupiah(adminFee)}</span>
            </div>
          )}

          {ppn > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">PPN</span>
              <span className="font-medium text-gray-800">{formatRupiah(ppn)}</span>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-800">Total</span>
            <span className="font-bold text-green-600">{formatRupiah(total)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !paymentMethod || formFields.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3.5 font-semibold text-[14px] disabled:opacity-50 transition-colors"
      >
        {submitting ? "Memproses..." : "Beli Sekarang"}
      </button>

      {data.checkoutConfig?.footer.digital_product_label !== false && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-green-700">Produk Digital</p>
            <p className="text-[11px] text-green-600">
              Produk akan dikirimkan ke kamu langsung setelah proses pembelian
            </p>
          </div>
          <span className="text-2xl">📩</span>
        </div>
      )}

      <p className="text-center text-[11px] text-gray-400 mt-6">Copyright © 2026</p>
    </div>
  );
}