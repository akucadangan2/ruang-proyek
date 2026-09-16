"use client";

import { useEffect, useState } from "react";

interface CustomDomain {
  id: string;
  domain: string;
  status: "pending" | "verified" | "failed";
  products?: { name: string } | null;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Verifikasi",
  verified: "Terverifikasi",
  failed: "Gagal",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-accent-soft text-accent",
  verified: "bg-positive-soft text-positive",
  failed: "bg-negative-soft text-negative",
};

export default function CustomDomainPage() {
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [adding, setAdding] = useState(false);

  function fetchDomains() {
    fetch("/api/custom-domains")
      .then((res) => res.json())
      .then(({ data }) => setDomains(data ?? []));
  }

  useEffect(() => {
    fetchDomains();
  }, []);

  async function addDomain() {
    if (!newDomain.trim()) return;
    setAdding(true);
    await fetch("/api/custom-domains", {
      method: "POST",
      body: JSON.stringify({ domain: newDomain.trim() }),
    });
    setNewDomain("");
    setAdding(false);
    fetchDomains();
  }

  async function removeDomain(id: string) {
    await fetch(`/api/custom-domains/${id}`, { method: "DELETE" });
    fetchDomains();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-ink tracking-tight">Custom Domain</h1>
        <p className="text-[12px] text-ink-soft mt-0.5">
          Hubungkan domain kamu sendiri ke landing page produk.
        </p>
      </div>

      <div className="border border-line rounded-lg p-4 bg-white">
        <label className="text-[12px] text-ink-soft mb-1 block">Tambah Domain Baru</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="contoh: toko.namamu.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            className="border border-line rounded-md px-3 py-2.5 flex-1 text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            onClick={addDomain}
            disabled={adding || !newDomain.trim()}
            className="bg-ink hover:bg-ink/90 text-white px-4 py-2.5 rounded-md text-[13px] font-medium disabled:opacity-40 transition-colors"
          >
            {adding ? "Menambah..." : "Tambah"}
          </button>
        </div>
      </div>

      {domains.length === 0 ? (
        <p className="text-[13px] text-ink-soft text-center py-8">Belum ada domain yang ditambahkan.</p>
      ) : (
        <div className="border border-line rounded-lg divide-y divide-line bg-white">
          {domains.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-[13px] text-ink">{d.domain}</p>
                {d.products?.name && (
                  <p className="text-[12px] text-ink-soft mt-0.5">→ {d.products.name}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[d.status]}`}>
                  {STATUS_LABEL[d.status]}
                </span>
                <button onClick={() => removeDomain(d.id)} className="text-negative text-[12px]">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}