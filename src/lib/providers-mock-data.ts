// ── Provider Management Mock Data ────────────────────────────────────────────

export type ProviderHealthStatus = "operational" | "degraded" | "down" | "maintenance";

export type ProviderDetail = {
  id: string;
  name: string;
  shortCode: string;
  status: ProviderHealthStatus;
  apiVersion: string;
  apiBaseUrl: string;
  lastSuccessful: string;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  successRate: number; // percentage
  errorRate: number; // percentage
  throughput: number; // transactions per minute
  uptime: number; // percentage
  lastHealthCheck: string;
  supportedChannels: string[];
  feeSchedule: {
    collectionRate: number; // percentage
    collectionFloor: number; // GHS
    collectionCap: number; // GHS
    payoutRate: number; // percentage
    payoutFloor: number; // GHS
    payoutCap: number; // GHS
  };
};

export type ProviderCredential = {
  id: string;
  providerId: string;
  providerName: string;
  credentialType: "api_key" | "certificate" | "oauth_token" | "sftp_key";
  label: string;
  createdAt: string;
  lastRotated: string;
  expiresAt: string;
  daysUntilExpiry: number;
  rotationSchedule: string;
  status: "active" | "expiring_soon" | "expired" | "revoked";
};

export type RoutingRule = {
  id: string;
  name: string;
  priority: number;
  enabled: boolean;
  ruleType: "channel_based" | "cost_based" | "success_rate" | "failover" | "default";
  condition?: string;
  targetProvider: string;
  fallbackProvider?: string;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: "draft" | "pending_approval" | "active" | "disabled";
  description: string;
};

export type MaintenanceWindow = {
  id: string;
  providerId: string;
  providerName: string;
  scheduledStart: string;
  scheduledEnd: string;
  duration: number; // minutes
  type: "planned" | "emergency";
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  reason: string;
  impactedChannels: string[];
  notificationSent: boolean;
};

export type ProviderIncident = {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  startedAt: string;
  resolvedAt?: string;
  duration?: number; // minutes
  impactedTransactions: number;
  status: "active" | "investigating" | "resolved";
  rootCause?: string;
};

// ── Mock Data ───────────────────────────────────────────────────────────────

export const mockProviderDetails: ProviderDetail[] = [
  {
    id: "p1",
    name: "MTN Mobile Money",
    shortCode: "MTN",
    status: "operational",
    apiVersion: "v2.3.1",
    apiBaseUrl: "https://api.mtn.com/v2",
    lastSuccessful: new Date(Date.now() - 45000).toISOString(),
    avgLatencyMs: 342,
    p50LatencyMs: 280,
    p95LatencyMs: 620,
    p99LatencyMs: 1240,
    successRate: 97.8,
    errorRate: 2.2,
    throughput: 145,
    uptime: 99.8,
    lastHealthCheck: new Date(Date.now() - 30000).toISOString(),
    supportedChannels: ["MoMo", "MoMo Merchant"],
    feeSchedule: {
      collectionRate: 1.0,
      collectionFloor: 0.5,
      collectionCap: 50,
      payoutRate: 0.8,
      payoutFloor: 0.3,
      payoutCap: 30,
    },
  },
  {
    id: "p2",
    name: "Vodafone Cash",
    shortCode: "VOD",
    status: "degraded",
    apiVersion: "v1.8.4",
    apiBaseUrl: "https://api.vodafone.gh/payments",
    lastSuccessful: new Date(Date.now() - 180000).toISOString(),
    avgLatencyMs: 1240,
    p50LatencyMs: 890,
    p95LatencyMs: 2100,
    p99LatencyMs: 3400,
    successRate: 93.4,
    errorRate: 6.6,
    throughput: 82,
    uptime: 97.2,
    lastHealthCheck: new Date(Date.now() - 120000).toISOString(),
    supportedChannels: ["Vodafone Cash"],
    feeSchedule: {
      collectionRate: 1.2,
      collectionFloor: 0.5,
      collectionCap: 50,
      payoutRate: 0.9,
      payoutFloor: 0.3,
      payoutCap: 35,
    },
  },
  {
    id: "p3",
    name: "AirtelTigo Money",
    shortCode: "AT",
    status: "operational",
    apiVersion: "v3.0.2",
    apiBaseUrl: "https://api.airteltigo.com.gh/v3",
    lastSuccessful: new Date(Date.now() - 30000).toISOString(),
    avgLatencyMs: 289,
    p50LatencyMs: 220,
    p95LatencyMs: 480,
    p99LatencyMs: 890,
    successRate: 98.5,
    errorRate: 1.5,
    throughput: 68,
    uptime: 99.5,
    lastHealthCheck: new Date(Date.now() - 25000).toISOString(),
    supportedChannels: ["AirtelTigo Money"],
    feeSchedule: {
      collectionRate: 1.1,
      collectionFloor: 0.5,
      collectionCap: 50,
      payoutRate: 0.85,
      payoutFloor: 0.3,
      payoutCap: 32,
    },
  },
  {
    id: "p4",
    name: "GhIPSS Instant Pay",
    shortCode: "GIP",
    status: "down",
    apiVersion: "v1.2.0",
    apiBaseUrl: "https://api.ghipss.net/instant-pay",
    lastSuccessful: new Date(Date.now() - 7200000).toISOString(),
    avgLatencyMs: 0,
    p50LatencyMs: 0,
    p95LatencyMs: 0,
    p99LatencyMs: 0,
    successRate: 0,
    errorRate: 100,
    throughput: 0,
    uptime: 91.3,
    lastHealthCheck: new Date(Date.now() - 60000).toISOString(),
    supportedChannels: ["Bank Transfer", "GhIPSS"],
    feeSchedule: {
      collectionRate: 0.5,
      collectionFloor: 0.2,
      collectionCap: 20,
      payoutRate: 0.4,
      payoutFloor: 0.2,
      payoutCap: 15,
    },
  },
];

export const mockProviderCredentials: ProviderCredential[] = [
  {
    id: "cred1",
    providerId: "p1",
    providerName: "MTN Mobile Money",
    credentialType: "api_key",
    label: "MTN Production API Key",
    createdAt: "2024-03-15T10:00:00Z",
    lastRotated: "2025-12-01T08:30:00Z",
    expiresAt: "2026-12-01T08:30:00Z",
    daysUntilExpiry: 90,
    rotationSchedule: "Every 12 months",
    status: "active",
  },
  {
    id: "cred2",
    providerId: "p1",
    providerName: "MTN Mobile Money",
    credentialType: "certificate",
    label: "MTN TLS Certificate",
    createdAt: "2024-01-10T14:20:00Z",
    lastRotated: "2025-07-10T09:00:00Z",
    expiresAt: "2026-07-10T09:00:00Z",
    daysUntilExpiry: 311,
    rotationSchedule: "Every 12 months",
    status: "active",
  },
  {
    id: "cred3",
    providerId: "p2",
    providerName: "Vodafone Cash",
    credentialType: "api_key",
    label: "Vodafone API Key",
    createdAt: "2024-05-20T11:15:00Z",
    lastRotated: "2025-11-20T10:00:00Z",
    expiresAt: "2026-11-20T10:00:00Z",
    daysUntilExpiry: 79,
    rotationSchedule: "Every 12 months",
    status: "active",
  },
  {
    id: "cred4",
    providerId: "p3",
    providerName: "AirtelTigo Money",
    credentialType: "oauth_token",
    label: "AirtelTigo OAuth Token",
    createdAt: "2025-08-01T13:45:00Z",
    lastRotated: "2026-02-01T12:00:00Z",
    expiresAt: "2026-08-01T12:00:00Z",
    daysUntilExpiry: 180,
    rotationSchedule: "Every 6 months",
    status: "active",
  },
  {
    id: "cred5",
    providerId: "p4",
    providerName: "GhIPSS Instant Pay",
    credentialType: "api_key",
    label: "GhIPSS API Key",
    createdAt: "2023-09-10T09:00:00Z",
    lastRotated: "2024-09-10T08:00:00Z",
    expiresAt: "2025-09-10T08:00:00Z",
    daysUntilExpiry: -358,
    rotationSchedule: "Every 12 months",
    status: "expired",
  },
  {
    id: "cred6",
    providerId: "p2",
    providerName: "Vodafone Cash",
    credentialType: "sftp_key",
    label: "Vodafone SFTP Key (Settlement Reports)",
    createdAt: "2024-11-05T16:30:00Z",
    lastRotated: "2026-05-05T10:00:00Z",
    expiresAt: "2027-05-05T10:00:00Z",
    daysUntilExpiry: 245,
    rotationSchedule: "Every 12 months",
    status: "active",
  },
];

export const mockRoutingRules: RoutingRule[] = [
  {
    id: "rule1",
    name: "Default MTN MoMo Routing",
    priority: 1,
    enabled: true,
    ruleType: "channel_based",
    condition: "channel === 'MTN MoMo'",
    targetProvider: "MTN",
    createdBy: "Platform Engineer",
    createdAt: "2024-01-15T10:00:00Z",
    approvedBy: "Super Admin",
    approvedAt: "2024-01-15T14:30:00Z",
    status: "active",
    description: "Route all MTN MoMo transactions to MTN provider",
  },
  {
    id: "rule2",
    name: "MTN Failover to Vodafone",
    priority: 2,
    enabled: true,
    ruleType: "failover",
    condition: "provider === 'MTN' AND status === 'down'",
    targetProvider: "VOD",
    fallbackProvider: "AT",
    createdBy: "Platform Engineer",
    createdAt: "2024-03-20T11:30:00Z",
    approvedBy: "Super Admin",
    approvedAt: "2024-03-20T15:00:00Z",
    status: "active",
    description: "Failover to Vodafone if MTN is down, with AirtelTigo as secondary fallback",
  },
  {
    id: "rule3",
    name: "Cost-Optimized Routing for Large Transactions",
    priority: 3,
    enabled: false,
    ruleType: "cost_based",
    condition: "amount > 1000",
    targetProvider: "GIP",
    fallbackProvider: "MTN",
    createdBy: "Platform Engineer",
    createdAt: "2025-06-10T09:15:00Z",
    status: "disabled",
    description: "Route large transactions (>GHS 1000) to GhIPSS for lower fees",
  },
  {
    id: "rule4",
    name: "Success Rate Based Routing",
    priority: 4,
    enabled: false,
    ruleType: "success_rate",
    condition: "provider.successRate < 95",
    targetProvider: "AT",
    createdBy: "Platform Engineer",
    createdAt: "2026-01-05T14:20:00Z",
    approvedBy: "Super Admin",
    approvedAt: "2026-01-06T10:00:00Z",
    status: "active",
    description: "Switch to AirtelTigo if primary provider success rate drops below 95%",
  },
  {
    id: "rule5",
    name: "Emergency GhIPSS Disable",
    priority: 10,
    enabled: true,
    ruleType: "default",
    condition: "provider !== 'GIP'",
    targetProvider: "MTN",
    createdBy: "Platform Engineer",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    status: "pending_approval",
    description: "Temporarily disable GhIPSS routing due to ongoing outage. Route to MTN instead.",
  },
];

export const mockMaintenanceWindows: MaintenanceWindow[] = [
  {
    id: "maint1",
    providerId: "p2",
    providerName: "Vodafone Cash",
    scheduledStart: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    scheduledEnd: new Date(Date.now() + 183600000).toISOString(), // 2 days + 3 hours
    duration: 180,
    type: "planned",
    status: "scheduled",
    reason: "API version upgrade from v1.8.4 to v2.0.0",
    impactedChannels: ["Vodafone Cash"],
    notificationSent: true,
  },
  {
    id: "maint2",
    providerId: "p4",
    providerName: "GhIPSS Instant Pay",
    scheduledStart: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    scheduledEnd: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    duration: 180,
    type: "emergency",
    status: "in_progress",
    reason: "Database failover and recovery",
    impactedChannels: ["Bank Transfer", "GhIPSS"],
    notificationSent: true,
  },
  {
    id: "maint3",
    providerId: "p1",
    providerName: "MTN Mobile Money",
    scheduledStart: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    scheduledEnd: new Date(Date.now() - 590400000).toISOString(), // 7 days ago + 4 hours
    duration: 240,
    type: "planned",
    status: "completed",
    reason: "Security patch deployment",
    impactedChannels: ["MoMo", "MoMo Merchant"],
    notificationSent: true,
  },
];

export const mockProviderIncidents: ProviderIncident[] = [
  {
    id: "inc1",
    providerId: "p4",
    providerName: "GhIPSS Instant Pay",
    title: "Complete API Outage",
    description: "All API endpoints returning 503 Service Unavailable. GhIPSS engineering team investigating.",
    severity: "critical",
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    impactedTransactions: 234,
    status: "active",
  },
  {
    id: "inc2",
    providerId: "p2",
    providerName: "Vodafone Cash",
    title: "Elevated Latency",
    description: "Average API response time increased from 300ms to 1200ms. Affecting transaction processing speed.",
    severity: "medium",
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    impactedTransactions: 89,
    status: "investigating",
  },
  {
    id: "inc3",
    providerId: "p1",
    providerName: "MTN Mobile Money",
    title: "Callback Webhook Delays",
    description: "Success callbacks delayed by 2-5 minutes. Transactions completing but notifications delayed.",
    severity: "low",
    startedAt: new Date(Date.now() - 14400000).toISOString(),
    resolvedAt: new Date(Date.now() - 10800000).toISOString(),
    duration: 60,
    impactedTransactions: 156,
    status: "resolved",
    rootCause: "Network congestion on MTN side. Resolved after load balancer adjustment.",
  },
];

// ── Helper functions ────────────────────────────────────────────────────────

export const getProviderStatusColor = (status: ProviderHealthStatus): string => {
  const colors: Record<ProviderHealthStatus, string> = {
    operational: "bg-emerald-50 text-emerald-700 border-emerald-200",
    degraded: "bg-amber-50 text-amber-700 border-amber-200",
    down: "bg-red-50 text-red-700 border-red-200",
    maintenance: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return colors[status];
};

export const getCredentialStatusColor = (status: ProviderCredential["status"]): string => {
  const colors: Record<ProviderCredential["status"], string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    expiring_soon: "bg-amber-50 text-amber-700 border-amber-200",
    expired: "bg-red-50 text-red-700 border-red-200",
    revoked: "bg-muted text-muted-foreground border-border",
  };
  return colors[status];
};

export const getRoutingRuleStatusColor = (status: RoutingRule["status"]): string => {
  const colors: Record<RoutingRule["status"], string> = {
    draft: "bg-muted text-muted-foreground border-border",
    pending_approval: "bg-amber-50 text-amber-700 border-amber-200",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    disabled: "bg-red-50 text-red-700 border-red-200",
  };
  return colors[status];
};
