"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, ShieldCheck, Clock, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ComplianceReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  completionProgress?: number; // 0-100
  dismissCount?: number; // How many times user has dismissed
}

export default function ComplianceReminderModal({
  isOpen,
  onClose,
  businessName,
  completionProgress = 0,
  dismissCount = 0,
}: ComplianceReminderModalProps) {
  const router = useRouter();

  const handleCompleteNow = () => {
    onClose();
    router.push("/merchant/compliance");
  };

  // Determine urgency level based on dismissal count
  const isUrgent = dismissCount >= 3;
  const isHighPriority = dismissCount >= 5;

  // Progressive messaging
  const getHeadline = () => {
    if (isHighPriority) return "Action Required: Complete Compliance Verification";
    if (isUrgent) return "Important: Activate Your Live Account";
    if (completionProgress > 0) return "You're Almost There!";
    return "Complete Your Compliance Verification";
  };

  const getMessage = () => {
    if (isHighPriority) {
      return "Your test mode access may be limited soon. Complete compliance verification now to continue accepting payments without interruption.";
    }
    if (isUrgent) {
      return "You've been exploring in test mode. Ready to accept real payments? Complete your compliance verification to unlock full platform access.";
    }
    if (completionProgress > 0) {
      return `You're ${completionProgress}% done with compliance verification. Finish now to activate live payments and unlock all features.`;
    }
    return "Your account is in test mode so you can explore features. To accept live payments and unlock full capabilities, complete your compliance verification.";
  };

  const benefits = [
    { icon: CheckCircle, text: "Accept live payments", color: "text-emerald-600" },
    { icon: CheckCircle, text: "Higher transaction limits", color: "text-brand-teal" },
    { icon: CheckCircle, text: "Full API access", color: "text-brand-lavender" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="relative bg-linear-to-br from-brand-teal/10 via-brand-lavender/10 to-brand-mint/10 p-6 pb-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-background/80 hover:text-foreground transition-all"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Logo */}
                <div className="mb-4">
                  <Image
                    src="/logo.png"
                    alt="NamibraPay"
                    width={130}
                    height={36}
                    className="w-32 h-auto"
                  />
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-medium mb-3">
                  <Clock className="size-3" />
                  Test Mode
                </div>

                <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  {businessName}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Headline */}
              <div className="text-center">
                <h3 className="text-base font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  {getHeadline()}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {getMessage()}
                </p>
              </div>

              {/* Progress Bar (if started) */}
              {completionProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-brand-teal">{completionProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionProgress}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full bg-linear-to-r from-brand-teal to-brand-mint"
                    />
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="space-y-2">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-center gap-2.5"
                  >
                    <benefit.icon className={`size-4 ${benefit.color}`} />
                    <span className="text-sm text-foreground">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Time Estimate */}
              <div className="bg-muted/50 border border-border rounded-xl p-3 flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-brand-lavender/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-4 text-[#5c3d9e]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">Quick & Secure</p>
                  <p className="text-xs text-muted-foreground">Takes about 5 minutes</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleCompleteNow}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isHighPriority
                      ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30"
                      : isUrgent
                      ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/30"
                      : "bg-brand-teal hover:bg-[#5ab3b0] text-white shadow-lg shadow-brand-teal/30"
                  }`}
                >
                  {completionProgress > 0 ? "Continue Verification" : "Complete Now"}
                  <ArrowRight className="size-4" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  Remind Me Later
                </button>
              </div>

              {/* Footer note */}
              {isHighPriority && (
                <div className="flex items-center justify-center gap-2 text-xs text-amber-600 font-medium">
                  <AlertTriangle className="size-3.5" />
                  <span>Complete verification to avoid service interruption</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
