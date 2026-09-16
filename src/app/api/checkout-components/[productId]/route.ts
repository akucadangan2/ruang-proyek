import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CheckoutComponentConfig } from "@/types/checkout-component";

const DEFAULT_CONFIG: Omit<CheckoutComponentConfig, "id" | "product_id" | "updated_at"> = {
  header: {
    trust_badge: true,
    product_image: true,
    video: false,
    description_points: true,
  },
  content: {
    save_member_data: false,
    order_bump: true,
    payment_methods: {
      bank_transfer_enabled: true,
      e_payment_enabled: true,
      e_payment_channels: ["bri_va", "bca_va", "qris", "mandiri_va", "bni_va"],
      admin_fee_bearer: "seller",
    },
    tracking_enabled: false,
    unique_code_enabled: false,
    ppn_enabled: false,
    ppn_percentage: null,
  },
  footer: {
    coupon: false,
    other_text: true,
    order_count_social_proof: true,
    buy_button_enabled: true,
    buy_button_text: "Beli Sekarang",
    digital_product_label: true,
  },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("checkout_components")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Belum pernah disetup — kembalikan default (belum tersimpan ke DB)
  if (!data) {
    return NextResponse.json({
      data: { product_id: productId, ...DEFAULT_CONFIG },
    });
  }

  return NextResponse.json({ data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("checkout_components")
    .upsert(
      {
        product_id: productId,
        header: body.header,
        content: body.content,
        footer: body.footer,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "product_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}