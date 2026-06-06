/**
 * Dashboard (Home) Page Mock Data
 * 
 * This file contains mock data for the compliance dashboard overview/home page.
 */

export interface KPI {
  label: string;
  value: number;
  change: string;
  trend: "up" | "down";
  icon: string;
  color: "blue" | "purple" | "green" | "red";
}

export interface QueueItem {
  id: string;
  applicantName: string;
  type: "INDIVIDUAL" | "BUSINESS";
  status: "UNDER_REVIEW" | "PENDING_INFO" | "ESCALATED";
  riskBand: "LOW" | "MEDIUM" | "HIGH";
  slaDeadline: string;
  submittedAt: string;
}

export interface ActivityItem {
  user: string;
  action: string;
  target: string;
  time: string;
}

export interface RiskDistribution {
  band: string;
  count: number;
  color: string;
}

export const MOCK_KPIS: KPI[] = [
  {
    label: "Pending Applications",
    value: 24,
    change: "+12%",
    trend: "up",
    icon: "FileText",
    color: "blue",
  },
  {
    label: "Under Review",
    value: 18,
    change: "-5%",
    trend: "down",
    icon: "Clock",
    color: "purple",
  },
  {
    label: "Approved Today",
    value: 7,
    change: "+3",
    trend: "up",
    icon: "CheckCircle",
    color: "green",
  },
  {
    label: "Escalated Cases",
    value: 3,
    change: "+1",
    trend: "up",
    icon: "AlertTriangle",
    color: "red",
  },
];

export const MOCK_MY_QUEUE: QueueItem[] = [
  {
    id: "APP-2024-001",
    applicantName: "Kwame Tech Solutions",
    type: "BUSINESS",
    status: "UNDER_REVIEW",
    riskBand: "MEDIUM",
    slaDeadline: "2026-06-04T10:00:00Z",
    submittedAt: "2026-06-02T14:30:00Z",
  },
  {
    id: "APP-2024-002",
    applicantName: "Sarah Osei",
    type: "INDIVIDUAL",
    status: "PENDING_INFO",
    riskBand: "LOW",
    slaDeadline: "2026-06-05T16:00:00Z",
    submittedAt: "2026-06-01T09:15:00Z",
  },
  {
    id: "APP-2024-003",
    applicantName: "Global Traders Ltd",
    type: "BUSINESS",
    status: "ESCALATED",
    riskBand: "HIGH",
    slaDeadline: "2026-06-03T12:00:00Z",
    submittedAt: "2026-05-30T11:45:00Z",
  },
];

export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    user: "John Mensah",
    action: "approved",
    target: "APP-2024-045",
    time: "10 minutes ago",
  },
  {
    user: "Mary Adu",
    action: "rejected",
    target: "APP-2024-038",
    time: "25 minutes ago",
  },
  {
    user: "Peter Owusu",
    action: "requested more info",
    target: "APP-2024-042",
    time: "1 hour ago",
  },
  {
    user: "Jane Mensah",
    action: "escalated",
    target: "APP-2024-003",
    time: "2 hours ago",
  },
];

export const MOCK_RISK_DISTRIBUTION: RiskDistribution[] = [
  { band: "Low", count: 42, color: "bg-green-500" },
  { band: "Medium", count: 28, color: "bg-yellow-500" },
  { band: "High", count: 8, color: "bg-red-500" },
];
