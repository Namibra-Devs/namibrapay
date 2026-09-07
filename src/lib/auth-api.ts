import type { SignInPayload, SignUpPayload, AuthResponse, SignInResponse, ApiErrorBody } from "@/types/auth";

// Extended response type for pending accounts
export type SignInResponseExtended = SignInResponse | {
  status: "pending";
  email: string;
  businessName: string;
  message: string;
};

// Compliance status type
export type ComplianceStatus = "incomplete" | "pending" | "approved" | "rejected";

// Mock auth functions - replace with real API calls later
export async function signIn(payload: SignInPayload): Promise<SignInResponseExtended> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock: Check if account is pending approval
  // In production, backend would check account status from database
  const isPending = false; // Set to true to test pending flow
  
  if (isPending) {
    return {
      status: "pending",
      email: payload.email,
      businessName: "Your Business", // Would come from database
      message: "Your account is still under review. Please check your application status.",
    };
  }
  
  // Mock response - returning successful auth (no MFA required)
  // TODO: In production, include complianceStatus from backend
  return {
    token: "mock-token",
    user: {
      id: "1",
      email: payload.email,
      firstName: "Test",
      lastName: "User",
      businessName: "Test Business",
      role: "owner", // Default to merchant owner role
      complianceStatus: "incomplete" as ComplianceStatus, // Would come from database
    },
  };
}

export async function verifyOtp(session: string, otp: string): Promise<AuthResponse> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    token: "mock-token",
    user: {
      id: "1",
      email: "user@example.com",
      firstName: "Test",
      lastName: "User",
      businessName: "Test Business",
      role: "owner",
    },
  };
}

export async function resendOtp(session: string): Promise<{ session: string }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { session: "new-session-id" };
}

export async function forgotPassword(email: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate payload structure at runtime
  if (!payload.email || !payload.password || !payload.firstName || !payload.lastName) {
    throw new Error("Missing required fields");
  }
  
  return {
    token: "mock-token",
    user: {
      id: "1",
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      businessName: payload.businessName || "New Business",
      role: "owner",
      complianceStatus: "incomplete" as ComplianceStatus, // New accounts start in Test Mode
    },
  };
}

export async function resendVerificationEmail(email: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
}

export async function confirmEmail(token: string): Promise<AuthResponse> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    token: "mock-token",
    user: {
      id: "1",
      email: "user@example.com",
      firstName: "Test",
      lastName: "User",
      businessName: "Test Business",
      role: "owner",
    },
  };
}

/** Extract a human-readable message from any thrown error. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred.";
}
