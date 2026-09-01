'use client';

import { createContext, useContext, useState } from "react";
import type { MerchantRole } from "@/lib/merchant-constants";
import { MERCHANT_ROLES, MERCHANT_PERMISSIONS } from "@/lib/merchant-constants";

type MerchantRoleContextType = {
  role: MerchantRole;
  setRole: (role: MerchantRole) => void;
  can: (permission: string) => boolean;
};

const MerchantRoleContext = createContext<MerchantRoleContextType>({
  role: MERCHANT_ROLES.OWNER,
  setRole: () => undefined,
  can: () => false,
});

export function MerchantRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<MerchantRole>(MERCHANT_ROLES.OWNER);
  const can = (permission: string) =>
    MERCHANT_PERMISSIONS[role]?.includes(permission) ?? false;
  return (
    <MerchantRoleContext.Provider value={{ role, setRole, can }}>
      {children}
    </MerchantRoleContext.Provider>
  );
}

export function useMerchantRole() {
  return useContext(MerchantRoleContext);
}
