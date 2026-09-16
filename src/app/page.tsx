import Link from "next/link";
import {
  IconPackage,
  IconSliders,
  IconGrid,
  IconBell,
} from "@/components/ui/icons";

const FEATURES = [
  {
    icon: IconPackage,
    title: "Landing Page Builder",
    description:
      "Buat halaman penjualan produk digital dengan foto, harga, deskripsi, dan formulir pemesanan.",
    label: "BUILDER",
  },
  {
    icon: IconSliders,
    title: "Checkout Builder",
    description:
      "Atur metode pembayaran, order bump, informasi pembeli, dan tampilan checkout sesuai kebutuhan.",
    label: "CHECKOUT",
  },
  {
    icon: IconGrid,
    title: "Dashboard & Analytics",
    description:
      "Pantau pendapatan, order, performa produk, dan aktivitas penjualan dari satu dashboard.",
    label: "ANALYTICS",
  },
  {
    icon: IconBell,
    title: "Follow Up Otomatis",
    description:
      "Follow up buyer melalui WhatsApp dan dapatkan notifikasi order baru secara otomatis.",
    label: "AUTOMATION",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Buat produk",
    description:
      "Tambahkan produk digital, foto, deskripsi, harga, dan informasi penting lainnya.",
  },
  {
    n: "02",
    title: "Publish halaman jualan",
    description:
      "Susun landing page dan checkout yang siap dibagikan kepada calon pembeli.",
  },
  {
    n: "03",
    title: "Kelola order",
    description:
      "Pantau pesanan, pembayaran, pelanggan, dan follow up dari satu dashboard.",
  },
];

const PRODUCTS = ["Template", "E-Book", "Kelas Online", "Digital Asset"];

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#F7F7F2] text-[#173E37]">
        {/* =====================================================
            NAVBAR
        ====================================================== */}

        <header className="sticky top-0 z-50 border-b border-[#173E37]/[0.07] bg-[#F7F7F2]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 sm:px-6 lg:px-8">
            <Link href="/" className="flex shrink-0 items-center">
              <img
                src="/logo.jpg"
                alt="Ruang Proyek"
                className="h-10 w-auto object-contain sm:h-11"
              />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden items-center gap-8 md:flex">
              <a
                href="#fitur"
                className="text-[13px] font-medium text-[#68736F] transition-colors hover:text-[#173E37]"
              >
                Fitur
              </a>

              <a
                href="#cara-kerja"
                className="text-[13px] font-medium text-[#68736F] transition-colors hover:text-[#173E37]"
              >
                Cara Kerja
              </a>

              <Link
                href="/katalog"
                className="text-[13px] font-medium text-[#68736F] transition-colors hover:text-[#173E37]"
              >
                Katalog
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

        <section className="relative">
          {/* BACKGROUND */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-[#173E37]/[0.035] blur-[100px]" />

            <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[#C79B4B]/[0.08] blur-[110px]" />

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

          <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 px-5 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-24">
            {/* LEFT */}
            <div className="relative z-10">
              <div className="hero-fade hero-delay-1 mb-5 inline-flex items-center gap-2 rounded-full border border-[#173E37]/10 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C79B4B] opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C79B4B]" />
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#65736F] sm:text-[11px]">
                  Workspace untuk seller digital
                </span>
              </div>

              <h1 className="hero-fade hero-delay-2 max-w-[650px] text-[40px] font-semibold leading-[1.05] tracking-[-0.045em] text-[#173E37] sm:text-[52px] lg:text-[60px]">
                Jual produk digital
                <br className="hidden sm:block" /> jadi{" "}
                <span className="relative whitespace-nowrap text-[#B8893F]">
                  lebih simpel.
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 6C49 1.5 139 1.5 198 5"
                      stroke="#C79B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity=".5"
                    />
                  </svg>
                </span>
              </h1>

              <p className="hero-fade hero-delay-3 mt-7 max-w-[520px] text-[14px] leading-7 text-[#697571] sm:text-[15px]">
                Bangun landing page, atur checkout, terima order, dan kelola
                pelanggan dalam satu workspace. Fokus pada produkmu, biarkan
                sistem membantu pekerjaan berulang.
              </p>

              {/* BUTTON */}
              <div className="hero-fade hero-delay-4 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="
                    group
                    relative
                    flex
                    h-[52px]
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-xl
                    bg-[#173E37]
                    px-6
                    text-[13px]
                    font-semibold
                    text-white
                    shadow-[0_10px_30px_rgba(23,62,55,0.18)]
                    transition-all
                    hover:-translate-y-[2px]
                    hover:bg-[#1D4B43]
                    hover:shadow-[0_14px_35px_rgba(23,62,55,0.22)]
                    sm:w-auto
                  "
                >
                  <span className="absolute inset-y-0 left-0 w-[3px] bg-[#C79B4B]" />

                  Mulai Gratis

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

                <Link
                  href="/katalog"
                  className="
                    flex
                    h-[52px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#173E37]/10
                    bg-white/60
                    px-6
                    text-[13px]
                    font-semibold
                    text-[#173E37]
                    backdrop-blur
                    transition-all
                    hover:border-[#173E37]/20
                    hover:bg-white
                  "
                >
                  Lihat Katalog
                </Link>
              </div>

              {/* MINI BENEFITS */}
              <div className="hero-fade hero-delay-5 mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#84908C]">
                <span className="flex items-center gap-1.5">
                  <CheckIcon />
                  Gratis daftar
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckIcon />
                  Tanpa kartu kredit
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckIcon />
                  Siap digunakan
                </span>
              </div>
            </div>

            {/* =====================================================
                DASHBOARD MOCKUP
            ====================================================== */}

            <div className="hero-fade hero-delay-3 relative mx-auto w-full max-w-[650px] lg:mx-0">
              {/* FLOATING BADGE */}
              <div className="float-card absolute -left-3 top-14 z-20 hidden rounded-xl border border-[#E3E5DE] bg-white px-3 py-2 shadow-[0_10px_30px_rgba(23,62,55,0.12)] sm:flex sm:items-center sm:gap-2 lg:-left-7">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E7EFEB] text-[#173E37]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </div>

                <div>
                  <p className="text-[9px] text-[#929A96]">Order baru</p>
                  <p className="text-[11px] font-semibold text-[#173E37]">
                    Pembayaran berhasil
                  </p>
                </div>
              </div>

              {/* SALES BADGE */}
              <div className="float-card-two absolute -right-3 bottom-16 z-20 hidden rounded-xl border border-[#E3E5DE] bg-white px-3 py-2.5 shadow-[0_10px_30px_rgba(23,62,55,0.12)] sm:block lg:-right-5">
                <p className="text-[9px] text-[#929A96]">
                  Penjualan hari ini
                </p>

                <p className="mt-0.5 text-[14px] font-bold text-[#173E37]">
                  Rp1.847.000
                </p>

                <p className="mt-0.5 text-[9px] font-semibold text-[#4E796E]">
                  ↑ 12,8%
                </p>
              </div>

              {/* APP WINDOW */}
              <div className="relative overflow-hidden rounded-[20px] border border-[#173E37]/10 bg-white shadow-[0_30px_80px_rgba(23,62,55,0.13)]">
                {/* BROWSER */}
                <div className="flex h-[44px] items-center border-b border-[#E8E8E2] bg-[#FAFAF7] px-4">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E1B1AA]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E4C985]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#9FC4B7]" />
                  </div>

                  <div className="mx-auto hidden h-6 w-[46%] items-center justify-center rounded-md border border-[#E7E7E1] bg-white text-[7px] text-[#9BA29F] sm:flex">
                    ruangproyek.app/dashboard
                  </div>
                </div>

                <div className="flex h-[370px] sm:h-[410px]">
                  {/* SIDEBAR MOCK */}
                  <div className="hidden w-[115px] shrink-0 border-r border-[#EBEBE5] bg-[#FAFAF7] p-3 sm:block">
                    <div className="mb-5 flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-md bg-[#173E37]" />
                      <div className="h-2 w-12 rounded-full bg-[#D6DAD6]" />
                    </div>

                    <MockNav active />
                    <MockNav />
                    <MockNav />
                    <MockNav />
                    <MockNav />
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1 bg-[#F8F8F5] p-4 sm:p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <div className="h-3 w-24 rounded bg-[#173E37]/85" />
                        <div className="mt-2 h-1.5 w-32 rounded bg-[#D7DBD7]" />
                      </div>

                      <div className="flex h-7 items-center rounded-lg bg-[#173E37] px-3 text-[7px] font-semibold text-white">
                        + Produk
                      </div>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      <MockStat
                        title="Pendapatan"
                        value="Rp8,4 jt"
                        trend="+18%"
                      />

                      <MockStat
                        title="Total Order"
                        value="142"
                        trend="+12%"
                      />

                      <div className="hidden sm:block">
                        <MockStat
                          title="Conversion"
                          value="8.4%"
                          trend="+2.1%"
                        />
                      </div>
                    </div>

                    {/* CHART */}
                    <div className="mt-3 rounded-xl border border-[#E8E9E4] bg-white p-3.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="h-2 w-20 rounded bg-[#526762]" />
                          <div className="mt-1.5 h-1.5 w-12 rounded bg-[#E0E2DE]" />
                        </div>

                        <div className="rounded-md bg-[#F1F3EF] px-2 py-1 text-[6px] text-[#84908C]">
                          30 hari
                        </div>
                      </div>

                      <div className="relative mt-5 h-[90px] overflow-hidden">
                        <div className="absolute inset-0 flex flex-col justify-between">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="border-t border-dashed border-[#E8EAE5]"
                            />
                          ))}
                        </div>

                        <svg
                          className="absolute inset-0 h-full w-full"
                          viewBox="0 0 400 100"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              id="chartGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#3D7468"
                                stopOpacity=".22"
                              />
                              <stop
                                offset="100%"
                                stopColor="#3D7468"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>

                          <path
                            d="M0 83 C30 79 35 63 65 67 C95 71 105 42 135 51 C165 60 175 32 205 38 C235 45 245 20 275 28 C305 36 325 12 350 20 C370 25 385 11 400 8 L400 100 L0 100 Z"
                            fill="url(#chartGradient)"
                          />

                          <path
                            className="chart-line"
                            d="M0 83 C30 79 35 63 65 67 C95 71 105 42 135 51 C165 60 175 32 205 38 C235 45 245 20 275 28 C305 36 325 12 350 20 C370 25 385 11 400 8"
                            fill="none"
                            stroke="#3D7468"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* ORDER */}
                    <div className="mt-3 rounded-xl border border-[#E8E9E4] bg-white p-3.5">
                      <div className="mb-3 h-2 w-20 rounded bg-[#526762]" />

                      <div className="space-y-2">
                        <MockOrder
                          name="Template Finance"
                          price="Rp149.000"
                        />

                        <MockOrder
                          name="E-Book Marketing"
                          price="Rp89.000"
                        />

                        <MockOrder
                          name="UI Design Kit"
                          price="Rp199.000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT TYPES */}
          <div className="relative mx-auto max-w-[1180px] px-5 pb-14 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-5 border-t border-[#173E37]/[0.08] pt-7 sm:flex-row">
              <p className="text-[11px] font-medium uppercase tracking-[0.13em] text-[#939B98]">
                Cocok untuk berbagai produk digital
              </p>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                {PRODUCTS.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 text-[11px] font-semibold text-[#66736F]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C79B4B]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}

        <section
          id="fitur"
          className="border-y border-[#173E37]/[0.07] bg-white"
        >
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-[620px]">
              <SectionBadge>FITUR UTAMA</SectionBadge>

              <h2 className="mt-4 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#173E37] sm:text-[38px]">
                Semua yang dibutuhkan
                <br className="hidden sm:block" /> untuk mulai jualan.
              </h2>

              <p className="mt-4 max-w-[520px] text-[13px] leading-6 text-[#75807C] sm:text-[14px]">
                Tidak perlu berpindah-pindah tools untuk mengelola halaman
                produk, checkout, order, dan follow up pelanggan.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="
                      feature-card
                      group
                      relative
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-[#E5E7E1]
                      bg-[#FAFAF7]
                      p-6
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#173E37]/15
                      hover:bg-white
                      hover:shadow-[0_15px_40px_rgba(23,62,55,0.08)]
                      sm:p-7
                    "
                  >
                    <div className="absolute right-5 top-4 text-[42px] font-bold tracking-[-0.05em] text-[#173E37]/[0.025]">
                      0{index + 1}
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7EEEA] text-[#173E37] transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>

                    <p className="mt-6 text-[10px] font-bold tracking-[0.13em] text-[#B0894C]">
                      {feature.label}
                    </p>

                    <h3 className="mt-2 text-[16px] font-semibold tracking-[-0.015em] text-[#173E37]">
                      {feature.title}
                    </h3>

                    <p className="mt-2 max-w-[440px] text-[12.5px] leading-6 text-[#78827F]">
                      {feature.description}
                    </p>

                    <div className="mt-6 h-[2px] w-8 rounded-full bg-[#C79B4B] transition-all duration-300 group-hover:w-14" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section id="cara-kerja" className="relative">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="text-center">
              <SectionBadge>CARA KERJA</SectionBadge>

              <h2 className="mx-auto mt-4 max-w-[600px] text-[30px] font-semibold tracking-[-0.035em] text-[#173E37] sm:text-[38px]">
                Dari produk sampai order,
                <br className="hidden sm:block" /> cukup tiga langkah.
              </h2>

              <p className="mx-auto mt-4 max-w-[520px] text-[13px] leading-6 text-[#75807C] sm:text-[14px]">
                Setup sederhana supaya kamu bisa lebih cepat mulai menjual
                produk digital.
              </p>
            </div>

            <div className="relative mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* DESKTOP LINE */}
              <div className="absolute left-[16%] right-[16%] top-[29px] hidden border-t border-dashed border-[#C8CCC7] md:block" />

              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="relative z-10 rounded-[18px] border border-[#E4E6E0] bg-white p-6 shadow-[0_8px_30px_rgba(23,62,55,0.035)] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-[#173E37] text-[13px] font-bold text-[#E8C77F] shadow-[0_8px_20px_rgba(23,62,55,0.16)]">
                      {step.n}
                    </span>

                    <svg
                      className="h-5 w-5 text-[#C79B4B]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </div>

                  <h3 className="mt-6 text-[15px] font-semibold text-[#173E37]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-[12.5px] leading-6 text-[#7B8581]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            AUTOMATION SECTION
        ====================================================== */}

        <section className="mx-auto max-w-[1180px] px-5 pb-20 sm:px-6 sm:pb-24 lg:px-8">
          <div className="relative overflow-hidden rounded-[26px] bg-[#173E37]">
            {/* BACKGROUND */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)
                `,
                backgroundSize: "38px 38px",
              }}
            />

            <div className="absolute -right-24 -top-24 h-[350px] w-[350px] rounded-full bg-[#C79B4B]/15 blur-[100px]" />

            <div className="relative grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-2 lg:px-14">
              <div>
                <span className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold tracking-[0.13em] text-[#E0BE78]">
                  AUTOMATION
                </span>

                <h2 className="mt-5 max-w-[470px] text-[28px] font-semibold leading-[1.15] tracking-[-0.035em] text-white sm:text-[36px]">
                  Jangan biarkan calon buyer terlupakan.
                </h2>

                <p className="mt-4 max-w-[460px] text-[13px] leading-6 text-white/55">
                  Buat alur follow up untuk membantu mengingatkan buyer dan
                  mempermudah pengelolaan proses penjualan.
                </p>

                <div className="mt-6 space-y-3">
                  <AutomationCheck text="Follow up WhatsApp" />
                  <AutomationCheck text="Notifikasi order" />
                  <AutomationCheck text="Tracking aktivitas" />
                </div>
              </div>

              {/* AUTOMATION MOCK */}
              <div className="relative mx-auto w-full max-w-[440px]">
                <div className="automation-card rounded-[18px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur sm:p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-white">
                        Follow Up Flow
                      </p>

                      <p className="mt-1 text-[8px] text-white/40">
                        Checkout belum selesai
                      </p>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full bg-[#C79B4B]/15 px-2.5 py-1 text-[8px] font-semibold text-[#E6C47B]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E6C47B]" />
                      Active
                    </span>
                  </div>

                  <AutomationNode
                    number="1"
                    title="Buyer checkout"
                    description="Customer mengisi checkout"
                  />

                  <AutomationConnector />

                  <AutomationNode
                    number="2"
                    title="Tunggu 15 menit"
                    description="Cek status pembayaran"
                  />

                  <AutomationConnector />

                  <AutomationNode
                    number="3"
                    title="Kirim WhatsApp"
                    description="Follow up otomatis"
                    gold
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}

        <section className="border-t border-[#173E37]/[0.07] bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8EFEB] text-[#173E37]">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v18" />
                <path d="m17 8-5-5-5 5" />
                <path d="M5 21h14" />
              </svg>
            </div>

            <h2 className="mx-auto mt-5 max-w-[620px] text-[30px] font-semibold tracking-[-0.035em] text-[#173E37] sm:text-[40px]">
              Siap mulai jual produk digital?
            </h2>

            <p className="mx-auto mt-3 max-w-[450px] text-[13px] leading-6 text-[#7A8581]">
              Buat akun dan mulai siapkan halaman penjualan pertamamu.
            </p>

            <Link
              href="/register"
              className="
                group
                mt-7
                inline-flex
                h-[52px]
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#173E37]
                px-7
                text-[13px]
                font-semibold
                text-white
                shadow-[0_10px_30px_rgba(23,62,55,0.17)]
                transition-all
                hover:-translate-y-1
                hover:bg-[#1D4B43]
              "
            >
              Daftar Sekarang

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

            <p className="mt-4 text-[10px] text-[#A0A7A4]">
              Gratis daftar • Tanpa kartu kredit
            </p>
          </div>
        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="border-t border-[#E5E6E0] bg-[#F7F7F2]">
          <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
              {/* BRAND */}
              <div>
                <img
                  src="/logo.jpg"
                  alt="Ruang Proyek"
                  className="h-10 w-auto object-contain"
                />

                <p className="mt-4 max-w-[330px] text-[11.5px] leading-5 text-[#7D8783]">
                  Platform untuk membantu seller mengelola produk digital,
                  checkout, order, dan pelanggan dalam satu workspace.
                </p>
              </div>

              {/* LINKS */}
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.13em] text-[#173E37]">
                  Platform
                </p>

                <div className="flex flex-col items-start gap-3">
                  <a
                    href="#fitur"
                    className="text-[11.5px] text-[#7D8783] transition-colors hover:text-[#173E37]"
                  >
                    Fitur
                  </a>

                  <a
                    href="#cara-kerja"
                    className="text-[11.5px] text-[#7D8783] transition-colors hover:text-[#173E37]"
                  >
                    Cara Kerja
                  </a>

                  <Link
                    href="/katalog"
                    className="text-[11.5px] text-[#7D8783] transition-colors hover:text-[#173E37]"
                  >
                    Katalog
                  </Link>

                  <Link
                    href="/login"
                    className="text-[11.5px] text-[#7D8783] transition-colors hover:text-[#173E37]"
                  >
                    Masuk
                  </Link>
                </div>
              </div>

              {/* LEGAL */}
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.13em] text-[#173E37]">
                  Informasi
                </p>

                <div className="flex flex-col items-start gap-3">
                  <Link
                    href="/privacy"
                    className="text-[11.5px] text-[#7D8783] transition-colors hover:text-[#173E37]"
                  >
                    Kebijakan Privasi
                  </Link>

                  <Link
                    href="/terms"
                    className="text-[11.5px] text-[#7D8783] transition-colors hover:text-[#173E37]"
                  >
                    Syarat & Ketentuan
                  </Link>

                  <a
                    href="mailto:info@ruangkerja.id"
                    className="text-[11.5px] text-[#7D8783] transition-colors hover:text-[#173E37]"
                  >
                    Hubungi Kami
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-[#E2E4DD] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10.5px] text-[#969E9B]">
                © {new Date().getFullYear()} Ruang Proyek. Seluruh hak cipta
                dilindungi.
              </p>

              <div className="flex items-center gap-2 text-[10px] text-[#969E9B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5C8B7F]" />
                Sistem beroperasi normal
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .hero-fade {
          opacity: 0;
          transform: translateY(18px);
          animation: heroFadeIn 0.7s ease forwards;
        }

        .hero-delay-1 {
          animation-delay: 0.05s;
        }

        .hero-delay-2 {
          animation-delay: 0.12s;
        }

        .hero-delay-3 {
          animation-delay: 0.2s;
        }

        .hero-delay-4 {
          animation-delay: 0.28s;
        }

        .hero-delay-5 {
          animation-delay: 0.36s;
        }

        @keyframes heroFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .float-card {
          animation: floatingCard 3.5s ease-in-out infinite alternate;
        }

        .float-card-two {
          animation: floatingCardTwo 4s ease-in-out infinite alternate;
        }

        @keyframes floatingCard {
          from {
            transform: translateY(0) rotate(-1deg);
          }

          to {
            transform: translateY(-9px) rotate(1deg);
          }
        }

        @keyframes floatingCardTwo {
          from {
            transform: translateY(0) rotate(1deg);
          }

          to {
            transform: translateY(8px) rotate(-1deg);
          }
        }

        .chart-line {
          stroke-dasharray: 700;
          stroke-dashoffset: 700;
          animation: drawChart 2.3s ease forwards 0.7s;
        }

        @keyframes drawChart {
          to {
            stroke-dashoffset: 0;
          }
        }

        .feature-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 80%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.7),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.7s ease;
          pointer-events: none;
        }

        .feature-card:hover::before {
          left: 140%;
        }

        .automation-card {
          animation: automationFloat 4s ease-in-out infinite alternate;
        }

        @keyframes automationFloat {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(-8px);
          }
        }

        @media (max-width: 640px) {
          .hero-fade {
            animation-duration: 0.55s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .hero-fade,
          .float-card,
          .float-card-two,
          .chart-line,
          .automation-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>
    </>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

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

function SectionBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-[#A37D40]">
      <span className="h-[3px] w-6 rounded-full bg-[#C79B4B]" />
      {children}
    </span>
  );
}

function MockNav({ active = false }: { active?: boolean }) {
  return (
    <div
      className={`mb-2 flex h-7 items-center gap-2 rounded-md px-2 ${
        active ? "bg-[#E6EDE9]" : ""
      }`}
    >
      <span
        className={`h-3.5 w-3.5 rounded ${
          active ? "bg-[#3D7468]" : "bg-[#D9DDD8]"
        }`}
      />

      <span
        className={`h-1.5 rounded ${
          active
            ? "w-10 bg-[#82958F]"
            : "w-9 bg-[#D9DDD8]"
        }`}
      />
    </div>
  );
}

function MockStat({
  title,
  value,
  trend,
}: {
  title: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-xl border border-[#E7E8E3] bg-white p-3">
      <p className="text-[6.5px] text-[#949C99]">
        {title}
      </p>

      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p className="text-[11px] font-bold text-[#173E37] sm:text-[12px]">
          {value}
        </p>

        <span className="text-[6px] font-semibold text-[#4F7C70]">
          {trend}
        </span>
      </div>
    </div>
  );
}

function MockOrder({
  name,
  price,
}: {
  name: string;
  price: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-6 w-6 shrink-0 rounded-md bg-[#EEF0EC]" />

      <div className="min-w-0 flex-1">
        <div className="text-[6.5px] font-semibold text-[#526762]">
          {name}
        </div>

        <div className="mt-1 h-1 w-12 rounded bg-[#E1E4DF]" />
      </div>

      <span className="text-[6.5px] font-semibold text-[#3D7468]">
        {price}
      </span>
    </div>
  );
}

function AutomationCheck({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[#E0BE78]">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </span>

      <span className="text-[12px] text-white/65">
        {text}
      </span>
    </div>
  );
}

function AutomationNode({
  number,
  title,
  description,
  gold = false,
}: {
  number: string;
  title: string;
  description: string;
  gold?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.06] p-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
          gold
            ? "bg-[#C79B4B] text-[#173E37]"
            : "bg-white/10 text-white"
        }`}
      >
        {number}
      </div>

      <div>
        <p className="text-[10px] font-semibold text-white">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] text-white/35">
          {description}
        </p>
      </div>

      {gold && (
        <span className="ml-auto flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[#E6C47B] opacity-40" />
          <span className="relative h-2 w-2 rounded-full bg-[#E6C47B]" />
        </span>
      )}
    </div>
  );
}

function AutomationConnector() {
  return (
    <div className="ml-[27px] h-4 border-l border-dashed border-white/20" />
  );
}