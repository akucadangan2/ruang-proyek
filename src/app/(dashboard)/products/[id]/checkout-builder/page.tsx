"use client";

import { useEffect, useState } from "react";
import { HeaderSettings } from "@/components/checkout-builder/header-settings";
import { ContentSettings } from "@/components/checkout-builder/content-settings";
import { FooterSettings } from "@/components/checkout-builder/footer-settings";
import { CheckoutPreview } from "@/components/checkout-builder/checkout-preview";
import type { CheckoutComponentConfig } from "@/types/checkout-component";
import type { Product, ProductImage, OrderFormField, OrderBump } from "@/types/product";

interface ProductDetail extends Partial<Product> {
  product_images?: ProductImage[];
  order_form_fields?: OrderFormField[];
  order_bumps?: (OrderBump & { bump_product?: { id: string; name: string; normal_price: number; discount_price: number | null } })[];
}

export default function CheckoutBuilderPage({ params }: { params: { id: string } }) {
  const { id: productId } = params;
  const [config, setConfig] = useState<CheckoutComponentConfig | null>(null);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/checkout-components/${productId}`)
      .then((res) => res.json())
      .then(({ data }) => setConfig(data));

    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then(({ data }) => setProduct(data));
  }, [productId]);

  async function handleSave() {
    if (!config) return;
    setSaving(true);
    await fetch(`/api/checkout-components/${productId}`, {
      method: "PUT",
      body: JSON.stringify(config),
    });
    setSaving(false);
  }

  if (!config || !product) return <p className="p-6 text-[13px] text-ink-soft">Memuat...</p>;

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-ink text-white px-6 py-3.5 flex items-center justify-between">
        <h1 className="text-[14px] font-medium">Komponen Formulir</h1>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
        <div className="space-y-4">
          <HeaderSettings config={config.header} onChange={(header) => setConfig({ ...config, header })} />
          <ContentSettings config={config.content} onChange={(content) => setConfig({ ...config, content })} />
          <FooterSettings config={config.footer} onChange={(footer) => setConfig({ ...config, footer })} />

          <div className="flex gap-3 justify-end pt-2">
            <button className="border border-line px-6 py-2.5 rounded-md text-[13px] text-ink-soft hover:bg-white">
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-ink hover:bg-ink/90 text-white px-6 py-2.5 rounded-md text-[13px] font-medium disabled:opacity-40 transition-colors"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        <div className="lg:sticky lg:top-4 h-fit">
          <CheckoutPreview product={product} config={config} />
        </div>
      </div>
    </div>
  );
}