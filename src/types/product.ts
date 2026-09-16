export type ProductDigitalType = "file" | "link" | "text";

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
}

export interface Product {
  id: string;
  owner_id: string;
  name: string;
  slug: string; // dipakai di URL checkout: ruangkerja.id/slug
  description: string | null;
  is_active: boolean;

  // Harga
  normal_price: number;
  discount_price: number | null;
  cost_price: number | null; // Harga Jual / HPP
  sku: string | null;

  // Produk digital
  digital_type: ProductDigitalType;
  digital_file_url: string | null;
  digital_link_url: string | null;
  digital_text_content: string | null;
  access_restricted: boolean;

  // Builder
  auto_slide_images: boolean;
  utm_enabled: boolean;

  created_at: string;
  updated_at: string;
}

export interface OrderBump {
  id: string;
  product_id: string; // produk utama yang nawarin bump ini
  bump_product_id: string; // produk yang jadi bump
  auto_checked: boolean;
  sort_order: number;
}

export type OrderFormFieldKey =
  | "nama"
  | "no_hp"
  | "email"
  | "jumlah_pesanan"
  | "catatan"
  | string; // custom field key

export interface OrderFormField {
  id: string;
  product_id: string;
  key: OrderFormFieldKey;
  label: string;
  required: boolean;
  enabled: boolean;
  sort_order: number;
}