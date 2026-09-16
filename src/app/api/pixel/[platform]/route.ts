import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendFacebookCapiEvent } from "@/lib/pixel/facebook-capi";
import { sendTiktokCapiEvent } from "@/lib/pixel/tiktok-capi";

// POST /api/pixel/facebook  atau  /api/pixel/tiktok
// Dipanggil dari webhook Midtrans atau saat status order berubah
export async function POST(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { platform } = params;
  const supabase = await createClient();
  const { pixelId, eventName, eventValue } = await request.json();

  const { data: pixel, error } = await supabase
    .from("pixels")
    .select("*")
    .eq("id", pixelId)
    .single();

  if (error || !pixel)
    return NextResponse.json({ error: "Pixel tidak ditemukan" }, { status: 404 });

  if (!pixel.server_side_enabled || !pixel.access_token) {
    return NextResponse.json({ error: "Server-side tracking belum aktif" }, { status: 400 });
  }

  try {
    if (platform === "facebook") {
      await sendFacebookCapiEvent({
        pixelId: pixel.pixel_id,
        accessToken: pixel.access_token,
        eventName,
        eventValue,
        testEventCode: pixel.test_event_code ?? undefined,
      });
    } else if (platform === "tiktok") {
      await sendTiktokCapiEvent({
        pixelId: pixel.pixel_id,
        accessToken: pixel.access_token,
        eventName,
        eventValue,
      });
    } else {
      return NextResponse.json({ error: "Platform belum didukung" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal kirim event" },
      { status: 500 }
    );
  }
}