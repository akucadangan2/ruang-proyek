"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import type { Product, ProductImage, OrderFormField, OrderBump } from "@/types/product";
import type { CheckoutComponentConfig, EPaymentChannel } from "@/types/checkout-component";

interface CheckoutData {
  product: Product & {
    product_images: ProductImage[];
    order_bumps: (OrderBump & {
      bump_product: { id: string; name: string; normal_price: number; discount_price: number | null };
    })[];
    order_form_fields: OrderFormField[];
  };
  checkoutConfig: CheckoutComponentConfig | null;
}

const CHANNEL_LABELS: Record<EPaymentChannel, string> = {
  bri_va: "BRI Virtual Account",
  bca_va: "BCA Virtual Account",
  qris: "QRIS",
  mandiri_va: "Mandiri VA",
  bni_va: "BNI Virtual Account",
};

// Dipakai kalau checkoutConfig belum pernah disetting di database,
// biar halaman tetap fungsional (bukan kosong total).
const FALLBACK_PAYMENT_METHODS = {
  bank_transfer_enabled: true,
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

  // Kalau config belum pernah disetting di Checkout Builder, pakai fallback
  const paymentMethodsConfig = data?.checkoutConfig?.content.payment_methods ?? FALLBACK_PAYMENT_METHODS;
  const formFields = data?.product.order_form_fields ?? [];
  const basePrice = data ? data.product.discount_price ?? data.product.normal_price : 0;

  const adminFee = useMemo(() => {
    if (paymentMethodsConfig.admin_fee_bearer === "seller") return 0;
    return paymentMethod === "qris" ? 500 : 4000;
  }, [paymentMethodsConfig, paymentMethod]);

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
        <p className="text-negative text-[14px] font-medium">{loadError}</p>
        <p className="text-ink-soft text-[12px] mt-2">
          Cek terminal <code>npm run dev</code> untuk detail error, atau pastikan produk aktif.
        </p>
      </div>
    );
  }

  if (!data) return <p className="p-6 text-center text-ink-soft text-[13px]">Memuat...</p>;

  const { product } = data;
  const enabledChannels = paymentMethodsConfig.e_payment_channels ?? [];

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {product.product_images?.[0] && (
        <img
          src={product.product_images[0].url}
          alt={product.name}
          className="w-full aspect-video object-cover rounded-xl"
        />
      )}

      <div>
        <h1 className="text-xl font-bold">{product.name}</h1>
        {product.description && <p className="text-sm text-gray-600 mt-1">{product.description}</p>}
      </div>

      {product.order_bumps?.length > 0 && (
        <div className="space-y-2">
          {product.order_bumps.map((bump) => (
            <label
              key={bump.id}
              className="flex items-center gap-3 border border-yellow-300 bg-yellow-50 rounded-lg p-3"
            >
              <input
                type="checkbox"
                checked={selectedBumps.includes(bump.id)}
                onChange={(e) =>
                  setSelectedBumps((prev) =>
                    e.target.checked ? [...prev, bump.id] : prev.filter((id) => id !== bump.id)
                  )
                }
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{bump.bump_product.name}</p>
                <p className="text-xs text-gray-500">
                  {formatRupiah(bump.bump_product.discount_price ?? bump.bump_product.normal_price)}
                </p>
              </div>
            </label>
          ))}
        </div>
      )}

      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-sm">Data Penerima</h3>
        {formFields.length === 0 ? (
          <p className="text-xs text-negative">
            Belum ada formulir pemesanan diatur untuk produk ini. Atur di halaman edit produk.
          </p>
        ) : (
          formFields
            .filter((f) => f.enabled)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((field) => (
              <div key={field.id}>
                <label className="text-xs text-gray-500">
                  {field.label} {field.required && "*"}
                </label>
                <input
                  type={field.key === "email" ? "email" : "text"}
                  value={formValues[field.key] ?? ""}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  required={field.required}
                  className="border rounded-lg px-3 py-2 w-full mt-1 text-sm"
                />
              </div>
            ))
        )}
      </div>

      <div className="border rounded-lg p-4 space-y-2">
        <h3 className="font-medium text-sm">Metode Pembayaran</h3>
        {paymentMethodsConfig.bank_transfer_enabled && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="payment_method"
              checked={paymentMethod === "bank_transfer"}
              onChange={() => setPaymentMethod("bank_transfer")}
            />
            Bank Transfer
          </label>
        )}
        {paymentMethodsConfig.e_payment_enabled &&
          enabledChannels.map((channel) => (
            <label key={channel} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="payment_method"
                checked={paymentMethod === channel}
                onChange={() => setPaymentMethod(channel)}
              />
              {CHANNEL_LABELS[channel]}
            </label>
          ))}
      </div>

      <div className="border rounded-lg p-4 text-sm space-y-1">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(basePrice)}</span></div>
        {bumpTotal > 0 && <div className="flex justify-between"><span>Bump</span><span>{formatRupiah(bumpTotal)}</span></div>}
        {adminFee > 0 && <div className="flex justify-between"><span>Biaya Admin</span><span>{formatRupiah(adminFee)}</span></div>}
        {ppn > 0 && <div className="flex justify-between"><span>PPN</span><span>{formatRupiah(ppn)}</span></div>}
        <div className="flex justify-between font-semibold border-t pt-1 mt-1">
          <span>Total</span><span>{formatRupiah(total)}</span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !paymentMethod || formFields.length === 0}
        className="w-full bg-blue-600 text-white rounded-xl py-3 font-medium disabled:opacity-50"
      >
        {submitting ? "Memproses..." : "Beli Sekarang"}
      </button>
    </div>
  );
}