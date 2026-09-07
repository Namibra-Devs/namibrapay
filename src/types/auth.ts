export type BusinessType = "starter" | "registered";

// ── Request payloads ─────────────────────────────────────────────

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  country: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Full number including dial code e.g. "+264811234567" */
  phone: string;
  password: string;
  businessType: BusinessType;
  isDeveloper: boolean;
}

// ── Response shapes ──────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  role: string;
  complianceStatus?: "incomplete" | "pending" | "approved" | "rejected";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

export interface MfaRequiredResponse {
  requiresMFA: true;
  session: string;
  /** Masked email hint from the backend e.g. "us**@ex**.com" */
  hint?: string;
  message?: string;
}

export type SignInResponse = AuthResponse | MfaRequiredResponse;

// ── API error body ───────────────────────────────────────────────

export interface ApiErrorBody {
  message: string;
  code?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
