"use client";

import { createContext, useContext, ReactNode } from "react";

// Define roles
export type UserRole = "CO" | "SENIOR_CO" | "MLRO" | "ADMIN" | "AUDITOR";

// Define permissions
export type Permission =
  | "VIEW_APPLICATIONS"
  | "APPROVE_APPLICATION"
  | "REJECT_APPLICATION"
  | "APPROVE_HIGH_RISK"
  | "APPROVE_MAKER_CHECKER"
  | "ESCALATE_APPLICATION"
  | "REQUEST_INFO"
  | "HOLD_APPLICATION"
  | "VIEW_CASES"
  | "CREATE_CASE"
  | "CLOSE_CASE"
  | "SIGN_REPORT"
  | "CONFIGURE_SYSTEM"
  | "MANAGE_USERS"
  | "VIEW_AUDIT"
  | "OVERRIDE_RISK"
  | "MANAGE_BLACKLIST";

// Role permission mappings
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CO: [
    "VIEW_APPLICATIONS",
    "APPROVE_APPLICATION",
    "REJECT_APPLICATION",
    "ESCALATE_APPLICATION",
    "REQUEST_INFO",
    "HOLD_APPLICATION",
    "VIEW_CASES",
    "CREATE_CASE",
  ],
  SENIOR_CO: [
    "VIEW_APPLICATIONS",
    "APPROVE_APPLICATION",
    "REJECT_APPLICATION",
    "APPROVE_HIGH_RISK",
    "APPROVE_MAKER_CHECKER",
    "ESCALATE_APPLICATION",
    "REQUEST_INFO",
    "HOLD_APPLICATION",
    "VIEW_CASES",
    "CREATE_CASE",
    "CLOSE_CASE",
    "OVERRIDE_RISK",
  ],
  MLRO: [
    "VIEW_APPLICATIONS",
    "APPROVE_APPLICATION",
    "REJECT_APPLICATION",
    "APPROVE_HIGH_RISK",
    "APPROVE_MAKER_CHECKER",
    "ESCALATE_APPLICATION",
    "REQUEST_INFO",
    "HOLD_APPLICATION",
    "VIEW_CASES",
    "CREATE_CASE",
    "CLOSE_CASE",
    "SIGN_REPORT",
    "OVERRIDE_RISK",
    "MANAGE_BLACKLIST",
    "VIEW_AUDIT",
  ],
  ADMIN: [
    "CONFIGURE_SYSTEM",
    "MANAGE_USERS",
    "VIEW_AUDIT",
  ],
  AUDITOR: [
    "VIEW_APPLICATIONS",
    "VIEW_CASES",
    "VIEW_AUDIT",
  ],
};

// Authority limits (approval thresholds)
export interface AuthorityLimit {
  maxRiskScore: number;
  maxVolume: number;
  requiresMakerChecker: boolean;
}

const AUTHORITY_LIMITS: Record<UserRole, AuthorityLimit> = {
  CO: {
    maxRiskScore: 60,
    maxVolume: 500000,
    requiresMakerChecker: false,
  },
  SENIOR_CO: {
    maxRiskScore: 80,
    maxVolume: 2000000,
    requiresMakerChecker: false,
  },
  MLRO: {
    maxRiskScore: 100,
    maxVolume: Infinity,
    requiresMakerChecker: false,
  },
  ADMIN: {
    maxRiskScore: 0,
    maxVolume: 0,
    requiresMakerChecker: false,
  },
  AUDITOR: {
    maxRiskScore: 0,
    maxVolume: 0,
    requiresMakerChecker: false,
  },
};

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Context interface
interface RBACContextType {
  user: User;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  canApprove: (riskScore: number, volume: number) => boolean;
  requiresMakerChecker: (riskScore: number) => boolean;
  authorityLimit: AuthorityLimit;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

// Mock current user (in real app, this would come from auth)
const MOCK_USER: User = {
  id: "CO-001",
  name: "Jane Mensah",
  email: "jane.mensah@namibrapay.com",
  role: "CO", // Change this to test different roles: "CO" | "SENIOR_CO" | "MLRO" | "ADMIN" | "AUDITOR"
};

export function RBACProvider({ children }: { children: ReactNode }) {
  const user = MOCK_USER;

  const hasPermission = (permission: Permission): boolean => {
    return ROLE_PERMISSIONS[user.role].includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const canApprove = (riskScore: number, volume: number): boolean => {
    const limit = AUTHORITY_LIMITS[user.role];
    return riskScore <= limit.maxRiskScore && volume <= limit.maxVolume;
  };

  const requiresMakerChecker = (riskScore: number): boolean => {
    // High-risk applications (score > 70) require maker-checker
    return riskScore > 70;
  };

  const value: RBACContextType = {
    user,
    hasPermission,
    hasAnyPermission,
    canApprove,
    requiresMakerChecker,
    authorityLimit: AUTHORITY_LIMITS[user.role],
  };

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

// Hook to use RBAC context
export function useRBAC() {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error("useRBAC must be used within RBACProvider");
  }
  return context;
}

// Helper function to get role display name
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    CO: "Compliance Officer",
    SENIOR_CO: "Senior Compliance Officer",
    MLRO: "Money Laundering Reporting Officer",
    ADMIN: "Compliance Administrator",
    AUDITOR: "Auditor",
  };
  return names[role];
}

// Export for use in other components
export { ROLE_PERMISSIONS, AUTHORITY_LIMITS };
