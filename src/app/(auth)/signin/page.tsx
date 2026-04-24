"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { toast } from "@/components/ui/Toast";
import { signIn, getErrorMessage } from "@/lib/auth-api";
import { TOKEN_KEY } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SignInForm {
  email: string;
  password: string;
}

const inputBase =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal disabled:opacity-50 disabled:cursor-not-allowed";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignInForm>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update =
    (field: keyof SignInForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      toast.error("Missing fields", { description: "Please enter your email and password." });
      return;
    }

    setIsSubmitting(true);
    const id = toast.loading("Signing in…", { description: "Verifying your credentials." });

    try {
      const data = await signIn({ email: form.email.trim(), password: form.password });
      localStorage.setItem(TOKEN_KEY, data.token);

      toast.success("Welcome back!", {
        description: `Good to see you, ${data.user.firstName}.`,
        id,
      });

      // Brief pause so the success toast is visible before navigation
      setTimeout(() => router.push("/dashboard"), 1400);
    } catch (err) {
      toast.error("Sign in failed", { description: getErrorMessage(err), id });
      setIsSubmitting(false);
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

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
              disabled={isSubmitting}
              className={inputBase}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              value={form.password}
              onChange={update("password")}
              disabled={isSubmitting}
              className={cn(inputBase, "pr-12")}
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
        <p className="mt-5 text-center text-sm text-gray-500">
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
