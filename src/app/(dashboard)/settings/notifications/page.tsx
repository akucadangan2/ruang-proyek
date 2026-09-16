"use client";

import { useEffect, useState } from "react";

export default function NotificationsSettingsPage() {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/notification-settings")
      .then((res) => res.json())
      .then(({ data }) => {
        if (data) {
          setBotToken(data.telegram_bot_token ?? "");
          setChatId(data.telegram_chat_id ?? "");
          setEnabled(data.telegram_enabled ?? false);
        }
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/notification-settings", {
      method: "PUT",
      body: JSON.stringify({
        telegram_bot_token: botToken,
        telegram_chat_id: chatId,
        telegram_enabled: enabled,
      }),
    });
    setSaving(false);
  }

  return (
    <div className="p-6 max-w-lg space-y-4">
      <h1 className="text-xl font-semibold mb-2">Notifikasi Telegram</h1>
      <p className="text-sm text-gray-500">
        Bikin bot lewat <strong>@BotFather</strong> di Telegram, lalu masukkan token &
        chat ID tujuan di bawah.
      </p>

      <div>
        <label className="text-sm text-gray-600">Bot Token</label>
        <input
          type="text"
          value={botToken}
          onChange={(e) => setBotToken(e.target.value)}
          placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
          className="border rounded-lg px-3 py-2 w-full mt-1"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Chat ID Tujuan</label>
        <input
          type="text"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="-123456789 (grup) atau chat ID personal"
          className="border rounded-lg px-3 py-2 w-full mt-1"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span className="text-sm">Aktifkan notifikasi Telegram</span>
      </label>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
      >
        {saving ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  );
}