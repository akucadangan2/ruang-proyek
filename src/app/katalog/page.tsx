"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { IconPackage } from "@/components/ui/icons";

interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  normal_price: number;
  discount_price: number | null;
  product_images: {
    url: string;
    sort_order: number;
  }[];
}

type SortOption = "latest" | "lowest" | "highest";

export default function KatalogPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("latest");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch("/api/public/products", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Gagal memuat produk");
        }

        const result = await response.json();

        if (active) {
          setProducts(result.data ?? []);
        }
      } catch (err) {
        console.error(err);

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = products.filter((product) => {
      if (!query) return true;

      return (
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    });

    result = [...result];

    if (sort === "lowest") {
      result.sort(
        (a, b) =>
          getFinalPrice(a) - getFinalPrice(b)
      );
    }

    if (sort === "highest") {
      result.sort(
        (a, b) =>
          getFinalPrice(b) - getFinalPrice(a)
      );
    }

    return result;
  }, [products, search, sort]);

  return (
    <>
      <main className="min-h-screen bg-[#F7F7F2] text-[#173E37]">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="sticky top-0 z-50 border-b border-[#173E37]/[0.07] bg-[#F7F7F2]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 sm:px-6 lg:px-8">
            <Link href="/" className="shrink-0">
              <img
                src="/logo.jpg"
                alt="Ruang Proyek"
                className="h-10 w-auto object-contain sm:h-11"
              />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden items-center gap-8 md:flex">
              <Link
                href="/"
                className="text-[13px] font-medium text-[#68736F] transition-colors hover:text-[#173E37]"
              >
                Beranda
              </Link>

              <span className="text-[13px] font-semibold text-[#173E37]">
                Katalog
              </span>

              <Link
                href="/#fitur"
                className="text-[13px] font-medium text-[#68736F] transition-colors hover:text-[#173E37]"
              >
                Fitur
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="
                  hidden
                  rounded-xl
                  px-4
                  py-2.5
                  text-[13px]
                  font-semibold
                  text-[#173E37]
                  transition-colors
                  hover:bg-[#173E37]/[0.05]
                  sm:inline-flex
                "
              >
                Masuk
              </Link>

              <Link
                href="/register"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#173E37]
                  px-4
                  py-2.5
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-[0_7px_20px_rgba(23,62,55,0.14)]
                  transition-all
                  hover:-translate-y-[1px]
                  hover:bg-[#1D4B43]
                  sm:px-5
                  sm:text-[13px]
                "
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </header>

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden border-b border-[#173E37]/[0.07]">
          {/* BACKGROUND */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#173E37]/[0.04] blur-[110px]" />

            <div className="absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#C79B4B]/[0.08] blur-[110px]" />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: `
                  linear-gradient(#173E37 1px, transparent 1px),
                  linear-gradient(90deg, #173E37 1px, transparent 1px)
                `,
                backgroundSize: "38px 38px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-[1180px] px-5 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
            <div className="catalog-fade catalog-delay-1 mb-4 inline-flex items-center gap-2 rounded-full border border-[#173E37]/10 bg-white/60 px-3 py-1.5 backdrop-blur">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#E6EDE9] text-[#173E37]">
                <IconPackage className="h-3 w-3" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#687570]">
                Digital Marketplace
              </span>
            </div>

            <h1 className="catalog-fade catalog-delay-2 max-w-[680px] text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#173E37] sm:text-[48px] lg:text-[54px]">
              Temukan produk digital
              <br className="hidden sm:block" /> untuk{" "}
              <span className="text-[#B8893F]">
                kebutuhanmu.
              </span>
            </h1>

            <p className="catalog-fade catalog-delay-3 mt-5 max-w-[570px] text-[13px] leading-6 text-[#707C78] sm:text-[14px]">
              Jelajahi berbagai produk digital yang dipublikasikan oleh seller
              di Ruang Proyek, mulai dari template, e-book, materi belajar,
              hingga aset digital lainnya.
            </p>

            {/* SEARCH */}
            <div className="catalog-fade catalog-delay-4 mt-8 max-w-[650px]">
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center text-[#939D99] transition-colors group-focus-within:text-[#173E37]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </div>

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Cari template, e-book, kelas online..."
                  className="
                    h-[54px]
                    w-full
                    rounded-[14px]
                    border
                    border-[#DDE1DB]
                    bg-white
                    pl-12
                    pr-4
                    text-[13px]
                    text-[#173E37]
                    shadow-[0_8px_30px_rgba(23,62,55,0.06)]
                    outline-none
                    transition-all
                    placeholder:text-[#A3AAA7]
                    hover:border-[#C9CFC9]
                    focus:border-[#52746D]
                    focus:ring-4
                    focus:ring-[#173E37]/[0.06]
                  "
                />
              </div>
            </div>

            {/* MINI INFO */}
            <div className="catalog-fade catalog-delay-5 mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10.5px] text-[#89938F]">
              <span className="flex items-center gap-1.5">
                <CheckIcon />
                Produk digital
              </span>

              <span className="flex items-center gap-1.5">
                <CheckIcon />
                Checkout online
              </span>

              <span className="flex items-center gap-1.5">
                <CheckIcon />
                Pembayaran digital
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            CATALOG
        ====================================================== */}

        <section className="mx-auto max-w-[1180px] px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          {/* TOOLBAR */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-[3px] w-6 rounded-full bg-[#C79B4B]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A17E47]">
                  Katalog
                </span>
              </div>

              <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.025em] text-[#173E37] sm:text-[26px]">
                Jelajahi Produk
              </h2>

              {!loading && !error && (
                <p className="mt-1 text-[11px] text-[#89928F]">
                  {search
                    ? `${filteredProducts.length} produk ditemukan`
                    : `${products.length} produk tersedia`}
                </p>
              )}
            </div>

            {/* SORT */}
            {!loading && products.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="hidden text-[11px] text-[#8B9491] sm:inline">
                  Urutkan:
                </span>

                <div className="relative w-full sm:w-auto">
                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(
                        e.target.value as SortOption
                      )
                    }
                    className="
                      h-[42px]
                      w-full
                      appearance-none
                      rounded-xl
                      border
                      border-[#DEE1DC]
                      bg-white
                      pl-4
                      pr-10
                      text-[11.5px]
                      font-medium
                      text-[#4F605B]
                      outline-none
                      transition-all
                      hover:border-[#C7CDC7]
                      focus:border-[#52746D]
                      sm:w-[180px]
                    "
                  >
                    <option value="latest">
                      Terbaru
                    </option>

                    <option value="lowest">
                      Harga Terendah
                    </option>

                    <option value="highest">
                      Harga Tertinggi
                    </option>
                  </select>

                  <svg
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#89928F]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* =====================================================
              LOADING
          ====================================================== */}

          {loading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <ProductSkeleton key={index} />
                )
              )}
            </div>
          )}

          {/* =====================================================
              ERROR
          ====================================================== */}

          {!loading && error && (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[20px] border border-[#E5E6E0] bg-white px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF1EF] text-[#B85045]">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5" />
                  <path d="M12 16h.01" />
                </svg>
              </div>

              <h3 className="mt-5 text-[15px] font-semibold text-[#173E37]">
                Katalog gagal dimuat
              </h3>

              <p className="mt-2 max-w-[340px] text-[12px] leading-5 text-[#808A86]">
                Terjadi masalah saat mengambil data produk. Silakan muat ulang
                halaman dan coba kembali.
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-5 rounded-xl bg-[#173E37] px-5 py-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#1D4B43]"
              >
                Muat Ulang
              </button>
            </div>
          )}

          {/* =====================================================
              EMPTY
          ====================================================== */}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#D6DAD4] bg-white/50 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8EFEB] text-[#173E37]">
                  <IconPackage className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-[15px] font-semibold text-[#173E37]">
                  Belum ada produk
                </h3>

                <p className="mt-2 max-w-[350px] text-[12px] leading-5 text-[#858E8A]">
                  Produk yang dipublikasikan oleh seller akan muncul di katalog
                  ini.
                </p>

                <Link
                  href="/register"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#173E37] px-5 py-2.5 text-[11px] font-semibold text-white transition-all hover:-translate-y-[1px] hover:bg-[#1D4B43]"
                >
                  Mulai Jual Produk

                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </Link>
              </div>
            )}

          {/* =====================================================
              NO SEARCH RESULT
          ====================================================== */}

          {!loading &&
            !error &&
            products.length > 0 &&
            filteredProducts.length === 0 && (
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#D6DAD4] bg-white/50 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EFEB] text-[#173E37]">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </div>

                <h3 className="mt-5 text-[15px] font-semibold text-[#173E37]">
                  Produk tidak ditemukan
                </h3>

                <p className="mt-2 max-w-[350px] text-[12px] leading-5 text-[#858E8A]">
                  Tidak ada produk yang cocok dengan pencarian{" "}
                  <strong className="font-semibold text-[#596864]">
                    &quot;{search}&quot;
                  </strong>
                  .
                </p>

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-xl border border-[#DDE1DB] bg-white px-5 py-2.5 text-[11px] font-semibold text-[#173E37] transition-colors hover:bg-[#F2F4F0]"
                >
                  Hapus Pencarian
                </button>
              </div>
            )}

          {/* =====================================================
              PRODUCTS
          ====================================================== */}

          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map(
                  (product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  )
                )}
              </div>
            )}
        </section>

        {/* =====================================================
            SELLER CTA
        ====================================================== */}

        <section className="mx-auto max-w-[1180px] px-5 pb-16 pt-4 sm:px-6 sm:pb-20 lg:px-8">
          <div className="relative overflow-hidden rounded-[24px] bg-[#173E37]">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)
                `,
                backgroundSize: "36px 36px",
              }}
            />

            <div className="absolute -right-24 -top-24 h-[350px] w-[350px] rounded-full bg-[#C79B4B]/20 blur-[100px]" />

            <div className="relative flex flex-col items-start justify-between gap-7 px-6 py-9 sm:px-9 sm:py-11 md:flex-row md:items-center lg:px-12">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#DDBA72]">
                  Untuk Seller
                </span>

                <h2 className="mt-3 max-w-[550px] text-[24px] font-semibold leading-tight tracking-[-0.03em] text-white sm:text-[28px]">
                  Punya produk digital untuk dijual?
                </h2>

                <p className="mt-2 max-w-[500px] text-[12px] leading-5 text-white/50">
                  Buat halaman produk dan mulai kelola penjualanmu melalui
                  Ruang Proyek.
                </p>
              </div>

              <Link
                href="/register"
                className="
                  group
                  flex
                  h-[48px]
                  w-full
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#C79B4B]
                  px-6
                  text-[12px]
                  font-bold
                  text-[#173E37]
                  shadow-lg
                  transition-all
                  hover:-translate-y-[2px]
                  hover:bg-[#D2A958]
                  sm:w-auto
                "
              >
                Mulai Jualan

                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="border-t border-[#E4E6DF] bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-9 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href="/">
                  <img
                    src="/logo.jpg"
                    alt="Ruang Proyek"
                    className="h-9 w-auto object-contain"
                  />
                </Link>

                <p className="mt-3 max-w-[400px] text-[10.5px] leading-5 text-[#929A97]">
                  Platform untuk membantu seller mengelola produk digital,
                  checkout, order, dan pelanggan.
                </p>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <Link
                  href="/"
                  className="text-[11px] text-[#7F8985] transition-colors hover:text-[#173E37]"
                >
                  Beranda
                </Link>

                <Link
                  href="/privacy"
                  className="text-[11px] text-[#7F8985] transition-colors hover:text-[#173E37]"
                >
                  Privasi
                </Link>

                <Link
                  href="/terms"
                  className="text-[11px] text-[#7F8985] transition-colors hover:text-[#173E37]"
                >
                  Ketentuan
                </Link>

                <Link
                  href="/login"
                  className="text-[11px] text-[#7F8985] transition-colors hover:text-[#173E37]"
                >
                  Masuk
                </Link>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-[#ECEDE8] pt-5 text-[10px] text-[#A0A7A4] sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} Ruang Proyek. Seluruh hak cipta
                dilindungi.
              </p>

              <p>
                Transaksi diproses melalui payment gateway yang tersedia.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* =====================================================
          ANIMATION
      ====================================================== */}

      <style jsx global>{`
        .catalog-fade {
          opacity: 0;
          transform: translateY(16px);
          animation: catalogFade 0.65s ease forwards;
        }

        .catalog-delay-1 {
          animation-delay: 0.05s;
        }

        .catalog-delay-2 {
          animation-delay: 0.12s;
        }

        .catalog-delay-3 {
          animation-delay: 0.19s;
        }

        .catalog-delay-4 {
          animation-delay: 0.26s;
        }

        .catalog-delay-5 {
          animation-delay: 0.33s;
        }

        @keyframes catalogFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .catalog-product-card {
          animation: productCardIn 0.5s ease both;
        }

        @keyframes productCardIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .catalog-product-image {
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .catalog-product-card:hover .catalog-product-image {
          transform: scale(1.045);
        }

        .catalog-shine::after {
          content: "";
          position: absolute;
          inset: 0;
          left: -130%;
          width: 65%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.7s ease;
          pointer-events: none;
        }

        .catalog-product-card:hover .catalog-shine::after {
          left: 140%;
        }

        @keyframes skeletonPulse {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }

        .catalog-skeleton {
          animation: skeletonPulse 1.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .catalog-fade,
          .catalog-product-card,
          .catalog-skeleton {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }

          .catalog-product-image {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  index,
}: {
  product: CatalogProduct;
  index: number;
}) {
  const image = [...(product.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  )[0];

  const hasDiscount =
    product.discount_price !== null &&
    product.discount_price < product.normal_price;

  const finalPrice = hasDiscount
    ? product.discount_price!
    : product.normal_price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.normal_price - product.discount_price!) /
          product.normal_price) *
          100
      )
    : 0;

  return (
    <Link
      href={`/${product.slug}`}
      className="
        catalog-product-card
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[18px]
        border
        border-[#E3E5DF]
        bg-white
        shadow-[0_5px_20px_rgba(23,62,55,0.035)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#173E37]/15
        hover:shadow-[0_16px_40px_rgba(23,62,55,0.09)]
      "
      style={{
        animationDelay: `${Math.min(index * 55, 330)}ms`,
      }}
    >
      {/* IMAGE */}
      <div className="catalog-shine relative aspect-[16/10] overflow-hidden border-b border-[#E9EAE5] bg-[#F1F2EE]">
        {image ? (
          <img
            src={image.url}
            alt={product.name}
            loading="lazy"
            className="catalog-product-image h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#DEE2DC] bg-white text-[#9BA5A1] shadow-sm">
              <IconPackage className="h-6 w-6" />
            </div>
          </div>
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#173E37]/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* DISCOUNT */}
        {hasDiscount && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-[#173E37] px-2.5 py-1.5 text-[9px] font-bold text-white shadow-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#DDB767]" />
            HEMAT {discountPercentage}%
          </div>
        )}

        {/* VIEW */}
        <div
          className="
            absolute
            bottom-3
            right-3
            flex
            translate-y-2
            items-center
            gap-1.5
            rounded-lg
            bg-white/95
            px-2.5
            py-1.5
            text-[9px]
            font-semibold
            text-[#173E37]
            opacity-0
            shadow-md
            backdrop-blur
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          Lihat Produk

          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C79B4B]" />

          <span className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-[#9A835B]">
            Produk Digital
          </span>
        </div>

        <h2 className="line-clamp-2 text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#173E37] sm:text-[15px]">
          {product.name}
        </h2>

        {product.description ? (
          <p className="mt-2 line-clamp-2 min-h-[40px] text-[11.5px] leading-5 text-[#7C8783]">
            {product.description}
          </p>
        ) : (
          <p className="mt-2 min-h-[40px] text-[11.5px] leading-5 text-[#A0A7A4]">
            Produk digital tersedia melalui Ruang Proyek.
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="border-t border-[#ECEDE8] pt-4">
            {hasDiscount && (
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[10px] text-[#9DA5A2] line-through">
                  {formatRupiah(product.normal_price)}
                </span>

                <span className="rounded-md bg-[#F3EBDD] px-1.5 py-0.5 text-[8px] font-bold text-[#A47734]">
                  -{discountPercentage}%
                </span>
              </div>
            )}

            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="mb-0.5 text-[8.5px] text-[#A0A7A4]">
                  {hasDiscount
                    ? "Harga promo"
                    : "Harga"}
                </p>

                <p className="text-[16px] font-bold tracking-[-0.02em] text-[#173E37] tabular-nums sm:text-[17px]">
                  {formatRupiah(finalPrice)}
                </p>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8EFEB] text-[#173E37] transition-all duration-300 group-hover:bg-[#173E37] group-hover:text-white">
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[2px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#E5E7E1] bg-white">
      <div className="catalog-skeleton aspect-[16/10] bg-[#ECEEEA]" />

      <div className="p-5">
        <div className="catalog-skeleton h-2 w-20 rounded bg-[#E9EBE7]" />

        <div className="catalog-skeleton mt-4 h-3.5 w-[75%] rounded bg-[#E5E8E3]" />

        <div className="catalog-skeleton mt-3 h-2.5 w-full rounded bg-[#EEF0EC]" />

        <div className="catalog-skeleton mt-2 h-2.5 w-[70%] rounded bg-[#EEF0EC]" />

        <div className="mt-5 border-t border-[#EEEFEA] pt-4">
          <div className="catalog-skeleton h-2 w-12 rounded bg-[#EEF0EC]" />

          <div className="catalog-skeleton mt-2 h-4 w-24 rounded bg-[#E5E8E3]" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getFinalPrice(product: CatalogProduct) {
  if (
    product.discount_price !== null &&
    product.discount_price < product.normal_price
  ) {
    return product.discount_price;
  }

  return product.normal_price;
}

function CheckIcon() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E2EBE7] text-[#3D7468]">
      <svg
        width="9"
        height="9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 12 4 4L19 6" />
      </svg>
    </span>
  );
}