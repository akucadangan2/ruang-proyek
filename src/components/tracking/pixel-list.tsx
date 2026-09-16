"use client";

import { useEffect, useState, useCallback } from "react";
import { formatDate } from "@/lib/utils";
import type { Pixel, PixelPlatform } from "@/types/pixel";

const PLATFORMS: { key: PixelPlatform; label: string }[] = [
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "Tiktok" },
  { key: "google_ads", label: "Google Ads" },
  { key: "gtm", label: "Google Tag Manager" },
  { key: "snack_video", label: "Snack Video" },
];

export function PixelList() {
  const [platform, setPlatform] = useState<PixelPlatform>("facebook");
  const [search, setSearch] = useState("");
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchPixels = useCallback(async () => {
    const params = new URLSearchParams({ platform });
    if (search) params.set("search", search);
    const res = await fetch(`/api/pixels?${params.toString()}`);
    const { data } = await res.json();
    setPixels(data ?? []);
  }, [platform, search]);

  useEffect(() => {
    fetchPixels();
  }, [fetchPixels]);

  async function toggleServerSide(pixel: Pixel) {
    await fetch(`/api/pixels/${pixel.id}`, {
      method: "PATCH",
      body: JSON.stringify({ server_side_enabled: !pixel.server_side_enabled }),
    });
    fetchPixels();
  }

  async function deletePixel(id: string) {
    await fetch(`/api/pixels/${id}`, { method: "DELETE" });
    fetchPixels();
  }

  return (
    <div>
      <div className="flex gap-6 border-b mb-4">
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPlatform(p.key)}
            className={`pb-2 text-sm ${
              platform === p.key
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Cari Pixel Name, ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-72"
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Add New Pixel
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-2">Pixel Name</th>
            <th>Pixel Id</th>
            <th>Server Side</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pixels.map((pixel) => (
            <tr key={pixel.id} className="border-b">
              <td className="py-3 font-medium">{pixel.pixel_name}</td>
              <td>{pixel.pixel_id}</td>
              <td>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pixel.server_side_enabled}
                    onChange={() => toggleServerSide(pixel)}
                  />
                  {pixel.server_side_enabled ? "Enable" : "Disable"}
                </label>
              </td>
              <td>{formatDate(pixel.created_at)}</td>
              <td className="text-right space-x-3">
                <button className="text-blue-600">Edit</button>
                <button onClick={() => deletePixel(pixel.id)} className="text-red-500">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <PixelFormModal
          platform={platform}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchPixels();
          }}
        />
      )}
    </div>
  );
}

function PixelFormModal({
  platform,
  onClose,
  onSaved,
}: {
  platform: PixelPlatform;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    pixel_id: "",
    pixel_name: "",
    server_side_enabled: false,
    access_token: "",
    trigger_condition: "when_order_completed",
    event_value_field: "total_price",
    test_event_code: "",
    apply_to_all_products: true,
  });

  async function handleSubmit() {
    await fetch("/api/pixels", {
      method: "POST",
      body: JSON.stringify({ ...form, platform }),
    });
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[480px] space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Tambah Pixel ID</h3>
          <button onClick={onClose}>×</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Pixel Id"
            value={form.pixel_id}
            onChange={(e) => setForm({ ...form, pixel_id: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Pixel Name"
            value={form.pixel_name}
            onChange={(e) => setForm({ ...form, pixel_name: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.server_side_enabled}
            onChange={(e) => setForm({ ...form, server_side_enabled: e.target.checked })}
          />
          Server Side
        </label>

        {form.server_side_enabled && (
          <>
            <input
              placeholder="Access Token"
              value={form.access_token}
              onChange={(e) => setForm({ ...form, access_token: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm w-full"
            />
            <input
              placeholder="Test_event_code"
              value={form.test_event_code}
              onChange={(e) => setForm({ ...form, test_event_code: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm w-full"
            />
          </>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.apply_to_all_products}
            onChange={(e) => setForm({ ...form, apply_to_all_products: e.target.checked })}
          />
          Semua Produk
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg text-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}