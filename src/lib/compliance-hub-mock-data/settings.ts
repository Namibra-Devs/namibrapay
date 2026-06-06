import { RiskRule, AuthorityMatrix } from "@/types/compliance";

// Risk Rules
export const MOCK_RISK_RULES: RiskRule[] = [
  {
    id: "RULE-001",
    name: "High Transaction Volume",
    factor: "transaction_volume",
    weight: 25,
    conditions: { threshold: 500000, period: "monthly" },
    isActive: true,
    version: 1,
  },
  {
    id: "RULE-002",
    name: "High-Risk Industry",
    factor: "industry_type",
    weight: 30,
    conditions: { industries: ["Money Services", "Crypto", "Gaming"] },
    isActive: true,
    version: 1,
  },
  {
    id: "RULE-003",
    name: "PEP Association",
    factor: "pep_status",
    weight: 40,
    conditions: { directOrIndirect: "both" },
    isActive: true,
    version: 1,
  },
  {
    id: "RULE-004",
    name: "Cross-Border Transactions",
    factor: "geography",
    weight: 20,
    conditions: { highRiskCountries: true },
    isActive: false,
    version: 1,
  },
];

// Authority Matrix
export const MOCK_AUTHORITY_MATRIX: AuthorityMatrix[] = [
  {
    role: "CO",
    riskBand: "LOW",
    canApprove: true,
    canReject: true,
    requiresSecondAuth: false,
  },
  {
    role: "CO",
    riskBand: "MEDIUM",
    canApprove: true,
    canReject: true,
    requiresSecondAuth: false,
  },
  {
    role: "CO",
    riskBand: "HIGH",
    canApprove: false,
    canReject: false,
    requiresSecondAuth: true,
  },
  {
    role: "SENIOR_CO",
    riskBand: "LOW",
    canApprove: true,
    canReject: true,
    requiresSecondAuth: false,
  },
  {
    role: "SENIOR_CO",
    riskBand: "MEDIUM",
    canApprove: true,
    canReject: true,
    requiresSecondAuth: false,
  },
  {
    role: "SENIOR_CO",
    riskBand: "HIGH",
    canApprove: true,
    canReject: true,
    requiresSecondAuth: false,
  },
];

// Communication Templates
export interface CommunicationTemplate {
  id: string;
  name: string;
  category: string;
  channel: "EMAIL" | "SMS" | "BOTH";
  body?: string;
  isActive: boolean;
}

export const MOCK_SETTINGS_TEMPLATES: CommunicationTemplate[] = [
  {
    id: "TPL-001",
    name: "Request Additional Information",
    category: "Information Request",
    channel: "EMAIL",
    isActive: true,
  },
  {
    id: "TPL-002",
    name: "Application Approved",
    category: "Approval",
    channel: "BOTH",
    isActive: true,
  },
  {
    id: "TPL-003",
    name: "Application Rejected",
    category: "Rejection",
    channel: "EMAIL",
    isActive: true,
  },
  {
    id: "TPL-004",
    name: "Document Expiry Reminder",
    category: "Reminder",
    channel: "BOTH",
    isActive: true,
  },
];

// System Settings
export interface SystemSettings {
  defaultSLA: number;
  autoEscalationThreshold: number;
  screeningAPIKey: string;
  enableAutoScreening: boolean;
  enableEmailNotifications: boolean;
}

export const MOCK_SYSTEM_SETTINGS: SystemSettings = {
  defaultSLA: 3,
  autoEscalationThreshold: 24,
  screeningAPIKey: "••••••••••••••••",
  enableAutoScreening: true,
  enableEmailNotifications: true,
};
