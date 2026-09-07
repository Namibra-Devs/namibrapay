"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  Clock, CheckCircle, XCircle, AlertCircle, FileText, 
  Mail, RefreshCw, ArrowRight, MessageSquare, Home, Building2,
  Calendar, User, Phone, MapPin, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

// ── Types ────────────────────────────────────────────────────────

type OnboardingStatus = "pending" | "under_review" | "info_requested" | "approved" | "rejected";

interface OnboardingData {
  email: string;
  businessName: string;
  registrationNumber?: string;
  country?: string;
  address?: string;
  industry?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  submittedAt: string;
  status: OnboardingStatus;
  statusMessage?: string;
  complianceNotes?: string[];
  requestedInfo?: {
    field: string;
    reason: string;
  }[];
  reviewedBy?: string;
  reviewedAt?: string;
  estimatedCompletionDays?: number;
}

// ── Status Configuration ─────────────────────────────────────────

const STATUS_CONFIG: Record<OnboardingStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
  description: string;
}> = {
  pending: {
    label: "Application Submitted",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    icon: Clock,
    description: "Your application has been submitted and is in the queue for review.",
  },
  under_review: {
    label: "Under Review",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    icon: RefreshCw,
    description: "Our compliance team is currently reviewing your application.",
  },
  info_requested: {
    label: "Additional Information Needed",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
    icon: AlertCircle,
    description: "We need some additional information to complete your application.",
  },
  approved: {
    label: "Application Approved",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle,
    description: "Congratulations! Your account has been approved and is now active.",
  },
  rejected: {
    label: "Application Declined",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    icon: XCircle,
    description: "Unfortunately, we are unable to approve your application at this time.",
  },
};

// ── Get Onboarding Data ─────────────────────────────────────────

function getOnboardingData(email: string): OnboardingData | null {
  // Try to get data from sessionStorage first (just submitted)
  const storedData = typeof window !== "undefined" ? sessionStorage.getItem("onboardingData") : null;
  
  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);
      // In production, this would be an API call to get the actual status
      return {
        ...parsed,
        status: "pending" as OnboardingStatus,
        statusMessage: "Your application has been submitted successfully and is awaiting review.",
        estimatedCompletionDays: 2,
        complianceNotes: [
          "Application received and assigned to compliance team",
          "Initial document verification in progress",
        ],
      };
    } catch (e) {
      logger.error("Failed to parse onboarding data", e);
    }
  }
  
  // Fallback: simulate API call with minimal data
  // In production, this would fetch from backend API
  return {
    email,
    businessName: "Your Business",
    submittedAt: new Date().toISOString(),
    status: "pending",
    statusMessage: "Application is being reviewed by our compliance team.",
    estimatedCompletionDays: 2,
    complianceNotes: [
      "Application received",
      "Under compliance review",
    ],
  };
}

// ── Main Component ───────────────────────────────────────────────

function OnboardingStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  
  const [data, setData] = useState<OnboardingData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (email) {
      const onboardingData = getOnboardingData(email);
      setData(onboardingData);
    }
  }, [email]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (email) {
      const onboardingData = getOnboardingData(email);
      setData(onboardingData);
    }
    setIsRefreshing(false);
  };

  const handleContinue = () => {
    if (data?.status === "approved") {
      router.push("/signin");
    } else if (data?.status === "info_requested") {
      // In production, redirect to info upload page
      router.push("/signin");
    }
  };

  if (!email || !data) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-card border border-border rounded-2xl px-8 py-16 text-center">
            <AlertCircle className="size-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              No Application Found
            </h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find an application associated with this link.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy/90 transition-colors"
            >
              Start New Application
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[data.status];
  const Icon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-brand-navy flex items-center justify-center">
              <Building2 className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Application Status
              </h1>
              <p className="text-xs text-muted-foreground">Track your onboarding progress</p>
            </div>
          </div>
          
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="size-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Status Banner */}
          <div className={cn("rounded-2xl border p-6 mb-6", statusConfig.bgColor)}>
            <div className="flex items-start gap-4">
              <div className={cn("size-14 rounded-xl flex items-center justify-center shrink-0", statusConfig.bgColor)}>
                <Icon className={cn("size-5", statusConfig.color)} />
              </div>
              <div className="flex-1">
                <h2 className={cn("text-lg font-bold mb-1", statusConfig.color)} style={{ fontFamily: "var(--font-heading)" }}>
                  {statusConfig.label}
                </h2>
                <p className={cn("text-xs", statusConfig.color, "opacity-90")}>
                  {statusConfig.description}
                </p>
                {data.statusMessage && (
                  <p className={cn("text-xs mt-2", statusConfig.color)}>
                    {data.statusMessage}
                  </p>
                )}
              </div>
              
              {/* Action Button */}
              <div className="shrink-0">
                {data.status === "approved" && (
                  <button
                    onClick={handleContinue}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-xl text-sm font-semibold hover:bg-brand-navy/90 transition-colors"
                  >
                    Sign In
                    <ArrowRight className="size-4" />
                  </button>
                )}
                {data.status === "info_requested" && (
                  <button
                    onClick={handleContinue}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
                  >
                    Upload Info
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Application Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Information */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="size-4 text-brand-navy" />
                  Application Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-lg bg-brand-navy/10 flex items-center justify-center shrink-0">
                      <Building2 className="size-5 text-brand-navy" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Business Name</p>
                      <p className="text-sm font-semibold text-foreground">{data.businessName}</p>
                    </div>
                  </div>

                  {data.registrationNumber && (
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-brand-navy/10 flex items-center justify-center shrink-0">
                        <FileText className="size-5 text-brand-navy" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Registration Number</p>
                        <p className="text-sm font-semibold text-foreground">{data.registrationNumber}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-lg bg-brand-teal/10 flex items-center justify-center shrink-0">
                      <Mail className="size-5 text-brand-teal" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Email Address</p>
                      <p className="text-sm font-semibold text-foreground break-all">{data.email}</p>
                    </div>
                  </div>

                  {data.phone && (
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-brand-teal/10 flex items-center justify-center shrink-0">
                        <Phone className="size-5 text-brand-teal" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Phone Number</p>
                        <p className="text-sm font-semibold text-foreground">{data.phone}</p>
                      </div>
                    </div>
                  )}

                  {(data.firstName || data.lastName) && (
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                        <User className="size-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Owner Name</p>
                        <p className="text-sm font-semibold text-foreground">
                          {data.firstName} {data.lastName}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.industry && (
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <Briefcase className="size-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Industry</p>
                        <p className="text-sm font-semibold text-foreground capitalize">
                          {data.industry.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.address && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <MapPin className="size-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Business Address</p>
                        <p className="text-sm font-semibold text-foreground">{data.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <Calendar className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Submitted Date</p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(data.submittedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={cn("size-10 rounded-lg flex items-center justify-center shrink-0", statusConfig.bgColor)}>
                      <Icon className={cn("size-5", statusConfig.color)} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Current Status</p>
                      <p className={cn("text-sm font-semibold", statusConfig.color)}>
                        {statusConfig.label}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Progress */}
              {data.complianceNotes && data.complianceNotes.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="size-4 text-brand-navy" />
                    Review Progress
                  </h3>
                  <div className="space-y-3">
                    {data.complianceNotes.map((note, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requested Information */}
              {data.status === "info_requested" && data.requestedInfo && (
                <div className="bg-card border border-amber-200 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MessageSquare className="size-4 text-amber-600" />
                    Additional Information Required
                  </h3>
                  <div className="space-y-4">
                    {data.requestedInfo.map((item, index) => (
                      <div key={index} className="bg-amber-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-amber-900">{item.field}</p>
                        <p className="text-xs text-amber-700 mt-1">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Timeline & Support */}
            <div className="space-y-6">
              {/* Estimated Completion */}
              {data.estimatedCompletionDays && data.status !== "approved" && data.status !== "rejected" && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="size-4 text-brand-navy" />
                    Estimated Time
                  </h3>
                  <div className="text-center py-4">
                    <div className="size-10 rounded-full bg-brand-navy/10 flex items-center justify-center mx-auto mb-3">
                      <Clock className="size-5 text-brand-navy" />
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                      {data.estimatedCompletionDays} {data.estimatedCompletionDays === 1 ? "day" : "days"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      You'll receive an email notification
                    </p>
                  </div>
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
                {isRefreshing ? "Refreshing..." : "Refresh Status"}
              </button>

              {/* Support Card */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Mail className="size-4 text-brand-navy" />
                  Need Help?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions about your application? Our support team is here to help.
                </p>
                <a
                  href="mailto:support@namibrapay.com"
                  className="flex items-center gap-2 text-sm text-brand-navy hover:text-brand-teal font-medium transition-colors"
                >
                  <Mail className="size-4" />
                  support@namibrapay.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Page Wrapper (with Suspense) ─────────────────────────────────

export default function OnboardingStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="size-16 text-muted-foreground/30 mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading application status...</p>
          </div>
        </div>
      }
    >
      <OnboardingStatusContent />
    </Suspense>
  );
}
