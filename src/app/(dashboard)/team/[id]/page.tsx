"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MemberForm } from "@/components/team/member-form";
import { PermissionMatrix } from "@/components/team/permission-matrix";
import type { Member, OrderAccessScope, MemberPermission } from "@/types/member";

export default function EditMemberPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const [member, setMember] = useState<Partial<Member>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id === "new") {
      setMember({
        name: "",
        email: "",
        phone: "",
        role: "Admin",
        order_access_scope: "semua",
        permissions: [],
      });
      return;
    }
    fetch(`/api/team/${id}`)
      .then((res) => res.json())
      .then(({ data }) => setMember(data));
  }, [id]);

  function updateField(field: string, value: string) {
    setMember((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const isNew = id === "new";
    await fetch(isNew ? "/api/team" : `/api/team/${id}`, {
      method: isNew ? "POST" : "PATCH",
      body: JSON.stringify(member),
    });
    setSaving(false);
    router.push("/team");
  }

  if (!member.name && id !== "new") return <p className="p-6 text-gray-500">Memuat...</p>;

  return (
    <div className="p-6 max-w-3xl space-y-4">
      <h1 className="text-xl font-semibold">{member.name || "Edit Member"}</h1>

      <MemberForm
        name={member.name ?? ""}
        email={member.email ?? ""}
        phone={member.phone ?? ""}
        role={member.role ?? "Admin"}
        orderAccessScope={(member.order_access_scope as OrderAccessScope) ?? "semua"}
        onChange={updateField}
      />

      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-3">Permission</h3>
        <PermissionMatrix
          permissions={(member.permissions as MemberPermission[]) ?? []}
          onChange={(permissions) => setMember((prev) => ({ ...prev, permissions }))}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.push("/team")}
          className="border px-6 py-2 rounded-lg"
        >
          Batalkan
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}