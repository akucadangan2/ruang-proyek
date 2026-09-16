"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IconGrid,
  IconPackage,
  IconReceipt,
  IconUsers,
  IconTarget,
  IconZap,
  IconFileText,
  IconBell,
  IconChevronLeft,
  IconChevronRight,
} from "@/components/ui/icons";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    Icon: IconGrid,
  },
  {
    href: "/products",
    label: "Produk",
    Icon: IconPackage,
  },
  {
    href: "/orders",
    label: "Order",
    Icon: IconReceipt,
  },
  {
    href: "/team",
    label: "Team",
    Icon: IconUsers,
  },
  {
    href: "/settings/tracking",
    label: "Tracking",
    Icon: IconTarget,
  },
  {
    href: "/settings/follow-up-otomatis",
    label: "Follow Up Otomatis",
    Icon: IconZap,
  },
  {
    href: "/settings/follow-up-manual",
    label: "Follow Up Manual",
    Icon: IconFileText,
  },
  {
    href: "/settings/notifications",
    label: "Notifikasi",
    Icon: IconBell,
  },
];

const STORAGE_KEY = "rk-sidebar-collapsed";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "1") {
      setCollapsed(true);
    }

    setMounted(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;

      localStorage.setItem(
        STORAGE_KEY,
        next ? "1" : "0"
      );

      return next;
    });
  }

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const { createClient } = await import(
        "@/lib/supabase/client"
      );

      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-[#F7F7F4]">
        <aside className="w-64 shrink-0 border-r border-[#E8E7E1] bg-[#FAFAF7]" />

        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F7F4]">

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        className={`
          relative
          flex
          min-h-screen
          shrink-0
          flex-col
          border-r
          border-[#E5E5DE]
          bg-[#FAFAF7]
          transition-[width]
          duration-300
          ease-in-out
          ${
            collapsed
              ? "w-[76px]"
              : "w-[260px]"
          }
        `}
      >

        {/* =========================
            LOGO
        ========================== */}
        <div
          className={`
            flex
            h-[92px]
            items-center
            border-b
            border-[#EAE9E3]
            ${
              collapsed
                ? "justify-center px-3"
                : "px-6"
            }
          `}
        >
          <img
            src="/logo.jpg"
            alt="Ruang Proyek"
            className={`
              object-contain
              transition-all
              duration-300
              ${
                collapsed
                  ? "h-[42px] w-[42px]"
                  : "h-[58px] w-auto max-w-[155px]"
              }
            `}
          />
        </div>

        {/* =========================
            NAVIGATION
        ========================== */}
        <nav
          className={`
            flex-1
            overflow-y-auto
            py-5
            ${
              collapsed
                ? "px-2"
                : "px-3"
            }
          `}
        >
          <div className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                pathname?.startsWith(
                  item.href + "/"
                );

              const Icon = item.Icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={
                    collapsed
                      ? item.label
                      : undefined
                  }
                  className={`
                    group
                    relative
                    flex
                    h-[46px]
                    items-center
                    rounded-xl
                    transition-all
                    duration-200

                    ${
                      collapsed
                        ? "justify-center px-0"
                        : "gap-3 px-3.5"
                    }

                    ${
                      active
                        ? `
                          bg-[#E8EFEC]
                          text-[#173E37]
                          shadow-[inset_0_0_0_1px_rgba(23,62,55,0.03)]
                        `
                        : `
                          text-[#737B78]
                          hover:bg-[#F0F1EC]
                          hover:text-[#243C38]
                        `
                    }
                  `}
                >

                  {/* GOLD ACTIVE INDICATOR */}
                  {active && (
                    <span
                      className="
                        absolute
                        -left-3
                        top-1/2
                        h-[26px]
                        w-[4px]
                        -translate-y-1/2
                        rounded-r-full
                        bg-[#C79B4B]
                      "
                    />
                  )}

                  {/* ICON */}
                  <span
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition-all
                      duration-200

                      ${
                        active
                          ? `
                            bg-[#173E37]
                            text-white
                            shadow-sm
                          `
                          : `
                            text-[#8A9290]
                            group-hover:text-[#173E37]
                          `
                      }
                    `}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>

                  {/* LABEL */}
                  {!collapsed && (
                    <span
                      className={`
                        whitespace-nowrap
                        text-[13.5px]
                        tracking-[-0.01em]
                        ${
                          active
                            ? "font-semibold"
                            : "font-medium"
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* =========================
            BOTTOM AREA
        ========================== */}
        <div className="border-t border-[#EAE9E3] p-3">

          {/* =========================
              LOGOUT
          ========================== */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            title={
              collapsed
                ? "Keluar"
                : undefined
            }
            className={`
              group
              mb-1
              flex
              h-[44px]
              w-full
              items-center
              rounded-xl
              text-[#7C8481]
              transition-all
              duration-200

              hover:bg-[#FCECEA]
              hover:text-[#B54237]

              disabled:pointer-events-none
              disabled:opacity-50

              ${
                collapsed
                  ? "justify-center"
                  : "gap-3 px-3"
              }
            `}
          >
            {/* Logout Icon */}
            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                transition-all
                duration-200
                group-hover:bg-[#F8DDD9]
              "
            >
              {loggingOut ? (
                <svg
                  className="h-[17px] w-[17px] animate-spin"
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
                    d="M21 12a9 9 0 00-9-9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  className="h-[18px] w-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              )}
            </span>

            {!collapsed && (
              <span className="text-[12.5px] font-medium">
                {loggingOut
                  ? "Keluar..."
                  : "Keluar"}
              </span>
            )}
          </button>

          {/* SEPARATOR */}
          <div className="my-2 h-px bg-[#EAE9E3]" />

          {/* =========================
              COLLAPSE BUTTON
          ========================== */}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={
              collapsed
                ? "Buka Sidebar"
                : "Tutup Sidebar"
            }
            className={`
              group
              flex
              h-[42px]
              w-full
              items-center
              rounded-xl
              text-[#7C8481]
              transition-all
              duration-200

              hover:bg-[#F0F1EC]
              hover:text-[#173E37]

              ${
                collapsed
                  ? "justify-center"
                  : "gap-3 px-3"
              }
            `}
          >
            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                transition-colors
                group-hover:bg-[#E4E9E6]
              "
            >
              {collapsed ? (
                <IconChevronRight className="h-4 w-4" />
              ) : (
                <IconChevronLeft className="h-4 w-4" />
              )}
            </span>

            {!collapsed && (
              <span className="text-[12.5px] font-medium">
                Tutup Sidebar
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main
        className="
          min-w-0
          flex-1
          overflow-y-auto
          bg-[#F7F7F4]
        "
      >
        {children}
      </main>
    </div>
  );
}