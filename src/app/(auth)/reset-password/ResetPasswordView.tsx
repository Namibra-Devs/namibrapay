"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import Logo from "@/components/ui/logo";
import { FieldError } from "@/components/ui/fielderror";
import { useToast } from "@/components/ui/toast";
import { resetPassword, getErrorMessage } from "@/lib/auth-api";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

export default function ResetPasswordView() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", passwordConfirm: "" },
  });

  const { showToast } = useToast();

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      await resetPassword(token, data.password);
      showToast("success", "Password updated!", "Sign in with your new password.");
      await new Promise((r) => setTimeout(r, 1400));
      router.push("/signin");
    } catch (err) {
      showToast("error", "Reset failed", getErrorMessage(err));
    }
  };

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 px-8 py-10">
          <div className="flex justify-center mb-7"><Logo /></div>
          <div className="border-t border-gray-100 mb-7" />
          <div className="flex flex-col items-center gap-5 py-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle size={36} className="text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Invalid reset link
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                This link is missing or has expired. Please request a new one.
              </p>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-brand-teal hover:text-brand-teal/75 transition-colors"
            >
              Request new link
            </Link>
          </div>
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

        <h1 className="text-center text-xs font-semibold tracking-[0.18em] uppercase text-gray-400 mb-8 font-heading">
          Set new password
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* New password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                autoComplete="new-password"
                autoFocus
                disabled={isSubmitting}
                {...register("password")}
                className={cn(
                  inputBase,
                  "pr-12",
                  errors.password
                    ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-200 focus:ring-brand-teal/30 focus:border-brand-teal"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                disabled={isSubmitting}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:pointer-events-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <FieldError message={errors.password?.message} />
          </div>

          {/* Confirm password */}
          <div>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register("passwordConfirm")}
                className={cn(
                  inputBase,
                  "pr-12",
                  errors.passwordConfirm
                    ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-200 focus:ring-brand-teal/30 focus:border-brand-teal"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
                disabled={isSubmitting}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:pointer-events-none"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <FieldError message={errors.passwordConfirm?.message} />
          </div>

          {/* Submit */}
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
                  Updating…
                </>
              ) : (
                "Set new password"
              )}
            </motion.button>
          </div>
        </form>
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
