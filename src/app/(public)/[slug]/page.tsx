"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import type { Product, ProductImage } from "@/types/product";

interface ProductPageData {
  product: Product & { product_images: ProductImage[] };
}

export default function PublicLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [data, setData] = useState<ProductPageData | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch(`/api/public/products/${slug}`)
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [slug]);

  if (!data) return <p className="p-6 text-center text-gray-500">Memuat...</p>;

  const { product } = data;
  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];

  return (
    <div className="max-w-xl mx-auto p-4">
      {images.length > 0 && (
        <div className="mb-4">
          <img
            src={images[activeImage]?.url}
            alt={product.name}
            className="w-full aspect-video object-cover rounded-xl"
          />
          {images.length > 1 && (
            <div className="flex gap-2 mt-2 justify-center">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`w-2 h-2 rounded-full ${
                    i === activeImage ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <h1 className="text-2xl font-bold">{product.name}</h1>

      <div className="flex items-center gap-2 mt-2">
        {product.discount_price ? (
          <>
            <span className="text-xl font-bold text-blue-600">
              {formatRupiah(product.discount_price)}
            </span>
            <span className="text-gray-400 line-through">
              {formatRupiah(product.normal_price)}
            </span>
          </>
        ) : (
          <span className="text-xl font-bold text-blue-600">
            {formatRupiah(product.normal_price)}
          </span>
        )}
      </div>

      {product.description && (
        <p className="text-gray-600 mt-4 whitespace-pre-line">{product.description}</p>
      )}

      <Link
        href={`/checkout/${product.slug}`}
        className="block text-center bg-blue-600 text-white rounded-xl py-3 mt-6 font-medium"
      >
        Beli Sekarang
      </Link>
    </div>
  );
}