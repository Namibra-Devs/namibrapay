// Compliance Dashboard Type Definitions

export type UserRole = "CO" | "SENIOR_CO" | "ADMIN" | "AUDITOR";

export type ApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "PENDING_INFO"
  | "ESCALATED"
  | "APPROVED"
  | "REJECTED";

export type EntityStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "UNDER_REVIEW"
  | "REJECTED"
  | "BLACKLISTED"
  | "OFFBOARDED";

export type RiskBand = "LOW" | "MEDIUM" | "HIGH";

export type ApplicantType = "INDIVIDUAL" | "BUSINESS" | "INSTITUTION";

export type DocumentStatus = "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";

export type ScreeningStatus = "CLEAR" | "HIT" | "PENDING";

export type ScreeningDisposition =
  | "PENDING"
  | "TRUE_POSITIVE"
  | "FALSE_POSITIVE"
  | "ESCALATED";

export type CaseStatus =
  | "OPEN"
  | "INVESTIGATING"
  | "PENDING_REVIEW"
  | "CLOSED"
  | "REPORTED";

export type MessageChannel = "SMS" | "EMAIL" | "BOTH";

export type MessageStatus =
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "FAILED"
  | "BOUNCED";

// User & Authentication
export interface ComplianceUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "ACTIVE" | "SUSPENDED" | "LOCKED";
  mfaEnabled: boolean;
  authorityLevel: number;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthSession {
  user: ComplianceUser;
  token: string;
  expiresAt: string;
}

// Application & Entity
export interface Application {
  id: string;
  type: ApplicantType;
  status: ApplicationStatus;
  riskScore: number;
  riskBand: RiskBand;
  assignedOfficer?: string;
  submittedAt: string;
  slaDeadline: string;
  screeningStatus: ScreeningStatus;
  applicant: ApplicantInfo;
  documents: Document[];
  beneficialOwners?: BeneficialOwner[];
  screeningResults: ScreeningResult[];
  notes: Note[];
  auditTrail: AuditEvent[];
}

export interface ApplicantInfo {
  // Individual
  fullName?: string;
  dateOfBirth?: string;
  nationality?: string;
  gender?: string;
  residentialAddress?: string;
  phone: string;
  email: string;
  nationalIdType?: string;
  nationalIdNumber?: string;
  tin?: string;
  occupation?: string;
  sourceOfFunds?: string;

  // Business
  legalName?: string;
  tradingName?: string;
  businessType?: string;
  registrationNumber?: string;
  dateOfIncorporation?: string;
  registeredAddress?: string;
  operatingAddress?: string;
  industry?: string;
  website?: string;
  expectedMonthlyVolume?: number;
  intendedChannels?: string[];
}

export interface BeneficialOwner {
  id: string;
  name: string;
  dateOfBirth: string;
  nationality: string;
  ownershipPercent: number;
  role: "DIRECTOR" | "SHAREHOLDER" | "UBO" | "SIGNATORY";
  screeningStatus: ScreeningStatus;
}

export interface Entity {
  id: string;
  type: ApplicantType;
  status: EntityStatus;
  riskBand: RiskBand;
  info: ApplicantInfo;
  onboardedAt: string;
  lastActivity?: string;
  assignedOfficer?: string;
  documents: Document[];
  cases: Case[];
  transactionSummary?: TransactionSummary;
}

// Documents
export interface Document {
  id: string;
  type: string;
  entityId: string;
  status: DocumentStatus;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

// Screening
export interface ScreeningResult {
  id: string;
  subjectId: string;
  subjectName: string;
  listType: "SANCTIONS" | "PEP" | "ADVERSE_MEDIA";
  matchScore: number;
  matchedAttributes: string[];
  screenedAt: string;
  disposition: ScreeningDisposition;
  dispositionBy?: string;
  dispositionAt?: string;
  dispositionJustification?: string;
}

// Risk Management
export interface RiskAssessment {
  score: number;
  band: RiskBand;
  factors: RiskFactor[];
  computedAt: string;
  overriddenBy?: string;
  overrideJustification?: string;
}

export interface RiskFactor {
  name: string;
  weight: number;
  value: number;
  contribution: number;
}

// Case Management
export interface Case {
  id: string;
  type:
    | "SANCTIONS_HIT"
    | "SUSPICIOUS_ACTIVITY"
    | "COMPLAINT"
    | "DOCUMENT_FRAUD"
    | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: CaseStatus;
  linkedEntities: string[];
  assignedInvestigator?: string;
  openedAt: string;
  openedBy: string;
  closedAt?: string;
  outcome?: string;
  evidence: CaseEvidence[];
  notes: Note[];
  tasks: CaseTask[];
  strDraft?: string;
}

export interface CaseEvidence {
  id: string;
  type: "DOCUMENT" | "SCREENSHOT" | "TRANSACTION" | "NOTE";
  description: string;
  fileUrl?: string;
  addedBy: string;
  addedAt: string;
}

export interface CaseTask {
  id: string;
  description: string;
  assignedTo: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
}

// Communications
export interface Message {
  id: string;
  entityId: string;
  channel: MessageChannel;
  template?: string;
  subject?: string;
  body: string;
  status: MessageStatus;
  sender: string;
  sentAt: string;
  deliveredAt?: string;
  attachments?: string[];
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: MessageChannel;
  subject?: string;
  body: string;
  mergeFields: string[];
  category: string;
  isActive: boolean;
}

// Transaction Monitoring
export interface TransactionSummary {
  totalVolume: number;
  totalValue: number;
  averageValue: number;
  channelBreakdown: Record<string, number>;
  period: string;
  flaggedCount: number;
}

export interface TransactionAlert {
  id: string;
  entityId: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  triggeredAt: string;
  reviewedBy?: string;
  disposition?: "FALSE_POSITIVE" | "ESCALATED_TO_CASE";
  dispositionJustification?: string;
}

// Notes & Audit
export interface Note {
  id: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
  isInternal: boolean;
}

export interface AuditEvent {
  id: string;
  actor: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeState?: any;
  afterState?: any;
  justification?: string;
  timestamp: string;
  ipAddress?: string;
  device?: string;
}

// Dashboard KPIs
export interface DashboardKPIs {
  pendingApplications: number;
  underReview: number;
  approvedToday: number;
  approvedThisPeriod: number;
  rejectedToday: number;
  rejectedThisPeriod: number;
  awaitingInfo: number;
  escalated: number;
  slaBreaches: number;
  slaApproaching: number;
  openCases: number;
  openAlerts: number;
}

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

// Configuration
export interface RiskRule {
  id: string;
  name: string;
  factor: string;
  weight: number;
  conditions: any;
  isActive: boolean;
  version: number;
}

export interface DocumentRequirement {
  id: string;
  applicantType: ApplicantType;
  riskBand: RiskBand;
  documentTypes: string[];
}

export interface AuthorityMatrix {
  role: UserRole;
  riskBand: RiskBand;
  canApprove: boolean;
  canReject: boolean;
  requiresSecondAuth: boolean;
}

// Onboarding & Account Data
export interface AccountData {
  accountType: "bank" | "mobile_money" | "";
  bankName: string;
  accountNumber: string;
  provider: string;
  mobilePhone: string;
  nameOnAccount: string;
}
