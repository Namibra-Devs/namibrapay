export const SUB_MERCHANT_ROLES = {
  ADMIN: "sub_admin",
  VIEWER: "sub_viewer",
} as const;

export type SubMerchantRole = (typeof SUB_MERCHANT_ROLES)[keyof typeof SUB_MERCHANT_ROLES];

export const SUB_MERCHANT_ROLE_LABELS: Record<SubMerchantRole, string> = {
  sub_admin: "Admin",
  sub_viewer: "Viewer",
};

export const SUB_MERCHANT_ROLE_COLORS: Record<SubMerchantRole, string> = {
  sub_admin: "bg-[#bcbbee]/20 text-[#5c3d9e] border-[#bcbbee]/40",
  sub_viewer: "bg-muted text-muted-foreground border-border",
};

const PERMISSIONS: Record<string, SubMerchantRole[]> = {
  "dashboard.view": ["sub_admin", "sub_viewer"],
  "transactions.view": ["sub_admin", "sub_viewer"],
  "transactions.export": ["sub_admin", "sub_viewer"],
  "transactions.dispute": ["sub_admin"],
  "settlements.view": ["sub_admin", "sub_viewer"],
  "team.view": ["sub_admin", "sub_viewer"],
  "team.manage": ["sub_admin"],
  "settings.view": ["sub_admin", "sub_viewer"],
  "settings.manage": ["sub_admin"],
};

export function subMerchantCan(role: SubMerchantRole, permission: string): boolean {
  return PERMISSIONS[permission]?.includes(role) ?? false;
}
