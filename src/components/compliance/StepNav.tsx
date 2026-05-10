"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Profile",
  "Contact",
  "Account",
  "Documents",
  "Service agreement",
];

interface StepNavProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export default function StepNav({ currentStep, completedSteps, onStepClick }: StepNavProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {/* Brand mark */}
      <div className="w-11 h-9 mb-6 rounded-lg bg-brand-teal/10 flex items-center justify-center shrink-0">
        <div className="flex flex-col gap-0.75 items-start">
          {[14, 10, 7].map((w, i) => (
            <div
              key={i}
              className="h-0.75 rounded-full bg-brand-teal"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>

      {STEPS.map((label, i) => {
        const isComplete = completedSteps.includes(i);
        const isActive = currentStep === i;

        return (
          <button
            key={i}
            onClick={() => onStepClick(i)}
            className={cn(
              "flex items-center gap-2.5 px-2 py-2 rounded-xl text-left w-full transition-colors cursor-pointer",
              isActive ? "bg-gray-100" : "hover:bg-gray-50",
            )}
          >
            <span
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                isComplete
                  ? "bg-emerald-500 border-emerald-500"
                  : isActive
                  ? "border-brand-teal"
                  : "border-gray-300",
              )}
            >
              {isComplete && (
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              )}
            </span>
            <span
              className={cn(
                "text-sm leading-tight",
                isActive
                  ? "font-semibold text-gray-900"
                  : isComplete
                  ? "text-gray-700"
                  : "text-gray-400",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
