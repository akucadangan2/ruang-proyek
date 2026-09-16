import { createServiceClient } from "@/lib/supabase/server";

interface LogPixelEventParams {
  orderId: string;
  pixelId: string;
  platform: string;
  eventName: string;
  status: "success" | "failed";
  payload?: unknown;
  response?: unknown;
}

export async function logPixelEvent(params: LogPixelEventParams) {
  const supabase = createServiceClient();
  await supabase.from("pixel_event_logs").insert({
    order_id: params.orderId,
    pixel_id: params.pixelId,
    platform: params.platform,
    event_name: params.eventName,
    status: params.status,
    payload: params.payload ?? null,
    response: params.response ?? null,
  });
}