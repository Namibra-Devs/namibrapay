"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { FieldError } from "@/components/ui/FieldError";
import { toast } from "@/components/ui/Toast";
import { signIn, getErrorMessage } from "@/lib/auth-api";
import { TOKEN_KEY } from "@/lib/api";
import { signInSchema, type SignInValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}**@${domain}`;
}

const inputBase =
  "w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInValues) => {
    const id = toast.loading("Signing in…", {
      description: "Verifying your credentials.",
    });
    try {
      const res = await signIn(data);

      if ("requiresMFA" in res) {
        toast.info("Verification code sent", {
          description: "Check your email for the 6-digit code.",
          id,
        });
        const hint = res.hint ?? maskEmail(data.email);
        await new Promise((r) => setTimeout(r, 800));
        router.push(
          `/verify-mfa?session=${encodeURIComponent(res.session)}&hint=${encodeURIComponent(hint)}`
        );
        return;
      }

      localStorage.setItem(TOKEN_KEY, res.token);
      toast.success("Welcome back!", {
        description: `Good to see you, ${res.user.firstName}.`,
        id,
      });
      // Keep isSubmitting true (button stays disabled) through the navigation delay
      await new Promise((r) => setTimeout(r, 1400));
      router.push("/dashboard");
    } catch (err) {
      toast.error("Sign in failed", { description: getErrorMessage(err), id });
    }
  };

  return (
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

        <h1 className="text-center text-xs font-semibold tracking-[0.18em] uppercase text-gray-400 mb-8 font-heading">
          Sign in to your account
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
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

        {/* Forgot password */}
        <p className="mt-5 text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-brand-navy hover:text-brand-teal transition-colors font-medium"
          >
            Forgot your password?
          </Link>
        </p>
      </div>

      {/* Sign up prompt */}
      <p className="mt-7 text-center text-white/60 text-sm">
        New to NamibraPay?{" "}
        <Link
          href="/signup"
          className="text-brand-teal font-semibold hover:underline transition-colors"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
