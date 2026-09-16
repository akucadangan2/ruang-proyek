const fs = require("fs");
const path = require("path");

function write(relPath, content) {
  const fullPath = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
  console.log("Ditulis:", relPath);
}

// ===== 1. globals.css — font + base =====
write(
  "src/app/globals.css",
  `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-feature-settings: "tnum" 1, "lnum" 1;
}
`
);

// ===== 2. tailwind.config.ts — token warna & font =====
write(
  "tailwind.config.ts",
  `import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        ink: "#14161F",
        "ink-soft": "#63677A",
        paper: "#F7F6F2",
        line: "#E4E2DC",
        "line-dark": "#262A38",
        accent: "#B4740E",
        "accent-soft": "#F4E4C1",
        positive: "#2E9E6D",
        "positive-soft": "#DFF3EA",
        negative: "#C4574A",
        "negative-soft": "#F7E4E1",
      },
    },
  },
  plugins: [],
};
export default config;
`
);

// ===== 3. Icon set (SVG garis, bukan emoji) =====
write(
  "src/components/ui/icons.tsx",
  `interface IconProps {
  className?: string;
}

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconGrid({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconPackage({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M21 8L12 3 3 8v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  );
}

export function IconReceipt({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3-6 7-6s7 2.7 7 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M23 20c0-2.6-2-4.8-5-5.6" />
    </svg>
  );
}

export function IconTarget({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

export function IconZap({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

export function IconFileText({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 2h9l5 5v15H6V2z" />
      <path d="M15 2v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

export function IconBell({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M10.3 21a2 2 0 003.4 0" />
    </svg>
  );
}

export function IconImage({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export function IconTag({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12.6 2H4v8.6L13.4 20 20 13.4 12.6 2z" />
      <circle cx="8" cy="8" r="1.3" />
    </svg>
  );
}

export function IconGift({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="8" width="18" height="13" rx="1" />
      <path d="M3 12h18" />
      <path d="M12 8v13" />
      <path d="M12 8c-2 0-4-1.3-4-3.3A2.2 2.2 0 0110.2 2.5c1.8 0 2.8 2 2.8 5.5z" />
      <path d="M12 8c2 0 4-1.3 4-3.3A2.2 2.2 0 0013.8 2.5c-1.8 0-2.8 2-2.8 5.5z" />
    </svg>
  );
}

export function IconClipboard({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M9 11h6M9 15h6" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  );
}

export function IconX({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function IconChevronUp({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 15l6-6 6 6" />
    </svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconCheckCircle({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

export function IconShieldCheck({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M8.5 12l2.5 2.5L15.5 9" />
    </svg>
  );
}
`
);

// ===== 4. SectionCard — flat, hairline border, no shadow =====
write(
  "src/components/ui/section-card.tsx",
  `interface SectionCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionCard({ icon, title, description, action, children }: SectionCardProps) {
  return (
    <div className="bg-white border border-line rounded-lg">
      <div className="flex items-start justify-between gap-3 px-5 py-3.5 border-b border-line">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-ink-soft">{icon}</span>}
          <div>
            <h3 className="font-semibold text-ink text-[13px] tracking-tight">{title}</h3>
            {description && <p className="text-[12px] text-ink-soft mt-0.5">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
`
);

// ===== 5. Toggle — ink track off, ochre on =====
write(
  "src/components/ui/toggle.tsx",
  `interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={\`w-9 h-5 rounded-full relative transition-colors shrink-0 \${
        checked ? "bg-accent" : "bg-line"
      }\`}
    >
      <span
        className={\`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform \${
          checked ? "translate-x-4" : ""
        }\`}
      />
    </button>
  );
}
`
);

// ===== 6. Sidebar layout — ink bg, left accent bar, ikon SVG =====
write(
  "src/app/(dashboard)/layout.tsx",
  `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconGrid,
  IconPackage,
  IconReceipt,
  IconUsers,
  IconTarget,
  IconZap,
  IconFileText,
  IconBell,
} from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", Icon: IconGrid },
  { href: "/products", label: "Produk", Icon: IconPackage },
  { href: "/orders", label: "Order", Icon: IconReceipt },
  { href: "/team", label: "Team", Icon: IconUsers },
  { href: "/settings/tracking", label: "Tracking", Icon: IconTarget },
  { href: "/settings/follow-up-otomatis", label: "Follow Up Otomatis", Icon: IconZap },
  { href: "/settings/follow-up-manual", label: "Follow Up Manual", Icon: IconFileText },
  { href: "/settings/notifications", label: "Notifikasi", Icon: IconBell },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="w-60 bg-ink flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-line-dark">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded bg-accent flex items-center justify-center text-ink font-bold text-[13px]">
              R
            </span>
            <span className="font-semibold text-white text-[14px] tracking-tight">Ruang Kerja</span>
          </div>
        </div>
        <nav className="flex-1 py-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={\`relative flex items-center gap-3 pl-5 pr-4 py-2.5 text-[13px] transition-colors \${
                  active ? "text-white font-medium" : "text-[#8C90A0] hover:text-white"
                }\`}
              >
                {active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />}
                <Icon className="w-[17px] h-[17px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
`
);

// ===== 7. ImageUploader =====
write(
  "src/components/product-builder/image-uploader.tsx",
  `"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SectionCard } from "@/components/ui/section-card";
import { Toggle } from "@/components/ui/toggle";
import { IconImage } from "@/components/ui/icons";
import type { ProductImage } from "@/types/product";

interface ImageUploaderProps {
  productId: string;
  images: ProductImage[];
  autoSlide: boolean;
  onImagesChange: (images: ProductImage[]) => void;
  onAutoSlideChange: (value: boolean) => void;
}

export function ImageUploader({
  productId,
  images,
  autoSlide,
  onImagesChange,
  onAutoSlideChange,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    const uploaded: ProductImage[] = [];
    for (const file of Array.from(files)) {
      const filePath = \`\${productId}/\${Date.now()}-\${file.name}\`;
      const { error } = await supabase.storage.from("product-images").upload(filePath, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
        uploaded.push({
          id: crypto.randomUUID(),
          product_id: productId,
          url: urlData.publicUrl,
          sort_order: images.length + uploaded.length,
        });
      }
    }
    onImagesChange([...images, ...uploaded]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(id: string) {
    onImagesChange(images.filter((img) => img.id !== id));
  }

  return (
    <SectionCard icon={<IconImage className="w-4 h-4" />} title="Foto Produk">
      <div className="flex gap-3 flex-wrap mb-3">
        {images.map((img) => (
          <div key={img.id} className="relative w-20 h-20">
            <img
              src={img.url}
              alt="Produk"
              className="w-full h-full object-cover rounded-md border border-line"
            />
            <button
              onClick={() => removeImage(img.id)}
              className="absolute -top-2 -right-2 bg-negative text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-20 border border-dashed border-line rounded-md flex flex-col items-center justify-center text-[11px] text-ink-soft hover:border-accent hover:text-accent transition-colors"
        >
          <span className="text-base leading-none mb-1">+</span>
          {uploading ? "..." : "Tambah Photo"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileSelect} />
      </div>

      <p className="text-[12px] text-ink-soft mb-3">
        Kamu bisa menampilkan atau menyembunyikan gambar produk di halaman pembayaran.
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-line">
        <span className="text-[13px] text-ink">Aktifkan Geser Otomatis</span>
        <Toggle checked={autoSlide} onChange={onAutoSlideChange} />
      </div>
    </SectionCard>
  );
}
`
);

// ===== 8. PricingForm =====
write(
  "src/components/product-builder/pricing-form.tsx",
  `"use client";

import { SectionCard } from "@/components/ui/section-card";
import { IconTag } from "@/components/ui/icons";

interface PricingFormProps {
  normalPrice: number;
  discountPrice: number | null;
  costPrice: number | null;
  sku: string;
  onChange: (field: string, value: number | string | null) => void;
}

export function PricingForm({ normalPrice, discountPrice, costPrice, sku, onChange }: PricingFormProps) {
  return (
    <SectionCard icon={<IconTag className="w-4 h-4" />} title="Harga Produk">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[12px] text-ink-soft mb-1 block">Harga Normal</label>
          <div className="flex items-center border border-line rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent">
            <span className="px-3 text-[13px] text-ink-soft bg-paper h-full flex items-center py-2.5">Rp</span>
            <input
              type="number"
              value={normalPrice}
              onChange={(e) => onChange("normal_price", Number(e.target.value))}
              className="px-2 py-2.5 w-full text-[13px] outline-none tabular-nums"
            />
          </div>
        </div>
        <div>
          <label className="text-[12px] text-ink-soft mb-1 block">Harga Diskon / Coret</label>
          <div className="flex items-center border border-line rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent">
            <span className="px-3 text-[13px] text-ink-soft bg-paper h-full flex items-center py-2.5">Rp</span>
            <input
              type="number"
              value={discountPrice ?? ""}
              onChange={(e) => onChange("discount_price", e.target.value ? Number(e.target.value) : null)}
              className="px-2 py-2.5 w-full text-[13px] outline-none tabular-nums"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[12px] text-ink-soft mb-1 block">Harga Jual / HPP</label>
        <div className="flex items-center border border-line rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent">
          <span className="px-3 text-[13px] text-ink-soft bg-paper h-full flex items-center py-2.5">Rp</span>
          <input
            type="number"
            value={costPrice ?? ""}
            onChange={(e) => onChange("cost_price", e.target.value ? Number(e.target.value) : null)}
            className="px-2 py-2.5 w-full text-[13px] outline-none tabular-nums"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-line">
        <label className="text-[12px] text-ink-soft mb-1 block">SKU (Stock Keeping Unit)</label>
        <input
          type="text"
          value={sku}
          placeholder="Kode SKU Produk, Contoh PROD001"
          onChange={(e) => onChange("sku", e.target.value)}
          className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
        />
      </div>
    </SectionCard>
  );
}
`
);

// ===== 9. OrderBumpForm =====
write(
  "src/components/product-builder/order-bump-form.tsx",
  `"use client";

import { useState } from "react";
import type { Product, OrderBump } from "@/types/product";
import { formatRupiah } from "@/lib/utils";
import { SectionCard } from "@/components/ui/section-card";
import { Toggle } from "@/components/ui/toggle";
import { IconGift, IconTrash } from "@/components/ui/icons";

interface OrderBumpFormProps {
  productId: string;
  availableProducts: Product[];
  bumps: OrderBump[];
  onAdd: (bumpProductId: string) => void;
  onRemove: (bumpId: string) => void;
  onToggleAutoChecked: (bumpId: string, value: boolean) => void;
}

export function OrderBumpForm({ availableProducts, bumps, onAdd, onRemove, onToggleAutoChecked }: OrderBumpFormProps) {
  const [selectedId, setSelectedId] = useState("");

  return (
    <SectionCard
      icon={<IconGift className="w-4 h-4" />}
      title="Bump Produk"
      description="Tawaran item tambahan di produk ini ketika di halaman checkout"
    >
      <div className="space-y-2 mb-3">
        {bumps.map((bump) => {
          const product = availableProducts.find((p) => p.id === bump.bump_product_id);
          if (!product) return null;
          return (
            <div key={bump.id} className="flex items-center justify-between bg-accent-soft/40 border border-accent-soft rounded-md p-3">
              <div>
                <p className="font-medium text-[13px] text-ink">{product.name}</p>
                <p className="text-[12px] text-ink-soft tabular-nums">
                  {formatRupiah(product.discount_price ?? product.normal_price)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ink-soft">Auto-checked</span>
                  <Toggle checked={bump.auto_checked} onChange={(v) => onToggleAutoChecked(bump.id, v)} />
                </div>
                <button onClick={() => onRemove(bump.id)} className="text-negative">
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="border border-line rounded-md px-3 py-2.5 flex-1 text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="">Pilih produk untuk dijadikan bump...</option>
          {availableProducts
            .filter((p) => !bumps.some((b) => b.bump_product_id === p.id))
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
        <button
          disabled={!selectedId}
          onClick={() => {
            onAdd(selectedId);
            setSelectedId("");
          }}
          className="bg-ink hover:bg-ink/90 text-white px-4 py-2.5 rounded-md text-[13px] disabled:opacity-40 transition-colors whitespace-nowrap"
        >
          Tambahkan
        </button>
      </div>
    </SectionCard>
  );
}
`
);

// ===== 10. OrderFormBuilder =====
write(
  "src/components/product-builder/order-form-builder.tsx",
  `"use client";

import { useState } from "react";
import type { OrderFormField } from "@/types/product";
import { SectionCard } from "@/components/ui/section-card";
import { IconClipboard, IconChevronUp, IconChevronDown } from "@/components/ui/icons";

interface OrderFormBuilderProps {
  fields: OrderFormField[];
  onChange: (fields: OrderFormField[]) => void;
}

const DEFAULT_FIELDS = ["nama", "no_hp", "email"];

export function OrderFormBuilder({ fields, onChange }: OrderFormBuilderProps) {
  const [newLabel, setNewLabel] = useState("");

  function toggleEnabled(id: string) {
    onChange(fields.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const next = [...fields];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((f, i) => ({ ...f, sort_order: i })));
  }

  function addCustomField() {
    if (!newLabel.trim()) return;
    const key = newLabel.toLowerCase().replace(/\\s+/g, "_");
    onChange([
      ...fields,
      {
        id: crypto.randomUUID(),
        product_id: fields[0]?.product_id ?? "",
        key,
        label: newLabel,
        required: false,
        enabled: true,
        sort_order: fields.length,
      },
    ]);
    setNewLabel("");
  }

  function removeField(id: string) {
    onChange(fields.filter((f) => f.id !== id));
  }

  return (
    <SectionCard
      icon={<IconClipboard className="w-4 h-4" />}
      title="Formulir Pemesanan"
      description="Berisi informasi data yang akan diisi oleh pembeli"
    >
      <div className="space-y-2">
        {fields
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((field, index) => {
            const isDefault = DEFAULT_FIELDS.includes(field.key);
            return (
              <div key={field.id} className="flex items-center justify-between border border-line rounded-md p-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-paper text-ink-soft text-[10px] flex items-center justify-center border border-line">
                    {index + 1}
                  </span>
                  <div className="flex flex-col text-ink-soft">
                    <button onClick={() => move(index, -1)}>
                      <IconChevronUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => move(index, 1)}>
                      <IconChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="checkbox"
                    checked={field.enabled}
                    disabled={isDefault && field.required}
                    onChange={() => toggleEnabled(field.id)}
                    className="accent-ink"
                  />
                  <span className="text-[13px] text-ink">{field.label}</span>
                  {field.required && (
                    <span className="text-[10px] text-negative font-medium">Required</span>
                  )}
                </div>
                {!isDefault && (
                  <button onClick={() => removeField(field.id)} className="text-negative text-[12px]">
                    Hapus
                  </button>
                )}
              </div>
            );
          })}
      </div>

      <div className="flex gap-2 pt-3 mt-3 border-t border-line">
        <input
          type="text"
          placeholder="Nama field custom..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="border border-line rounded-md px-3 py-2 flex-1 text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          onClick={addCustomField}
          className="border border-line px-4 py-2 rounded-md text-[13px] text-ink-soft hover:bg-paper whitespace-nowrap"
        >
          + Tambah Form Lain
        </button>
      </div>
    </SectionCard>
  );
}
`
);

// ===== 11. LpPreview =====
write(
  "src/components/product-builder/lp-preview.tsx",
  `"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { IconShieldCheck, IconCheckCircle } from "@/components/ui/icons";
import type { Product, ProductImage, OrderFormField } from "@/types/product";

interface LpPreviewProps {
  product: Partial<Product>;
  images: ProductImage[];
  formFields: OrderFormField[];
}

export function LpPreview({ product, images, formFields }: LpPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="bg-white border border-line rounded-lg overflow-hidden">
      <div className="flex justify-end gap-1 p-2.5 border-b border-line bg-paper">
        <button
          onClick={() => setDevice("desktop")}
          className={\`text-[12px] px-3 py-1.5 rounded-md font-medium transition-colors \${
            device === "desktop" ? "bg-ink text-white" : "text-ink-soft hover:bg-white"
          }\`}
        >
          Desktop
        </button>
        <button
          onClick={() => setDevice("mobile")}
          className={\`text-[12px] px-3 py-1.5 rounded-md font-medium transition-colors \${
            device === "mobile" ? "bg-ink text-white" : "text-ink-soft hover:bg-white"
          }\`}
        >
          Mobile
        </button>
      </div>

      <div className={\`p-5 mx-auto transition-all \${device === "mobile" ? "max-w-[375px]" : "max-w-full"}\`}>
        <div className="flex items-center justify-center gap-5 text-[11px] text-ink-soft mb-4">
          <span className="flex items-center gap-1.5">
            <IconShieldCheck className="w-3.5 h-3.5" /> Garansi Uang Kembali
          </span>
          <span className="flex items-center gap-1.5">
            <IconCheckCircle className="w-3.5 h-3.5" /> Jaminan Kepuasan
          </span>
        </div>

        {images.length > 0 ? (
          <img
            src={images[0].url}
            alt={product.name ?? "Produk"}
            className="w-full aspect-video object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full aspect-video bg-paper border border-line rounded-md mb-4 flex items-center justify-center text-ink-soft text-[12px]">
            Belum ada foto produk
          </div>
        )}

        <h2 className="font-bold text-[17px] text-ink">{product.name || "Nama Produk"}</h2>

        <div className="flex items-center gap-2 mt-1.5">
          {product.discount_price ? (
            <>
              <span className="font-bold text-accent tabular-nums">{formatRupiah(product.discount_price)}</span>
              <span className="text-[13px] text-ink-soft line-through tabular-nums">
                {formatRupiah(product.normal_price ?? 0)}
              </span>
            </>
          ) : (
            <span className="font-bold text-accent tabular-nums">{formatRupiah(product.normal_price ?? 0)}</span>
          )}
        </div>

        {product.description && (
          <p className="text-[13px] text-ink-soft mt-2 leading-relaxed">{product.description}</p>
        )}

        <div className="border border-line rounded-lg p-4 mt-5 space-y-2.5 bg-paper">
          <p className="text-[13px] font-semibold text-ink">Data Penerima:</p>
          {formFields
            .filter((f) => f.enabled)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((field) => (
              <div
                key={field.id}
                className="bg-white border border-line rounded-md px-3 py-2.5 text-[13px] text-ink-soft"
              >
                {field.label} {field.required && <span className="text-negative">*</span>}
              </div>
            ))}
        </div>

        <button className="w-full bg-ink hover:bg-ink/90 text-white rounded-lg py-3 mt-4 font-medium text-[13px] transition-colors">
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}
`
);

// ===== 12. Halaman Tambah Produk — header ink bar, breadcrumb =====
write(
  "src/app/(dashboard)/products/new/page.tsx",
  `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/product-builder/image-uploader";
import { PricingForm } from "@/components/product-builder/pricing-form";
import { OrderBumpForm } from "@/components/product-builder/order-bump-form";
import { OrderFormBuilder } from "@/components/product-builder/order-form-builder";
import { LpPreview } from "@/components/product-builder/lp-preview";
import { SectionCard } from "@/components/ui/section-card";
import { IconX } from "@/components/ui/icons";
import { slugify } from "@/lib/utils";
import type { Product, ProductImage, OrderFormField, OrderBump } from "@/types/product";

const DEFAULT_FORM_FIELDS: OrderFormField[] = [
  { id: crypto.randomUUID(), product_id: "", key: "nama", label: "Nama", required: true, enabled: true, sort_order: 0 },
  { id: crypto.randomUUID(), product_id: "", key: "no_hp", label: "No Handphone/WhatsApp", required: true, enabled: true, sort_order: 1 },
  { id: crypto.randomUUID(), product_id: "", key: "email", label: "Email", required: true, enabled: true, sort_order: 2 },
  { id: crypto.randomUUID(), product_id: "", key: "jumlah_pesanan", label: "Jumlah Pesanan", required: false, enabled: false, sort_order: 3 },
  { id: crypto.randomUUID(), product_id: "", key: "catatan", label: "Catatan", required: false, enabled: false, sort_order: 4 },
];

const STEPS = [
  { n: 1, label: "Tambah Produk" },
  { n: 2, label: "Halaman Checkout" },
  { n: 3, label: "Desain Halaman Sukses" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    normal_price: 0,
    discount_price: null,
    cost_price: null,
    sku: "",
    digital_type: "link",
    digital_link_url: "",
    auto_slide_images: false,
  });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [formFields, setFormFields] = useState<OrderFormField[]>(DEFAULT_FORM_FIELDS);
  const [bumps, setBumps] = useState<OrderBump[]>([]);
  const [saving, setSaving] = useState(false);

  function updateField(field: string, value: unknown) {
    setProduct((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({ ...product, slug: slugify(product.name ?? "") }),
    });
    if (res.ok) {
      const { data } = await res.json();
      router.push(\`/products/\${data.id}\`);
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-ink text-white px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 font-semibold text-[14px] tracking-tight">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Ruang Kerja
        </div>
        <div className="flex items-center gap-3 text-[13px]">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={\`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold \${
                    step.n === 1 ? "bg-accent text-ink" : "bg-white/10 text-white/50"
                  }\`}
                >
                  {step.n}
                </span>
                <span className={step.n === 1 ? "font-medium" : "text-white/40"}>{step.label}</span>
              </div>
              {i < STEPS.length - 1 && <span className="text-white/20">/</span>}
            </div>
          ))}
        </div>
        <button onClick={() => router.push("/products")} className="text-white/50 hover:text-white">
          <IconX className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 py-4 text-[13px] text-ink-soft">
        Produk <span className="mx-1.5">/</span>{" "}
        <span className="text-ink font-medium">{product.name || "Produk Baru"}</span>
      </div>

      <div className="px-6 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
        <div className="space-y-4">
          <SectionCard title="Nama Produk">
            <input
              type="text"
              value={product.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Contoh: Laporan Kas Proyek Otomatis"
              className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
          </SectionCard>

          <ImageUploader
            productId="draft"
            images={images}
            autoSlide={product.auto_slide_images ?? false}
            onImagesChange={setImages}
            onAutoSlideChange={(v) => updateField("auto_slide_images", v)}
          />

          <SectionCard title="Produk Digital" description="Pilih produk digital yang mau kamu jual">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { key: "file", label: "File Produk" },
                { key: "link", label: "Produk Link" },
                { key: "text", label: "Produk Teks" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => updateField("digital_type", opt.key)}
                  className={\`border rounded-md py-2.5 text-[12px] font-medium transition-colors \${
                    product.digital_type === opt.key
                      ? "border-accent bg-accent-soft/40 text-ink"
                      : "border-line text-ink-soft hover:border-ink-soft"
                  }\`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {product.digital_type === "link" && (
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={product.digital_link_url ?? ""}
                onChange={(e) => updateField("digital_link_url", e.target.value)}
                className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] mb-3 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
              />
            )}

            <textarea
              placeholder="Masukan deskripsi produk"
              value={product.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
              maxLength={250}
              rows={3}
              className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
            />
            <p className="text-[11px] text-ink-soft text-right mt-1">{(product.description ?? "").length}/250</p>
          </SectionCard>

          <PricingForm
            normalPrice={product.normal_price ?? 0}
            discountPrice={product.discount_price ?? null}
            costPrice={product.cost_price ?? null}
            sku={product.sku ?? ""}
            onChange={updateField}
          />

          <OrderBumpForm
            productId="draft"
            availableProducts={[]}
            bumps={bumps}
            onAdd={(bumpProductId) =>
              setBumps((prev) => [
                ...prev,
                { id: crypto.randomUUID(), product_id: "draft", bump_product_id: bumpProductId, auto_checked: false, sort_order: prev.length },
              ])
            }
            onRemove={(id) => setBumps((prev) => prev.filter((b) => b.id !== id))}
            onToggleAutoChecked={(id, value) =>
              setBumps((prev) => prev.map((b) => (b.id === id ? { ...b, auto_checked: value } : b)))
            }
          />

          <OrderFormBuilder fields={formFields} onChange={setFormFields} />

          <button
            onClick={handleSave}
            disabled={saving || !product.name}
            className="w-full bg-ink hover:bg-ink/90 text-white rounded-lg py-3 font-medium text-[13px] disabled:opacity-40 transition-colors"
          >
            {saving ? "Menyimpan..." : "Simpan & Lanjut ke Checkout Builder"}
          </button>
        </div>

        <div className="lg:sticky lg:top-4 h-fit">
          <LpPreview product={product} images={images} formFields={formFields} />
        </div>
      </div>
    </div>
  );
}
`
);

console.log("\\nSelesai — design system baru diterapkan.");