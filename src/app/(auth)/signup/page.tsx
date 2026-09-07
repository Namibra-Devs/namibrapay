"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Logo from "@/components/ui/logo";
import PhoneInput from "@/components/ui/phone-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";
import { FieldError } from "@/components/ui/field-error";
import { useToast } from "@/components/ui/toast";
import { signUp, getErrorMessage } from "@/lib/auth-api";
import { logger } from "@/lib/logger";
import { TOKEN_KEY } from "@/lib/api";
import { simpleSignUpSchema, type SimpleSignUpValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

const labelBase = "block text-sm font-medium text-gray-700 mb-1.5";

export default function SignUpPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SimpleSignUpValues>({
    resolver: zodResolver(simpleSignUpSchema),
    defaultValues: {
      businessName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      businessType: "registered",
      isDeveloper: "no",
      password: "",
      passwordConfirm: "",
      acceptedTerms: false,
    },
  });

  const password = watch("password");
  const businessType = watch("businessType");
  const isDeveloper = watch("isDeveloper");

  const onSubmit = async (data: SimpleSignUpValues) => {
    try {
      // Transform the form data to match API expectations
      const signUpPayload = {
        businessName: data.businessName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        businessType: data.businessType,
        isDeveloper: data.isDeveloper === "yes",
      };

      const res = await signUp(signUpPayload);
      
      localStorage.setItem(TOKEN_KEY, res.token);
      showToast("success", "Account created!", "Complete your business onboarding to get started.");
      await new Promise((r) => setTimeout(r, 1500));
      
      // Redirect to compliance/onboarding form per SRS MD-001
      router.push("/merchant");
    } catch (err) {
      logger.error("Sign up failed", err, { email: data.email, businessName: data.businessName });
      showToast("error", "Sign up failed", getErrorMessage(err));
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

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className={labelBase}>
              Business Name
            </label>
            <input
              id="businessName"
              type="text"
              placeholder="Acme Corp Ltd"
              autoComplete="organization"
              disabled={isSubmitting}
              {...register("businessName")}
              className={cn(
                inputBase,
                errors.businessName
                  ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                  : "border-gray-200 focus:ring-brand-teal/30 focus:border-brand-teal"
              )}
            />
            <FieldError message={errors.businessName?.message} />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className={labelBase}>
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                autoComplete="given-name"
                disabled={isSubmitting}
                {...register("firstName")}
                className={cn(
                  inputBase,
                  errors.firstName
                    ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-200 focus:ring-brand-teal/30 focus:border-brand-teal"
                )}
              />
              <FieldError message={errors.firstName?.message} />
            </div>

            <div>
              <label htmlFor="lastName" className={labelBase}>
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                autoComplete="family-name"
                disabled={isSubmitting}
                {...register("lastName")}
                className={cn(
                  inputBase,
                  errors.lastName
                    ? "border-red-400 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-200 focus:ring-brand-teal/30 focus:border-brand-teal"
                )}
              />
              <FieldError message={errors.lastName?.message} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelBase}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
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

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelBase}>
              Phone Number
            </label>
            <PhoneInput
              value={watch("phone")}
              onChange={(value) => setValue("phone", value, { shouldValidate: true })}
              disabled={isSubmitting}
              className={cn(
                errors.phone && "border-red-400 focus-within:ring-red-200"
              )}
            />
            <FieldError message={errors.phone?.message} />
          </div>

          {/* Business Type */}
          <div>
            <label className={labelBase}>What type of business do you own?</label>
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
                ] as const
              ).map((option) => {
                const selected = businessType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setValue("businessType", option.value)}
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
            <FieldError message={errors.businessType?.message} />
          </div>

          {/* Developer */}
          <div>
            <label className={labelBase}>Are you a software developer?</label>
            <div className="flex gap-3">
              {(["yes", "no"] as const).map((val) => {
                const selected = isDeveloper === val;
                return (
                  <button
                    key={val}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setValue("isDeveloper", val)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
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
            <FieldError message={errors.isDeveloper?.message} />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelBase}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                autoComplete="new-password"
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
            
            {/* Password Strength Meter */}
            <PasswordStrengthMeter password={password} className="mt-3" />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="passwordConfirm" className={labelBase}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
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
                onClick={() => setShowPasswordConfirm((v) => !v)}
                tabIndex={-1}
                disabled={isSubmitting}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:pointer-events-none"
              >
                {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <FieldError message={errors.passwordConfirm?.message} />
          </div>

          {/* Terms & Conditions */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                disabled={isSubmitting}
                {...register("acceptedTerms")}
                className="mt-0.5 size-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal/30 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-brand-navy hover:text-brand-teal transition-colors font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-brand-navy hover:text-brand-teal transition-colors font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>
            <FieldError message={errors.acceptedTerms?.message} />
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
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </div>
        </form>

        {/* Sign in prompt */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-brand-teal font-semibold hover:text-brand-teal/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Privacy & Terms Note */}
      <p className="mt-7 text-center text-xs text-white/60">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-white/80 hover:text-brand-teal transition-colors font-medium">
          Terms of Service
        </Link>
        {" "}and{" "}
        <Link href="/privacy" className="text-white/80 hover:text-brand-teal transition-colors font-medium">
          Privacy Policy
        </Link>
      </p>
    </motion.div>
  );
}
