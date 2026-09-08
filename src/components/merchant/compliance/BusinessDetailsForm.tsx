"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight } from "lucide-react";
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
  onComplete: (data: BusinessDetailsValues) => void;
}

export default function BusinessDetailsForm({ defaultValues, onComplete }: BusinessDetailsFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<BusinessDetailsValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: defaultValues || { 
      businessName: "", 
      registrationNumber: "", 
      country: "", 
      address: "", 
      industry: "", 
      businessType: "registered" 
    },
  });

  return (
    <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          Business Information
        </h2>
        <p className="text-sm text-muted-foreground">Tell us about your business</p>
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

      <div>
        <label htmlFor="registrationNumber" className={labelBase}>Business Registration Number</label>
        <input 
          id="registrationNumber" 
          type="text" 
          placeholder="CS004152023" 
          {...register("registrationNumber")} 
          className={cn(inputBase, errors.registrationNumber && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
        />
        <FieldError message={errors.registrationNumber?.message} />
      </div>

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

      <div>
        <label className={labelBase}>Business Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: "registered", label: "Registered Business", desc: "Licensed and legally operating" },
            { value: "starter", label: "Starter Business", desc: "Testing ideas, preparing registration" },
          ].map((option) => (
            <label 
              key={option.value} 
              className="relative flex items-start gap-3 p-4 border border-border rounded-xl cursor-pointer hover:border-brand-teal/40 transition-colors has-checked:border-brand-teal has-checked:bg-brand-teal/5"
            >
              <input type="radio" value={option.value} {...register("businessType")} className="mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
        <FieldError message={errors.businessType?.message} />
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
