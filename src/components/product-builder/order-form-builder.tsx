"use client";

import { useState } from "react";
import type { OrderFormField } from "@/types/product";
import { SectionCard } from "@/components/ui/section-card";
import { IconClipboard, IconChevronUp, IconChevronDown } from "@/components/ui/icons";

interface OrderFormBuilderProps {
  fields: OrderFormField[];
  onChange: (fields: OrderFormField[]) => void;
}

const DEFAULT_FIELDS = ["nama", "no_hp", "email"];

export function OrderFormBuilder({ fields, onChange }: OrderFormBuilderProps) {
  const [newLabel, setNewLabel] = useState("");

  function toggleEnabled(id: string) {
    onChange(fields.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const next = [...fields];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((f, i) => ({ ...f, sort_order: i })));
  }

  function addCustomField() {
    if (!newLabel.trim()) return;
    const key = newLabel.toLowerCase().replace(/\s+/g, "_");
    onChange([
      ...fields,
      {
        id: crypto.randomUUID(),
        product_id: fields[0]?.product_id ?? "",
        key,
        label: newLabel,
        required: false,
        enabled: true,
        sort_order: fields.length,
      },
    ]);
    setNewLabel("");
  }

  function removeField(id: string) {
    onChange(fields.filter((f) => f.id !== id));
  }

  return (
    <SectionCard
      icon={<IconClipboard className="w-4 h-4" />}
      title="Formulir Pemesanan"
      description="Berisi informasi data yang akan diisi oleh pembeli"
    >
      <div className="space-y-2">
        {fields
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((field, index) => {
            const isDefault = DEFAULT_FIELDS.includes(field.key);
            return (
              <div key={field.id} className="flex items-center justify-between border border-line rounded-md p-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-paper text-ink-soft text-[10px] flex items-center justify-center border border-line">
                    {index + 1}
                  </span>
                  <div className="flex flex-col text-ink-soft">
                    <button onClick={() => move(index, -1)}>
                      <IconChevronUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => move(index, 1)}>
                      <IconChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="checkbox"
                    checked={field.enabled}
                    disabled={isDefault && field.required}
                    onChange={() => toggleEnabled(field.id)}
                    className="accent-ink"
                  />
                  <span className="text-[13px] text-ink">{field.label}</span>
                  {field.required && (
                    <span className="text-[10px] text-negative font-medium">Required</span>
                  )}
                </div>
                {!isDefault && (
                  <button onClick={() => removeField(field.id)} className="text-negative text-[12px]">
                    Hapus
                  </button>
                )}
              </div>
            );
          })}
      </div>

      <div className="flex gap-2 pt-3 mt-3 border-t border-line">
        <input
          type="text"
          placeholder="Nama field custom..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="border border-line rounded-md px-3 py-2 flex-1 text-[13px] outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          onClick={addCustomField}
          className="border border-line px-4 py-2 rounded-md text-[13px] text-ink-soft hover:bg-paper whitespace-nowrap"
        >
          + Tambah Form Lain
        </button>
      </div>
    </SectionCard>
  );
}
