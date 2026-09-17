"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SectionCard } from "@/components/ui/section-card";
import { Toggle } from "@/components/ui/toggle";
import { IconImage } from "@/components/ui/icons";
import type { ProductImage } from "@/types/product";

interface ImageUploaderProps {
  productId: string;
  images: ProductImage[];
  autoSlide: boolean;
  onImagesChange: (images: ProductImage[]) => void;
  onAutoSlideChange: (value: boolean) => void;
}

export function ImageUploader({
  productId,
  images,
  autoSlide,
  onImagesChange,
  onAutoSlideChange,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    const uploaded: ProductImage[] = [];
    let uploadError: string | null = null;
    for (const file of Array.from(files)) {
      const filePath = `${productId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("product-images").upload(filePath, file);
      if (error) {
        uploadError = error.message;
        continue;
      }
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
      uploaded.push({
        id: crypto.randomUUID(),
        product_id: productId,
        url: urlData.publicUrl,
        sort_order: images.length + uploaded.length,
      });
    }
    if (uploadError) {
      alert(`Gagal upload foto: ${uploadError}`);
    }
    onImagesChange([...images, ...uploaded]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(id: string) {
    onImagesChange(images.filter((img) => img.id !== id));
  }

  return (
    <SectionCard icon={<IconImage className="w-4 h-4" />} title="Foto Produk">
      <div className="flex gap-3 flex-wrap mb-3">
        {images.map((img) => (
          <div key={img.id} className="relative w-20 h-20">
            <img
              src={img.url}
              alt="Produk"
              className="w-full h-full object-cover rounded-md border border-line"
            />
            <button
              onClick={() => removeImage(img.id)}
              className="absolute -top-2 -right-2 bg-negative text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-20 border border-dashed border-line rounded-md flex flex-col items-center justify-center text-[11px] text-ink-soft hover:border-accent hover:text-accent transition-colors"
        >
          <span className="text-base leading-none mb-1">+</span>
          {uploading ? "..." : "Tambah Photo"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileSelect} />
      </div>

      <p className="text-[12px] text-ink-soft mb-3">
        Kamu bisa menampilkan atau menyembunyikan gambar produk di halaman pembayaran.
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-line">
        <span className="text-[13px] text-ink">Aktifkan Geser Otomatis</span>
        <Toggle checked={autoSlide} onChange={onAutoSlideChange} />
      </div>
    </SectionCard>
  );
}