"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const COUNTRIES = [
  { name: "Namibia", code: "NA" },
  { name: "South Africa", code: "ZA" },
  { name: "Botswana", code: "BW" },
  { name: "Zimbabwe", code: "ZW" },
  { name: "Zambia", code: "ZM" },
  { name: "Angola", code: "AO" },
  { name: "Kenya", code: "KE" },
  { name: "Nigeria", code: "NG" },
  { name: "Ghana", code: "GH" },
  { name: "Uganda", code: "UG" },
  { name: "Tanzania", code: "TZ" },
  { name: "Rwanda", code: "RW" },
  { name: "Ethiopia", code: "ET" },
  { name: "Other", code: "" },
];

const PHONE_CODES = [
  { label: "+264", country: "NA" },
  { label: "+27", country: "ZA" },
  { label: "+267", country: "BW" },
  { label: "+263", country: "ZW" },
  { label: "+260", country: "ZM" },
  { label: "+244", country: "AO" },
  { label: "+254", country: "KE" },
  { label: "+234", country: "NG" },
  { label: "+233", country: "GH" },
  { label: "+256", country: "UG" },
  { label: "+255", country: "TZ" },
  { label: "+250", country: "RW" },
  { label: "+251", country: "ET" },
  { label: "+44", country: "GB" },
  { label: "+1", country: "US" },
];

type BusinessType = "starter" | "registered";
type DeveloperType = "yes" | "no" | null;

const inputBase =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal";

const labelBase = "block text-sm font-medium text-gray-700 mb-1.5";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [businessType, setBusinessType] = useState<BusinessType>("starter");
  const [isDeveloper, setIsDeveloper] = useState<DeveloperType>(null);

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
          Create your account
        </h1>

        <form className="space-y-5" noValidate>
          {/* Country */}
          <div>
            <label className={labelBase}>Country</label>
            <div className="relative">
              <select
                defaultValue="NA"
                className={cn(
                  inputBase,
                  "appearance-none pr-10 cursor-pointer"
                )}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Business name */}
          <div>
            <label className={labelBase}>Business name</label>
            <input
              type="text"
              placeholder="Acme Payments Ltd."
              autoComplete="organization"
              className={inputBase}
            />
          </div>

          {/* First / Last name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>First name</label>
              <input
                type="text"
                placeholder="Jane"
                autoComplete="given-name"
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelBase}>Last name</label>
              <input
                type="text"
                placeholder="Doe"
                autoComplete="family-name"
                className={inputBase}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelBase}>Email address</label>
            <input
              type="email"
              placeholder="jane@acme.com"
              autoComplete="email"
              className={inputBase}
            />
          </div>

          {/* Phone number */}
          <div>
            <label className={labelBase}>Phone number</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden transition focus-within:ring-2 focus-within:ring-brand-teal/30 focus-within:border-brand-teal">
              <div className="relative shrink-0">
                <select
                  defaultValue="+264"
                  className="h-full appearance-none bg-gray-50 border-r border-gray-200 text-sm text-gray-700 pl-3 pr-8 py-3 focus:outline-none cursor-pointer"
                >
                  {PHONE_CODES.map((p) => (
                    <option key={p.label} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
              <input
                type="tel"
                placeholder="81 234 5678"
                autoComplete="tel-national"
                className="flex-1 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={labelBase}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                autoComplete="new-password"
                className={cn(inputBase, "pr-12")}
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
          </div>

          {/* Business type */}
          <div>
            <label className={labelBase}>
              What type of business do you own?
            </label>
            <div className="space-y-3">
              {(
                [
                  {
                    value: "starter",
                    title: "Starter Business",
                    description:
                      "I'm testing my ideas with real customers, and preparing to register my company.",
                  },
                  {
                    value: "registered",
                    title: "Registered Business",
                    description:
                      "My business has the approval, documentation, and licences required to operate legally.",
                  },
                ] as { value: BusinessType; title: string; description: string }[]
              ).map((option) => {
                const selected = businessType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setBusinessType(option.value)}
                    className={cn(
                      "w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3.5 transition-all cursor-pointer",
                      selected
                        ? "border-brand-teal bg-brand-teal/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                        selected
                          ? "border-brand-teal"
                          : "border-gray-300"
                      )}
                    >
                      {selected && (
                        <span className="w-2 h-2 rounded-full bg-brand-teal" />
                      )}
                    </span>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          selected ? "text-brand-navy" : "text-gray-700"
                        )}
                      >
                        {option.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Developer */}
          <div>
            <label className={labelBase}>Are you a software developer?</label>
            <div className="flex gap-3">
              {(["yes", "no"] as DeveloperType[]).map((val) => {
                const selected = isDeveloper === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setIsDeveloper(val)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer",
                      selected
                        ? "border-brand-teal bg-brand-teal/5 text-brand-navy"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                        selected ? "border-brand-teal" : "border-gray-300"
                      )}
                    >
                      {selected && (
                        <span className="w-2 h-2 rounded-full bg-brand-teal" />
                      )}
                    </span>
                    {val === "yes" ? "Yes, I am" : "No, I'm not"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-1">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-teal text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-teal/90 transition-colors cursor-pointer"
            >
              Create my account
            </motion.button>
          </div>
        </form>

        {/* Terms */}
        <p className="mt-5 text-xs text-gray-400 leading-relaxed text-center">
          By clicking &ldquo;Create my account&rdquo;, you agree to
          NamibraPay&apos;s{" "}
          <Link
            href="/terms"
            className="text-brand-navy hover:text-brand-teal underline transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-brand-navy hover:text-brand-teal underline transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {/* Sign in prompt */}
      <p className="mt-7 text-center text-white/60 text-sm">
        Already have an account?{" "}
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
