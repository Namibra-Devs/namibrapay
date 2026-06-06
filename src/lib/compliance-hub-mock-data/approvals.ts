/**
 * Maker-Checker Approvals Queue Mock Data
 */

export interface PendingApproval {
  id: string;
  applicationId: string;
  applicantName: string;
  applicationType: "INDIVIDUAL" | "BUSINESS";
  riskScore: number;
  riskBand: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  daysInQueue: number;
  slaDeadline: string;
  urgency: "URGENT" | "HIGH" | "NORMAL";
  country: string;
}

export const MOCK_PENDING_APPROVALS: PendingApproval[] = [
  {
    id: "AUTH-001",
    applicationId: "APP-2024-008",
    applicantName: "Apex Trading Limited",
    applicationType: "BUSINESS",
    riskScore: 82,
    riskBand: "HIGH",
    submittedBy: "Jane Mensah",
    submittedAt: "2024-02-21T09:30:00Z",
    daysInQueue: 0,
    slaDeadline: "2024-02-23T09:30:00Z",
    urgency: "NORMAL",
    country: "Ghana",
  },
  {
    id: "AUTH-002",
    applicationId: "APP-2024-007",
    applicantName: "Kojo Mensah",
    applicationType: "INDIVIDUAL",
    riskScore: 75,
    riskBand: "HIGH",
    submittedBy: "Kwame Asante",
    submittedAt: "2024-02-20T14:15:00Z",
    daysInQueue: 1,
    slaDeadline: "2024-02-22T14:15:00Z",
    urgency: "HIGH",
    country: "Nigeria",
  },
  {
    id: "AUTH-003",
    applicationId: "APP-2024-006",
    applicantName: "MegaCorp Industries",
    applicationType: "BUSINESS",
    riskScore: 88,
    riskBand: "HIGH",
    submittedBy: "Jane Mensah",
    submittedAt: "2024-02-18T11:00:00Z",
    reviewedBy: "Ama Osei",
    daysInQueue: 3,
    slaDeadline: "2024-02-20T11:00:00Z",
    urgency: "URGENT",
    country: "Kenya",
  },
];
