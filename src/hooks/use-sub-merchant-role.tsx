'use client';

import { createContext, useContext, useState } from "react";
import type { SubMerchantRole } from "@/lib/sub-merchant-constants";
import { subMerchantCan, SUB_MERCHANT_ROLES } from "@/lib/sub-merchant-constants";

type SubMerchantRoleCtx = {
  role: SubMerchantRole;
  setRole: (role: SubMerchantRole) => void;
  can: (permission: string) => boolean;
};

const SubMerchantRoleContext = createContext<SubMerchantRoleCtx>({
  role: SUB_MERCHANT_ROLES.ADMIN,
  setRole: () => undefined,
  can: () => false,
});

export function SubMerchantRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<SubMerchantRole>(SUB_MERCHANT_ROLES.ADMIN);
  const can = (permission: string) => subMerchantCan(role, permission);
  return (
    <SubMerchantRoleContext.Provider value={{ role, setRole, can }}>
      {children}
    </SubMerchantRoleContext.Provider>
  );
}

export function useSubMerchantRole() {
  return useContext(SubMerchantRoleContext);
}
