"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { IconPackage } from "@/components/ui/icons";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);

    const res = await fetch(`/api/products?${params.toString()}`);
    const { data } = await res.json();
    setProducts(data ?? []);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  async function toggleActive(product: Product) {
    await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: !product.is_active }),
    });
    fetchProducts();
  }

  async function duplicateProduct(id: string) {
    await fetch(`/api/products/${id}/duplicate`, { method: "POST" });
    fetchProducts();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[18px] font-semibold text-ink tracking-tight">Katalog Produk</h1>
          <p className="text-[12px] text-ink-soft mt-0.5">Kelola semua produk yang kamu jual.</p>
        </div>
        <Link
          href="/products/new"
          className="bg-ink hover:bg-ink/90 text-white px-4 py-2.5 rounded-md text-[13px] font-medium transition-colors"
        >
          + Tambah Produk
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-line rounded-md px-3 py-2.5 flex-1 text-[13px] outline-none focus:ring-2 focus:ring-accent/30 bg-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="border border-line rounded-md px-3 py-2.5 text-[13px] outline-none bg-white"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>

      {loading ? (
        <p className="text-[13px] text-ink-soft py-8 text-center">Memuat...</p>
      ) : products.length === 0 ? (
        <div className="border border-dashed border-line rounded-lg py-16 flex flex-col items-center gap-3 text-center">
          <IconPackage className="w-8 h-8 text-ink-soft" />
          <div>
            <p className="text-[13px] font-medium text-ink">Belum ada produk</p>
            <p className="text-[12px] text-ink-soft mt-0.5">Mulai dengan menambahkan produk pertamamu.</p>
          </div>
        </div>
      ) : (
        <div className="border border-line rounded-lg divide-y divide-line bg-white">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4">
              <img
                src={(product as any).product_images?.[0]?.url ?? ""}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-md border border-line bg-paper shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[13px] text-ink truncate">{product.name}</p>
                <p className="text-[12px] text-ink-soft tabular-nums mt-0.5">
                  {formatRupiah(product.discount_price ?? product.normal_price)}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/${(product as any).slug}`);
                  }}
                  className="text-[11px] text-accent mt-0.5"
                >
                  /{(product as any).slug} · Copy Link
                </button>
              </div>
              <span
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium shrink-0 ${
                  product.is_active ? "bg-positive-soft text-positive" : "bg-paper text-ink-soft border border-line"
                }`}
              >
                {product.is_active ? "Aktif" : "Nonaktif"}
              </span>
              <div className="flex gap-4 text-[12px] shrink-0">
                <Link href={`/products/${product.id}`} className="text-ink hover:text-accent font-medium">
                  Edit
                </Link>
                <button onClick={() => toggleActive(product)} className="text-ink-soft hover:text-ink">
                  {product.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <button onClick={() => duplicateProduct(product.id)} className="text-ink-soft hover:text-ink">
                  Duplikat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}