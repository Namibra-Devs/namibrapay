import axios from "axios";
import api from "./api";
import type { SignInPayload, SignUpPayload, AuthResponse, ApiErrorBody } from "@/types/auth";

export async function signIn(payload: SignInPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/signin", payload);
  return data;
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/signup", payload);
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
