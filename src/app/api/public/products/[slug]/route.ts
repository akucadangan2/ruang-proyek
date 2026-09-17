import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const supabase = createServiceClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      "*, product_images(*), order_bumps!product_id(*, bump_product:bump_product_id(id, name, normal_price, discount_price, description, product_images(url, sort_order))), order_form_fields(*)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (productError || !product) {
    console.error("[public/products] gagal ambil produk:", productError?.message);
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }

  const { data: checkoutConfig, error: configError } = await supabase
    .from("checkout_components")
    .select("*")
    .eq("product_id", product.id)
    .maybeSingle();

  if (configError) {
    console.error("[public/products] gagal ambil checkout config:", configError.message);
  }

  console.log(
    `[public/products] slug=${slug} order_form_fields=${product.order_form_fields?.length ?? 0} checkout_config=${!!checkoutConfig}`
  );

  return NextResponse.json({ data: { product, checkoutConfig } });
}