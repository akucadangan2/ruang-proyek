# Platform Jualan Produk Digital

Struktur awal (scaffold) berdasarkan scope yang sudah disepakati dengan client. Stack: Next.js (App Router) + Supabase + Midtrans + Fonnte + Telegram Bot API.

## Mapping Scope → Folder

| Scope | Lokasi |
|---|---|
| 1. Katalog Produk | `src/app/(dashboard)/products/page.tsx` |
| 2. Product & LP Builder | `src/app/(dashboard)/products/new`, `[id]`, `src/components/product-builder/*` |
| 3. Checkout Page Builder | `src/app/(dashboard)/products/[id]/checkout-builder`, `src/components/checkout-builder/*` |
| 4. Dashboard & Analytics | `src/app/(dashboard)/dashboard`, `src/components/dashboard/*` |
| 5. Pengaturan Pixel/Tracking | `src/app/(dashboard)/settings/tracking`, `src/lib/pixel/*` |
| 6. Notifikasi & Follow Up | `src/app/(dashboard)/settings/follow-up-*`, `notifications`, `src/lib/fonnte`, `src/lib/telegram` |
| 7. Manajemen Tim & Permission | `src/app/(dashboard)/team`, `src/components/team/*`, `src/lib/permissions/rbac.ts` |
| 8. Payment Gateway (Midtrans) | `src/lib/midtrans/client.ts`, `src/app/api/webhooks/midtrans` |
| Landing Page & Checkout publik | `src/app/(public)/*` |

## Setup

```bash
npm install
cp .env.local.example .env.local
# isi env: Supabase, Midtrans, Fonnte, Telegram
npm run dev
```

## Belum termasuk di scaffold ini (belum di-scope final)
- Account Settings, Banned Device, Log Aktivitas, My Address (menu Settings tambahan yang kelihatan di referensi tapi belum dibahas detail)
