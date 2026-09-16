const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "src/app/(dashboard)/products/page.tsx"
);

const content = `"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
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

    const res = await fetch(\`/api/products?\${params.toString()}\`);
    const { data } = await res.json();
    setProducts(data ?? []);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  async function toggleActive(product: Product) {
    await fetch(\`/api/products/\${product.id}\`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: !product.is_active }),
    });
    fetchProducts();
  }

  async function duplicateProduct(id: string) {
    await fetch(\`/api/products/\${id}/duplicate\`, { method: "POST" });
    fetchProducts();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Katalog Produk</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">Belum ada produk.</p>
      ) : (
        <div className="grid gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 flex items-center gap-4"
            >
              <img
                src={(product as any).product_images?.[0]?.url ?? "/placeholder.png"}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {formatRupiah(product.discount_price ?? product.normal_price)}
                </p>
              </div>
              <span
                className={\`text-xs px-2 py-1 rounded-full \${
                  product.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }\`}
              >
                {product.is_active ? "Aktif" : "Nonaktif"}
              </span>
              <div className="flex gap-2">
                <Link
                  href={\`/products/\${product.id}\`}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleActive(product)}
                  className="text-sm text-gray-600"
                >
                  {product.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <button
                  onClick={() => duplicateProduct(product.id)}
                  className="text-sm text-gray-600"
                >
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
`;

fs.writeFileSync(filePath, content, "utf8");
console.log("Ditulis:", filePath);