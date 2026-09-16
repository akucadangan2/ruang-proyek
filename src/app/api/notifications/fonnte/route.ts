import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendFonnteMessage } from "@/lib/fonnte/client";
import { renderTemplate } from "@/lib/notifications/template-vars";

export async function POST(request: NextRequest) {
  const supabase = createServiceClient();
  const { order_id, scenario } = await request.json();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, products(*)")
    .eq("id", order_id)
    .single();

  if (orderError || !order) {
    console.error("[fonnte] order tidak ketemu:", orderError?.message);
    return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  }

  const { data: template, error: templateError } = await supabase
    .from("notification_templates")
    .select("content")
    .eq("owner_id", order.products.owner_id)
    .eq("scenario", scenario)
    .maybeSingle();

  if (templateError) {
    console.error("[fonnte] gagal ambil template:", templateError.message);
  }

  if (!template) {
    console.error(`[fonnte] template belum diatur untuk scenario "${scenario}"`);
    return NextResponse.json({ error: "Template belum diatur" }, { status: 400 });
  }

  const message = renderTemplate(template.content, {
    order,
    product: order.products,
  });

  try {
    const result = await sendFonnteMessage({ target: order.buyer_phone, message });
    console.log("[fonnte] terkirim:", result);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[fonnte] gagal kirim:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal kirim WA" },
      { status: 500 }
    );
  }
}