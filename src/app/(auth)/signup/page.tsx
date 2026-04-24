"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import Select, { type SelectOption } from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import { signUp, getErrorMessage } from "@/lib/auth-api";
import { TOKEN_KEY } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { BusinessType } from "@/types/auth";

// ── Static data ──────────────────────────────────────────────────

const COUNTRY_OPTIONS: SelectOption[] = [
  { value: "NA", label: "Namibia" },
  { value: "ZA", label: "South Africa" },
  { value: "BW", label: "Botswana" },
  { value: "ZW", label: "Zimbabwe" },
  { value: "ZM", label: "Zambia" },
  { value: "AO", label: "Angola" },
  { value: "KE", label: "Kenya" },
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "UG", label: "Uganda" },
  { value: "TZ", label: "Tanzania" },
  { value: "RW", label: "Rwanda" },
  { value: "ET", label: "Ethiopia" },
  { value: "OTHER", label: "Other" },
];

const PHONE_CODE_OPTIONS: SelectOption[] = [
  { value: "+264", label: "+264" },
  { value: "+27", label: "+27" },
  { value: "+267", label: "+267" },
  { value: "+263", label: "+263" },
  { value: "+260", label: "+260" },
  { value: "+244", label: "+244" },
  { value: "+254", label: "+254" },
  { value: "+234", label: "+234" },
  { value: "+233", label: "+233" },
  { value: "+256", label: "+256" },
  { value: "+255", label: "+255" },
  { value: "+250", label: "+250" },
  { value: "+251", label: "+251" },
  { value: "+44", label: "+44" },
  { value: "+1", label: "+1" },
];

// ── Form types ───────────────────────────────────────────────────

interface SignUpForm {
  country: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  password: string;
}

type DeveloperType = "yes" | "no" | null;

// ── Shared styles ────────────────────────────────────────────────

const inputBase =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal disabled:opacity-50 disabled:cursor-not-allowed";

const labelBase = "block text-sm font-medium text-gray-700 mb-1.5";

// ── Component ────────────────────────────────────────────────────

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState<SignUpForm>({
    country: "GH",
    businessName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+233",
    phone: "",
    password: "",
  });
  const [businessType, setBusinessType] = useState<BusinessType>("starter");
  const [isDeveloper, setIsDeveloper] = useState<DeveloperType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField =
    (field: keyof SignUpForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const updateSelect = (field: keyof SignUpForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic required-field check
    const required: Array<[keyof SignUpForm, string]> = [
      ["businessName", "Business name"],
      ["firstName", "First name"],
      ["lastName", "Last name"],
      ["email", "Email address"],
      ["phone", "Phone number"],
      ["password", "Password"],
    ];
    for (const [field, label] of required) {
      if (!form[field].trim()) {
        toast.error("Missing field", { description: `${label} is required.` });
        return;
      }
    }
    if (isDeveloper === null) {
      toast.error("Missing field", { description: "Please answer the developer question." });
      return;
    }

    setIsSubmitting(true);
    const id = toast.loading("Creating your account…", {
      description: "This only takes a moment.",
    });

    try {
      const data = await signUp({
        country: form.country,
        businessName: form.businessName.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: `${form.phoneCode}${form.phone.trim().replace(/\s/g, "")}`,
        password: form.password,
        businessType,
        isDeveloper: isDeveloper === "yes",
      });

      localStorage.setItem(TOKEN_KEY, data.token);

      toast.success("Account created!", {
        description: `Welcome to NamibraPay, ${data.user.firstName}!`,
        id,
      });

      setTimeout(() => router.push("/dashboard"), 1400);
    } catch (err) {
      toast.error("Sign up failed", { description: getErrorMessage(err), id });
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
          Create your account
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Country */}
          <div>
            <label className={labelBase}>Country</label>
            <Select
              options={COUNTRY_OPTIONS}
              value={form.country}
              onChange={updateSelect("country")}
            />
          </div>

          {/* Business name */}
          <div>
            <label className={labelBase}>Business name</label>
            <input
              type="text"
              placeholder="Acme Payments Ltd."
              autoComplete="organization"
              value={form.businessName}
              onChange={updateField("businessName")}
              disabled={isSubmitting}
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
                value={form.firstName}
                onChange={updateField("firstName")}
                disabled={isSubmitting}
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelBase}>Last name</label>
              <input
                type="text"
                placeholder="Doe"
                autoComplete="family-name"
                value={form.lastName}
                onChange={updateField("lastName")}
                disabled={isSubmitting}
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
              value={form.email}
              onChange={updateField("email")}
              disabled={isSubmitting}
              className={inputBase}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelBase}>Phone number</label>
            <div className="flex rounded-xl border border-gray-200 transition focus-within:ring-2 focus-within:ring-brand-teal/30 focus-within:border-brand-teal">
              <Select
                compact
                options={PHONE_CODE_OPTIONS}
                value={form.phoneCode}
                onChange={updateSelect("phoneCode")}
                className="shrink-0"
                triggerClassName="rounded-l-xl"
              />
              <input
                type="tel"
                placeholder="81 234 5678"
                autoComplete="tel-national"
                value={form.phone}
                onChange={updateField("phone")}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white rounded-r-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                value={form.password}
                onChange={updateField("password")}
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
          </div>

          {/* Business type */}
          <div>
            <label className={labelBase}>What type of business do you own?</label>
            <div className="space-y-3">
              {(
                [
                  {
                    value: "starter" as BusinessType,
                    title: "Starter Business",
                    description:
                      "I'm testing my ideas with real customers, and preparing to register my company.",
                  },
                  {
                    value: "registered" as BusinessType,
                    title: "Registered Business",
                    description:
                      "My business has the approval, documentation, and licences required to operate legally.",
                  },
                ]
              ).map((option) => {
                const selected = businessType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setBusinessType(option.value)}
                    className={cn(
                      "w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                      selected
                        ? "border-brand-teal bg-brand-teal/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                        selected ? "border-brand-teal" : "border-gray-300"
                      )}
                    >
                      {selected && <span className="w-2 h-2 rounded-full bg-brand-teal" />}
                    </span>
                    <div>
                      <p className={cn("text-sm font-semibold", selected ? "text-brand-navy" : "text-gray-700")}>
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
                    disabled={isSubmitting}
                    onClick={() => setIsDeveloper(val)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
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
                      {selected && <span className="w-2 h-2 rounded-full bg-brand-teal" />}
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
              disabled={isSubmitting}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-brand-teal text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-teal/90 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-brand-teal"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create my account"
              )}
            </motion.button>
          </div>
        </form>

        {/* Terms */}
        <p className="mt-5 text-xs text-gray-400 leading-relaxed text-center">
          By clicking &ldquo;Create my account&rdquo;, you agree to NamibraPay&apos;s{" "}
          <Link href="/terms" className="text-brand-navy hover:text-brand-teal underline transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-brand-navy hover:text-brand-teal underline transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {/* Sign in prompt */}
      <p className="mt-7 text-center text-white/60 text-sm">
        Already have an account?{" "}
        <Link href="/signin" className="text-brand-teal font-semibold hover:underline transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
