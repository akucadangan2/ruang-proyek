"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        level: 1,
        label: "Lemah",
        color: "#C95B4F",
      };
    }

    if (score <= 3) {
      return {
        level: 2,
        label: "Cukup",
        color: "#C79B4B",
      };
    }

    return {
      level: 3,
      label: "Kuat",
      color: "#3D7468",
    };
  }, [password]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Email confirmation aktif
      if (data.user && !data.session) {
        setSuccess(true);
        return;
      }

      router.replace("/products");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     SUCCESS / EMAIL VERIFICATION
  ========================================================== */

  if (success) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F5F0] px-5">
        {/* BACKGROUND */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#173E37]/[0.04] blur-3xl" />

          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#C79B4B]/[0.08] blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
                linear-gradient(#173E37 1px, transparent 1px),
                linear-gradient(90deg, #173E37 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[460px]">
          {/* LOGO */}
          <div className="mb-7 flex justify-center">
            <div className="rounded-2xl border border-[#E6E5DE] bg-white p-3 shadow-sm">
              <img
                src="/logo.jpg"
                alt="Ruang Proyek"
                className="h-14 w-auto object-contain"
              />
            </div>
          </div>

          {/* CARD */}
          <div className="rounded-[24px] border border-[#E4E4DD] bg-white p-8 text-center shadow-[0_20px_60px_rgba(23,62,55,0.08)]">
            {/* ICON */}
            <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E8EFEC]">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#173E37] text-white shadow-lg shadow-[#173E37]/15">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-center gap-2">
              <div className="h-[3px] w-6 rounded-full bg-[#C79B4B]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8151]">
                Satu langkah lagi
              </span>

              <div className="h-[3px] w-6 rounded-full bg-[#C79B4B]" />
            </div>

            <h1 className="text-[25px] font-semibold tracking-[-0.03em] text-[#173E37]">
              Cek email kamu
            </h1>

            <p className="mx-auto mt-3 max-w-[340px] text-[13px] leading-6 text-[#7C8481]">
              Kami sudah mengirimkan link verifikasi ke
            </p>

            <div className="mx-auto mt-3 max-w-[340px] break-all rounded-xl border border-[#E4E7E2] bg-[#F7F8F5] px-4 py-3 text-[12px] font-semibold text-[#173E37]">
              {email}
            </div>

            <p className="mx-auto mt-4 max-w-[350px] text-[12px] leading-5 text-[#929996]">
              Klik link di email tersebut untuk mengaktifkan akun Ruang Proyek
              sebelum masuk ke dashboard.
            </p>

            <Link
              href="/login"
              className="
                mt-7
                flex
                h-[48px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#173E37]
                text-[13px]
                font-semibold
                text-white
                shadow-[0_8px_24px_rgba(23,62,55,0.15)]
                transition-all
                hover:-translate-y-[1px]
                hover:bg-[#1D4B43]
              "
            >
              Kembali ke Login

              <svg
                width="15"
                height="15"
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
      </main>
    );
  }

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#F5F5F0]">
        {/* =====================================================
            BACKGROUND
        ====================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#173E37]/[0.035] blur-3xl" />

          <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#C79B4B]/[0.06] blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
                linear-gradient(#173E37 1px, transparent 1px),
                linear-gradient(90deg, #173E37 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
          {/* =====================================================
              LEFT
          ====================================================== */}

          <section className="relative hidden overflow-hidden bg-[#173E37] lg:flex lg:flex-col">
            {/* GRID */}
            <div
              className="absolute inset-0 opacity-[0.055]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* GLOW */}
            <div className="absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[#C79B4B]/10 blur-[110px]" />

            {/* LOGO */}
            <div className="relative z-10 flex items-center px-12 pt-10">
              <div className="rounded-2xl bg-white p-2 shadow-lg shadow-black/10">
                <img
                  src="/logo.jpg"
                  alt="Ruang Proyek"
                  className="h-12 w-auto object-contain"
                />
              </div>
            </div>

            {/* HERO */}
            <div className="relative z-10 mx-auto mt-auto w-full max-w-[620px] px-12">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AC60] opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AC60]" />
                </span>

                <span className="text-[11px] font-medium tracking-wide text-white/70">
                  START YOUR WORKSPACE
                </span>
              </div>

              <h1 className="max-w-[520px] text-[42px] font-semibold leading-[1.08] tracking-[-0.04em] text-white">
                Mulai proyekmu.
                <br />
                Atur semuanya{" "}
                <span className="text-[#D4AC60]">lebih rapi.</span>
              </h1>

              <p className="mt-5 max-w-[470px] text-[14px] leading-6 text-white/55">
                Bangun workspace untuk mengelola produk, order, pelanggan,
                follow up, dan tim dalam satu tempat.
              </p>
            </div>

            {/* =====================================================
                PIXEL PROJECT ANIMATION
            ====================================================== */}

            <div className="relative z-10 mt-10 h-[225px] w-full overflow-hidden">
              {/* CLOUD */}
              <div className="reg-cloud reg-cloud-one">
                <span />
                <span />
                <span />
              </div>

              <div className="reg-cloud reg-cloud-two">
                <span />
                <span />
                <span />
              </div>

              {/* COINS */}
              <div className="reg-coin reg-coin-one">★</div>
              <div className="reg-coin reg-coin-two">★</div>
              <div className="reg-coin reg-coin-three">★</div>

              {/* DEV CHARACTER */}
              <div className="reg-dev">
                <div className="reg-dev-shadow" />

                <div className="reg-dev-character">
                  <div className="reg-dev-head">
                    <div className="reg-dev-hat">
                      <span>R</span>
                    </div>

                    <div className="reg-dev-face">
                      <div className="reg-dev-eye" />
                      <div className="reg-dev-nose" />
                    </div>
                  </div>

                  <div className="reg-dev-body">
                    <div className="reg-dev-arm reg-dev-arm-left" />
                    <div className="reg-dev-arm reg-dev-arm-right" />
                  </div>

                  <div className="reg-dev-leg reg-dev-leg-left" />
                  <div className="reg-dev-leg reg-dev-leg-right" />
                </div>

                <div className="reg-dev-label">
                  YOU
                </div>
              </div>

              {/* PROJECT BOARD */}
              <div className="project-board">
                <div className="project-board-top">
                  NEW PROJECT
                </div>

                <div className="project-board-content">
                  <div className="project-task project-task-done">
                    <span>✓</span>
                    Setup
                  </div>

                  <div className="project-task">
                    <span />
                    Product
                  </div>

                  <div className="project-task">
                    <span />
                    Order
                  </div>

                  <div className="project-task">
                    <span />
                    Launch
                  </div>
                </div>

                <div className="project-progress">
                  <div />
                </div>
              </div>

              {/* PLUS */}
              <div className="floating-plus plus-one">+</div>
              <div className="floating-plus plus-two">+</div>

              {/* STATUS */}
              <div className="absolute bottom-[67px] left-12 flex items-center gap-2 text-[9px] font-semibold tracking-[0.18em] text-white/35">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D4AC60]" />
                CREATING NEW PROJECT...
              </div>

              {/* GROUND */}
              <div className="absolute bottom-0 left-0 right-0 h-[55px]">
                <div className="absolute left-0 right-0 top-0 h-[4px] bg-[#C79B4B]" />

                <div className="reg-ground-grass absolute left-0 right-0 top-[4px] h-[7px]" />

                <div
                  className="reg-moving-ground absolute bottom-0 left-0 right-0 top-[11px]"
                  style={{
                    backgroundImage: `
                      linear-gradient(
                        90deg,
                        rgba(255,255,255,.055) 1px,
                        transparent 1px
                      )
                    `,
                    backgroundSize: "34px 100%",
                  }}
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              RIGHT / REGISTER
          ====================================================== */}

          <section className="relative flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
            <div className="w-full max-w-[420px]">
              {/* MOBILE LOGO */}
              <div className="mb-8 flex justify-center lg:hidden">
                <div className="rounded-2xl border border-[#E5E5DE] bg-white p-3 shadow-sm">
                  <img
                    src="/logo.jpg"
                    alt="Ruang Proyek"
                    className="h-14 w-auto object-contain"
                  />
                </div>
              </div>

              {/* HEADING */}
              <div className="mb-7">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-[3px] w-7 rounded-full bg-[#C79B4B]" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A7A58]">
                    Get started
                  </span>
                </div>

                <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#173E37]">
                  Buat akun Ruang Proyek
                </h1>

                <p className="mt-2 text-[13px] leading-5 text-[#7C8481]">
                  Buat akun untuk mulai mengelola produk dan proyek kamu.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#F1D5D1] bg-[#FFF5F3] px-4 py-3">
                  <div className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B54237] text-[11px] font-bold text-white">
                    !
                  </div>

                  <p className="text-[12px] leading-5 text-[#9E3E35]">
                    {error}
                  </p>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleRegister} className="space-y-4">
                {/* NAME */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[12px] font-semibold text-[#374844]"
                  >
                    Nama Lengkap
                  </label>

                  <div className="group relative">
                    <InputIcon>
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>
                    </InputIcon>

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap kamu"
                      autoComplete="name"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[12px] font-semibold text-[#374844]"
                  >
                    Nomor Telepon
                  </label>

                  <div className="group relative">
                    <InputIcon>
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                      </svg>
                    </InputIcon>

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      autoComplete="tel"
                      inputMode="tel"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[12px] font-semibold text-[#374844]"
                  >
                    Email
                  </label>

                  <div className="group relative">
                    <InputIcon>
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </InputIcon>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      autoComplete="email"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-[12px] font-semibold text-[#374844]"
                    >
                      Password
                    </label>

                    {password.length > 0 && (
                      <span
                        className="text-[10px] font-semibold"
                        style={{
                          color: passwordStrength.color,
                        }}
                      >
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>

                  <div className="group relative">
                    <InputIcon>
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="5" y="10" width="14" height="10" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </InputIcon>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#929A97] transition-colors hover:text-[#173E37]"
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m3 3 18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5 9 8a8.6 8.6 0 0 1-2 3.7" />
                          <path d="M6.6 6.6C4.4 8 3 10.2 3 12c0 3 3.5 8 9 8a10 10 0 0 0 4-.8" />
                        </svg>
                      ) : (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* PASSWORD STRENGTH */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className="h-[3px] flex-1 rounded-full transition-all"
                            style={{
                              backgroundColor:
                                level <= passwordStrength.level
                                  ? passwordStrength.color
                                  : "#E4E6E2",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    relative
                    mt-1
                    flex
                    h-[50px]
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    bg-[#173E37]
                    text-[13px]
                    font-semibold
                    text-white
                    shadow-[0_8px_24px_rgba(23,62,55,0.16)]
                    transition-all
                    duration-200
                    hover:-translate-y-[1px]
                    hover:bg-[#1D4B43]
                    hover:shadow-[0_10px_28px_rgba(23,62,55,0.22)]
                    active:translate-y-0
                    disabled:pointer-events-none
                    disabled:opacity-60
                  "
                >
                  <span className="absolute inset-y-0 left-0 w-[3px] bg-[#C79B4B]" />

                  {loading ? (
                    <span className="flex items-center gap-2.5">
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
                          opacity="0.25"
                        />

                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>

                      Membuat akun...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Buat Akun

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
                    </span>
                  )}
                </button>

                {/* LOGIN */}
                <p className="pt-1 text-center text-[12px] text-[#7C8481]">
                  Sudah punya akun?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[#173E37] underline decoration-[#C79B4B] decoration-2 underline-offset-4 transition-colors hover:text-[#C79B4B]"
                  >
                    Masuk
                  </Link>
                </p>
              </form>

              {/* SECURITY */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#9AA19F]">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>

                <span>
                  Secure authentication powered by Supabase
                </span>
              </div>

              <p className="mt-7 text-center text-[10px] text-[#B0B5B3]">
                © {new Date().getFullYear()} Ruang Proyek
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* =====================================================
          ANIMATION CSS
      ====================================================== */}

      <style jsx global>{`
        .reg-dev {
          position: absolute;
          left: 16%;
          bottom: 50px;
          width: 80px;
          height: 100px;
          animation: regDevMove 3.2s ease-in-out infinite;
          z-index: 5;
        }

        .reg-dev-character {
          position: absolute;
          left: 12px;
          bottom: 13px;
          width: 50px;
          height: 75px;
          animation: regDevBounce 0.24s ease-in-out infinite alternate;
        }

        .reg-dev-shadow {
          position: absolute;
          left: 11px;
          bottom: 7px;
          width: 52px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.24);
          animation: regShadow 0.24s ease-in-out infinite alternate;
        }

        .reg-dev-head {
          position: absolute;
          left: 9px;
          top: 0;
          width: 32px;
          height: 31px;
        }

        .reg-dev-hat {
          position: absolute;
          left: 0;
          top: 0;
          width: 32px;
          height: 11px;
          border-radius: 6px 6px 2px 2px;
          background: #c79b4b;
          z-index: 3;
        }

        .reg-dev-hat::after {
          content: "";
          position: absolute;
          right: -7px;
          bottom: 0;
          width: 14px;
          height: 4px;
          border-radius: 2px;
          background: #c79b4b;
        }

        .reg-dev-hat span {
          position: absolute;
          left: 12px;
          top: 1px;
          color: #173e37;
          font-size: 7px;
          font-weight: 900;
        }

        .reg-dev-face {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 25px;
          height: 22px;
          border-radius: 3px 6px 6px 4px;
          background: #e7ad78;
        }

        .reg-dev-eye {
          position: absolute;
          right: 4px;
          top: 5px;
          width: 3px;
          height: 4px;
          border-radius: 2px;
          background: #173e37;
        }

        .reg-dev-nose {
          position: absolute;
          right: -4px;
          top: 9px;
          width: 8px;
          height: 7px;
          border-radius: 50%;
          background: #e7ad78;
        }

        .reg-dev-body {
          position: absolute;
          left: 10px;
          top: 30px;
          width: 30px;
          height: 28px;
          border-radius: 5px;
          background: #f0eee6;
        }

        .reg-dev-body::after {
          content: "";
          position: absolute;
          left: 5px;
          right: 5px;
          bottom: -2px;
          height: 15px;
          border-radius: 3px;
          background: #3d7468;
        }

        .reg-dev-arm {
          position: absolute;
          top: 3px;
          width: 8px;
          height: 23px;
          border-radius: 4px;
          background: #e7ad78;
          transform-origin: top center;
        }

        .reg-dev-arm-left {
          left: -5px;
          animation: regArmLeft 0.24s linear infinite alternate;
        }

        .reg-dev-arm-right {
          right: -5px;
          animation: regArmRight 0.24s linear infinite alternate;
        }

        .reg-dev-leg {
          position: absolute;
          top: 56px;
          width: 9px;
          height: 20px;
          border-radius: 3px;
          background: #263a36;
          transform-origin: top center;
        }

        .reg-dev-leg::after {
          content: "";
          position: absolute;
          left: -2px;
          bottom: -2px;
          width: 15px;
          height: 6px;
          border-radius: 2px;
          background: #c79b4b;
        }

        .reg-dev-leg-left {
          left: 11px;
          animation: regLegLeft 0.24s linear infinite alternate;
        }

        .reg-dev-leg-right {
          right: 10px;
          animation: regLegRight 0.24s linear infinite alternate;
        }

        .reg-dev-label {
          position: absolute;
          left: 50%;
          top: -7px;
          transform: translateX(-50%);
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.2);
          padding: 3px 7px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        /* PROJECT BOARD */

        .project-board {
          position: absolute;
          right: 14%;
          bottom: 67px;
          width: 125px;
          height: 115px;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.16);
          border-radius: 9px;
          background: #f5f3e9;
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.18);
          animation: projectBoardFloat 2s ease-in-out infinite alternate;
        }

        .project-board-top {
          height: 25px;
          background: #c79b4b;
          color: #173e37;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          padding: 0 9px;
        }

        .project-board-content {
          padding: 8px 9px 4px;
        }

        .project-task {
          display: flex;
          align-items: center;
          gap: 5px;
          height: 16px;
          color: #7b817d;
          font-size: 7px;
          font-weight: 700;
        }

        .project-task > span {
          display: flex;
          width: 9px;
          height: 9px;
          align-items: center;
          justify-content: center;
          border: 1px solid #bfc3bb;
          border-radius: 2px;
          font-size: 6px;
        }

        .project-task-done {
          color: #3d7468;
        }

        .project-task-done > span {
          border-color: #3d7468;
          background: #3d7468;
          color: white;
        }

        .project-progress {
          position: absolute;
          left: 9px;
          right: 9px;
          bottom: 8px;
          height: 4px;
          overflow: hidden;
          border-radius: 4px;
          background: #e3e2dc;
        }

        .project-progress div {
          width: 42%;
          height: 100%;
          border-radius: inherit;
          background: #3d7468;
          animation: projectProgress 3s ease-in-out infinite alternate;
        }

        /* COINS */

        .reg-coin {
          position: absolute;
          display: flex;
          width: 21px;
          height: 21px;
          align-items: center;
          justify-content: center;
          border: 2px solid #f0cb7b;
          border-radius: 50%;
          background: #c79b4b;
          color: #fff4d1;
          font-size: 8px;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
          animation:
            regCoinFloat 0.8s ease-in-out infinite alternate,
            regCoinSpin 1.6s linear infinite;
        }

        .reg-coin-one {
          left: 43%;
          bottom: 125px;
        }

        .reg-coin-two {
          left: 49%;
          bottom: 148px;
          animation-delay: 0.2s;
        }

        .reg-coin-three {
          left: 55%;
          bottom: 127px;
          animation-delay: 0.4s;
        }

        /* PLUS */

        .floating-plus {
          position: absolute;
          color: rgba(212, 172, 96, 0.45);
          font-weight: 300;
          animation: plusFloat 1.8s ease-in-out infinite alternate;
        }

        .plus-one {
          left: 62%;
          top: 38px;
          font-size: 20px;
        }

        .plus-two {
          right: 8%;
          top: 58px;
          font-size: 13px;
          animation-delay: 0.4s;
        }

        /* CLOUD */

        .reg-cloud {
          position: absolute;
          height: 20px;
          opacity: 0.08;
          animation: regCloudMove 13s linear infinite;
        }

        .reg-cloud span {
          position: absolute;
          bottom: 0;
          display: block;
          border-radius: 20px;
          background: white;
        }

        .reg-cloud span:nth-child(1) {
          left: 0;
          width: 45px;
          height: 12px;
        }

        .reg-cloud span:nth-child(2) {
          left: 11px;
          width: 22px;
          height: 22px;
        }

        .reg-cloud span:nth-child(3) {
          left: 28px;
          width: 29px;
          height: 16px;
        }

        .reg-cloud-one {
          left: 30%;
          top: 20px;
        }

        .reg-cloud-two {
          left: 75%;
          top: 42px;
          transform: scale(0.7);
          animation-delay: -6s;
        }

        /* GROUND */

        .reg-ground-grass {
          background: repeating-linear-gradient(
            90deg,
            #d4ac60 0,
            #d4ac60 7px,
            #b88a3e 7px,
            #b88a3e 13px
          );

          animation: regGroundGrass 0.35s linear infinite;
        }

        .reg-moving-ground {
          animation: regGroundMove 0.4s linear infinite;
        }

        /* ANIMATIONS */

        @keyframes regDevMove {
          0%,
          100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(38px);
          }
        }

        @keyframes regDevBounce {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(-6px);
          }
        }

        @keyframes regShadow {
          from {
            transform: scaleX(1);
            opacity: 0.25;
          }

          to {
            transform: scaleX(0.72);
            opacity: 0.14;
          }
        }

        @keyframes regArmLeft {
          from {
            transform: rotate(38deg);
          }

          to {
            transform: rotate(-38deg);
          }
        }

        @keyframes regArmRight {
          from {
            transform: rotate(-38deg);
          }

          to {
            transform: rotate(38deg);
          }
        }

        @keyframes regLegLeft {
          from {
            transform: rotate(32deg);
          }

          to {
            transform: rotate(-32deg);
          }
        }

        @keyframes regLegRight {
          from {
            transform: rotate(-32deg);
          }

          to {
            transform: rotate(32deg);
          }
        }

        @keyframes projectBoardFloat {
          from {
            transform: translateY(0) rotate(-1deg);
          }

          to {
            transform: translateY(-7px) rotate(1deg);
          }
        }

        @keyframes projectProgress {
          from {
            width: 30%;
          }

          to {
            width: 82%;
          }
        }

        @keyframes regCoinFloat {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(-7px);
          }
        }

        @keyframes regCoinSpin {
          from {
            rotate: 0deg;
          }

          to {
            rotate: 360deg;
          }
        }

        @keyframes plusFloat {
          from {
            transform: translateY(0) rotate(0);
          }

          to {
            transform: translateY(-10px) rotate(12deg);
          }
        }

        @keyframes regGroundMove {
          from {
            background-position-x: 0;
          }

          to {
            background-position-x: -34px;
          }
        }

        @keyframes regGroundGrass {
          from {
            background-position-x: 0;
          }

          to {
            background-position-x: -13px;
          }
        }

        @keyframes regCloudMove {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-170px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .reg-dev,
          .reg-dev-character,
          .reg-dev-arm,
          .reg-dev-leg,
          .project-board,
          .project-progress div,
          .reg-coin,
          .floating-plus,
          .reg-cloud,
          .reg-moving-ground,
          .reg-ground-grass {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

/* =========================================================
   REUSABLE INPUT PART
========================================================== */

const inputClass = `
  h-[48px]
  w-full
  rounded-xl
  border
  border-[#DFE1DC]
  bg-white
  pl-11
  pr-4
  text-[13px]
  text-[#263A36]
  outline-none
  transition-all
  placeholder:text-[#B3B8B6]
  hover:border-[#C9CECA]
  focus:border-[#52746D]
  focus:ring-4
  focus:ring-[#173E37]/[0.07]
`;

function InputIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-[#9AA19F] transition-colors group-focus-within:text-[#173E37]">
      {children}
    </div>
  );
}