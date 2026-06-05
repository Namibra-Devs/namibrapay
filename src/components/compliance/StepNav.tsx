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
    <div className="flex flex-row items-center justify-center overflow-x-auto lg:flex-col lg:items-start lg:overflow-x-visible">
      {/* Brand mark: lg only */}
      <div className="hidden lg:flex w-11 h-9 mb-6 rounded-lg bg-brand-teal/10 items-center justify-center shrink-0">
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
        const isLast = i === STEPS.length - 1;

        return (
          <div key={i} className="flex flex-row items-center lg:flex-col lg:items-start">
            <button
              onClick={() => onStepClick(i)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl text-left transition-colors cursor-pointer shrink-0",
                "p-1.5 lg:px-2 lg:py-2 lg:w-full",
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
                    : "border-gray-200",
                )}
              >
                {isComplete && (
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                )}
              </span>
              <span
                className={cn(
                  "hidden lg:block text-sm leading-tight",
                  isActive
                    ? "font-semibold text-gray-600"
                    : isComplete
                    ? "text-gray-700"
                    : "text-gray-400",
                )}
              >
                {label}
              </span>
            </button>

            {/* Connector: horizontal on small, vertical on lg */}
            {!isLast && (
              <div
                className={cn(
                  "shrink-0 transition-colors",
                  "w-6 h-0.5",
                  "lg:w-0.5 lg:h-3 lg:ml-4.25",
                  isComplete ? "bg-emerald-400" : "bg-gray-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
