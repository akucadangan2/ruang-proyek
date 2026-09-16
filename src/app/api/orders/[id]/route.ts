import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendFacebookCapiEvent } from "@/lib/pixel/facebook-capi";
import { logPixelEvent } from "@/lib/pixel/log-event";
import type { OrderStatus, PaymentStatus } from "@/types/order";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, products(name, digital_link_url, owner_id)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();
  const body = await request.json();

  const { data: order, error } = await supabase
    .from("orders")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*, products(name, owner_id)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const newStatus = body.status as OrderStatus | undefined;
  const newPaymentStatus = body.payment_status as PaymentStatus | undefined;

  // Trigger pixel Purchase event kalau order baru aja jadi completed
  if (newStatus === "completed" || newPaymentStatus === "terbayar") {
    const serviceSupabase = createServiceClient();
    const { data: pixels } = await serviceSupabase
      .from("pixels")
      .select("*")
      .eq("owner_id", order.products.owner_id)
      .eq("server_side_enabled", true)
      .eq("trigger_condition", "when_order_completed");

    for (const pixel of pixels ?? []) {
      const payload = {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        custom_data: { value: order.total, currency: "IDR" },
      };

      try {
        if (pixel.platform === "facebook") {
          const response = await sendFacebookCapiEvent({
            pixelId: pixel.pixel_id,
            accessToken: pixel.access_token,
            eventName: "Purchase",
            eventValue: order.total,
            testEventCode: pixel.test_event_code ?? undefined,
          });
          await logPixelEvent({
            orderId: id,
            pixelId: pixel.id,
            platform: pixel.platform,
            eventName: "Purchase",
            status: "success",
            payload,
            response,
          });
        }
      } catch (err) {
        await logPixelEvent({
          orderId: id,
          pixelId: pixel.id,
          platform: pixel.platform,
          eventName: "Purchase",
          status: "failed",
          payload,
          response: { error: err instanceof Error ? err.message : "Unknown error" },
        });
      }
    }

    // Follow up WA "produk terkirim" tetap jalan seperti sebelumnya
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    fetch(`${appUrl}/api/notifications/fonnte`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: id, scenario: "produk_terkirim" }),
    })
      .then(async (res) => {
        const body = await res.json();
        console.log("[fonnte trigger]", res.status, body);
      })
      .catch((err) => console.error("[fonnte trigger] gagal fetch:", err.message));

    // Notif Telegram khusus konfirmasi pembayaran
    fetch(`${appUrl}/api/notifications/telegram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: id, type: "payment" }),
    }).catch(() => {});
  }

  return NextResponse.json({ data: order });
}