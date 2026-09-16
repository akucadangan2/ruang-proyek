import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

// GET /api/products — list produk milik owner, support search & filter status
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status"); // "active" | "inactive" | null

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let query = supabase
    .from("products")
    .select("*, product_images(url, sort_order)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (search) query = query.ilike("name", `%${search}%`);
  if (status === "active") query = query.eq("is_active", true);
  if (status === "inactive") query = query.eq("is_active", false);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

// POST /api/products — buat produk baru
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);

  const { data, error } = await supabase
    .from("products")
    .insert({
      owner_id: user.id,
      name: body.name,
      slug,
      description: body.description ?? null,
      normal_price: body.normal_price,
      discount_price: body.discount_price ?? null,
      cost_price: body.cost_price ?? null,
      sku: body.sku ?? null,
      digital_type: body.digital_type,
      digital_file_url: body.digital_file_url ?? null,
      digital_link_url: body.digital_link_url ?? null,
      digital_text_content: body.digital_text_content ?? null,
      access_restricted: body.access_restricted ?? false,
      auto_slide_images: body.auto_slide_images ?? false,
      utm_enabled: body.utm_enabled ?? false,
      is_active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Insert default formulir pemesanan
  if (data) {
    await supabase.from("order_form_fields").insert([
      { product_id: data.id, key: "nama", label: "Nama", required: true, enabled: true, sort_order: 0 },
      { product_id: data.id, key: "no_hp", label: "No Handphone/WhatsApp", required: true, enabled: true, sort_order: 1 },
      { product_id: data.id, key: "email", label: "Email", required: true, enabled: true, sort_order: 2 },
    ]);
  }

  return NextResponse.json({ data }, { status: 201 });
}