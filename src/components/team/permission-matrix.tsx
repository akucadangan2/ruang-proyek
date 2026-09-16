"use client";

import { PERMISSION_MODULES } from "@/lib/permissions/default-modules";
import type { MemberPermission } from "@/types/member";

interface PermissionMatrixProps {
  permissions: MemberPermission[];
  onChange: (permissions: MemberPermission[]) => void;
}

export function PermissionMatrix({ permissions, onChange }: PermissionMatrixProps) {
  function getPerm(moduleKey: string) {
    return permissions.find((p) => p.module === moduleKey);
  }

  function toggleAction(moduleKey: string, action: string) {
    const existing = getPerm(moduleKey);
    const hasAction = existing?.actions.includes(action) ?? false;

    if (!existing) {
      onChange([...permissions, { module: moduleKey as any, actions: [action] }]);
      return;
    }

    const nextActions = hasAction
      ? existing.actions.filter((a) => a !== action)
      : [...existing.actions, action];

    onChange(
      permissions.map((p) =>
        p.module === moduleKey ? { ...p, actions: nextActions } : p
      )
    );
  }

  function toggleSubOption(moduleKey: string, groupKey: string, option: string) {
    const existing = getPerm(moduleKey);
    const current = existing?.sub_permissions?.[groupKey] ?? [];
    const has = current.includes(option);
    const nextOptions = has ? current.filter((o) => o !== option) : [...current, option];

    const nextPerm: MemberPermission = {
      module: moduleKey as any,
      actions: existing?.actions ?? [],
      sub_permissions: { ...existing?.sub_permissions, [groupKey]: nextOptions },
    };

    const exists = permissions.some((p) => p.module === moduleKey);
    onChange(
      exists
        ? permissions.map((p) => (p.module === moduleKey ? nextPerm : p))
        : [...permissions, nextPerm]
    );
  }

  return (
    <div className="space-y-5">
      {PERMISSION_MODULES.map((mod) => {
        const perm = getPerm(mod.key);
        return (
          <div key={mod.key} className="border-b pb-4">
            <p className="font-medium text-sm mb-2">{mod.label}</p>

            <div className="flex flex-wrap gap-4">
              {mod.actions.map((action) => (
                <label key={action} className="flex items-center gap-1 text-sm capitalize">
                  <input
                    type="checkbox"
                    checked={perm?.actions.includes(action) ?? false}
                    onChange={() => toggleAction(mod.key, action)}
                  />
                  {action.replace(/_/g, " ")}
                </label>
              ))}
            </div>

            {mod.subGroups?.map((group) => (
              <div key={group.key} className="ml-6 mt-2">
                <p className="text-xs text-gray-500 mb-1">{group.label}</p>
                <div className="flex flex-wrap gap-3">
                  {group.options.map((option) => (
                    <label key={option} className="flex items-center gap-1 text-xs capitalize">
                      <input
                        type="checkbox"
                        checked={
                          perm?.sub_permissions?.[group.key]?.includes(option) ?? false
                        }
                        onChange={() => toggleSubOption(mod.key, group.key, option)}
                      />
                      {option.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}