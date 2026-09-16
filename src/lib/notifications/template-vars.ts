import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

interface TemplateVarsInput {
  order: Order;
  product: Product;
}

// Replace {nama}, {no_order}, {nama_produk}, {total_bayar}, {link_produk} dst
export function renderTemplate(template: string, { order, product }: TemplateVarsInput): string {
  const vars: Record<string, string> = {
    nama: order.buyer_name,
    no_order: order.order_number,
    nama_produk: product.name,
    total_bayar: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(order.total),
    link_produk: product.digital_link_url ?? "",
  };

  return template.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match);
}