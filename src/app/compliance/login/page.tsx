"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { FieldError } from "@/components/ui/FieldError";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

// Validation schemas
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function ComplianceLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginValues) => {
    const id = toast.loading("Signing in…", {
      description: "Verifying your credentials.",
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.info("MFA code required", {
        description: "Check your authenticator app for the code.",
        id,
      });
      setShowMFA(true);
    } catch (err) {
      toast.error("Sign in failed", {
        description: "Invalid email or password.",
        id,
      });
    }
  };

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mfaCode.length !== 6) {
      toast.error("Invalid code", {
        description: "Please enter a 6-digit authentication code.",
      });
      return;
    }

    const id = toast.loading("Verifying code…", {
      description: "Authenticating your access.",
    });

    setIsVerifying(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Authentication successful!", {
        description: "Redirecting to compliance dashboard.",
        id,
      });
      // Keep loading state through navigation
      await new Promise((resolve) => setTimeout(resolve, 1400));
      window.location.href = "/compliance/dashboard";
    } catch (err) {
      toast.error("Verification failed", {
        description: "Invalid authentication code. Please try again.",
        id,
      });
      setIsVerifying(false);
    }
  };

  const handleBackToLogin = () => {
    setShowMFA(false);
    setMfaCode("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-brand-navy via-brand-navy to-brand-teal/20 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 px-8 py-10">
          {/* Logo */}
          <div className="flex justify-center mb-7">
            <Logo />
          </div>
          <div className="border-t border-gray-100 mb-7" />

          <h1 className="text-center text-xs font-semibold tracking-[0.18em] uppercase text-gray-400 mb-2 font-heading">
            {showMFA ? "Two-Factor Authentication" : "Compliance Portal"}
          </h1>
          <p className="text-center text-sm text-gray-500 mb-8">
            {showMFA
              ? "Enter your authentication code"
              : "Authorized personnel only"}
          </p>

          {!showMFA ? (
            /* Login Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="officer@namibrapay.com"
                  autoComplete="email"
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

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
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

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-brand-teal border-gray-300 rounded focus:ring-brand-teal"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
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
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </motion.button>
              </div>
            </form>
          ) : (
            /* MFA Form */
            <form onSubmit={handleMFAVerify} className="space-y-5">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-brand-teal" />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) =>
                    setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  disabled={isVerifying}
                  className={cn(
                    inputBase,
                    "text-center text-2xl tracking-[0.5em] font-semibold",
                    "border-gray-200 focus:ring-brand-teal/30 focus:border-brand-teal"
                  )}
                  placeholder="000000"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isVerifying || mfaCode.length !== 6}
                  whileTap={isVerifying || mfaCode.length !== 6 ? {} : { scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-brand-teal text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-teal/90 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-brand-teal"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </motion.button>
              </div>

              <button
                type="button"
                onClick={handleBackToLogin}
                disabled={isVerifying}
                className="w-full text-sm text-gray-600 hover:text-brand-navy transition-colors disabled:opacity-50"
              >
                ← Back to login
              </button>
            </form>
          )}

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">Secure Access</p>
                <p className="text-blue-700">
                  All compliance portal access is monitored and logged. MFA is
                  mandatory for all accounts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-7 text-center text-white/60 text-sm">
          Need help?{" "}
          <span className="text-white/90 font-medium">
            Contact your system administrator
          </span>
        </p>
      </motion.div>
    </div>
  );
}
