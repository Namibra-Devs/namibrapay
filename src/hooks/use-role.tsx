'use client';

import { createContext, useContext, useState } from "react";
import type { Role } from "@/lib/constants";
import { ROLES } from "@/lib/constants";

type RoleContextType = {
  role: Role;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextType>({
  role: ROLES.SUPER_ADMIN,
  setRole: () => undefined,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(ROLES.SUPER_ADMIN);
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  super_admin: [
    "merchants.view",
    "merchants.manage",
    "merchants.create",
    "merchants.edit",
    "merchants.suspend",
    "merchants.impersonate",
    "merchants.delete",
    "treasury.view",
    "treasury.approve",
    "compliance.view",
    "compliance.override",
    "support.view",
    "providers.view",
    "providers.edit",
    "routing.approve",
    "audit.view",
    "settings.view",
    "settings.edit",
  ],
  finance: [
    "treasury.view",
    "treasury.approve",
    "merchants.view",
    "audit.view",
    "settings.view",
  ],
  compliance: [
    "compliance.view",
    "compliance.approve",
    "merchants.view",
    "merchants.manage",
    "merchants.suspend",
    "audit.view",
    "settings.view",
  ],
  support: [
    "support.view",
    "merchants.view",
    "audit.view",
    "settings.view",
  ],
  platform_engineer: [
    "providers.view",
    "providers.edit",
    "audit.view",
    "settings.view",
    "merchants.view",
  ],
};

export function usePermission(permission: string): boolean {
  const { role } = useRole();
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
