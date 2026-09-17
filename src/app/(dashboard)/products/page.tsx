"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { IconPackage, IconArrowUpDown, IconCopy, IconTrash } from "@/components/ui/icons";
import type { Product } from "@/types/product";

interface ProductStats {
  pesanan: number;
  sudah_dibayar: number;
  rasio_bayar: number;
  jumlah_terjual: number;
  pendapatan_bersih: number;
}

interface ProductRow extends Product {
  product_images?: { url: string; sort_order: number }[];
  stats: ProductStats;
}

type SortKey = "name" | "normal_price" | "pesanan" | "sudah_dibayar" | "rasio_bayar" | "jumlah_terjual" | "pendapatan_bersih";

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "name", label: "Nama Produk" },
  { key: "normal_price", label: "Harga", align: "right" },
  { key: "pesanan", label: "Pesanan", align: "right" },
  { key: "sudah_dibayar", label: "Sudah Dibayar", align: "right" },
  { key: "rasio_bayar", label: "Rasio Bayar", align: "right" },
  { key: "jumlah_terjual", label: "Jumlah Terjual", align: "right" },
  { key: "pendapatan_bersih", label: "Pendapatan Bersih", align: "right" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

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

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    copy.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      if (sortKey === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortKey === "normal_price") {
        valA = a.discount_price ?? a.normal_price;
        valB = b.discount_price ?? b.normal_price;
      } else {
        valA = a.stats[sortKey];
        valB = b.stats[sortKey];
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [products, sortKey, sortDir]);

  function toggleSelectAll() {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  }

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function toggleActive(product: ProductRow) {
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[18px] font-semibold text-ink tracking-tight">Tampilan List Produk</h1>
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
        <div className="border border-line rounded-lg overflow-x-auto bg-white">
          <table className="w-full text-[13px] min-w-[900px]">
            <thead>
              <tr className="text-left text-ink-soft bg-paper border-b border-line text-[12px]">
                <th className="py-2.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selectedIds.size === products.length}
                    onChange={toggleSelectAll}
                    className="accent-ink"
                  />
                </th>
                {COLUMNS.map((col) => (
                  <th key={col.key} className={`font-medium ${col.align === "right" ? "text-right pr-4" : ""}`}>
                    <button
                      onClick={() => handleSort(col.key)}
                      className={`flex items-center gap-1 hover:text-ink ${
                        col.align === "right" ? "ml-auto" : ""
                      } ${sortKey === col.key ? "text-ink font-semibold" : ""}`}
                    >
                      {col.label}
                      <IconArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sortedProducts.map((product) => {
                const image = product.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0];
                return (
                  <tr key={product.id} className="group">
                    <td className="py-3 px-4 align-top">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelectOne(product.id)}
                        className="accent-ink"
                      />
                    </td>
                    <td className="align-top py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={image?.url ?? ""}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded border border-line bg-paper shrink-0"
                        />
                        <div>
                          <Link href={`/products/${product.id}`} className="font-medium text-ink hover:text-accent">
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-3 mt-1 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/products/${product.id}/checkout-builder`} className="text-accent">
                              Checkout
                            </Link>
                            <Link href={`/orders?product_id=${product.id}`} className="text-accent">
                              Orders
                            </Link>
                            <button onClick={() => toggleActive(product)} className="text-ink-soft">
                              {product.is_active ? "Nonaktifkan" : "Aktifkan"}
                            </button>
                            <button onClick={() => duplicateProduct(product.id)} className="text-ink-soft" title="Duplikat">
                              <IconCopy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="align-top py-3 pr-4 text-right tabular-nums text-ink">
                      {formatRupiah(product.discount_price ?? product.normal_price)}
                    </td>
                    <td className="align-top py-3 pr-4 text-right tabular-nums text-ink">{product.stats.pesanan}</td>
                    <td className="align-top py-3 pr-4 text-right tabular-nums text-ink">{product.stats.sudah_dibayar}</td>
                    <td className="align-top py-3 pr-4 text-right tabular-nums text-ink">
                      {product.stats.rasio_bayar.toFixed(2)} %
                    </td>
                    <td className="align-top py-3 pr-4 text-right tabular-nums text-ink">{product.stats.jumlah_terjual}</td>
                    <td className="align-top py-3 pr-4 text-right tabular-nums text-ink">
                      {formatRupiah(product.stats.pendapatan_bersih)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}