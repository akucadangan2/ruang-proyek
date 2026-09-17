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
    <main className="min-h-screen bg-[#F3F7FC] px-2 py-2 sm:px-4 sm:py-4">
      {/* =====================================================
          CHECKOUT CONTAINER
      ====================================================== */}

      <div className="checkout-enter mx-auto w-full max-w-[570px] overflow-hidden rounded-[17px] border border-[#C9D9EA] bg-white shadow-[0_2px_8px_rgba(42,80,120,0.04)]">
        <div className="px-3 pb-5 pt-3 sm:px-4 sm:pb-6">
          {/* =================================================
              TRUST
          ================================================== */}

          <div className="mb-4 grid grid-cols-2 gap-2 px-2 sm:px-12">
            <TrustItem
              icon={<MoneyShieldIcon />}
              title="Garansi Uang"
              subtitle="Kembali"
            />

            <TrustItem
              icon={<ThumbIcon />}
              title="Jaminan"
              subtitle="Kepuasan"
            />
          </div>

          {/* =================================================
              PRODUCT IMAGE
          ================================================== */}

          {mainImage && (
            <div className="mb-5 overflow-hidden rounded-[3px] border border-[#B9CADC] bg-[#F7FAFD]">
              <img
                src={mainImage.url}
                alt={product.name}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* =================================================
              PRODUCT NAME OPTIONAL
          ================================================== */}

          {!mainImage && (
            <div className="mb-5 rounded-lg border border-[#D6E2EE] bg-[#F7FAFD] p-5">
              <h1 className="text-[16px] font-bold text-[#172E4D]">
                {product.name}
              </h1>

              {product.description && (
                <p className="mt-1 text-[12px] leading-5 text-[#718399]">
                  {product.description}
                </p>
              )}
            </div>
          )}

          {/* =================================================
              DATA PENERIMA
          ================================================== */}

          <CheckoutSectionTitle>
            Data Penerima:
          </CheckoutSectionTitle>

          <div className="mt-4 space-y-3">
            {enabledFields.map(
              (field) => (
                <input
                  key={field.id}
                  type={
                    field.key === "email"
                      ? "email"
                      : field.key ===
                          "no_hp"
                        ? "tel"
                        : "text"
                  }
                  placeholder={`${field.label}${
                    field.required
                      ? " *"
                      : ""
                  }`}
                  value={
                    formValues[
                      field.key
                    ] ?? ""
                  }
                  onChange={(e) =>
                    setFormValues(
                      (prev) => ({
                        ...prev,
                        [field.key]:
                          e.target
                            .value,
                      })
                    )
                  }
                  required={
                    field.required
                  }
                  className="
                    h-[44px]
                    w-full
                    rounded-[3px]
                    border
                    border-[#C8D9EB]
                    bg-white
                    px-3
                    text-[12px]
                    text-[#243A55]
                    shadow-[0_0_0_1px_rgba(209,224,239,.25)]
                    outline-none
                    transition-all
                    placeholder:text-[#8A9AAF]
                    hover:border-[#ABC5E0]
                    focus:border-[#568DD1]
                    focus:ring-2
                    focus:ring-[#568DD1]/10
                  "
                />
              )
            )}
          </div>

          {/* =================================================
              ORDER BUMP
          ================================================== */}

          {product.order_bumps?.length >
            0 && (
            <div className="mt-5 space-y-3">
              {product.order_bumps.map(
                (bump) => {
                  const bp =
                    bump.bump_product;

                  const image = [
                    ...(bp.product_images ??
                      []),
                  ].sort(
                    (a, b) =>
                      a.sort_order -
                      b.sort_order
                  )[0];

                  const selected =
                    selectedBumps.includes(
                      bump.id
                    );

                  return (
                    <div
                      key={bump.id}
                      className="
                        overflow-hidden
                        rounded-[4px]
                        border
                        border-dashed
                        border-[#F2A43B]
                        bg-[#FFF9EB]
                        p-3
                      "
                    >
                      <div className="flex items-start gap-3">
                        {image ? (
                          <img
                            src={
                              image.url
                            }
                            alt={
                              bp.name
                            }
                            className="h-[66px] w-[66px] shrink-0 rounded-[3px] border border-[#E8C06F] object-cover"
                          />
                        ) : (
                          <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[3px] border border-[#E8C06F] bg-[#FFF2C9] text-[#B6822B]">
                            <PackageIcon />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="text-[11.5px] font-semibold leading-[17px] text-[#233A55]">
                            {bp.name}
                          </h3>

                          <p className="mt-0.5 text-[11px] font-medium text-[#BA761C]">
                            {formatRupiah(
                              bp.discount_price ??
                                bp.normal_price
                            )}
                          </p>

                          {bp.description && (
                            <p className="mt-1 line-clamp-4 text-[10px] leading-[15px] text-[#667B91]">
                              {
                                bp.description
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      <label
                        className={`
                          mt-3
                          flex
                          cursor-pointer
                          items-center
                          gap-2
                          rounded-[3px]
                          border
                          px-2.5
                          py-2
                          transition-all

                          ${
                            selected
                              ? "border-[#E9A72F] bg-[#FFF4CC]"
                              : "border-[#EAB34B] bg-[#FFF8E5] hover:bg-[#FFF2C9]"
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={
                            selected
                          }
                          onChange={(
                            e
                          ) =>
                            setSelectedBumps(
                              (
                                prev
                              ) =>
                                e
                                  .target
                                  .checked
                                  ? [
                                      ...prev,
                                      bump.id,
                                    ]
                                  : prev.filter(
                                      (
                                        id
                                      ) =>
                                        id !==
                                        bump.id
                                    )
                            )
                          }
                          className="h-4 w-4 accent-[#D99118]"
                        />

                        <span className="text-[10.5px] font-medium text-[#53677A]">
                          Tambahkan Paket{" "}
                          {bp.name}
                        </span>
                      </label>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* =================================================
              PAYMENT
          ================================================== */}

          <div className="mt-6">
            <CheckoutSectionTitle>
              Metode Pembayaran:
            </CheckoutSectionTitle>

            <div className="mt-4 space-y-2.5">
              {paymentMethodsConfig.bank_transfer_enabled && (
                <PaymentOption
                  selected={
                    paymentMethod ===
                    "bank_transfer"
                  }
                  onSelect={() =>
                    setPaymentMethod(
                      "bank_transfer"
                    )
                  }
                  logo={
                    <BankIcon />
                  }
                  title="Bank Transfer"
                  subtitle="Transfer bank manual"
                  showGateway={false}
                />
              )}

              {paymentMethodsConfig.e_payment_enabled &&
                enabledChannels.map(
                  (channel) => {
                    const cfg =
                      FEE_CONFIG[
                        channel
                      ];

                    return (
                      <PaymentOption
                        key={
                          channel
                        }
                        selected={
                          paymentMethod ===
                          channel
                        }
                        onSelect={() =>
                          setPaymentMethod(
                            channel
                          )
                        }
                        logo={
                          <PaymentLogo
                            channel={
                              channel
                            }
                            label={
                              cfg.badge
                            }
                            className={
                              cfg.badgeColor
                            }
                          />
                        }
                        title={
                          CHANNEL_LABELS[
                            channel
                          ]
                        }
                        subtitle={
                          cfg.feeLabel
                        }
                        showGateway
                      />
                    );
                  }
                )}
            </div>
          </div>

          {/* =================================================
              EMAIL NOTICE
          ================================================== */}

          <div className="mt-5 rounded-[3px] bg-[#F7FAFE] px-3 py-3">
            <p className="text-[10px] font-semibold leading-[16px] text-[#20364F]">
              *Pastikan Email dengan benar.
              Produk akan terkirim secara
              otomatis melalui Email setelah
              pembayaran.
            </p>
          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================== */}

          <div className="mt-5 rounded-[4px] border border-[#C9D9EA] bg-[#FBFDFF] p-3">
            <CheckoutSectionTitle>
              Rincian Pesanan
            </CheckoutSectionTitle>

            <div className="mt-3">
              {/* PRODUCT */}
              <div className="flex items-start justify-between gap-4 border-b border-[#DCE6F0] pb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] leading-4 text-[#4E6680]">
                    (1x) {product.name}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-medium text-[#253C55]">
                    {formatRupiah(
                      basePrice
                    )}
                  </p>

                  {hasDiscount && (
                    <p className="mt-0.5 text-[9px] text-[#E65050] line-through">
                      {formatRupiah(
                        product.normal_price
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* BUMPS */}
              {product.order_bumps
                ?.filter((b) =>
                  selectedBumps.includes(
                    b.id
                  )
                )
                .map((b) => (
                  <div
                    key={b.id}
                    className="flex items-start justify-between gap-4 border-b border-[#DCE6F0] py-3"
                  >
                    <span className="text-[10px] leading-4 text-[#4E6680]">
                      (1x){" "}
                      {
                        b
                          .bump_product
                          .name
                      }
                    </span>

                    <span className="shrink-0 text-[10px] font-medium text-[#253C55]">
                      {formatRupiah(
                        b
                          .bump_product
                          .discount_price ??
                          b
                            .bump_product
                            .normal_price
                      )}
                    </span>
                  </div>
                ))}

              {/* ADMIN FEE */}
              {adminFee > 0 &&
                selectedFeeConfig && (
                  <div className="flex items-start justify-between gap-4 border-b border-[#DCE6F0] py-3">
                    <div>
                      <p className="text-[10px] text-[#4E6680]">
                        {
                          CHANNEL_LABELS[
                            paymentMethod as EPaymentChannel
                          ]
                        }
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#8293A5]">
                        {
                          selectedFeeConfig.feeLabel
                        }
                      </p>
                    </div>

                    <span className="text-[10px] font-medium text-[#253C55]">
                      {formatRupiah(
                        adminFee
                      )}
                    </span>
                  </div>
                )}

              {/* PPN */}
              {ppn > 0 && (
                <div className="flex items-center justify-between border-b border-[#DCE6F0] py-3">
                  <span className="text-[10px] text-[#4E6680]">
                    PPN
                  </span>

                  <span className="text-[10px] font-medium text-[#253C55]">
                    {formatRupiah(
                      ppn
                    )}
                  </span>
                </div>
              )}

              {/* TOTAL */}
              <div className="flex items-center justify-between pt-3">
                <span className="text-[12px] font-bold text-[#009B42]">
                  Total
                </span>

                <span className="text-[13px] font-bold text-[#009B42]">
                  {formatRupiah(
                    total
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              BUY BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              submitting ||
              !paymentMethod ||
              enabledFields.length === 0
            }
            className="
              mt-5
              flex
              h-[54px]
              w-full
              items-center
              justify-center
              rounded-[3px]
              bg-[#00B719]
              px-5
              text-[16px]
              font-bold
              text-white
              shadow-[0_3px_7px_rgba(0,183,25,.18)]
              transition-all
              hover:bg-[#00A817]
              active:translate-y-[1px]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Memproses...
              </span>
            ) : (
              "Beli Sekarang"
            )}
          </button>

          {/* =================================================
              DIGITAL PRODUCT
          ================================================== */}

          {data.checkoutConfig?.footer
            .digital_product_label !==
            false && (
            <div className="mt-5 flex items-center gap-3 rounded-[3px] bg-[#EAFBF1] px-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-[#00A547]">
                  Produk Digital
                </p>

                <p className="mt-0.5 max-w-[270px] text-[9.5px] leading-[15px] text-[#148D4B]">
                  Produk akan dikirimkan ke
                  kamu langsung setelah proses
                  pembelian
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B8E8C8] bg-[#F7FFF9] text-[#19A653]">
                <DigitalProductIcon />
              </div>
            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="pb-1 pt-7 text-center">
            <p className="text-[8.5px] text-[#71869C]">
              Copyright ©{" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          STYLE
      ====================================================== */}

      <style jsx global>{`
        .checkout-enter {
          animation: checkoutEnter 0.45s
            ease both;
        }

        @keyframes checkoutEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          body {
            background: #f3f7fc;
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
      <h2 className="shrink-0 text-[12px] font-medium text-[#1F344C]">
        {children}
      </h2>

      <div className="h-px flex-1 bg-[#C8D9EA]" />
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
    <div className="flex items-center justify-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7EFF8] text-[#243F60]">
        {icon}
      </div>

      <div className="text-[10px] font-medium leading-[13px] text-[#375677] sm:text-[11px]">
        <p>{title}</p>
        <p>{subtitle}</p>
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
      className={`
        flex
        min-h-[55px]
        cursor-pointer
        items-center
        justify-between
        gap-3
        rounded-[3px]
        border
        px-2.5
        py-2
        transition-all

        ${
          selected
            ? "border-[#5B8FE2] bg-[#F7FAFF] shadow-[0_0_0_1px_rgba(91,143,226,.08)]"
            : "border-[#C9D9EA] bg-white hover:border-[#9DB9D8]"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {/* RADIO */}
        <span
          className={`
            flex
            h-[16px]
            w-[16px]
            shrink-0
            items-center
            justify-center
            rounded-full
            border-2

            ${
              selected
                ? "border-[#3F61D5]"
                : "border-[#C4D4EA]"
            }
          `}
        >
          {selected && (
            <span className="h-[6px] w-[6px] rounded-full bg-[#3F61D5]" />
          )}
        </span>

        <input
          type="radio"
          className="sr-only"
          checked={selected}
          onChange={onSelect}
        />

        {/* LOGO */}
        <div className="flex h-[24px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-[#D7E1EC] bg-white">
          {logo}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10.5px] font-medium text-[#2D4C70] sm:text-[11px]">
            {title}
          </p>

          <p className="mt-[1px] text-[8.5px] text-[#6E89A6]">
            {subtitle}
          </p>
        </div>
      </div>

      {showGateway && (
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#E9F1FC] px-2 py-1">
          <span className="flex items-end gap-[1px]">
            <span className="h-2 w-[1px] rounded bg-[#4B7FDF]" />
            <span className="h-3 w-[1px] rounded bg-[#4B7FDF]" />
            <span className="h-2.5 w-[1px] rounded bg-[#4B7FDF]" />
          </span>

          <span className="text-[8px] font-medium text-[#5174BC]">
            Midtrans
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
        className={`text-[7px] font-black tracking-[-0.04em] ${className}`}
      >
        QRIS
      </span>
    );
  }

  if (channel === "mandiri_va") {
    return (
      <span
        className={`text-[6px] font-bold ${className}`}
      >
        mandiri
      </span>
    );
  }

  return (
    <span
      className={`text-[7px] font-black ${className}`}
    >
      {label}
    </span>
  );
}

/* =========================================================
   LOADING
========================================================= */

function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-[#F3F7FC] px-2 py-3">
      <div className="mx-auto w-full max-w-[570px] rounded-[17px] border border-[#C9D9EA] bg-white p-4">
        <div className="flex justify-center gap-8">
          <div className="skeleton h-8 w-28 rounded-lg bg-[#EDF2F7]" />
          <div className="skeleton h-8 w-28 rounded-lg bg-[#EDF2F7]" />
        </div>

        <div className="skeleton mt-4 aspect-[1.1/1] w-full rounded bg-[#EDF2F7]" />

        <div className="mt-6 space-y-3">
          <div className="skeleton h-4 w-28 rounded bg-[#EDF2F7]" />
          <div className="skeleton h-11 w-full rounded bg-[#EDF2F7]" />
          <div className="skeleton h-11 w-full rounded bg-[#EDF2F7]" />
          <div className="skeleton h-11 w-full rounded bg-[#EDF2F7]" />
        </div>
      </div>

      <style jsx global>{`
        .skeleton {
          animation: skeletonLoading 1.4s
            ease-in-out infinite;
        }

        @keyframes skeletonLoading {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
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