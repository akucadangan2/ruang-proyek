import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils";
import { getOrderAccessFilter } from "@/lib/permissions/rbac";

// GET /api/orders?status=pending&search=...
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Cek apakah user ini owner atau member (buat filter scope akses order)
  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  let query = supabase
    .from("orders")
    .select("*, products!inner(id, name, owner_id)")
    .order("created_at", { ascending: false });

  if (member) {
    // Member — scope ke owner-nya + filter akses (lihat semua/diassign)
    query = query.eq("products.owner_id", member.owner_id);
    const accessFilter = getOrderAccessFilter(member);
    Object.entries(accessFilter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  } else {
    // Owner langsung
    query = query.eq("products.owner_id", user.id);
  }

  if (status) query = query.eq("status", status);
  if (search) {
    query = query.or(
      `buyer_name.ilike.%${search}%,order_number.ilike.%${search}%,buyer_phone.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/orders — dipanggil dari public checkout page saat buyer submit form
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  // Hitung total: harga produk + bump yg dipilih + admin fee + PPN - kupon
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", body.product_id)
    .single();

  if (productError || !product)
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

  const price = product.discount_price ?? product.normal_price;
  const bumpTotal = body.bump_total ?? 0;
  const adminFee = body.admin_fee ?? 0;
  const ppn = body.ppn ?? 0;
  const total = price * (body.quantity ?? 1) + bumpTotal + adminFee + ppn;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      product_id: body.product_id,
      order_number: generateOrderNumber(),
      buyer_name: body.buyer_name,
      buyer_phone: body.buyer_phone,
      buyer_email: body.buyer_email,
      quantity: body.quantity ?? 1,
      note: body.note ?? null,
      address: body.address ?? null,
      status: "created",
      payment_status: "belum_dibayar",
      payment_method: body.payment_method ?? null,
      subtotal: price * (body.quantity ?? 1),
      bump_total: bumpTotal,
      admin_fee: adminFee,
      ppn,
      total,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Trigger notifikasi order baru (Telegram) — fire and forget, gak nge-block response
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  fetch(`${appUrl}/api/notifications/telegram`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: data.id }),
  })
    .then(async (res) => {
      const body = await res.json();
      console.log("[telegram trigger]", res.status, body);
    })
    .catch((err) => console.error("[telegram trigger] gagal fetch:", err.message));

  return NextResponse.json({ data }, { status: 201 });
}