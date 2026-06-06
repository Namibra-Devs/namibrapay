/**
 * Audit Trail Page Mock Data
 */

export interface AuditEvent {
  id: string;
  actor: string;
  role: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeValue?: string;
  afterValue?: string;
  timestamp: string;
  ipAddress: string;
  justification?: string;
}

export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "AUD-2024-001",
    actor: "Jane Mensah",
    role: "Compliance Officer",
    action: "APPROVED_APPLICATION",
    targetType: "APPLICATION",
    targetId: "APP-2024-045",
    beforeValue: "UNDER_REVIEW",
    afterValue: "APPROVED",
    timestamp: "2026-06-05T10:30:00Z",
    ipAddress: "192.168.1.45",
    justification: "All documents verified, screening clear",
  },
  {
    id: "AUD-2024-002",
    actor: "John Mensah",
    role: "Senior Compliance Officer",
    action: "UPDATED_RISK_RULE",
    targetType: "RISK_RULE",
    targetId: "RULE-003",
    beforeValue: '{"weight": 15}',
    afterValue: '{"weight": 20}',
    timestamp: "2026-06-05T09:15:00Z",
    ipAddress: "192.168.1.32",
    justification: "Adjusted weight based on regulatory update",
  },
  {
    id: "AUD-2024-003",
    actor: "Mary Adu",
    role: "Compliance Officer",
    action: "REJECTED_APPLICATION",
    targetType: "APPLICATION",
    targetId: "APP-2024-038",
    beforeValue: "UNDER_REVIEW",
    afterValue: "REJECTED",
    timestamp: "2026-06-05T08:45:00Z",
    ipAddress: "192.168.1.28",
    justification: "Incomplete documentation, multiple discrepancies",
  },
  {
    id: "AUD-2024-004",
    actor: "Peter Owusu",
    role: "Compliance Officer",
    action: "VERIFIED_DOCUMENT",
    targetType: "DOCUMENT",
    targetId: "DOC-2024-122",
    beforeValue: "PENDING",
    afterValue: "VERIFIED",
    timestamp: "2026-06-04T16:20:00Z",
    ipAddress: "192.168.1.19",
  },
  {
    id: "AUD-2024-005",
    actor: "Jane Mensah",
    role: "Compliance Officer",
    action: "CREATED_CASE",
    targetType: "CASE",
    targetId: "CASE-2024-008",
    afterValue: "OPEN",
    timestamp: "2026-06-04T14:55:00Z",
    ipAddress: "192.168.1.45",
    justification: "Suspicious transaction pattern detected",
  },
  {
    id: "AUD-2024-006",
    actor: "John Mensah",
    role: "Senior Compliance Officer",
    action: "ESCALATED_APPLICATION",
    targetType: "APPLICATION",
    targetId: "APP-2024-031",
    beforeValue: "UNDER_REVIEW",
    afterValue: "ESCALATED",
    timestamp: "2026-06-04T13:10:00Z",
    ipAddress: "192.168.1.32",
    justification: "High-risk merchant, requires senior review",
  },
];
