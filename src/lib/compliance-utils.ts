import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RiskBand, ApplicationStatus, EntityStatus } from "@/types/compliance";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Risk Band Utilities
export function getRiskBadgeColor(risk: RiskBand): string {
  switch (risk) {
    case "LOW":
      return "bg-green-100 text-green-800 border-green-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Status Badge Utilities
export function getStatusBadgeColor(status: ApplicationStatus | EntityStatus): string {
  switch (status) {
    case "SUBMITTED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "UNDER_REVIEW":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "PENDING_INFO":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "ESCALATED":
      return "bg-red-100 text-red-800 border-red-200";
    case "APPROVED":
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    case "SUSPENDED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "BLACKLISTED":
      return "bg-gray-900 text-white border-gray-800";
    case "OFFBOARDED":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Format status for display
export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

// SLA Time Utilities
export function calculateSLARemaining(deadline: string): {
  remaining: number;
  unit: string;
  isBreached: boolean;
  isUrgent: boolean;
} {
  const now = new Date();
  const slaDate = new Date(deadline);
  const diff = slaDate.getTime() - now.getTime();

  const isBreached = diff < 0;
  const absDiff = Math.abs(diff);

  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return {
      remaining: days,
      unit: days === 1 ? "day" : "days",
      isBreached,
      isUrgent: days <= 1 && !isBreached,
    };
  }

  return {
    remaining: hours,
    unit: hours === 1 ? "hour" : "hours",
    isBreached,
    isUrgent: hours <= 4 && !isBreached,
  };
}

// Format date
export function formatDate(date: string, includeTime: boolean = false): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return d.toLocaleDateString("en-US", options);
}

// Format currency
export function formatCurrency(amount: number, currency: string = "GHS"): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
  }).format(amount);
}

// Mask sensitive data
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) return "***";
  return data.slice(0, visibleChars) + "*".repeat(data.length - visibleChars);
}

// Calculate risk score color
export function getRiskScoreColor(score: number): string {
  if (score < 30) return "text-green-600";
  if (score < 70) return "text-yellow-600";
  return "text-red-600";
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Validation helpers
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/[\s()-]/g, ""));
}

// Permission checks
export function canApproveHighRisk(role: string): boolean {
  return role === "SENIOR_CO" || role === "ADMIN";
}

export function canAccessAuditLog(role: string): boolean {
  return role === "SENIOR_CO" || role === "ADMIN" || role === "AUDITOR";
}

export function canConfigureSystem(role: string): boolean {
  return role === "SENIOR_CO" || role === "ADMIN";
}

// Document type labels
export const DOCUMENT_TYPES: Record<string, string> = {
  NATIONAL_ID: "National ID",
  PASSPORT: "Passport",
  PROOF_OF_ADDRESS: "Proof of Address",
  BUSINESS_REG: "Business Registration Certificate",
  COMMENCE_CERT: "Certificate to Commence Business",
  TAX_CERT: "Tax Registration Certificate",
  BANK_STATEMENT: "Bank Statement",
  MOBILE_MONEY_CONFIRM: "Mobile Money Confirmation",
  DIRECTORS_ID: "Director's ID",
  SHAREHOLDERS_REGISTRY: "Shareholders Registry",
  OTHER: "Other Document",
};

// Rejection reason codes
export const REJECTION_REASONS = [
  { code: "INCOMPLETE_DOCS", label: "Incomplete Documentation" },
  { code: "SANCTIONS_HIT", label: "Sanctions Match" },
  { code: "HIGH_RISK_PROFILE", label: "High Risk Profile" },
  { code: "FRAUDULENT_INFO", label: "Fraudulent Information" },
  { code: "UNVERIFIABLE_IDENTITY", label: "Unverifiable Identity" },
  { code: "BUSINESS_MODEL_RISK", label: "High-Risk Business Model" },
  { code: "REGULATORY_RESTRICTION", label: "Regulatory Restriction" },
  { code: "OTHER", label: "Other (Specify)" },
];

// Missing info categories
export const MISSING_INFO_CATEGORIES = [
  "Valid Government-Issued ID",
  "Proof of Residential Address",
  "Business Registration Certificate",
  "Tax Identification Number",
  "Bank Account Confirmation",
  "Beneficial Ownership Declaration",
  "Director Identification Documents",
  "Business Operations Description",
  "Source of Funds Documentation",
  "Other (Specify)",
];
