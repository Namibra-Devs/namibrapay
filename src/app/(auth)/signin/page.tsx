"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      {/* Logo above card */}
      <div className="flex justify-center mb-8">
        <Logo />
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 px-8 py-10">
        <h1 className="text-center text-xs font-semibold tracking-[0.18em] uppercase text-gray-400 mb-8 font-heading">
          Sign in to your account
        </h1>

        <form className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-teal text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-teal/90 transition-colors cursor-pointer"
            >
              Sign in
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
