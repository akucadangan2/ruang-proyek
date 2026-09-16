import type {
  Member,
  MemberPermission,
  PermissionAction,
  PermissionModule,
} from "@/types/member";

export function hasPermission(
  member: Member,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  const perm = member.permissions.find((p) => p.module === module);
  return perm ? perm.actions.includes(action) : false;
}

export function hasSubPermission(
  member: Member,
  module: PermissionModule,
  subKey: string,
  subValue: string
): boolean {
  const perm = member.permissions.find((p) => p.module === module);
  return perm?.sub_permissions?.[subKey]?.includes(subValue) ?? false;
}

// Dipakai buat filter query order sesuai scope akses member
export function getOrderAccessFilter(member: Member) {
  switch (member.order_access_scope) {
    case "hanya_diassign":
      return { assignee_id: member.id };
    case "hanya_produk_diassign":
      return { assigned_product_owner: member.id };
    default:
      return {}; // semua order
  }
}

export function findPermission(
  permissions: MemberPermission[],
  module: PermissionModule
): MemberPermission | undefined {
  return permissions.find((p) => p.module === module);
}