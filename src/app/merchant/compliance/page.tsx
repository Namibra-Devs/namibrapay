"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Building2,
  User,
  FileText,
  Landmark,
  FileCheck,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  type BusinessDetailsValues,
  type OwnerDetailsValues,
  type KYCDocumentsValues,
  type PayoutAccountValues,
} from "@/lib/schemas/auth";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { resetComplianceReminder } from "@/hooks/use-compliance-reminder";
import BusinessDetailsForm from "@/components/merchant/compliance/BusinessDetailsForm";
import OwnerDetailsForm from "@/components/merchant/compliance/OwnerDetailsForm";
import DocumentsForm from "@/components/merchant/compliance/DocumentsForm";
import PayoutAccountForm from "@/components/merchant/compliance/PayoutAccountForm";
import TermsForm from "@/components/merchant/compliance/TermsForm";

type Step = "business" | "owner" | "documents" | "payout" | "terms";

const STEPS: { id: Step; label: string; description: string; icon: any }[] = [
  { id: "business", label: "Business Details", description: "Company information", icon: Building2 },
  { id: "owner", label: "Owner Verification", description: "Personal details", icon: User },
  { id: "documents", label: "KYC Documents", description: "Required uploads", icon: FileText },
  { id: "payout", label: "Payout Account", description: "Bank details", icon: Landmark },
  { id: "terms", label: "Service Agreement", description: "Terms & conditions", icon: FileCheck },
];

export default function CompliancePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("business");
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

  // Store form data
  const [businessData, setBusinessData] = useState<BusinessDetailsValues | null>(null);
  const [ownerData, setOwnerData] = useState<OwnerDetailsValues | null>(null);
  const [documentsData, setDocumentsData] = useState<KYCDocumentsValues | null>(null);
  const [payoutData, setPayoutData] = useState<PayoutAccountValues | null>(null);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const completedCount = completedSteps.length;

  const handleStepComplete = (step: Step, data: any) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }

    if (step === "business") {
      setBusinessData(data);
      setCurrentStep("owner");
    } else if (step === "owner") {
      setOwnerData(data);
      setCurrentStep("documents");
    } else if (step === "documents") {
      setDocumentsData(data);
      setCurrentStep("payout");
    } else if (step === "payout") {
      setPayoutData(data);
      setCurrentStep("terms");
    }
  };

  const handleFinalSubmit = async (termsAccepted: boolean) => {
    if (!termsAccepted) {
      showToast("error", "Terms required", "You must accept the terms of service to continue.");
      return;
    }

    try {
      const completeData = {
        ...businessData,
        ...ownerData,
        ...documentsData,
        ...payoutData,
        acceptedTerms: termsAccepted,
      };

      // TODO: Replace with actual API call per SRS MD-001
      console.log("Submitting onboarding application:", completeData);
      await new Promise((r) => setTimeout(r, 2000));

      // Reset compliance reminder since they've submitted
      resetComplianceReminder();

      showToast("success", "Application submitted!", "Your application is under review. You'll be notified once approved.");
      await new Promise((r) => setTimeout(r, 1500));
      
      // Per SRS MD-002: redirect to onboarding status page
      router.push("/onboarding-status");
    } catch (err) {
      showToast("error", "Submission failed", "Please try again or contact support.");
    }
  };

  return (
    <div className="px-6 py-6 space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Merchant Onboarding
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete your business information to start accepting payments
        </p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3"
      >
        <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-blue-900">Your application will be reviewed within 24-48 hours</p>
          <p className="text-xs text-blue-700 mt-0.5">
            You'll receive an email notification once approved. All information is kept secure and confidential.
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Step Navigation - Side */}
        <div className="lg:w-64 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-4 space-y-2"
          >
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = step.id === currentStep;
              const isAccessible = idx <= currentStepIndex || isCompleted;

              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && setCurrentStep(step.id)}
                  disabled={!isAccessible}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left",
                    isCurrent && "bg-brand-teal/10 border border-brand-teal/20",
                    isCompleted && !isCurrent && "bg-emerald-50 border border-emerald-200",
                    !isCurrent && !isCompleted && "hover:bg-muted/50",
                    !isAccessible && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div
                    className={cn(
                      "size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isCompleted && "bg-emerald-500",
                      isCurrent && !isCompleted && "bg-brand-teal",
                      !isCurrent && !isCompleted && "bg-muted"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="size-4 text-white" />
                    ) : (
                      <Icon className={cn("size-4", isCurrent ? "text-white" : "text-muted-foreground")} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold", isCurrent ? "text-brand-navy" : "text-foreground")}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Main Form Content */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            {currentStep === "business" && (
              <BusinessDetailsForm 
                defaultValues={businessData} 
                onComplete={(data) => handleStepComplete("business", data)} 
              />
            )}
            {currentStep === "owner" && (
              <OwnerDetailsForm 
                defaultValues={ownerData}
                onBack={() => setCurrentStep("business")}
                onComplete={(data) => handleStepComplete("owner", data)} 
              />
            )}
            {currentStep === "documents" && (
              <DocumentsForm 
                defaultValues={documentsData}
                onBack={() => setCurrentStep("owner")}
                onComplete={(data) => handleStepComplete("documents", data)} 
              />
            )}
            {currentStep === "payout" && (
              <PayoutAccountForm 
                defaultValues={payoutData}
                onBack={() => setCurrentStep("documents")}
                onComplete={(data) => handleStepComplete("payout", data)} 
              />
            )}
            {currentStep === "terms" && (
              <TermsForm 
                onBack={() => setCurrentStep("payout")}
                onComplete={handleFinalSubmit} 
              />
            )}
          </motion.div>
        </div>

        {/* Progress Indicator - Right Side */}
        <div className="hidden xl:block w-48 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card border border-border rounded-2xl p-5 sticky top-6"
          >
            <div className="text-center mb-4">
              <div className="relative size-24 mx-auto mb-3">
                <svg className="size-24 -rotate-90">
                  <circle cx="48" cy="48" r="40" className="stroke-muted" strokeWidth="8" fill="none" />
                  <circle
                    cx="48" cy="48" r="40" className="stroke-brand-teal transition-all duration-500"
                    strokeWidth="8" fill="none"
                    strokeDasharray={`${(completedCount / STEPS.length) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-navy">
                    {Math.round((completedCount / STEPS.length) * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {STEPS.length} steps completed
              </p>
            </div>
            <div className="space-y-2">
              {STEPS.map((step) => (
                <div key={step.id} className="flex items-center gap-2 text-xs">
                  <div className={cn("size-2 rounded-full transition-colors", completedSteps.includes(step.id) ? "bg-emerald-500" : "bg-muted")} />
                  <span className={cn(completedSteps.includes(step.id) ? "text-foreground" : "text-muted-foreground")}>{step.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Continue in next message with form components...

