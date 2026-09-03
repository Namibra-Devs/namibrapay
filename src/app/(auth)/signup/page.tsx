"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, CheckCircle, Building2, User, FileText, CreditCard, Lock, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "@/components/ui/logo";
import PhoneInput from "@/components/ui/phone-input";
import CustomSelect from "@/components/ui/select";
import FileUpload from "@/components/ui/file-upload";
import { FieldError } from "@/components/ui/fielderror";
import { useToast } from "@/components/ui/toast";
import { signUp, getErrorMessage } from "@/lib/auth-api";
import {
  signUpSchema,
  INDUSTRY_OPTIONS,
  type SignUpValues,
} from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

// ── Constants ────────────────────────────────────────────────────

const COUNTRY_OPTIONS = [
  { value: "GH", label: "Ghana" },
  { value: "NG", label: "Nigeria" },
  { value: "KE", label: "Kenya" },
  { value: "ZA", label: "South Africa" },
  { value: "UG", label: "Uganda" },
  { value: "TZ", label: "Tanzania" },
  { value: "RW", label: "Rwanda" },
  { value: "ET", label: "Ethiopia" },
  { value: "OTHER", label: "Other" },
];

const PHONE_CODE_OPTIONS = [
  { value: "+233", label: "+233" },
  { value: "+234", label: "+234" },
  { value: "+254", label: "+254" },
  { value: "+27", label: "+27" },
  { value: "+256", label: "+256" },
  { value: "+255", label: "+255" },
  { value: "+250", label: "+250" },
  { value: "+251", label: "+251" },
];

const GHANA_BANKS = [
  { value: "access_bank", label: "Access Bank Ghana" },
  { value: "absa", label: "Absa Bank Ghana" },
  { value: "gcb", label: "GCB Bank" },
  { value: "ecobank", label: "Ecobank Ghana" },
  { value: "fidelity", label: "Fidelity Bank Ghana" },
  { value: "gtbank", label: "Guaranty Trust Bank" },
  { value: "stanbic", label: "Stanbic Bank Ghana" },
  { value: "standard_chartered", label: "Standard Chartered" },
  { value: "umb", label: "Universal Merchant Bank" },
  { value: "zenith", label: "Zenith Bank Ghana" },
  { value: "cal_bank", label: "CAL Bank" },
  { value: "republic_bank", label: "Republic Bank" },
  { value: "other", label: "Other Bank" },
];

const STEPS = [
  { id: 1, title: "Business", icon: Building2 },
  { id: 2, title: "Owner", icon: User },
  { id: 3, title: "Documents", icon: FileText },
  { id: 4, title: "Bank", icon: CreditCard },
  { id: 5, title: "Security", icon: Lock },
  { id: 6, title: "Terms", icon: Shield },
];

// ── Shared Styles ────────────────────────────────────────────────

const inputBase =
  "w-full border rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

const labelBase = "block text-sm font-medium text-gray-700 mb-1.5";

function fieldCls(hasError: boolean) {
  return hasError
    ? "border-red-400 focus:ring-red-200 focus:border-red-400"
    : "border-gray-200 focus:ring-brand-teal/30 focus:border-brand-teal";
}

// ── Main Component ───────────────────────────────────────────────

export default function SignUpPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      country: "GH",
      phoneCode: "+233",
      businessType: "registered",
      isDeveloper: "no",
      acceptedTerms: false,
      acceptedPrivacy: false,
    },
    mode: "onBlur",
  });

  const formData = watch();

  const onSubmit = async (data: SignUpValues) => {
    try {
      await signUp(data as any);
      showToast("success", "Application submitted!", "Your account is being reviewed. Check your email for updates.");
      await new Promise((r) => setTimeout(r, 1500));
      router.push(`/onboarding-status?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      showToast("error", "Submission failed", getErrorMessage(err));
    }
  };

  const validateStep = async (step: number): Promise<boolean> => {
    let fields: (keyof SignUpValues)[] = [];
    
    switch (step) {
      case 1:
        fields = ["businessName", "registrationNumber", "country", "address", "industry", "businessType"];
        break;
      case 2:
        fields = ["firstName", "lastName", "email", "phoneCode", "phone", "isDeveloper"];
        break;
      case 3:
        fields = ["businessRegistrationCertificate", "directorId", "proofOfAddress"];
        break;
      case 4:
        fields = ["bankName", "accountNumber", "accountName"];
        break;
      case 5:
        fields = ["password", "passwordConfirm"];
        break;
      case 6:
        fields = ["acceptedTerms", "acceptedPrivacy"];
        break;
    }

    const result = await trigger(fields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 px-8 py-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <div className="border-t border-gray-100 mb-7" />

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "size-10 rounded-full flex items-center justify-center transition-all mb-2",
                        isCompleted && "bg-brand-teal text-white",
                        isCurrent && "bg-brand-navy text-white ring-4 ring-brand-navy/20",
                        !isCompleted && !isCurrent && "bg-gray-200 text-gray-400"
                      )}
                    >
                      {isCompleted ? <CheckCircle className="size-5" /> : <Icon className="size-5" />}
                    </div>
                    <p className={cn("text-xs font-medium hidden sm:block", isCurrent ? "text-brand-navy" : "text-gray-500")}>
                      {step.title}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={cn("h-0.5 flex-1 mx-2 transition-all", currentStep > step.id ? "bg-brand-teal" : "bg-gray-200")} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
              {currentStep === 1 && "Business Details"}
              {currentStep === 2 && "Owner Information"}
              {currentStep === 3 && "KYC Documents"}
              {currentStep === 4 && "Payout Account"}
              {currentStep === 5 && "Create Password"}
              {currentStep === 6 && "Terms & Conditions"}
            </h2>
            <p className="text-sm text-gray-500">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-100"
            >
              {currentStep === 1 && <Step1 register={register} errors={errors} setValue={setValue} watch={watch} />}
              {currentStep === 2 && <Step2 register={register} errors={errors} setValue={setValue} watch={watch} />}
              {currentStep === 3 && <Step3 errors={errors} setValue={setValue} watch={watch} />}
              {currentStep === 4 && <Step4 register={register} errors={errors} setValue={setValue} watch={watch} />}
              {currentStep === 5 && <Step5 register={register} errors={errors} showPassword={showPassword} setShowPassword={setShowPassword} showPasswordConfirm={showPasswordConfirm} setShowPasswordConfirm={setShowPasswordConfirm} />}
              {currentStep === 6 && <Step6 register={register} errors={errors} setValue={setValue} watch={watch} formData={formData} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
            )}

            <div className="flex-1" />

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors"
              >
                Continue
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={isSubmitting ? {} : { scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-3 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-brand-navy/90 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-4" />
                    Submit Application
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </div>

      <p className="mt-7 text-center text-white/60 text-sm">
        Already have an account?{" "}
        <Link href="/signin" className="text-brand-teal font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

// ── Step 1: Business Details ─────────────────────────────────────

function Step1({ register, errors, setValue, watch }: any) {
  const country = watch("country");
  const industry = watch("industry");
  const businessType = watch("businessType");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelBase}>Business Name <span className="text-red-500">*</span></label>
          <input type="text" placeholder="Acme Payments Ltd" {...register("businessName")} className={cn(inputBase, fieldCls(!!errors.businessName))} />
          <FieldError message={errors.businessName?.message} />
        </div>

        <div>
          <label className={labelBase}>Registration Number <span className="text-red-500">*</span></label>
          <input type="text" placeholder="GH-123456789" {...register("registrationNumber")} className={cn(inputBase, fieldCls(!!errors.registrationNumber))} />
          <FieldError message={errors.registrationNumber?.message} />
        </div>
      </div>

      <div>
        <label className={labelBase}>Country <span className="text-red-500">*</span></label>
        <CustomSelect options={COUNTRY_OPTIONS} value={country} onChange={(val) => setValue("country", val, { shouldValidate: true })} placeholder="Select country..." />
        <FieldError message={errors.country?.message} />
      </div>

      <div>
        <label className={labelBase}>Business Address <span className="text-red-500">*</span></label>
        <textarea placeholder="123 Main Street, East Legon, Accra" rows={3} {...register("address")} className={cn(inputBase, fieldCls(!!errors.address), "resize-none")} />
        <FieldError message={errors.address?.message} />
      </div>

      <div>
        <label className={labelBase}>Industry <span className="text-red-500">*</span></label>
        <CustomSelect options={INDUSTRY_OPTIONS} value={industry} onChange={(val) => setValue("industry", val, { shouldValidate: true })} placeholder="Select your industry..." />
        <FieldError message={errors.industry?.message} />
      </div>

      <div>
        <label className={labelBase}>Business Type <span className="text-red-500">*</span></label>
        <div className="space-y-3">
          {[
            { value: "starter", title: "Starter Business", desc: "Testing ideas with customers, preparing to register." },
            { value: "registered", title: "Registered Business", desc: "Fully registered with all required licenses." },
          ].map((opt) => {
            const selected = businessType === opt.value;
            return (
              <button key={opt.value} type="button" onClick={() => setValue("businessType", opt.value, { shouldValidate: true })}
                className={cn("w-full text-left flex items-start gap-3 rounded-lg border px-4 py-3.5 transition-all", selected ? "border-brand-teal bg-brand-teal/5" : "border-gray-200 hover:border-gray-300")}
              >
                <span className={cn("mt-0.5 shrink-0 size-4 rounded-full border-2 flex items-center justify-center", selected ? "border-brand-teal" : "border-gray-300")}>
                  {selected && <span className="size-2 rounded-full bg-brand-teal" />}
                </span>
                <div>
                  <p className={cn("text-sm font-semibold", selected ? "text-brand-navy" : "text-gray-700")}>{opt.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.businessType?.message} />
      </div>
    </div>
  );
}

// ── Step 2: Owner Info ───────────────────────────────────────────

function Step2({ register, errors, setValue, watch }: any) {
  const phoneCode = watch("phoneCode");
  const isDeveloper = watch("isDeveloper");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>First Name <span className="text-red-500">*</span></label>
          <input type="text" placeholder="Jane" {...register("firstName")} className={cn(inputBase, fieldCls(!!errors.firstName))} />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <label className={labelBase}>Last Name <span className="text-red-500">*</span></label>
          <input type="text" placeholder="Doe" {...register("lastName")} className={cn(inputBase, fieldCls(!!errors.lastName))} />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div>
        <label className={labelBase}>Email Address <span className="text-red-500">*</span></label>
        <input type="email" placeholder="jane@acme.com" {...register("email")} className={cn(inputBase, fieldCls(!!errors.email))} />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <label className={labelBase}>Phone Number <span className="text-red-500">*</span></label>
        <PhoneInput
          value={`${phoneCode} ${watch("phone")}`}
          onChange={(val) => {
            const match = val.match(/^(\+\d+)\s*(.*)$/);
            if (match) {
              setValue("phoneCode", match[1], { shouldValidate: true });
              setValue("phone", match[2].trim(), { shouldValidate: true });
            }
          }}
          placeholder="24 123 4567"
        />
        <FieldError message={errors.phone?.message} />
      </div>

      <div>
        <label className={labelBase}>Are you a software developer? <span className="text-red-500">*</span></label>
        <div className="flex gap-3">
          {[{ value: "yes", label: "Yes, I am" }, { value: "no", label: "No, I'm not" }].map((opt) => {
            const selected = isDeveloper === opt.value;
            return (
              <button key={opt.value} type="button" onClick={() => setValue("isDeveloper", opt.value, { shouldValidate: true })}
                className={cn("flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-all", selected ? "border-brand-teal bg-brand-teal/5 text-brand-navy" : "border-gray-200 text-gray-600 hover:border-gray-300")}
              >
                <span className={cn("size-4 rounded-full border-2 flex items-center justify-center", selected ? "border-brand-teal" : "border-gray-300")}>
                  {selected && <span className="size-2 rounded-full bg-brand-teal" />}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
        <FieldError message={errors.isDeveloper?.message} />
      </div>
    </div>
  );
}

// ── Step 3: KYC Documents ────────────────────────────────────────

function Step3({ errors, setValue, watch }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Required:</strong> Clear copies in PDF, JPG, or PNG (max 5MB each).
        </p>
      </div>

      <FileUpload
        label="Business Registration Certificate"
        description="Certificate of incorporation or registration"
        value={watch("businessRegistrationCertificate")}
        onChange={(file) => setValue("businessRegistrationCertificate", file, { shouldValidate: true })}
        error={errors.businessRegistrationCertificate?.message}
        required
      />

      <FileUpload
        label="Director/Owner ID"
        description="National ID, passport, or driver's license"
        value={watch("directorId")}
        onChange={(file) => setValue("directorId", file, { shouldValidate: true })}
        error={errors.directorId?.message}
        required
      />

      <FileUpload
        label="Proof of Address"
        description="Utility bill, bank statement (within 3 months)"
        value={watch("proofOfAddress")}
        onChange={(file) => setValue("proofOfAddress", file, { shouldValidate: true })}
        error={errors.proofOfAddress?.message}
        required
      />
    </div>
  );
}

// ── Step 4: Payout Account ───────────────────────────────────────

function Step4({ register, errors, setValue, watch }: any) {
  const bankName = watch("bankName");

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Settlement Account:</strong> Funds will be paid out to this bank account.
        </p>
      </div>

      <div>
        <label className={labelBase}>Bank Name <span className="text-red-500">*</span></label>
        <CustomSelect options={GHANA_BANKS} value={bankName} onChange={(val) => setValue("bankName", val, { shouldValidate: true })} placeholder="Select your bank..." />
        <FieldError message={errors.bankName?.message} />
      </div>

      <div>
        <label className={labelBase}>Account Number <span className="text-red-500">*</span></label>
        <input type="text" placeholder="1234567890" {...register("accountNumber")} className={cn(inputBase, fieldCls(!!errors.accountNumber))} />
        <FieldError message={errors.accountNumber?.message} />
      </div>

      <div>
        <label className={labelBase}>Account Name <span className="text-red-500">*</span></label>
        <input type="text" placeholder="Acme Payments Ltd" {...register("accountName")} className={cn(inputBase, fieldCls(!!errors.accountName))} />
        <FieldError message={errors.accountName?.message} />
      </div>
    </div>
  );
}

// ── Step 5: Security ─────────────────────────────────────────────

function Step5({ register, errors, showPassword, setShowPassword, showPasswordConfirm, setShowPasswordConfirm }: any) {
  return (
    <div className="space-y-5">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <p className="text-sm text-purple-800">
          <strong>Password requirements:</strong> At least 10 characters with uppercase, lowercase, number, and special character.
        </p>
      </div>

      <div>
        <label className={labelBase}>Password <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" {...register("password")} className={cn(inputBase, "pr-12", fieldCls(!!errors.password))} />
          <button type="button" onClick={() => setShowPassword((v: boolean) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      <div>
        <label className={labelBase}>Confirm Password <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type={showPasswordConfirm ? "text" : "password"} placeholder="Re-enter your password" {...register("passwordConfirm")} className={cn(inputBase, "pr-12", fieldCls(!!errors.passwordConfirm))} />
          <button type="button" onClick={() => setShowPasswordConfirm((v: boolean) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <FieldError message={errors.passwordConfirm?.message} />
      </div>
    </div>
  );
}

// ── Step 6: Terms ────────────────────────────────────────────────

function Step6({ register, errors, setValue, watch, formData }: any) {
  const acceptedTerms = watch("acceptedTerms");
  const acceptedPrivacy = watch("acceptedPrivacy");

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-br from-brand-navy/5 to-brand-teal/5 border border-brand-navy/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-brand-navy mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          Application Summary
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Business</p>
            <p className="font-semibold text-gray-900">{formData.businessName || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Owner</p>
            <p className="font-semibold text-gray-900">{formData.firstName} {formData.lastName}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Email</p>
            <p className="font-semibold text-gray-900">{formData.email || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Phone</p>
            <p className="font-semibold text-gray-900">{formData.phoneCode} {formData.phone}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" checked={acceptedTerms} onChange={(e) => setValue("acceptedTerms", e.target.checked, { shouldValidate: true })}
            className="mt-0.5 size-5 rounded border-gray-300 text-brand-teal focus:ring-brand-teal/30"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            I have read and agree to NamibraPay's{" "}
            <Link href="/terms" target="_blank" className="text-brand-navy underline hover:text-brand-teal">
              Terms of Service
            </Link>
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>
        <FieldError message={errors.acceptedTerms?.message} />

        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" checked={acceptedPrivacy} onChange={(e) => setValue("acceptedPrivacy", e.target.checked, { shouldValidate: true })}
            className="mt-0.5 size-5 rounded border-gray-300 text-brand-teal focus:ring-brand-teal/30"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            I have read and agree to NamibraPay's{" "}
            <Link href="/privacy" target="_blank" className="text-brand-navy underline hover:text-brand-teal">
              Privacy Policy
            </Link>
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>
        <FieldError message={errors.acceptedPrivacy?.message} />
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <p className="text-sm text-emerald-800">
          ✓ Your application will be reviewed by our compliance team within 2 business days. You'll receive email updates on your application status.
        </p>
      </div>
    </div>
  );
}
