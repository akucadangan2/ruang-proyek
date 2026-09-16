"use client";

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
      router.push(`/products/${data.id}`);
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
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                    step.n === 1 ? "bg-accent text-ink" : "bg-white/10 text-white/50"
                  }`}
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
                  className={`border rounded-md py-2.5 text-[12px] font-medium transition-colors ${
                    product.digital_type === opt.key
                      ? "border-accent bg-accent-soft/40 text-ink"
                      : "border-line text-ink-soft hover:border-ink-soft"
                  }`}
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
