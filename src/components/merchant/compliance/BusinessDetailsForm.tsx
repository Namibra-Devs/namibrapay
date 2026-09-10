"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, Info } from "lucide-react";
import {
  businessDetailsSchema,
  type BusinessDetailsValues,
} from "@/lib/schemas/auth";
import { COUNTRY_OPTIONS, INDUSTRY_OPTIONS } from "@/lib/constants/options";
import { FieldError } from "@/components/ui/field-error";
import Select from "@/components/ui/Select";
import { cn } from "@/lib/utils";

const inputBase = "w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all bg-background border-border focus:border-brand-teal/60 focus:ring-2 focus:ring-brand-teal/10 disabled:bg-muted/30 disabled:cursor-not-allowed";
const labelBase = "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider";

interface BusinessDetailsFormProps {
  defaultValues: BusinessDetailsValues | null;
  businessType?: "starter" | "registered"; // Passed from signup
  onComplete: (data: BusinessDetailsValues) => void;
}

export default function BusinessDetailsForm({ defaultValues, businessType = "registered", onComplete }: BusinessDetailsFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<BusinessDetailsValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: defaultValues || { 
      businessName: "", 
      registrationNumber: "", 
      tinNumber: "",
      country: "", 
      address: "", 
      industry: "", 
      businessType: businessType // Use passed business type
    },
  });

  const currentBusinessType = watch("businessType");
  const isRegistered = currentBusinessType === "registered";

  return (
    <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          Business Information
        </h2>
        <p className="text-sm text-muted-foreground">Tell us about your business</p>
      </div>

      {/* Info banner for business type */}
      <div className={cn(
        "flex items-start gap-3 border rounded-xl px-4 py-3",
        isRegistered ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"
      )}>
        <Info className={cn("size-4 shrink-0 mt-0.5", isRegistered ? "text-blue-600" : "text-amber-600")} />
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium", isRegistered ? "text-blue-900" : "text-amber-900")}>
            {isRegistered ? "Registered Business Account" : "Starter Business Account"}
          </p>
          <p className={cn("text-xs mt-0.5", isRegistered ? "text-blue-700" : "text-amber-700")}>
            {isRegistered 
              ? "Registration number and TIN are required for registered businesses" 
              : "You can complete registration later as you grow your business"}
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="businessName" className={labelBase}>Business Name</label>
        <input 
          id="businessName" 
          type="text" 
          placeholder="Acme Corp Ltd" 
          {...register("businessName")} 
          className={cn(inputBase, errors.businessName && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
        />
        <FieldError message={errors.businessName?.message} />
      </div>

      {/* Conditional Registration Number - Only for Registered Businesses */}
      {isRegistered && (
        <div>
          <label htmlFor="registrationNumber" className={labelBase}>
            Business Registration Number <span className="text-red-500">*</span>
          </label>
          <input 
            id="registrationNumber" 
            type="text" 
            placeholder="CS004152023" 
            {...register("registrationNumber")} 
            className={cn(inputBase, errors.registrationNumber && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
          />
          <FieldError message={errors.registrationNumber?.message} />
        </div>
      )}

      {/* TIN Number - Only for Registered Businesses */}
      {isRegistered && (
        <div>
          <label htmlFor="tinNumber" className={labelBase}>
            TIN Number (Tax Identification Number) <span className="text-red-500">*</span>
          </label>
          <input 
            id="tinNumber" 
            type="text" 
            placeholder="Enter your TIN" 
            {...register("tinNumber")} 
            className={cn(inputBase, errors.tinNumber && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Tax Identification Number issued by the Ghana Revenue Authority
          </p>
          <FieldError message={errors.tinNumber?.message} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className={labelBase}>Country</label>
          <Select
            options={COUNTRY_OPTIONS}
            value={watch("country")}
            onChange={(value) => setValue("country", value, { shouldValidate: true })}
            placeholder="Select country"
            triggerClassName={cn(
              "rounded-xl",
              errors.country && "border-red-400 focus:ring-red-200"
            )}
          />
          <FieldError message={errors.country?.message} />
        </div>

        <div>
          <label htmlFor="industry" className={labelBase}>Industry</label>
          <Select
            options={INDUSTRY_OPTIONS}
            value={watch("industry")}
            onChange={(value) => setValue("industry", value, { shouldValidate: true })}
            placeholder="Select industry"
            triggerClassName={cn(
              "rounded-xl",
              errors.industry && "border-red-400 focus:ring-red-200"
            )}
          />
          <FieldError message={errors.industry?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="address" className={labelBase}>Business Address</label>
        <textarea 
          id="address" 
          rows={3} 
          placeholder="123 Main Street, Accra, Ghana" 
          {...register("address")} 
          className={cn(inputBase, "resize-none", errors.address && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
        />
        <FieldError message={errors.address?.message} />
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-border">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-brand-navy hover:bg-[#1e2f72] text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
