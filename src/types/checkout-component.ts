export type PaymentMethodType = "bank_transfer" | "e_payment";

export type EPaymentChannel = "bri_va" | "bca_va" | "qris" | "mandiri_va" | "bni_va";

export type AdminFeeBearer = "seller" | "buyer";

export interface CheckoutHeaderConfig {
  trust_badge: boolean;
  product_image: boolean;
  video: boolean;
  description_points: boolean;
}

export interface CheckoutContentConfig {
  save_member_data: boolean;
  order_bump: boolean;
  payment_methods: {
    bank_transfer_enabled: boolean;
    e_payment_enabled: boolean;
    e_payment_channels: EPaymentChannel[]; // urutan sesuai array = urutan tampil
    admin_fee_bearer: AdminFeeBearer;
  };
  tracking_enabled: boolean;
  unique_code_enabled: boolean;
  ppn_enabled: boolean;
  ppn_percentage: number | null;
}

export interface CheckoutFooterConfig {
  coupon: boolean;
  other_text: boolean;
  order_count_social_proof: boolean;
  buy_button_enabled: boolean;
  buy_button_text: string;
  digital_product_label: boolean;
}

export interface CheckoutComponentConfig {
  id: string;
  product_id: string;
  header: CheckoutHeaderConfig;
  content: CheckoutContentConfig;
  footer: CheckoutFooterConfig;
  updated_at: string;
}