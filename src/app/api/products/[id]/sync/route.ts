import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { images, bumps, formFields } = await request.json();

  await supabase.from("product_images").delete().eq("product_id", id);
  if (images?.length) {
    const { error } = await supabase.from("product_images").insert(
      images.map((img: { url: string }, i: number) => ({ product_id: id, url: img.url, sort_order: i }))
    );
    if (error) console.error("[sync] gagal insert product_images:", error.message);
  }

  await supabase.from("order_bumps").delete().eq("product_id", id);
  if (bumps?.length) {
    const { error } = await supabase.from("order_bumps").insert(
      bumps.map((b: { bump_product_id: string; auto_checked: boolean }, i: number) => ({
        product_id: id,
        bump_product_id: b.bump_product_id,
        auto_checked: b.auto_checked,
        sort_order: i,
      }))
    );
    if (error) console.error("[sync] gagal insert order_bumps:", error.message);
  }

  await supabase.from("order_form_fields").delete().eq("product_id", id);
  if (formFields?.length) {
    const { error } = await supabase.from("order_form_fields").insert(
      formFields.map((f: { key: string; label: string; required: boolean; enabled: boolean }, i: number) => ({
        product_id: id,
        key: f.key,
        label: f.label,
        required: f.required,
        enabled: f.enabled,
        sort_order: i,
      }))
    );
    if (error) console.error("[sync] gagal insert order_form_fields:", error.message);
  }

  return NextResponse.json({ success: true });
}