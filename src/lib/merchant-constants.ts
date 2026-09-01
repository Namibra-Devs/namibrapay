export const MERCHANT_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  DEVELOPER: "developer",
  FINANCE: "finance",
  SUPPORT: "support",
} as const;

export type MerchantRole = (typeof MERCHANT_ROLES)[keyof typeof MERCHANT_ROLES];

export const MERCHANT_ROLE_LABELS: Record<MerchantRole, string> = {
  owner: "Owner",
  admin: "Admin",
  developer: "Developer",
  finance: "Finance",
  support: "Support Agent",
};

export const MERCHANT_ROLE_COLORS: Record<MerchantRole, string> = {
  owner: "bg-[#263b8e]/10 text-[#263b8e] border-[#263b8e]/20",
  admin: "bg-[#64c6c3]/10 text-[#1a6e6c] border-[#64c6c3]/20",
  developer: "bg-[#bcbbee]/10 text-[#5c3d9e] border-[#bcbbee]/20",
  finance: "bg-[#fedfb8]/10 text-[#d35400] border-[#fedfb8]/30",
  support: "bg-[#a3ffe2]/10 text-[#1a7a5e] border-[#a3ffe2]/20",
};

export const MERCHANT_ROLE_DOTS: Record<MerchantRole, string> = {
  owner: "bg-[#263b8e]",
  admin: "bg-[#64c6c3]",
  developer: "bg-[#bcbbee]",
  finance: "bg-[#fedfb8]",
  support: "bg-[#a3ffe2]",
};

export const MERCHANT_PERMISSIONS: Record<MerchantRole, string[]> = {
  owner: [
    "dashboard.view",
    "transactions.view",
    "transactions.export",
    "settlements.view",
    "settlements.export",
    "settlements.reconcile",
    "submerchants.view",
    "submerchants.create",
    "submerchants.manage",
    "api.view",
    "api.manage",
    "team.view",
    "team.manage",
    "settings.view",
    "settings.manage",
    "disputes.raise",
    "refunds.approve",
    "account.delete",
    "account.transfer",
    "payout.change_bank",
  ],
  admin: [
    "dashboard.view",
    "transactions.view",
    "transactions.export",
    "settlements.view",
    "settlements.export",
    "settlements.reconcile",
    "submerchants.view",
    "submerchants.create",
    "submerchants.manage",
    "api.view",
    "team.view",
    "team.manage",
    "settings.view",
    "settings.manage",
    "disputes.raise",
    "refunds.approve",
  ],
  developer: [
    "dashboard.view",
    "transactions.view",
    "api.view",
    "api.manage",
    "settings.view",
  ],
  finance: [
    "dashboard.view",
    "transactions.view",
    "transactions.export",
    "settlements.view",
    "settlements.export",
    "settlements.reconcile",
    "disputes.raise",
    "settings.view",
  ],
  support: [
    "dashboard.view",
    "transactions.view",
    "refunds.request",
    "settings.view",
  ],
};
