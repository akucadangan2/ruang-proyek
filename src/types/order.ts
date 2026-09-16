export type OrderStatus =
  | "created"
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "completed"
  | "rts"
  | "canceled"
  | "refund";

export type PaymentStatus = "belum_dibayar" | "terbayar";

export interface Order {
  id: string;
  product_id: string;
  order_number: string; // kode unik per pembelian
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  quantity: number;
  note: string | null;

  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null; // bank_transfer | qris | va_bri | dll

  subtotal: number;
  bump_total: number;
  admin_fee: number;
  ppn: number;
  total: number;

  assignee_id: string | null; // untuk scope permission "hanya order yang diassign"

  created_at: string;
  updated_at: string;
}

export interface OrderStatusSummary {
  status: OrderStatus | "all";
  total_amount: number;
  count: number;
}