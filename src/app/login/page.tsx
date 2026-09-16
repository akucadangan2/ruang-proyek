"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
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

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#F5F5F0]">
        {/* BACKGROUND */}
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
                  RUANG PROYEK WORKSPACE
                </span>
              </div>

              <h1 className="max-w-[540px] text-[42px] font-semibold leading-[1.08] tracking-[-0.04em] text-white">
                Kelola pekerjaan
                <br />
                sebelum{" "}
                <span className="text-[#D4AC60]">deadline mengejar.</span>
              </h1>

              <p className="mt-5 max-w-[470px] text-[14px] leading-6 text-white/55">
                Produk, order, tracking, follow up, dan tim tersusun dalam satu
                dashboard untuk membantu proyek tetap terkontrol.
              </p>
            </div>

            {/* =====================================================
                PIXEL GAME
            ====================================================== */}

            <div className="relative z-10 mt-10 h-[225px] w-full overflow-hidden">
              {/* CLOUD */}
              <div className="game-cloud cloud-one">
                <span />
                <span />
                <span />
              </div>

              <div className="game-cloud cloud-two">
                <span />
                <span />
                <span />
              </div>

              {/* QUESTION BLOCK */}
              <div className="question-block">?</div>

              {/* COINS */}
              <div className="coin coin-one">★</div>
              <div className="coin coin-two">★</div>

              {/* =========================
                  MARIO STYLE RUNNER
              ========================== */}

              <div className="mario">
                <div className="mario-shadow" />

                <div className="mario-character">
                  {/* HEAD */}
                  <div className="mario-head">
                    <div className="mario-hat">
                      <span>M</span>
                    </div>

                    <div className="mario-hair" />

                    <div className="mario-face">
                      <div className="mario-eye" />
                      <div className="mario-nose" />
                      <div className="mario-mustache" />
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="mario-body">
                    <div className="mario-shirt" />

                    <div className="mario-overall">
                      <span className="overall-button button-left" />
                      <span className="overall-button button-right" />
                    </div>

                    <div className="mario-arm mario-arm-left">
                      <span />
                    </div>

                    <div className="mario-arm mario-arm-right">
                      <span />
                    </div>
                  </div>

                  {/* LEGS */}
                  <div className="mario-leg mario-leg-left">
                    <span />
                  </div>

                  <div className="mario-leg mario-leg-right">
                    <span />
                  </div>
                </div>

                <div className="mario-name">DEV</div>
              </div>

              {/* =========================
                  DEADLINE
              ========================== */}

              <div className="deadline">
                <div className="deadline-shadow" />

                <div className="deadline-paper">
                  <div className="deadline-top">
                    <span />
                    <span />
                  </div>

                  <div className="deadline-face">
                    <span className="deadline-eye deadline-eye-left" />
                    <span className="deadline-eye deadline-eye-right" />

                    <div className="deadline-mouth" />
                  </div>

                  <div className="deadline-lines">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="deadline-stamp">
                    DUE
                  </div>
                </div>

                <div className="deadline-leg deadline-leg-left" />
                <div className="deadline-leg deadline-leg-right" />

                <div className="deadline-label">
                  DEADLINE
                </div>
              </div>

              {/* SPEED LINES */}
              <div className="speed-line speed-line-one" />
              <div className="speed-line speed-line-two" />
              <div className="speed-line speed-line-three" />

              {/* STATUS */}
              <div className="absolute bottom-[67px] left-12 flex items-center gap-2 text-[9px] font-semibold tracking-[0.18em] text-white/35">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D4AC60]" />
                CHASING PROJECT DEADLINE...
              </div>

              {/* GROUND */}
              <div className="absolute bottom-0 left-0 right-0 h-[55px]">
                <div className="absolute left-0 right-0 top-0 h-[4px] bg-[#C79B4B]" />

                <div className="ground-grass absolute left-0 right-0 top-[4px] h-[7px]" />

                <div
                  className="moving-ground absolute bottom-0 left-0 right-0 top-[11px]"
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
              RIGHT / LOGIN
          ====================================================== */}

          <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
            <div className="w-full max-w-[420px]">
              {/* MOBILE LOGO */}
              <div className="mb-10 flex justify-center lg:hidden">
                <div className="rounded-2xl border border-[#E5E5DE] bg-white p-3 shadow-sm">
                  <img
                    src="/logo.jpg"
                    alt="Ruang Proyek"
                    className="h-14 w-auto object-contain"
                  />
                </div>
              </div>

              {/* HEADING */}
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-[3px] w-7 rounded-full bg-[#C79B4B]" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A7A58]">
                    Welcome back
                  </span>
                </div>

                <h2 className="text-[30px] font-semibold tracking-[-0.035em] text-[#173E37]">
                  Masuk ke Ruang Proyek
                </h2>

                <p className="mt-2 text-[13px] leading-5 text-[#7C8481]">
                  Masukkan email dan password untuk melanjutkan ke dashboard.
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
              <form onSubmit={handleLogin} className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[12px] font-semibold text-[#374844]"
                  >
                    Email
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-[#9AA19F] transition-colors group-focus-within:text-[#173E37]">
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
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />

                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </div>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      autoComplete="email"
                      required
                      className="
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
                      "
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[12px] font-semibold text-[#374844]"
                  >
                    Password
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-[#9AA19F] transition-colors group-focus-within:text-[#173E37]">
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
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                        />

                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      required
                      className="
                        h-[48px]
                        w-full
                        rounded-xl
                        border
                        border-[#DFE1DC]
                        bg-white
                        pl-11
                        pr-12
                        text-[13px]
                        text-[#263A36]
                        outline-none
                        transition-all
                        placeholder:text-[#B3B8B6]
                        hover:border-[#C9CECA]
                        focus:border-[#52746D]
                        focus:ring-4
                        focus:ring-[#173E37]/[0.07]
                      "
                    />

                    {/* SHOW PASSWORD */}
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
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    relative
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

                      Memverifikasi...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Masuk ke Dashboard

                      <svg
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
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

                {/* =========================
                    REGISTER
                ========================== */}

                <p className="pt-1 text-center text-[12px] text-[#7C8481]">
                  Belum punya akun?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-[#173E37] underline decoration-[#C79B4B] decoration-2 underline-offset-4 transition-colors hover:text-[#C79B4B]"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </form>

              {/* SECURITY */}
              <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-[#9AA19F]">
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

              <p className="mt-10 text-center text-[10px] text-[#B0B5B3]">
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
        /* ==============================================
           MARIO
        =============================================== */

        .mario {
          position: absolute;
          left: 15%;
          bottom: 50px;
          width: 90px;
          height: 105px;
          animation: marioChase 3s ease-in-out infinite;
          z-index: 5;
        }

        .mario-character {
          position: absolute;
          left: 15px;
          bottom: 13px;
          width: 56px;
          height: 82px;
          animation: marioBounce 0.22s ease-in-out infinite alternate;
        }

        .mario-shadow {
          position: absolute;
          left: 14px;
          bottom: 7px;
          width: 58px;
          height: 9px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.25);
          animation: shadowPulse 0.22s ease-in-out infinite alternate;
        }

        /* HEAD */

        .mario-head {
          position: absolute;
          left: 11px;
          top: 0;
          width: 36px;
          height: 34px;
        }

        .mario-hat {
          position: absolute;
          left: 0;
          top: 0;
          width: 35px;
          height: 12px;
          border-radius: 7px 7px 2px 2px;
          background: #c9473c;
          z-index: 4;
        }

        .mario-hat::after {
          content: "";
          position: absolute;
          right: -8px;
          bottom: 0;
          width: 16px;
          height: 5px;
          border-radius: 2px;
          background: #c9473c;
        }

        .mario-hat span {
          position: absolute;
          left: 13px;
          top: 1px;
          color: white;
          font-size: 7px;
          font-weight: 900;
        }

        .mario-hair {
          position: absolute;
          left: 1px;
          top: 10px;
          width: 10px;
          height: 18px;
          border-radius: 4px;
          background: #563425;
          z-index: 2;
        }

        .mario-face {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 29px;
          height: 24px;
          border-radius: 3px 7px 7px 4px;
          background: #e7ad78;
          z-index: 3;
        }

        .mario-eye {
          position: absolute;
          right: 5px;
          top: 5px;
          width: 4px;
          height: 5px;
          border-radius: 2px;
          background: #182f2b;
        }

        .mario-nose {
          position: absolute;
          right: -5px;
          top: 10px;
          width: 10px;
          height: 8px;
          border-radius: 50%;
          background: #e7ad78;
        }

        .mario-mustache {
          position: absolute;
          right: 1px;
          bottom: 4px;
          width: 13px;
          height: 5px;
          border-radius: 5px 5px 3px 3px;
          background: #563425;
        }

        /* BODY */

        .mario-body {
          position: absolute;
          left: 12px;
          top: 33px;
          width: 34px;
          height: 31px;
        }

        .mario-shirt {
          position: absolute;
          inset: 0;
          border-radius: 5px;
          background: #c9473c;
        }

        .mario-overall {
          position: absolute;
          left: 6px;
          right: 5px;
          top: 8px;
          bottom: -2px;
          border-radius: 4px;
          background: #315f88;
          z-index: 2;
        }

        .mario-overall::before,
        .mario-overall::after {
          content: "";
          position: absolute;
          top: -8px;
          width: 5px;
          height: 13px;
          background: #315f88;
        }

        .mario-overall::before {
          left: 3px;
        }

        .mario-overall::after {
          right: 3px;
        }

        .overall-button {
          position: absolute;
          top: 3px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #e4b652;
        }

        .button-left {
          left: 3px;
        }

        .button-right {
          right: 3px;
        }

        /* ARMS */

        .mario-arm {
          position: absolute;
          top: 3px;
          width: 9px;
          height: 25px;
          border-radius: 5px;
          background: #c9473c;
          transform-origin: top center;
        }

        .mario-arm span {
          position: absolute;
          bottom: -4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #f1f0e9;
        }

        .mario-arm-left {
          left: -6px;
          animation: marioArmLeft 0.22s linear infinite alternate;
        }

        .mario-arm-right {
          right: -7px;
          animation: marioArmRight 0.22s linear infinite alternate;
        }

        /* LEGS */

        .mario-leg {
          position: absolute;
          top: 61px;
          width: 11px;
          height: 22px;
          border-radius: 3px;
          background: #315f88;
          transform-origin: top center;
        }

        .mario-leg span {
          position: absolute;
          bottom: -3px;
          width: 18px;
          height: 8px;
          border-radius: 3px;
          background: #563425;
        }

        .mario-leg-left {
          left: 13px;
          animation: marioLegLeft 0.22s linear infinite alternate;
        }

        .mario-leg-right {
          right: 11px;
          animation: marioLegRight 0.22s linear infinite alternate;
        }

        .mario-name {
          position: absolute;
          left: 50%;
          top: -8px;
          transform: translateX(-50%);
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.2);
          padding: 3px 7px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        /* ==============================================
           DEADLINE
        =============================================== */

        .deadline {
          position: absolute;
          right: 16%;
          bottom: 49px;
          width: 95px;
          height: 105px;
          animation: deadlineRun 2.2s ease-in-out infinite;
          z-index: 4;
        }

        .deadline-paper {
          position: absolute;
          left: 17px;
          top: 9px;
          width: 60px;
          height: 70px;
          border-radius: 5px;
          border: 3px solid #ded9ca;
          background: #f5f0df;
          box-shadow:
            inset -5px -5px 0 rgba(0, 0, 0, 0.05),
            0 8px 18px rgba(0, 0, 0, 0.16);

          animation: deadlineBounce 0.27s ease-in-out infinite alternate;
        }

        .deadline-top {
          position: absolute;
          left: 7px;
          right: 7px;
          top: -8px;
          display: flex;
          justify-content: space-between;
        }

        .deadline-top span {
          width: 5px;
          height: 13px;
          border-radius: 3px;
          background: #c79b4b;
        }

        .deadline-lines {
          position: absolute;
          left: 9px;
          top: 12px;
          width: 24px;
        }

        .deadline-lines span {
          display: block;
          height: 3px;
          margin-bottom: 4px;
          border-radius: 2px;
          background: #b9b39f;
        }

        .deadline-lines span:nth-child(2) {
          width: 18px;
        }

        .deadline-lines span:nth-child(3) {
          width: 21px;
        }

        .deadline-face {
          position: absolute;
          left: 8px;
          right: 8px;
          bottom: 11px;
          height: 21px;
        }

        .deadline-eye {
          position: absolute;
          top: 2px;
          width: 5px;
          height: 6px;
          border-radius: 2px;
          background: #173e37;
        }

        .deadline-eye-left {
          left: 8px;
        }

        .deadline-eye-right {
          right: 8px;
        }

        .deadline-mouth {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 14px;
          height: 7px;
          transform: translateX(-50%);
          border-radius: 7px 7px 2px 2px;
          background: #c9473c;
        }

        .deadline-stamp {
          position: absolute;
          right: 3px;
          top: 27px;
          transform: rotate(-10deg);
          border: 1px solid #c9473c;
          padding: 1px 3px;
          color: #c9473c;
          font-size: 6px;
          font-weight: 900;
        }

        .deadline-shadow {
          position: absolute;
          left: 18px;
          bottom: 6px;
          width: 59px;
          height: 9px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.23);
        }

        .deadline-leg {
          position: absolute;
          bottom: 12px;
          width: 7px;
          height: 21px;
          border-radius: 4px;
          background: #ded9ca;
          transform-origin: top center;
        }

        .deadline-leg::after {
          content: "";
          position: absolute;
          bottom: -2px;
          width: 13px;
          height: 5px;
          border-radius: 3px;
          background: #c9473c;
        }

        .deadline-leg-left {
          left: 31px;
          animation: deadlineLegLeft 0.22s linear infinite alternate;
        }

        .deadline-leg-right {
          right: 31px;
          animation: deadlineLegRight 0.22s linear infinite alternate;
        }

        .deadline-label {
          position: absolute;
          left: 50%;
          top: -9px;
          transform: translateX(-50%);
          border-radius: 5px;
          background: #c9473c;
          padding: 4px 7px;
          color: white;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }

        /* ==============================================
           QUESTION BLOCK
        =============================================== */

        .question-block {
          position: absolute;
          left: 53%;
          bottom: 125px;
          display: flex;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          border: 3px solid #e4b652;
          border-radius: 3px;
          background: #c79b4b;
          color: #fff7dc;
          font-size: 18px;
          font-weight: 900;
          box-shadow:
            inset -4px -4px 0 rgba(0, 0, 0, 0.1),
            0 5px 12px rgba(0, 0, 0, 0.15);

          animation: questionFloat 1.3s ease-in-out infinite alternate;
        }

        /* ==============================================
           COINS
        =============================================== */

        .coin {
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
            coinFloat 0.8s ease-in-out infinite alternate,
            coinSpin 1.5s linear infinite;
        }

        .coin-one {
          left: 43%;
          bottom: 135px;
        }

        .coin-two {
          left: 47%;
          bottom: 153px;
          animation-delay: 0.2s;
        }

        /* ==============================================
           SPEED LINES
        =============================================== */

        .speed-line {
          position: absolute;
          height: 2px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.1);
          animation: speedLine 1s linear infinite;
        }

        .speed-line-one {
          left: 8%;
          bottom: 115px;
          width: 35px;
        }

        .speed-line-two {
          left: 4%;
          bottom: 137px;
          width: 20px;
          animation-delay: -0.3s;
        }

        .speed-line-three {
          left: 27%;
          bottom: 155px;
          width: 28px;
          animation-delay: -0.6s;
        }

        /* ==============================================
           CLOUDS
        =============================================== */

        .game-cloud {
          position: absolute;
          height: 20px;
          opacity: 0.08;
          animation: cloudMove 13s linear infinite;
        }

        .game-cloud span {
          position: absolute;
          bottom: 0;
          display: block;
          border-radius: 20px;
          background: white;
        }

        .game-cloud span:nth-child(1) {
          left: 0;
          width: 45px;
          height: 12px;
        }

        .game-cloud span:nth-child(2) {
          left: 11px;
          width: 22px;
          height: 22px;
        }

        .game-cloud span:nth-child(3) {
          left: 28px;
          width: 29px;
          height: 16px;
        }

        .cloud-one {
          left: 30%;
          top: 20px;
        }

        .cloud-two {
          left: 75%;
          top: 48px;
          transform: scale(0.7);
          animation-delay: -6s;
        }

        /* ==============================================
           GROUND
        =============================================== */

        .ground-grass {
          background: repeating-linear-gradient(
            90deg,
            #d4ac60 0,
            #d4ac60 7px,
            #b88a3e 7px,
            #b88a3e 13px
          );
          animation: groundGrass 0.35s linear infinite;
        }

        .moving-ground {
          animation: groundMove 0.4s linear infinite;
        }

        /* ==============================================
           ANIMATIONS
        =============================================== */

        @keyframes marioChase {
          0%,
          100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(38px);
          }
        }

        @keyframes marioBounce {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(-6px);
          }
        }

        @keyframes shadowPulse {
          from {
            transform: scaleX(1);
            opacity: 0.25;
          }

          to {
            transform: scaleX(0.72);
            opacity: 0.14;
          }
        }

        @keyframes marioArmLeft {
          from {
            transform: rotate(40deg);
          }

          to {
            transform: rotate(-45deg);
          }
        }

        @keyframes marioArmRight {
          from {
            transform: rotate(-45deg);
          }

          to {
            transform: rotate(40deg);
          }
        }

        @keyframes marioLegLeft {
          from {
            transform: rotate(32deg);
          }

          to {
            transform: rotate(-35deg);
          }
        }

        @keyframes marioLegRight {
          from {
            transform: rotate(-35deg);
          }

          to {
            transform: rotate(32deg);
          }
        }

        @keyframes deadlineRun {
          0%,
          100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(25px);
          }
        }

        @keyframes deadlineBounce {
          from {
            transform: translateY(0) rotate(-2deg);
          }

          to {
            transform: translateY(-7px) rotate(2deg);
          }
        }

        @keyframes deadlineLegLeft {
          from {
            transform: rotate(30deg);
          }

          to {
            transform: rotate(-30deg);
          }
        }

        @keyframes deadlineLegRight {
          from {
            transform: rotate(-30deg);
          }

          to {
            transform: rotate(30deg);
          }
        }

        @keyframes questionFloat {
          from {
            transform: translateY(0) rotate(-2deg);
          }

          to {
            transform: translateY(-8px) rotate(2deg);
          }
        }

        @keyframes coinFloat {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(-7px);
          }
        }

        @keyframes coinSpin {
          from {
            rotate: 0deg;
          }

          to {
            rotate: 360deg;
          }
        }

        @keyframes speedLine {
          from {
            transform: translateX(40px);
            opacity: 0;
          }

          40% {
            opacity: 1;
          }

          to {
            transform: translateX(-40px);
            opacity: 0;
          }
        }

        @keyframes groundMove {
          from {
            background-position-x: 0;
          }

          to {
            background-position-x: -34px;
          }
        }

        @keyframes groundGrass {
          from {
            background-position-x: 0;
          }

          to {
            background-position-x: -13px;
          }
        }

        @keyframes cloudMove {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-170px);
          }
        }

        /* ACCESSIBILITY */

        @media (prefers-reduced-motion: reduce) {
          .mario,
          .mario-character,
          .mario-arm,
          .mario-leg,
          .deadline,
          .deadline-paper,
          .deadline-leg,
          .coin,
          .question-block,
          .game-cloud,
          .moving-ground,
          .ground-grass,
          .speed-line {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}