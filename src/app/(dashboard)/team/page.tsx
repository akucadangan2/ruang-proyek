"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Member } from "@/types/member";

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then(({ data }) => setMembers(data ?? []));
  }, []);

  async function removeMember(id: string) {
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Team Member</h1>
        <Link href="/team/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          + Tambah Member
        </Link>
      </div>

      <div className="grid gap-3">
        {members.map((member) => (
          <div key={member.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-500">{member.email} · {member.role}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/team/${member.id}`} className="text-blue-600">Edit</Link>
              <button onClick={() => removeMember(member.id)} className="text-red-500">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}