import type { SignInPayload, SignUpPayload, AuthResponse, SignInResponse, ApiErrorBody } from "@/types/auth";

// Mock auth functions - replace with real API calls later
export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response - returning successful auth (no MFA required)
  return {
    token: "mock-token",
    user: {
      id: "1",
      email: payload.email,
      firstName: "Test",
      lastName: "User",
      businessName: "Test Business",
      role: "owner",
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
  
  return {
    token: "mock-token",
    user: {
      id: "1",
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      businessName: payload.businessName,
      role: "owner",
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
