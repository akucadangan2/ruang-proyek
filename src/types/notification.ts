export type NotificationScenario =
  | "order_masuk"
  | "reminder_belum_bayar"
  | "pembayaran_berhasil"
  | "produk_terkirim";

export interface NotificationTemplate {
  id: string;
  owner_id: string;
  scenario: NotificationScenario;
  content: string; // pakai variable {nama}, {no_order}, dll
  updated_at: string;
}

export interface FollowUpRule {
  id: string;
  owner_id: string;
  scenario: NotificationScenario;
  template_id: string;
  delay_minutes: number; // misal 120 = 2 jam setelah trigger
  is_active: boolean;
}

export interface NotificationSettings {
  owner_id: string;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  telegram_enabled: boolean;
}