"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { MailOpen, Loader2 } from "lucide-react";
import Logo from "@/components/ui/logo";
import { FieldError } from "@/components/ui/field-error";
import { useToast } from "@/components/ui/toast";
import { forgotPassword, getErrorMessage } from "@/lib/auth-api";
import { logger } from "@/lib/logger";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await forgotPassword(data.email);
      showToast("success", "Reset link sent!", "Check your inbox and spam folder.");
      setSentEmail(data.email);
      setSent(true);
    } catch (err) {
      logger.error("Forgot password request failed", err, { email: data.email });
      showToast("error", "Failed to send", getErrorMessage(err));
    }
  };

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

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-center text-xs font-semibold tracking-[0.18em] uppercase text-gray-400 mb-8 font-heading">
                Request password reset
              </h1>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    autoFocus
                    disabled={isSubmitting}
                    {...register("email")}
                    className={cn(
                      inputBase,
                      errors.email
                        ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                        : "border-gray-200 focus:ring-brand-teal/30 focus:border-brand-teal"
                    )}
                  />
                  <FieldError message={errors.email?.message} />
                </div>

                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileTap={isSubmitting ? {} : { scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-brand-teal text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-teal/90 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-brand-teal"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Request reset"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-4 gap-5"
            >
              <div className="w-20 h-20 rounded-full bg-brand-teal/10 flex items-center justify-center">
                <MailOpen size={38} className="text-brand-teal" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-gray-900 mb-2 font-heading">
                  Check your inbox
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We sent a password reset link to{" "}
                  <span className="font-semibold text-gray-700">{sentEmail}</span>.
                  The link expires in 1 hour.
                </p>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Did not receive it?{" "}
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-brand-teal font-semibold hover:underline"
                >
                  Try again
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <p className="mt-7 text-center text-white/60 text-sm">
        Remember your password?{" "}
        <Link
          href="/signin"
          className="text-brand-teal font-semibold hover:underline transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
