export const APP_NAME = 'NamibraPay';
export const APP_DESCRIPTION = 'Payment processing platform for Namibia';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  MERCHANT: '/merchant',
  PLATFORM: '/platform',
  SUB_MERCHANT: '/sub-merchant',
} as const;

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  FINANCE: "finance",
  COMPLIANCE: "compliance",
  SUPPORT: "support",
  PLATFORM_ENGINEER: "platform_engineer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  finance: "Finance / Treasury",
  compliance: "Compliance / KYC",
  support: "Support Lead",
  platform_engineer: "Platform Engineer",
};

export const ROLE_COLORS: Record<Role, string> = {
  super_admin: "bg-[#ffb4b0]/20 text-[#c0392b] border-[#ffb4b0]/50",
  finance: "bg-[#fedfb8]/20 text-[#d35400] border-[#fedfb8]/50",
  compliance: "bg-[#bcbbee]/20 text-[#5c3d9e] border-[#bcbbee]/50",
  support: "bg-[#a3ffe2]/20 text-[#1a7a5e] border-[#a3ffe2]/50",
  platform_engineer: "bg-[#64c6c3]/20 text-[#1a6e6c] border-[#64c6c3]/50",
};

export const PROVIDER_STATUS = {
  OPERATIONAL: "operational",
  DEGRADED: "degraded",
  DOWN: "down",
} as const;

export type ProviderStatus = (typeof PROVIDER_STATUS)[keyof typeof PROVIDER_STATUS];

export const BALANCE_STATUS = {
  HEALTHY: "healthy",
  WARNING: "warning",
  CRITICAL: "critical",
} as const;

export type BalanceStatus = (typeof BALANCE_STATUS)[keyof typeof BALANCE_STATUS];

// Fee Structure Constants
export const FEE_STRUCTURE = {
  DEFAULT_RATE: 1.5, // Default merchant rate: 1.5%
  BANK_SHARE: 1.0,   // Bank (UMB) share: 1%
  PLATFORM_SHARE: 0.5, // NamibraPay share: 0.5%
} as const;

export const formatGHS = (amount: number): string => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
};
