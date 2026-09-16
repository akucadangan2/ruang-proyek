"use client";

import type { OrderAccessScope } from "@/types/member";

interface MemberFormProps {
  name: string;
  email: string;
  phone: string;
  role: string;
  orderAccessScope: OrderAccessScope;
  onChange: (field: string, value: string) => void;
  onChangePassword?: () => void;
}

const SCOPE_LABELS: Record<OrderAccessScope, string> = {
  semua: "Lihat Semua Order",
  hanya_diassign: "Hanya Order yang Diassign",
  hanya_produk_diassign: "Hanya Produk yang Diassign",
};

export function MemberForm({
  name,
  email,
  phone,
  role,
  orderAccessScope,
  onChange,
  onChangePassword,
}: MemberFormProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="font-medium">Member Profile</h3>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-600">Nama Lengkap</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            className="border rounded-lg px-3 py-2 w-full mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            className="border rounded-lg px-3 py-2 w-full mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Nomor Telepon</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="border rounded-lg px-3 py-2 w-full mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Role</label>
          <select
            value={role}
            onChange={(e) => onChange("role", e.target.value)}
            className="border rounded-lg px-3 py-2 w-full mt-1"
          >
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <button
            onClick={onChangePassword}
            className="border rounded-lg px-3 py-2 w-full mt-1 text-left text-sm"
          >
            Change Password
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-2">Scope Akses Order</label>
        <div className="flex gap-4">
          {(Object.keys(SCOPE_LABELS) as OrderAccessScope[]).map((scope) => (
            <label key={scope} className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="order_access_scope"
                checked={orderAccessScope === scope}
                onChange={() => onChange("order_access_scope", scope)}
              />
              {SCOPE_LABELS[scope]}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}