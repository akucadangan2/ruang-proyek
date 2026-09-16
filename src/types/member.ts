export type PermissionAction = string;

export type PermissionModule =
  | "dashboard"
  | "laporan_penjualan"
  | "produk"
  | "order"
  | "landing_page"
  | "pembayaran"
  | "team_member"
  | "product_reports"
  | "stok"
  | "transaction"
  | "statistik"
  | "custom_domain"
  | "notifikasi"
  | "tracking"
  | "follow_up_manual"
  | "balance";

export type OrderAccessScope = "semua" | "hanya_diassign" | "hanya_produk_diassign";

export interface MemberPermission {
  module: PermissionModule;
  actions: PermissionAction[];
  sub_permissions?: Record<string, string[]>;
}

export interface Member {
  id: string;
  owner_id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  order_access_scope: OrderAccessScope;
  permissions: MemberPermission[];
  created_at: string;
}