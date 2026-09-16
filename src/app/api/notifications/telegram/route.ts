import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendTelegramMessage, toWaLink } from "@/lib/telegram/client";
import { formatRupiah, formatDate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const supabase = createServiceClient();
  const { order_id, type } = await request.json(); // type: "new_order" (default) | "payment"

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, products(*)")
    .eq("id", order_id)
    .single();

  if (orderError || !order) {
    console.error("[telegram] order tidak ketemu:", orderError?.message);
    return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  }

  const { data: settings } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("owner_id", order.products.owner_id)
    .maybeSingle();

  if (!settings?.telegram_enabled || !settings.telegram_bot_token || !settings.telegram_chat_id) {
    return NextResponse.json({ error: "Telegram belum diatur" }, { status: 400 });
  }

  // Assignee: fitur assign order ke staff belum dibangun UI-nya, jadi selalu "-" untuk sekarang
  let assigneeName = "-";
  if (order.assignee_id) {
    const { data: assignee } = await supabase
      .from("members")
      .select("name")
      .eq("id", order.assignee_id)
      .maybeSingle();
    assigneeName = assignee?.name ?? "-";
  }

  let message: string;

  if (type === "payment") {
    message =
      `💰 *PEMBAYARAN*\n\n` +
      `${order.products.name}\n` +
      `Waktu: ${formatDate(new Date().toISOString())} WIB\n\n` +
      `Order ID: ${order.order_number}\n` +
      `Payment Method: ${order.payment_method ?? "-"}\n\n` +
      `Nama: ${order.buyer_name}\n` +
      `Telepon: ${order.buyer_phone}\n` +
      `Alamat: ${order.address ?? "-"}`;
  } else {
    message =
      `🎉 *PESANAN BARU*\n\n` +
      `${order.products.name}\n\n` +
      `Assignee: ${assigneeName}\n\n` +
      `Cepat cek detailnya dan siap-siap kirim!\n\n` +
      `Order ID: ${order.order_number}\n` +
      `Nama Customer: ${order.buyer_name}\n` +
      `Nomor HP: ${order.buyer_phone}\n` +
      `Alamat: ${order.address ?? "-"}\n` +
      `Nama Produk: ${order.products.name}\n\n` +
      `Total: ${formatRupiah(order.total)}\n` +
      `Metode Pembayaran: ${order.payment_method ?? "-"}\n` +
      `Notes: ${order.note ?? "-"}`;
  }

  try {
    await sendTelegramMessage({
      botToken: settings.telegram_bot_token,
      chatId: settings.telegram_chat_id,
      message,
      buttonText: "Follow up di WhatsApp",
      buttonUrl: toWaLink(order.buyer_phone),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[telegram] gagal kirim:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal kirim notif Telegram" },
      { status: 500 }
    );
  }
}