"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { IconPackage } from "@/components/ui/icons";

interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  normal_price: number;
  discount_price: number | null;
  product_images: { url: string; sort_order: number }[];
}

export default function KatalogPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/products")
      .then((res) => res.json())
      .then(({ data }) => setProducts(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.jpg" alt="Ruang Kerja" className="h-9 w-auto object-contain" />
          </Link>
          <nav className="flex items-center gap-4 text-[13px]">
            <Link href="/" className="text-ink-soft hover:text-ink">Beranda</Link>
            <Link href="/login" className="text-ink-soft hover:text-ink">Masuk</Link>
            <Link
              href="/register"
              className="bg-ink hover:bg-ink/90 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-[24px] font-bold text-ink tracking-tight">Katalog Produk</h1>
        <p className="text-[14px] text-ink-soft mt-1">
          Produk digital yang dijual oleh seller di platform Ruang Kerja.
        </p>

        {loading ? (
          <p className="text-[13px] text-ink-soft py-16 text-center">Memuat...</p>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-line rounded-lg py-20 flex flex-col items-center gap-3 text-center mt-6">
            <IconPackage className="w-8 h-8 text-ink-soft" />
            <p className="text-[13px] text-ink-soft">Belum ada produk yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {products.map((product) => {
              const image = product.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0];
              return (
                <Link
                  key={product.id}
                  href={`/${product.slug}`}
                  className="bg-white border border-line rounded-lg overflow-hidden hover:border-ink-soft transition-colors"
                >
                  <div className="aspect-video bg-paper border-b border-line flex items-center justify-center">
                    {image ? (
                      <img src={image.url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <IconPackage className="w-6 h-6 text-ink-soft" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-[13px] text-ink line-clamp-1">{product.name}</p>
                    {product.description && (
                      <p className="text-[12px] text-ink-soft mt-1 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {product.discount_price ? (
                        <>
                          <span className="font-semibold text-[13px] text-accent tabular-nums">
                            {formatRupiah(product.discount_price)}
                          </span>
                          <span className="text-[12px] text-ink-soft line-through tabular-nums">
                            {formatRupiah(product.normal_price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-[13px] text-accent tabular-nums">
                          {formatRupiah(product.normal_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <footer className="border-t border-line bg-white mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 text-[12px] text-ink-soft">
          <p>© 2026 Ruang Kerja. Seluruh transaksi diproses melalui payment gateway resmi.</p>
        </div>
      </footer>
    </div>
  );
}