/**
 * Reports Page Mock Data
 * 
 * This file contains mock data for reports and regulatory filings.
 */

export interface Report {
  id: string;
  name: string;
  type: "OPERATIONAL" | "REGULATORY" | "MANAGEMENT";
  category: string;
  description: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUAL" | "AD_HOC";
  lastGenerated: string;
  nextDue?: string;
  status: "SCHEDULED" | "READY" | "OVERDUE" | "SUBMITTED";
}

export const MOCK_REPORTS: Report[] = [
  {
    id: "REP-001",
    name: "Monthly Onboarding Statistics",
    type: "OPERATIONAL",
    category: "KYC Statistics",
    description: "Monthly summary of new applications, approvals, and rejections",
    frequency: "MONTHLY",
    lastGenerated: "2024-02-01T09:00:00Z",
    nextDue: "2024-03-01T09:00:00Z",
    status: "SCHEDULED",
  },
  {
    id: "REP-002",
    name: "Quarterly Risk Assessment Report",
    type: "REGULATORY",
    category: "Risk Management",
    description: "Comprehensive risk assessment for regulatory submission",
    frequency: "QUARTERLY",
    lastGenerated: "2024-01-15T10:00:00Z",
    nextDue: "2024-04-15T10:00:00Z",
    status: "SCHEDULED",
  },
  {
    id: "REP-003",
    name: "Weekly Screening Hits Summary",
    type: "OPERATIONAL",
    category: "Sanctions Screening",
    description: "Summary of all screening hits and dispositions",
    frequency: "WEEKLY",
    lastGenerated: "2024-02-19T08:00:00Z",
    nextDue: "2024-02-26T08:00:00Z",
    status: "READY",
  },
  {
    id: "REP-004",
    name: "Annual AML/CFT Compliance Report",
    type: "REGULATORY",
    category: "AML Compliance",
    description: "Annual compliance report for Bank of Ghana submission",
    frequency: "ANNUAL",
    lastGenerated: "2023-12-31T23:59:00Z",
    nextDue: "2024-12-31T23:59:00Z",
    status: "SCHEDULED",
  },
  {
    id: "REP-005",
    name: "Daily Transaction Monitoring Alerts",
    type: "OPERATIONAL",
    category: "Transaction Monitoring",
    description: "Daily summary of transaction monitoring alerts and dispositions",
    frequency: "DAILY",
    lastGenerated: "2024-02-21T06:00:00Z",
    nextDue: "2024-02-22T06:00:00Z",
    status: "READY",
  },
  {
    id: "REP-006",
    name: "Monthly STR Filing Report",
    type: "REGULATORY",
    category: "Suspicious Activity",
    description: "Monthly summary of Suspicious Transaction Reports filed with FIU",
    frequency: "MONTHLY",
    lastGenerated: "2024-02-01T09:00:00Z",
    nextDue: "2024-03-01T09:00:00Z",
    status: "SCHEDULED",
  },
  {
    id: "REP-007",
    name: "Quarterly Executive Dashboard",
    type: "MANAGEMENT",
    category: "Executive Summary",
    description: "High-level compliance metrics and trends for executive review",
    frequency: "QUARTERLY",
    lastGenerated: "2024-01-15T09:00:00Z",
    nextDue: "2024-04-15T09:00:00Z",
    status: "SCHEDULED",
  },
  {
    id: "REP-008",
    name: "Monthly Document Expiry Report",
    type: "OPERATIONAL",
    category: "Document Management",
    description: "Report of expiring and expired documents requiring renewal",
    frequency: "MONTHLY",
    lastGenerated: "2024-02-01T09:00:00Z",
    nextDue: "2024-03-01T09:00:00Z",
    status: "READY",
  },
];
