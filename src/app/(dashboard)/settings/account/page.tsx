"use client";

import { useEffect, useState } from "react";
import { SectionCard } from "@/components/ui/section-card";
import { IconUsers } from "@/components/ui/icons";

export default function AccountSettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/account")
      .then((res) => res.json())
      .then(({ data }) => {
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/account", {
      method: "PATCH",
      body: JSON.stringify({
        name,
        phone,
        new_password: newPassword || undefined,
      }),
    });

    if (res.ok) {
      setMessage("Perubahan berhasil disimpan.");
      setNewPassword("");
    } else {
      const { error } = await res.json();
      setMessage(error ?? "Gagal menyimpan perubahan.");
    }
    setSaving(false);
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <div>
        <h1 className="text-[18px] font-semibold text-ink tracking-tight">Account Settings</h1>
        <p className="text-[12px] text-ink-soft mt-0.5">Kelola informasi akun kamu.</p>
      </div>

      {message && (
        <p className="text-[12px] text-ink bg-accent-soft/40 border border-accent-soft rounded-md p-2.5">
          {message}
        </p>
      )}

      <SectionCard icon={<IconUsers className="w-4 h-4" />} title="Profil">
        <div className="space-y-4">
          <div>
            <label className="text-[12px] text-ink-soft mb-1 block">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div>
            <label className="text-[12px] text-ink-soft mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] bg-paper text-ink-soft"
            />
            <p className="text-[11px] text-ink-soft mt-1">Email tidak bisa diubah dari sini.</p>
          </div>

          <div>
            <label className="text-[12px] text-ink-soft mb-1 block">Nomor Telepon</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Ganti Password" description="Kosongkan kalau tidak ingin mengubah password">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Password baru"
          className="border border-line rounded-md px-3 py-2.5 w-full text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
        />
      </SectionCard>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-ink hover:bg-ink/90 text-white px-6 py-2.5 rounded-md text-[13px] font-medium disabled:opacity-40 transition-colors"
      >
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}