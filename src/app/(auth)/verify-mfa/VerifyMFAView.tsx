"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useToast } from "@/components/ui/Toast";
import { verifyOtp, resendOtp, getErrorMessage } from "@/lib/auth-api";
import { TOKEN_KEY } from "@/lib/api";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;
const EXPIRY_SECONDS = 30 * 60;

function formatTime(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function VerifyMFAView() {
  const router = useRouter();
  const params = useSearchParams();
  const [session, setSession] = useState(params.get("session") ?? "");
  const hint = params.get("hint") ?? "your email address";
  const { showToast } = useToast();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH && digits.every(Boolean);
  const isExpired = secondsLeft <= 0;

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const focusAt = (i: number) =>
    inputRefs.current[Math.max(0, Math.min(i, OTP_LENGTH - 1))]?.focus();

  function handleChange(i: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;
    setDigits(next);
    if (digit && i < OTP_LENGTH - 1) focusAt(i + 1);
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits];
        next[i] = "";
        setDigits(next);
      } else {
        focusAt(i - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => {
      next[i] = d;
    });
    setDigits(next);
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
  }

  const handleVerify = useCallback(async () => {
    if (!isComplete || submitting || isExpired) return;
    setSubmitting(true);
    try {
      const res = await verifyOtp(session, otp);
      localStorage.setItem(TOKEN_KEY, res.token);
      showToast("success", "Identity confirmed!", `Welcome back, ${res.user.firstName}.`);
      await new Promise((r) => setTimeout(r, 1400));
      router.push("/dashboard");
    } catch (err) {
      logger.error("MFA verification failed", err);
      showToast("error", "Invalid code", getErrorMessage(err));
      setDigits(Array(OTP_LENGTH).fill(""));
      setSubmitting(false);
      focusAt(0);
    }
  }, [isComplete, submitting, isExpired, session, otp, router, showToast]);

  async function handleResend() {
    if (resending) return;
    setResending(true);
    try {
      const res = await resendOtp(session);
      setSession(res.session);
      setDigits(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(EXPIRY_SECONDS);
      showToast("success", "Code resent!", "Check your inbox and spam folder.");
      focusAt(0);
    } catch (err) {
      logger.error("OTP resend failed", err);
      showToast("error", "Failed to resend", getErrorMessage(err));
    } finally {
      setResending(false);
    }
  }

  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 px-8 py-10 text-center">
          <div className="flex justify-center mb-7">
            <Logo />
          </div>
          <div className="border-t border-gray-100 mb-7" />
          <p className="text-sm text-gray-500 mb-6">
            Invalid or expired session. Please sign in again.
          </p>
          <Link
            href="/signin"
            className="text-sm font-semibold text-brand-teal hover:text-brand-teal/75 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 px-8 py-10">
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <Logo />
        </div>
        <div className="border-t border-gray-100 mb-7" />

        <h1 className="text-center text-xs font-semibold tracking-[0.18em] uppercase text-gray-400 mb-3 font-heading">
          Two-Factor Authentication
        </h1>

        <p className="text-center text-sm text-gray-500 leading-relaxed mb-8">
          Enter the 6-digit code from your authenticator app
        </p>

        {/* OTP inputs */}
        <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el: HTMLInputElement | null) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={submitting || isExpired}
              autoFocus={i === 0}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              className={cn(
                "w-12 h-14 text-center text-xl font-semibold text-gray-900 rounded-xl border-2 bg-white transition focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed",
                digit
                  ? "border-brand-teal"
                  : "border-gray-200 focus:border-brand-teal",
              )}
            />
          ))}
        </div>

        {/* Expiry - Remove for TOTP */}
        <p className="text-center text-xs text-gray-400 mb-6">
          Open your authenticator app to get your code
        </p>

        {/* Submit */}
        <motion.button
          type="button"
          onClick={handleVerify}
          disabled={!isComplete || submitting}
          whileTap={!isComplete || submitting ? {} : { scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-brand-teal text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-teal/90 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-brand-teal"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Verifying…
            </>
          ) : (
            "Verify & Sign in"
          )}
        </motion.button>
      </div>

      {/* Below-card links */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <Link
          href="/signin"
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          ← Back to sign in
        </Link>
        <p className="text-sm text-white/50">
          Lost access to your authenticator?{" "}
          <a
            href="mailto:support@namibra.io"
            className="text-brand-teal font-semibold hover:underline transition-colors"
          >
            Contact support
          </a>
        </p>
      </div>
    </motion.div>
  );
}
