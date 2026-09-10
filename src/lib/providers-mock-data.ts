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
    name: "Universal Merchant Bank (UMB)",
    shortCode: "UMB",
    status: "operational",
    apiVersion: "v2.1.0",
    apiBaseUrl: "https://api.umb.com.gh/v2",
    lastSuccessful: new Date(Date.now() - 30000).toISOString(),
    avgLatencyMs: 425,
    p50LatencyMs: 350,
    p95LatencyMs: 780,
    p99LatencyMs: 1450,
    successRate: 98.9,
    errorRate: 1.1,
    throughput: 245,
    uptime: 99.9,
    lastHealthCheck: new Date(Date.now() - 25000).toISOString(),
    supportedChannels: ["Bank Transfer", "Card Payment", "Direct Debit"],
    feeSchedule: {
      collectionRate: 0.8,
      collectionFloor: 0.3,
      collectionCap: 40,
      payoutRate: 0.5,
      payoutFloor: 0.2,
      payoutCap: 25,
    },
  },
  {
    id: "p2",
    name: "MTN Mobile Money",
    shortCode: "MTN",
    status: "operational",
    apiVersion: "v2.3.1",
    apiBaseUrl: "https://api.mtn.com.gh/momo/v2",
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
    supportedChannels: ["MTN Mobile Money", "MoMo Merchant Pay"],
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
    id: "p3",
    name: "Telecel Cash",
    shortCode: "TCL",
    status: "operational",
    apiVersion: "v1.9.2",
    apiBaseUrl: "https://api.telecel.com.gh/cash",
    lastSuccessful: new Date(Date.now() - 60000).toISOString(),
    avgLatencyMs: 478,
    p50LatencyMs: 390,
    p95LatencyMs: 890,
    p99LatencyMs: 1680,
    successRate: 96.5,
    errorRate: 3.5,
    throughput: 98,
    uptime: 98.7,
    lastHealthCheck: new Date(Date.now() - 45000).toISOString(),
    supportedChannels: ["Telecel Cash"],
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
    id: "p4",
    name: "AirtelTigo Money",
    shortCode: "AT",
    status: "operational",
    apiVersion: "v3.0.2",
    apiBaseUrl: "https://api.airteltigo.com.gh/v3",
    lastSuccessful: new Date(Date.now() - 35000).toISOString(),
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
];

export const mockProviderCredentials: ProviderCredential[] = [
  {
    id: "cred1",
    providerId: "p1",
    providerName: "Universal Merchant Bank (UMB)",
    credentialType: "api_key",
    label: "UMB Production API Key",
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
    providerName: "Universal Merchant Bank (UMB)",
    credentialType: "certificate",
    label: "UMB TLS Certificate",
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
    providerName: "MTN Mobile Money",
    credentialType: "api_key",
    label: "MTN API Key",
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
    providerName: "Telecel Cash",
    credentialType: "oauth_token",
    label: "Telecel OAuth Token",
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
    providerName: "AirtelTigo Money",
    credentialType: "api_key",
    label: "AirtelTigo API Key",
    createdAt: "2023-09-10T09:00:00Z",
    lastRotated: "2025-09-10T08:00:00Z",
    expiresAt: "2026-09-10T08:00:00Z",
    daysUntilExpiry: 180,
    rotationSchedule: "Every 12 months",
    status: "active",
  },
  {
    id: "cred6",
    providerId: "p2",
    providerName: "MTN Mobile Money",
    credentialType: "sftp_key",
    label: "MTN SFTP Key (Settlement Reports)",
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
    name: "MTN Failover to Telecel",
    priority: 2,
    enabled: true,
    ruleType: "failover",
    condition: "provider === 'MTN' AND status === 'down'",
    targetProvider: "TCL",
    fallbackProvider: "AT",
    createdBy: "Platform Engineer",
    createdAt: "2024-03-20T11:30:00Z",
    approvedBy: "Super Admin",
    approvedAt: "2024-03-20T15:00:00Z",
    status: "active",
    description: "Failover to Telecel if MTN is down, with AirtelTigo as secondary fallback",
  },
  {
    id: "rule3",
    name: "Cost-Optimized Routing for Large Transactions",
    priority: 3,
    enabled: true,
    ruleType: "cost_based",
    condition: "amount > 1000",
    targetProvider: "UMB",
    fallbackProvider: "MTN",
    createdBy: "Platform Engineer",
    createdAt: "2025-06-10T09:15:00Z",
    approvedBy: "Super Admin",
    approvedAt: "2025-06-12T10:00:00Z",
    status: "active",
    description: "Route large transactions (>GHS 1000) to UMB for lower fees",
  },
  {
    id: "rule4",
    name: "Success Rate Based Routing",
    priority: 4,
    enabled: true,
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
    name: "Bank Transfer Default Routing",
    priority: 5,
    enabled: true,
    ruleType: "channel_based",
    condition: "channel === 'Bank Transfer'",
    targetProvider: "UMB",
    createdBy: "Platform Engineer",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    approvedBy: "Super Admin",
    approvedAt: new Date(Date.now() - 3600000).toISOString(),
    status: "active",
    description: "Route all bank transfer transactions through UMB",
  },
];

export const mockMaintenanceWindows: MaintenanceWindow[] = [
  {
    id: "maint1",
    providerId: "p3",
    providerName: "Telecel Cash",
    scheduledStart: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    scheduledEnd: new Date(Date.now() + 183600000).toISOString(), // 2 days + 3 hours
    duration: 180,
    type: "planned",
    status: "scheduled",
    reason: "API version upgrade from v1.9.2 to v2.0.0",
    impactedChannels: ["Telecel Cash"],
    notificationSent: true,
  },
  {
    id: "maint2",
    providerId: "p1",
    providerName: "Universal Merchant Bank (UMB)",
    scheduledStart: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    scheduledEnd: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    duration: 180,
    type: "emergency",
    status: "in_progress",
    reason: "Database failover and recovery",
    impactedChannels: ["Bank Transfer", "Direct Debit"],
    notificationSent: true,
  },
  {
    id: "maint3",
    providerId: "p2",
    providerName: "MTN Mobile Money",
    scheduledStart: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    scheduledEnd: new Date(Date.now() - 590400000).toISOString(), // 7 days ago + 4 hours
    duration: 240,
    type: "planned",
    status: "completed",
    reason: "Security patch deployment",
    impactedChannels: ["MTN Mobile Money", "MoMo Merchant Pay"],
    notificationSent: true,
  },
];

export const mockProviderIncidents: ProviderIncident[] = [
  {
    id: "inc1",
    providerId: "p1",
    providerName: "Universal Merchant Bank (UMB)",
    title: "Elevated Latency on Bank Transfers",
    description: "All bank transfer API endpoints experiencing increased latency. Average response time up from 425ms to 890ms.",
    severity: "medium",
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    impactedTransactions: 142,
    status: "investigating",
  },
  {
    id: "inc2",
    providerId: "p3",
    providerName: "Telecel Cash",
    title: "Intermittent Callback Failures",
    description: "Success callbacks failing intermittently for Telecel Cash transactions. Transactions completing but some webhook notifications not received.",
    severity: "medium",
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    impactedTransactions: 67,
    status: "investigating",
  },
  {
    id: "inc3",
    providerId: "p2",
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
