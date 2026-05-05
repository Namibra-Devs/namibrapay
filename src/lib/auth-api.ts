import axios from "axios";
import api from "./api";
import type { SignInPayload, SignUpPayload, AuthResponse, SignInResponse, ApiErrorBody } from "@/types/auth";

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  const { data } = await api.post<SignInResponse>("/auth/signin", payload);
  return data;
}

export async function verifyOtp(session: string, otp: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/verify-otp", { session, otp });
  return data;
}

export async function resendOtp(session: string): Promise<{ session: string }> {
  const { data } = await api.post<{ session: string }>("/auth/resend-otp", { session });
  return data;
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post("/auth/forgot-password", { email });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await api.post("/auth/reset-password", { token, password });
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/signup", payload);
  return data;
}

export async function resendVerificationEmail(email: string): Promise<void> {
  await api.post("/auth/resend-verification", { email });
}

export async function confirmEmail(token: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/confirm-email", { token });
  return data;
}

/** Extract a human-readable message from any thrown error. */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(err)) {
    const body = err.response?.data;
    if (body?.message) return body.message;
    if (err.response?.status === 0 || !err.response) {
      return "Unable to reach the server. Check your connection.";
    }
    return err.message ?? "Something went wrong.";
  }
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred.";
}
