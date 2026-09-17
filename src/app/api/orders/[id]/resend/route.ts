import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendFonnteMessage } from "@/lib/fonnte/client";
import { renderTemplate } from "@/lib/notifications/template-vars";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, products(*)")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  }

  if (order.products.owner_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data: template } = await supabase
    .from("notification_templates")
    .select("content")
    .eq("owner_id", user.id)
    .eq("scenario", "produk_terkirim")
    .maybeSingle();

  if (!template) {
    return NextResponse.json({ error: "Template 'Produk Terkirim' belum diatur di Follow Up Manual" }, { status: 400 });
  }

  const message = renderTemplate(template.content, { order, product: order.products });

  try {
    await sendFonnteMessage({ target: order.buyer_phone, message });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal kirim ulang" },
      { status: 500 }
    );
  }
}