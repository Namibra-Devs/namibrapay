"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { MailOpen, CheckCircle2, Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { toast } from "@/components/ui/Toast";
import { resendVerificationEmail, getErrorMessage } from "@/lib/auth-api";

export default function VerifyEmailView() {
  const email = useSearchParams().get("email") ?? "";
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleResend() {
    if (resending || !email) return;
    setResending(true);
    const id = toast.loading("Resending verification email…", {
      description: "Hang tight.",
    });
    try {
      await resendVerificationEmail(email);
      toast.success("Email sent!", {
        description: "Check your inbox and spam folder.",
        id,
      });
      setResent(true);
    } catch (err) {
      toast.error("Failed to resend", {
        description: getErrorMessage(err),
        id,
      });
    } finally {
      setResending(false);
    }
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
        <div className="border-t border-gray-100 mb-8" />

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative inline-flex">
            <div className="w-20 h-20 rounded-full bg-brand-teal/10 flex items-center justify-center">
              <MailOpen size={38} className="text-brand-teal" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
              <CheckCircle2 size={15} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-xl font-bold text-gray-900 mb-3 font-heading">
          Verify your email address
        </h1>

        {/* Body */}
        <p className="text-center text-sm text-gray-500 leading-relaxed mb-7">
          Please click the link that was sent to{" "}
          {email ? (
            <span className="font-semibold text-gray-800">{email}</span>
          ) : (
            "your email address"
          )}{" "}
          to verify your email.
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-6" />

        {/* Resend */}
        <p className="text-center text-sm text-gray-400 mb-3">
          Did not receive the email?
        </p>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-teal hover:text-brand-teal/75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending && <Loader2 size={14} className="animate-spin" />}
            Click here to resend
          </button>
        </div>

        <AnimatePresence>
          {resent && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-gray-400 mt-4"
            >
              Email resent — check your inbox and spam folder.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <p className="mt-7 text-center text-white/60 text-sm">
        Wrong account?{" "}
        <Link
          href="/signup"
          className="text-brand-teal font-semibold hover:underline transition-colors"
        >
          Sign up again
        </Link>
      </p>
    </motion.div>
  );
}
