"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import type {
  Product,
  ProductImage,
  OrderFormField,
  OrderBump,
} from "@/types/product";
import type {
  CheckoutComponentConfig,
  EPaymentChannel,
} from "@/types/checkout-component";

interface BumpProduct {
  id: string;
  name: string;
  normal_price: number;
  discount_price: number | null;
  description: string | null;
  product_images?: {
    url: string;
    sort_order: number;
  }[];
}

interface CheckoutData {
  product: Product & {
    product_images: ProductImage[];
    order_bumps: (OrderBump & {
      bump_product: BumpProduct;
    })[];
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

const FEE_CONFIG: Record<
  EPaymentChannel,
  {
    badge: string;
    badgeColor: string;
    feeLabel: string;
    getFee: (base: number) => number;
  }
> = {
  bri_va: {
    badge: "BRI",
    badgeColor: "text-[#1554B7]",
    feeLabel: "Admin fee Rp4.440",
    getFee: () => 4440,
  },

  bca_va: {
    badge: "BCA",
    badgeColor: "text-[#0067B1]",
    feeLabel: "Admin fee Rp4.440",
    getFee: () => 4440,
  },

  qris: {
    badge: "QRIS",
    badgeColor: "text-[#B2292E]",
    feeLabel: "Admin fee 0.7%",
    getFee: (base) => Math.round(base * 0.007),
  },

  mandiri_va: {
    badge: "mandiri",
    badgeColor: "text-[#0A4B87]",
    feeLabel: "Admin fee Rp4.440",
    getFee: () => 4440,
  },

  bni_va: {
    badge: "BNI",
    badgeColor: "text-[#E87624]",
    feeLabel: "Admin fee Rp4.440",
    getFee: () => 4440,
  },
};

const FALLBACK_PAYMENT_METHODS = {
  bank_transfer_enabled: false,
  e_payment_enabled: true,
  e_payment_channels: ["qris"] as EPaymentChannel[],
  admin_fee_bearer: "seller" as const,
};

export default function CheckoutPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const router = useRouter();

  const [data, setData] = useState<CheckoutData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<
    Record<string, string>
  >({});

  const [selectedBumps, setSelectedBumps] = useState<string[]>(
    []
  );

  const [paymentMethod, setPaymentMethod] =
    useState<string>("");

  const [submitting, setSubmitting] = useState(false);

  /* =========================================================
     LOAD PRODUCT
  ========================================================= */

  useEffect(() => {
    fetch(`/api/public/products/${slug}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data?.product) {
          setLoadError(
            res.error ?? "Produk tidak ditemukan."
          );
          return;
        }

        setData(res.data);

        const autoChecked = (
          res.data.product.order_bumps ?? []
        )
          .filter((b: OrderBump) => b.auto_checked)
          .map((b: OrderBump) => b.id);

        setSelectedBumps(autoChecked);
      })
      .catch((err) =>
        setLoadError(
          err.message ?? "Gagal memuat halaman."
        )
      );
  }, [slug]);

  /* =========================================================
     CALCULATION
  ========================================================= */

  const bumpTotal = useMemo(() => {
    if (!data) return 0;

    return (data.product.order_bumps ?? [])
      .filter((b) =>
        selectedBumps.includes(b.id)
      )
      .reduce(
        (sum, b) =>
          sum +
          (b.bump_product.discount_price ??
            b.bump_product.normal_price),
        0
      );
  }, [data, selectedBumps]);

  const paymentMethodsConfig =
    data?.checkoutConfig?.content.payment_methods ??
    FALLBACK_PAYMENT_METHODS;

  const formFields =
    data?.product.order_form_fields ?? [];

  const basePrice = data
    ? data.product.discount_price ??
      data.product.normal_price
    : 0;

  const adminFee = useMemo(() => {
    if (
      paymentMethodsConfig.admin_fee_bearer ===
      "seller"
    ) {
      return 0;
    }

    const config =
      FEE_CONFIG[
        paymentMethod as EPaymentChannel
      ];

    if (!config) return 0;

    return config.getFee(
      basePrice + bumpTotal
    );
  }, [
    paymentMethodsConfig,
    paymentMethod,
    basePrice,
    bumpTotal,
  ]);

  const ppn = useMemo(() => {
    const cfg =
      data?.checkoutConfig?.content;

    if (
      !cfg?.ppn_enabled ||
      !cfg.ppn_percentage
    ) {
      return 0;
    }

    return Math.round(
      (basePrice + bumpTotal) *
        (cfg.ppn_percentage / 100)
    );
  }, [data, basePrice, bumpTotal]);

  const total =
    basePrice +
    bumpTotal +
    adminFee +
    ppn;

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit() {
    if (!data) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          product_id: data.product.id,
          buyer_name: formValues.nama,
          buyer_phone: formValues.no_hp,
          buyer_email: formValues.email,
          quantity:
            Number(
              formValues.jumlah_pesanan
            ) || 1,
          note:
            formValues.catatan ?? null,
          payment_method:
            paymentMethod,
          bump_total: bumpTotal,
          admin_fee: adminFee,
          ppn,
        }),
      });

      if (res.ok) {
        const { data: order } =
          await res.json();

        router.push(
          `/checkout/${slug}/success?order=${order.order_number}`
        );
      } else {
        const err = await res.json();

        alert(
          err.error ??
            "Gagal membuat order."
        );
      }
    } catch {
      alert(
        "Terjadi kesalahan. Silakan coba kembali."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F7FC] px-5">
        <div className="w-full max-w-[420px] rounded-2xl border border-red-100 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            !
          </div>

          <h1 className="mt-4 text-[15px] font-semibold text-[#1D3557]">
            Gagal memuat checkout
          </h1>

          <p className="mt-2 text-[12px] text-gray-500">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (!data) {
    return <CheckoutSkeleton />;
  }

  const { product } = data;

  const enabledChannels =
    paymentMethodsConfig.e_payment_channels ??
    [];

  const selectedFeeConfig =
    FEE_CONFIG[
      paymentMethod as EPaymentChannel
    ];

  const sortedImages = [
    ...(product.product_images ?? []),
  ].sort(
    (a, b) =>
      (a.sort_order ?? 0) -
      (b.sort_order ?? 0)
  );

  const mainImage = sortedImages[0];

  const enabledFields = [
    ...formFields,
  ]
    .filter((f) => f.enabled)
    .sort(
      (a, b) =>
        a.sort_order -
        b.sort_order
    );

  const hasDiscount =
    product.discount_price !== null &&
    product.discount_price !== undefined &&
    product.discount_price <
      product.normal_price;

  return (
    <main className="min-h-screen bg-white sm:bg-[#F4F7F5] sm:px-4 sm:py-6">
      <div className="checkout-enter mx-auto w-full bg-white sm:max-w-[600px] sm:overflow-hidden sm:rounded-[24px] sm:border sm:border-[#E2E8E5] sm:shadow-[0_18px_60px_rgba(23,62,55,0.08)]">

        {/* TRUST BAR */}
        <div className="border-b border-[#EDF1EF] bg-[#FAFBFA] px-4 py-3 sm:px-6">
          <div className="grid grid-cols-2 divide-x divide-[#E3E9E6]">
            <TrustItem icon={<MoneyShieldIcon />} title="Pembayaran" subtitle="Aman" />
            <TrustItem icon={<ThumbIcon />} title="Produk Digital" subtitle="Terkirim Otomatis" />
          </div>
        </div>

        {/* PRODUCT */}
        <section className="px-4 pb-5 pt-4 sm:px-6 sm:pt-6">
          {mainImage ? (
            <div className="overflow-hidden rounded-2xl border border-[#E4EAE7] bg-[#F6F8F7]">
              <img
                src={mainImage.url}
                alt={product.name}
                className="aspect-[4/3] h-auto w-full object-cover sm:aspect-video"
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-[#E4EAE7] bg-[#F6F8F7] text-[#6D7D77]">
              <PackageIcon />
            </div>
          )}

          <div className="pt-4">
            <h1 className="text-[18px] font-bold leading-[1.35] tracking-[-0.02em] text-[#173E37] sm:text-[20px]">
              {product.name}
            </h1>

            {product.description && (
              <p className="mt-2 text-[12px] leading-5 text-[#74827D] sm:text-[13px]">
                {product.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[20px] font-bold tracking-[-0.03em] text-[#173E37]">
                {formatRupiah(basePrice)}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-[12px] text-[#9AA5A1] line-through">
                    {formatRupiah(product.normal_price)}
                  </span>
                  <span className="rounded-full bg-[#EAF5EF] px-2.5 py-1 text-[10px] font-semibold text-[#2E7557]">
                    Harga Promo
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* BUYER DATA */}
        <section className="border-t border-[#EDF1EF] px-4 py-5 sm:px-6 sm:py-6">
          <CheckoutSectionTitle>Data Penerima</CheckoutSectionTitle>

          <p className="mt-2 text-[11px] leading-4 text-[#8A9692]">
            Data ini digunakan untuk memproses dan mengirimkan pesanan.
          </p>

          <div className="mt-4 space-y-3.5">
            {enabledFields.map((field) => (
              <div key={field.id}>
                <label className="mb-1.5 block text-[11px] font-semibold text-[#455B53]">
                  {field.label}
                  {field.required && <span className="ml-1 text-red-500">*</span>}
                </label>

                <input
                  type={
                    field.key === "email"
                      ? "email"
                      : field.key === "no_hp"
                        ? "tel"
                        : "text"
                  }
                  placeholder={
                    field.key === "email"
                      ? "contoh@email.com"
                      : field.key === "no_hp"
                        ? "08xxxxxxxxxx"
                        : `Masukkan ${field.label.toLowerCase()}`
                  }
                  value={formValues[field.key] ?? ""}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  required={field.required}
                  className="h-[50px] w-full rounded-xl border border-[#DCE4E0] bg-white px-3.5 text-[14px] text-[#263C35] outline-none transition-all placeholder:text-[#A2ACA8] focus:border-[#4D7B6B] focus:ring-4 focus:ring-[#4D7B6B]/10"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ORDER BUMP */}
        {product.order_bumps?.length > 0 && (
          <section className="border-t border-[#EDF1EF] px-4 py-5 sm:px-6 sm:py-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <CheckoutSectionTitle>Penawaran Tambahan</CheckoutSectionTitle>
              <span className="shrink-0 rounded-full bg-[#FFF4DC] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#A86F1F]">
                Opsional
              </span>
            </div>

            <div className="space-y-3">
              {product.order_bumps.map((bump) => {
                const bp = bump.bump_product;
                const image = [...(bp.product_images ?? [])].sort(
                  (a, b) => a.sort_order - b.sort_order
                )[0];
                const selected = selectedBumps.includes(bump.id);

                return (
                  <label
                    key={bump.id}
                    className={`block cursor-pointer overflow-hidden rounded-2xl border transition-all ${
                      selected
                        ? "border-[#D8A04A] bg-[#FFFCF5] shadow-[0_0_0_3px_rgba(216,160,74,0.08)]"
                        : "border-[#E4E8E5] bg-white"
                    }`}
                  >
                    <div className="flex gap-3 p-3">
                      {image ? (
                        <img
                          src={image.url}
                          alt={bp.name}
                          className="h-[72px] w-[72px] shrink-0 rounded-xl border border-[#ECEDE9] object-cover"
                        />
                      ) : (
                        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-[#FFF5DF] text-[#B27A27]">
                          <PackageIcon />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold leading-[17px] text-[#30473F]">
                          {bp.name}
                        </p>
                        <p className="mt-1 text-[13px] font-bold text-[#B77820]">
                          {formatRupiah(bp.discount_price ?? bp.normal_price)}
                        </p>
                        {bp.description && (
                          <p className="mt-1 line-clamp-2 text-[10px] leading-[15px] text-[#7C8985]">
                            {bp.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={`flex min-h-[44px] items-center gap-2.5 border-t px-3 ${
                      selected
                        ? "border-[#ECD8B2] bg-[#FFF6E2]"
                        : "border-[#ECEFEB] bg-[#FAFBFA]"
                    }`}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) =>
                          setSelectedBumps((prev) =>
                            e.target.checked
                              ? [...prev, bump.id]
                              : prev.filter((id) => id !== bump.id)
                          )
                        }
                        className="h-4 w-4 accent-[#C88A2E]"
                      />
                      <span className="text-[11px] font-semibold text-[#53665F]">
                        Tambahkan ke pesanan
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        )}

        {/* PAYMENT */}
        <section className="border-t border-[#EDF1EF] px-4 py-5 sm:px-6 sm:py-6">
          <CheckoutSectionTitle>Metode Pembayaran</CheckoutSectionTitle>
          <p className="mt-2 text-[11px] leading-4 text-[#8A9692]">
            Pilih metode pembayaran yang paling nyaman.
          </p>

          <div className="mt-4 space-y-2.5">
            {paymentMethodsConfig.bank_transfer_enabled && (
              <PaymentOption
                selected={paymentMethod === "bank_transfer"}
                onSelect={() => setPaymentMethod("bank_transfer")}
                logo={<BankIcon />}
                title="Transfer Bank"
                subtitle="Transfer bank manual"
                showGateway={false}
              />
            )}

            {paymentMethodsConfig.e_payment_enabled &&
              enabledChannels.map((channel) => {
                const cfg = FEE_CONFIG[channel];

                return (
                  <PaymentOption
                    key={channel}
                    selected={paymentMethod === channel}
                    onSelect={() => setPaymentMethod(channel)}
                    logo={
                      <PaymentLogo
                        channel={channel}
                        label={cfg.badge}
                        className={cfg.badgeColor}
                      />
                    }
                    title={CHANNEL_LABELS[channel]}
                    subtitle={cfg.feeLabel}
                    showGateway
                  />
                );
              })}
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#F4F8F6] p-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#52766A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" />
              <path d="M12 8h.01" />
            </svg>
            <p className="text-[10.5px] leading-[16px] text-[#667770]">
              Pastikan email sudah benar. Produk digital akan dikirim otomatis setelah pembayaran berhasil dikonfirmasi.
            </p>
          </div>
        </section>

        {/* SUMMARY */}
        <section className="border-t border-[#EDF1EF] px-4 py-5 sm:px-6 sm:py-6">
          <CheckoutSectionTitle>Rincian Pesanan</CheckoutSectionTitle>

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#E0E7E3] bg-white">
            <div className="space-y-3.5 p-4">
              <SummaryRow label={`1x ${product.name}`} value={formatRupiah(basePrice)} />

              {product.order_bumps
                ?.filter((b) => selectedBumps.includes(b.id))
                .map((b) => (
                  <SummaryRow
                    key={b.id}
                    label={`1x ${b.bump_product.name}`}
                    value={formatRupiah(
                      b.bump_product.discount_price ?? b.bump_product.normal_price
                    )}
                  />
                ))}

              {adminFee > 0 && selectedFeeConfig && (
                <SummaryRow
                  label="Biaya pembayaran"
                  sublabel={CHANNEL_LABELS[paymentMethod as EPaymentChannel]}
                  value={formatRupiah(adminFee)}
                />
              )}

              {ppn > 0 && <SummaryRow label="PPN" value={formatRupiah(ppn)} />}
            </div>

            <div className="flex items-end justify-between gap-4 border-t border-[#E0E7E3] bg-[#F6F9F7] px-4 py-4">
              <div>
                <p className="text-[11px] font-medium text-[#667770]">Total Pembayaran</p>
                <p className="mt-0.5 text-[9px] text-[#8B9793]">Termasuk biaya yang berlaku</p>
              </div>
              <span className="shrink-0 text-[19px] font-bold tracking-[-0.03em] text-[#173E37]">
                {formatRupiah(total)}
              </span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="border-t border-[#EDF1EF] bg-white px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !paymentMethod || enabledFields.length === 0}
            className="flex h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#173E37] px-5 text-[14px] font-bold text-white shadow-[0_8px_22px_rgba(23,62,55,0.18)] transition-all hover:bg-[#12342D] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Spinner />
                Memproses pembayaran...
              </>
            ) : (
              "Bayar Sekarang"
            )}
          </button>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[9.5px] text-[#87938F]">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            <span>Pembayaran aman diproses melalui</span>
            <span className="font-extrabold tracking-wide text-[#E66C2B]">DOKU</span>
          </div>
        </div>

        {/* DIGITAL PRODUCT */}
        {data.checkoutConfig?.footer.digital_product_label !== false && (
          <div className="mx-4 mb-5 flex items-center gap-3 rounded-2xl border border-[#DDEFE5] bg-[#F1FBF5] p-3.5 sm:mx-6 sm:mb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#3D8565] shadow-sm">
              <DigitalProductIcon />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#286A4C]">Produk Digital</p>
              <p className="mt-0.5 text-[9.5px] leading-[15px] text-[#668577]">
                Produk dikirim otomatis setelah pembayaran berhasil.
              </p>
            </div>
          </div>
        )}

        <footer className="border-t border-[#F0F2F1] px-4 py-5 text-center">
          <p className="text-[9px] text-[#A0AAA6]">
            © {new Date().getFullYear()} Ruang Kerja
          </p>
        </footer>
      </div>

      <style jsx global>{`
        .checkout-enter {
          animation: checkoutEnter 0.35s ease both;
        }

        @keyframes checkoutEnter {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 639px) {
          html,
          body {
            background: #ffffff !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .checkout-enter {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function CheckoutSectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="shrink-0 text-[14px] font-bold tracking-[-0.01em] text-[#29433A]">
        {children}
      </h2>
      <div className="h-px flex-1 bg-[#E1E8E4]" />
    </div>
  );
}

/* =========================================================
   TRUST ITEM
========================================================= */

function TrustItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-2 px-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F0ED] text-[#315F50]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-bold leading-[13px] text-[#3D554D] sm:text-[11px]">
          {title}
        </p>
        <p className="truncate text-[9px] leading-[12px] text-[#82908B] sm:text-[10px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT
========================================================= */

function PaymentOption({
  selected,
  onSelect,
  logo,
  title,
  subtitle,
  showGateway,
}: {
  selected: boolean;
  onSelect: () => void;
  logo: React.ReactNode;
  title: string;
  subtitle: string;
  showGateway: boolean;
}) {
  return (
    <label
      className={`flex min-h-[68px] cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all ${
        selected
          ? "border-[#3E725F] bg-[#F4FAF7] shadow-[0_0_0_3px_rgba(62,114,95,0.08)]"
          : "border-[#DFE6E2] bg-white hover:border-[#B9C8C1]"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-[#2F6D57]" : "border-[#CBD5D1]"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#2F6D57]" />}
      </span>

      <input type="radio" className="sr-only" checked={selected} onChange={onSelect} />

      <div className="flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E5EAE7] bg-white shadow-sm">
        {logo}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold leading-4 text-[#30483F] sm:text-[13px]">
          {title}
        </p>
        <p className="mt-0.5 text-[10px] leading-4 text-[#87948F]">
          {subtitle}
        </p>
      </div>

      {showGateway && (
        <div className="shrink-0 rounded-lg bg-[#FFF1E8] px-2 py-1.5">
          <span className="text-[9px] font-extrabold tracking-[0.04em] text-[#E66C2B]">
            DOKU
          </span>
        </div>
      )}
    </label>
  );
}

/* =========================================================
   PAYMENT LOGO
========================================================= */

function PaymentLogo({
  channel,
  label,
  className,
}: {
  channel: EPaymentChannel;
  label: string;
  className: string;
}) {
  if (channel === "qris") {
    return (
      <span
        className={`text-[9px] font-black tracking-[-0.04em] ${className}`}
      >
        QRIS
      </span>
    );
  }

  if (channel === "mandiri_va") {
    return (
      <span
        className={`text-[8px] font-bold ${className}`}
      >
        mandiri
      </span>
    );
  }

  return (
    <span
      className={`text-[9px] font-black ${className}`}
    >
      {label}
    </span>
  );
}


function SummaryRow({
  label,
  sublabel,
  value,
}: {
  label: string;
  sublabel?: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[11px] font-medium leading-4 text-[#4F625B]">{label}</p>
        {sublabel && (
          <p className="mt-0.5 text-[9px] leading-4 text-[#929D99]">{sublabel}</p>
        )}
      </div>
      <span className="shrink-0 text-[11px] font-semibold text-[#2D443C]">{value}</span>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-white sm:bg-[#F4F7F5] sm:px-4 sm:py-6">
      <div className="mx-auto w-full bg-white p-4 sm:max-w-[600px] sm:rounded-[24px] sm:border sm:border-[#E2E8E5] sm:p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="skeleton h-10 rounded-xl bg-[#EEF2F0]" />
          <div className="skeleton h-10 rounded-xl bg-[#EEF2F0]" />
        </div>
        <div className="skeleton mt-5 aspect-[4/3] w-full rounded-2xl bg-[#EEF2F0] sm:aspect-video" />
        <div className="skeleton mt-5 h-6 w-2/3 rounded bg-[#EEF2F0]" />
        <div className="skeleton mt-3 h-4 w-full rounded bg-[#EEF2F0]" />
        <div className="mt-7 space-y-3">
          <div className="skeleton h-12 w-full rounded-xl bg-[#EEF2F0]" />
          <div className="skeleton h-12 w-full rounded-xl bg-[#EEF2F0]" />
          <div className="skeleton h-16 w-full rounded-2xl bg-[#EEF2F0]" />
        </div>
      </div>

      <style jsx global>{`
        .skeleton {
          animation: skeletonLoading 1.4s ease-in-out infinite;
        }
        @keyframes skeletonLoading {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   ICONS
========================================================= */

function MoneyShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z" />
      <path d="M14.5 9.2c-.5-.5-1.2-.7-2-.7-1.2 0-2 .6-2 1.4 0 2.1 4.2 1 4.2 3.3 0 .9-.9 1.5-2.2 1.5-.9 0-1.7-.3-2.3-.8" />
      <path d="M12.5 7.3v8.5" />
    </svg>
  );
}

function ThumbIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v10H4V10h3Z" />
      <path d="M7 18c3 1 5.5 2 8 2h1.2c1.1 0 2-.8 2.2-1.8l1.3-6c.3-1.3-.7-2.5-2-2.5H14l.5-3.1c.2-1.2-.6-2.4-1.8-2.6L12 4l-5 6" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="m4 7 8 4 8-4" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#456585"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 10 9-6 9 6" />
      <path d="M5 10v7" />
      <path d="M9 10v7" />
      <path d="M15 10v7" />
      <path d="M19 10v7" />
      <path d="M3 20h18" />
    </svg>
  );
}

function DigitalProductIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16v12H4z" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="m8 10 3 3 5-6" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        opacity=".25"
      />

      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}