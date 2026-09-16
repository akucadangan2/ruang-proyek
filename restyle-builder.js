const fs = require("fs");
const path = require("path");

function write(relPath, content) {
  const fullPath = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
  console.log("Ditulis:", relPath);
}

// ===== 1. Reusable UI: SectionCard =====
write(
  "src/components/ui/section-card.tsx",
  `interface SectionCardProps {
  icon: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionCard({ icon, title, description, action, children }: SectionCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-lg shrink-0">
            {icon}
          </span>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
            {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
`
);

// ===== 2. Reusable UI: Toggle (pill switch) =====
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
      onClick={() => onChange(!checked)}
      className={\`w-11 h-6 rounded-full transition-colors relative shrink-0 \${
        checked ? "bg-blue-600" : "bg-gray-300"
      }\`}
    >
      <span
        className={\`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform \${
          checked ? "translate-x-5" : ""
        }\`}
      />
    </button>
  );
}
`
);

// ===== 3. Dashboard layout — sidebar dengan icon + active state =====
write(
  "src/app/(dashboard)/layout.tsx",
  `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/products", label: "Produk", icon: "📦" },
  { href: "/orders", label: "Order", icon: "🧾" },
  { href: "/team", label: "Team", icon: "👥" },
  { href: "/settings/tracking", label: "Tracking", icon: "🎯" },
  { href: "/settings/follow-up-otomatis", label: "Follow Up Otomatis", icon: "🤖" },
  { href: "/settings/follow-up-manual", label: "Follow Up Manual", icon: "📝" },
  { href: "/settings/notifications", label: "Notifikasi", icon: "🔔" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            RK
          </span>
          <span className="font-semibold text-gray-800">Ruang Kerja</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors \${
                  active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                }\`}
              >
                <span className="text-base">{item.icon}</span>
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

// ===== 4. ImageUploader restyle =====
write(
  "src/components/product-builder/image-uploader.tsx",
  `"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SectionCard } from "@/components/ui/section-card";
import { Toggle } from "@/components/ui/toggle";
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
    <SectionCard icon="🖼️" title="Foto Produk">
      <div className="flex gap-3 flex-wrap mb-3">
        {images.map((img) => (
          <div key={img.id} className="relative w-20 h-20">
            <img
              src={img.url}
              alt="Produk"
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
            <button
              onClick={() => removeImage(img.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-xs text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <span className="text-lg mb-0.5">＋</span>
          {uploading ? "..." : "Tambah Photo"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileSelect} />
      </div>

      <p className="text-xs text-gray-400 mb-3">
        Kamu bisa menampilkan atau menyembunyikan gambar produk di halaman pembayaran.
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-700">Aktifkan Geser Otomatis</span>
        <Toggle checked={autoSlide} onChange={onAutoSlideChange} />
      </div>
    </SectionCard>
  );
}
`
);

// ===== 5. PricingForm restyle =====
write(
  "src/components/product-builder/pricing-form.tsx",
  `"use client";

import { SectionCard } from "@/components/ui/section-card";

interface PricingFormProps {
  normalPrice: number;
  discountPrice: number | null;
  costPrice: number | null;
  sku: string;
  onChange: (field: string, value: number | string | null) => void;
}

export function PricingForm({ normalPrice, discountPrice, costPrice, sku, onChange }: PricingFormProps) {
  return (
    <SectionCard icon="🏷️" title="Harga Produk">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Harga Normal</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="px-3 text-sm text-gray-400 bg-gray-50 h-full flex items-center py-2.5">Rp</span>
            <input
              type="number"
              value={normalPrice}
              onChange={(e) => onChange("normal_price", Number(e.target.value))}
              className="px-2 py-2.5 w-full text-sm outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Harga Diskon / Coret</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="px-3 text-sm text-gray-400 bg-gray-50 h-full flex items-center py-2.5">Rp</span>
            <input
              type="number"
              value={discountPrice ?? ""}
              onChange={(e) => onChange("discount_price", e.target.value ? Number(e.target.value) : null)}
              className="px-2 py-2.5 w-full text-sm outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-500 mb-1 block">Harga Jual / HPP</label>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="px-3 text-sm text-gray-400 bg-gray-50 h-full flex items-center py-2.5">Rp</span>
          <input
            type="number"
            value={costPrice ?? ""}
            onChange={(e) => onChange("cost_price", e.target.value ? Number(e.target.value) : null)}
            className="px-2 py-2.5 w-full text-sm outline-none"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <label className="text-xs text-gray-500 mb-1 block">SKU (Stock Keeping Unit)</label>
        <input
          type="text"
          value={sku}
          placeholder="Kode SKU Produk, Contoh PROD001"
          onChange={(e) => onChange("sku", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
    </SectionCard>
  );
}
`
);

// ===== 6. OrderBumpForm restyle =====
write(
  "src/components/product-builder/order-bump-form.tsx",
  `"use client";

import { useState } from "react";
import type { Product, OrderBump } from "@/types/product";
import { formatRupiah } from "@/lib/utils";
import { SectionCard } from "@/components/ui/section-card";
import { Toggle } from "@/components/ui/toggle";

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
    <SectionCard icon="🎁" title="Bump Produk" description="Tawaran item tambahan di produk ini ketika di halaman checkout">
      <div className="space-y-2 mb-3">
        {bumps.map((bump) => {
          const product = availableProducts.find((p) => p.id === bump.bump_product_id);
          if (!product) return null;
          return (
            <div key={bump.id} className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div>
                <p className="font-medium text-sm text-gray-800">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {formatRupiah(product.discount_price ?? product.normal_price)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Auto-checked</span>
                  <Toggle checked={bump.auto_checked} onChange={(v) => onToggleAutoChecked(bump.id, v)} />
                </div>
                <button onClick={() => onRemove(bump.id)} className="text-red-500 text-sm">
                  🗑️
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
          className="border border-gray-200 rounded-lg px-3 py-2.5 flex-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          + Tambahkan
        </button>
      </div>
    </SectionCard>
  );
}
`
);

// ===== 7. OrderFormBuilder restyle =====
write(
  "src/components/product-builder/order-form-builder.tsx",
  `"use client";

import { useState } from "react";
import type { OrderFormField } from "@/types/product";
import { SectionCard } from "@/components/ui/section-card";

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
    <SectionCard icon="📋" title="Formulir Pemesanan" description="Berisi informasi data yang akan disii oleh pembeli">
      <div className="space-y-2">
        {fields
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((field, index) => {
            const isDefault = DEFAULT_FIELDS.includes(field.key);
            return (
              <div key={field.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex flex-col text-[10px] text-gray-300 leading-none">
                    <button onClick={() => move(index, -1)}>▲</button>
                    <button onClick={() => move(index, 1)}>▼</button>
                  </div>
                  <input
                    type="checkbox"
                    checked={field.enabled}
                    disabled={isDefault && field.required}
                    onChange={() => toggleEnabled(field.id)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                  {field.required && (
                    <span className="text-[10px] text-red-500 font-medium">Required</span>
                  )}
                </div>
                {!isDefault && (
                  <button onClick={() => removeField(field.id)} className="text-red-500 text-xs">
                    Hapus
                  </button>
                )}
              </div>
            );
          })}
      </div>

      <div className="flex gap-2 pt-3 mt-3 border-t border-gray-100">
        <input
          type="text"
          placeholder="Nama field custom..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 flex-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addCustomField}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap"
        >
          + Tambah Form Lain
        </button>
      </div>
    </SectionCard>
  );
}
`
);

// ===== 8. LpPreview restyle (badges, boxed Data Penerima) =====
write(
  "src/components/product-builder/lp-preview.tsx",
  `"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import type { Product, ProductImage, OrderFormField } from "@/types/product";

interface LpPreviewProps {
  product: Partial<Product>;
  images: ProductImage[];
  formFields: OrderFormField[];
}

export function LpPreview({ product, images, formFields }: LpPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex justify-end gap-2 p-3 border-b border-gray-100 bg-gray-50">
        <button
          onClick={() => setDevice("desktop")}
          className={\`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors \${
            device === "desktop" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-500"
          }\`}
        >
          🖥️ Desktop
        </button>
        <button
          onClick={() => setDevice("mobile")}
          className={\`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors \${
            device === "mobile" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-500"
          }\`}
        >
          📱 Mobile
        </button>
      </div>

      <div className={\`p-5 mx-auto transition-all \${device === "mobile" ? "max-w-[375px]" : "max-w-full"}\`}>
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">🛡️ Garansi Uang Kembali</span>
          <span className="flex items-center gap-1">✅ Jaminan Kepuasan</span>
        </div>

        {images.length > 0 ? (
          <img
            src={images[0].url}
            alt={product.name ?? "Produk"}
            className="w-full aspect-video object-cover rounded-xl mb-4"
          />
        ) : (
          <div className="w-full aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-300 text-sm">
            Belum ada foto produk
          </div>
        )}

        <h2 className="font-bold text-lg text-gray-800">{product.name || "Nama Produk"}</h2>

        <div className="flex items-center gap-2 mt-1.5">
          {product.discount_price ? (
            <>
              <span className="font-bold text-blue-600">{formatRupiah(product.discount_price)}</span>
              <span className="text-sm text-gray-400 line-through">
                {formatRupiah(product.normal_price ?? 0)}
              </span>
            </>
          ) : (
            <span className="font-bold text-blue-600">{formatRupiah(product.normal_price ?? 0)}</span>
          )}
        </div>

        {product.description && (
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{product.description}</p>
        )}

        <div className="border border-gray-200 rounded-xl p-4 mt-5 space-y-2.5 bg-gray-50">
          <p className="text-sm font-semibold text-gray-700">Data Penerima:</p>
          {formFields
            .filter((f) => f.enabled)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((field) => (
              <div
                key={field.id}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400"
              >
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </div>
            ))}
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 mt-4 font-medium text-sm transition-colors">
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}
`
);

// ===== 9. Halaman Tambah Produk — full redesign (header stepper, breadcrumb, layout) =====
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-lg">⏱️</span> Ruang Kerja
        </div>
        <div className="flex items-center gap-3 text-sm">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={\`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold \${
                    step.n === 1 ? "bg-white text-blue-600" : "bg-blue-500 text-white"
                  }\`}
                >
                  {step.n}
                </span>
                <span className={step.n === 1 ? "font-medium" : "text-blue-100"}>{step.label}</span>
              </div>
              {i < STEPS.length - 1 && <span className="text-blue-300">›</span>}
            </div>
          ))}
        </div>
        <button onClick={() => router.push("/products")} className="text-white/80 hover:text-white text-lg">
          ×
        </button>
      </div>

      <div className="px-6 py-4 text-sm text-gray-400">
        Produk <span className="mx-1">›</span>{" "}
        <span className="text-gray-700 font-medium">{product.name || "Produk Baru"}</span>
      </div>

      <div className="px-6 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <div className="space-y-4">
          <SectionCard icon="✏️" title="Nama Produk">
            <input
              type="text"
              value={product.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Contoh: Laporan Kas Proyek Otomatis"
              className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </SectionCard>

          <ImageUploader
            productId="draft"
            images={images}
            autoSlide={product.auto_slide_images ?? false}
            onImagesChange={setImages}
            onAutoSlideChange={(v) => updateField("auto_slide_images", v)}
          />

          <SectionCard icon="📦" title="Produk Digital" description="Pilih produk digital yang mau kamu jual">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { key: "file", label: "File Produk" },
                { key: "link", label: "Produk Link" },
                { key: "text", label: "Produk Teks" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => updateField("digital_type", opt.key)}
                  className={\`border rounded-lg py-3 text-xs font-medium transition-colors \${
                    product.digital_type === opt.key
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
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
                className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            )}

            <textarea
              placeholder="Masukan deskripsi produk"
              value={product.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
              maxLength={250}
              rows={3}
              className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {(product.description ?? "").length}/250
            </p>
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium text-sm disabled:opacity-50 transition-colors"
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

console.log("\\nSelesai — restyle builder produk kelar.");