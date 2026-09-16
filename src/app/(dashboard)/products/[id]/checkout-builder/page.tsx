"use client";

import { useEffect, useState } from "react";
import { HeaderSettings } from "@/components/checkout-builder/header-settings";
import { ContentSettings } from "@/components/checkout-builder/content-settings";
import { FooterSettings } from "@/components/checkout-builder/footer-settings";
import type { CheckoutComponentConfig } from "@/types/checkout-component";

export default function CheckoutBuilderPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: productId } = params;
  const [config, setConfig] = useState<CheckoutComponentConfig | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/checkout-components/${productId}`)
      .then((res) => res.json())
      .then(({ data }) => setConfig(data));
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

  if (!config) return <p className="p-6 text-gray-500">Memuat...</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Komponen Formulir</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setDevice("desktop")}
            className={`text-xs px-3 py-1 rounded ${
              device === "desktop" ? "bg-blue-600 text-white" : "border"
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`text-xs px-3 py-1 rounded ${
              device === "mobile" ? "bg-blue-600 text-white" : "border"
            }`}
          >
            Mobile
          </button>
        </div>
      </div>

      <div className="space-y-4 max-w-xl">
        <HeaderSettings
          config={config.header}
          onChange={(header) => setConfig({ ...config, header })}
        />
        <ContentSettings
          config={config.content}
          onChange={(content) => setConfig({ ...config, content })}
        />
        <FooterSettings
          config={config.footer}
          onChange={(footer) => setConfig({ ...config, footer })}
        />

        <div className="flex gap-3 justify-end pt-2">
          <button className="border px-6 py-2 rounded-lg">Batal</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}