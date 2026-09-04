'use client';

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

type PasswordStrength = "weak" | "medium" | "strong" | "none";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

function calculateStrength(password: string): PasswordStrength {
  if (!password) return "none";
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score++; // lowercase
  if (/[A-Z]/.test(password)) score++; // uppercase
  if (/[0-9]/.test(password)) score++; // numbers
  if (/[^A-Za-z0-9]/.test(password)) score++; // special characters
  
  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

function getStrengthConfig(strength: PasswordStrength) {
  switch (strength) {
    case "weak":
      return {
        label: "Weak",
        color: "bg-red-500",
        textColor: "text-red-600",
        width: "33.33%",
      };
    case "medium":
      return {
        label: "Medium",
        color: "bg-amber-500",
        textColor: "text-amber-600",
        width: "66.66%",
      };
    case "strong":
      return {
        label: "Strong",
        color: "bg-emerald-500",
        textColor: "text-emerald-600",
        width: "100%",
      };
    default:
      return {
        label: "",
        color: "bg-gray-200",
        textColor: "text-gray-500",
        width: "0%",
      };
  }
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const strength = calculateStrength(password);
  const config = getStrengthConfig(strength);
  
  const requirements = [
    { label: "At least 10 characters", met: password.length >= 10 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">Password strength</span>
          <span className={cn("text-xs font-semibold", config.textColor)}>
            {config.label}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300 rounded-full", config.color)}
            style={{ width: config.width }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="size-3.5 text-emerald-600 shrink-0" />
            ) : (
              <X className="size-3.5 text-gray-300 shrink-0" />
            )}
            <span className={cn(req.met ? "text-emerald-600" : "text-muted-foreground")}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
