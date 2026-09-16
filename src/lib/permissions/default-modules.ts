import type { PermissionModule } from "@/types/member";

export interface ModuleDefinition {
  key: PermissionModule;
  label: string;
  actions: string[]; // aksi checkbox utama, misal ["lihat","buat","edit","hapus"]
  subGroups?: {
    key: string; // misal "edit_order", "update_status"
    label: string;
    options: string[];
  }[];
}

export const PERMISSION_MODULES: ModuleDefinition[] = [
  { key: "dashboard", label: "Dashboard", actions: ["lihat"] },
  { key: "laporan_penjualan", label: "Laporan Penjualan", actions: ["lihat"] },
  {
    key: "produk",
    label: "Tambah Produk",
    actions: ["semua_produk", "buat", "lihat", "edit", "hapus"],
  },
  {
    key: "order",
    label: "Semua Order",
    actions: ["lihat", "input", "shipments", "hapus"],
    subGroups: [
      {
        key: "edit_order",
        label: "Edit Order",
        options: ["nama", "assignee", "no_telepon", "alamat", "produk_kuantitas", "payment"],
      },
      {
        key: "update_status",
        label: "Update Order Status",
        options: ["pending", "refund", "process", "complete", "cancel"],
      },
      {
        key: "update_payment_status",
        label: "Update Order Payment Status",
        options: ["terbayar", "belum_dibayar"],
      },
    ],
  },
  { key: "landing_page", label: "Landing Page", actions: ["atur_akses"] },
  { key: "pembayaran", label: "Pembayaran", actions: ["lihat", "update", "hapus", "halaman"] },
  {
    key: "team_member",
    label: "Team Member",
    actions: ["tambah", "lihat", "update", "hapus"],
  },
  { key: "product_reports", label: "Product Reports", actions: ["lihat"] },
  { key: "stok", label: "Stok", actions: ["lihat"] },
  { key: "transaction", label: "Transaction", actions: ["lihat"] },
  {
    key: "statistik",
    label: "Statistik",
    actions: [
      "lihat_statistik",
      "total_order",
      "total_terbayar",
      "rasio_terbayar",
      "cogs",
      "revenue_belum_dibayar",
      "bump_order",
      "bump_revenue",
      "discount_claim",
      "shipping_cost",
      "gross_revenue",
      "net_revenue",
      "gross_profit",
      "net_profit",
      "pengeluaran",
      "kuantitas_terjual",
    ],
  },
  { key: "custom_domain", label: "Custom Domain", actions: ["tambah", "lihat", "edit", "hapus"] },
  { key: "notifikasi", label: "Notifikasi", actions: ["lihat", "buat_akun_email"] },
  { key: "tracking", label: "Tracking", actions: ["lihat", "tambah", "hapus"] },
  {
    key: "follow_up_manual",
    label: "Follow Up Manual",
    actions: ["lihat", "buat_template", "edit_template"],
  },
  { key: "balance", label: "Balance", actions: ["lihat", "tambah", "withdraw", "riwayat"] },
];