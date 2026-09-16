export type PixelPlatform =
  | "facebook"
  | "tiktok"
  | "google_ads"
  | "gtm"
  | "snack_video";

export type PixelEventName =
  | "AddToCart"
  | "InitiateCheckout"
  | "AddToWishlist"
  | "Purchase"
  | "Lead"
  | "AddPaymentInfo";

export type PixelTriggerMode = "every" | "once";

export interface Pixel {
  id: string;
  owner_id: string;
  platform: PixelPlatform;
  pixel_id: string;
  pixel_name: string;
  server_side_enabled: boolean;
  access_token: string | null; // untuk server-side (CAPI)
  trigger_condition: string | null; // misal "order_status:completed"
  event_value_field: string | null; // misal "total_price"
  test_event_code: string | null;
  apply_to_all_products: boolean;
  created_at: string;
}

export interface ProductPixelEvent {
  id: string;
  product_id: string;
  pixel_id: string;
  event_name: PixelEventName;
  trigger_mode: PixelTriggerMode;
}