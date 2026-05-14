import type { UserRole } from "@/types/auth";

const roleWeight: Record<UserRole, number> = {
  viewer: 0,
  registered: 1,
  editor: 2,
  admin: 3,
  super_admin: 4,
};

export function hasRequiredRole(
  currentRole: UserRole | null | undefined,
  allowedRoles: UserRole[],
) {
  if (!currentRole) {
    return false;
  }

  return allowedRoles.some(
    (allowedRole) => roleWeight[currentRole] >= roleWeight[allowedRole],
  );
}
