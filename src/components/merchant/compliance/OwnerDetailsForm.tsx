"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight } from "lucide-react";
import {
  ownerDetailsSchema,
  type OwnerDetailsValues,
} from "@/lib/schemas/auth";
import { FieldError } from "@/components/ui/field-error";
import PhoneInput from "@/components/ui/phone-input";
import Select from "@/components/ui/Select";
import { cn } from "@/lib/utils";

const inputBase = "w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all bg-background border-border focus:border-brand-teal/60 focus:ring-2 focus:ring-brand-teal/10 disabled:bg-muted/30 disabled:cursor-not-allowed";
const labelBase = "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider";

const ID_TYPE_OPTIONS = [
  { value: "passport", label: "Passport" },
  { value: "national_id", label: "National ID (Ghana Card)" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "voter_id", label: "Voter ID" },
];

interface OwnerDetailsFormProps {
  defaultValues: OwnerDetailsValues | null;
  onBack: () => void;
  onComplete: (data: OwnerDetailsValues) => void;
}

export default function OwnerDetailsForm({ defaultValues, onBack, onComplete }: OwnerDetailsFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<OwnerDetailsValues>({
    resolver: zodResolver(ownerDetailsSchema),
    defaultValues: defaultValues || { 
      firstName: "", 
      lastName: "", 
      email: "", 
      phoneCode: "+233", 
      phone: "",
      idType: "national_id",
      idNumber: "",
      isDeveloper: "no" 
    },
  });

  const selectedIdType = watch("idType");
  const idTypeLabel = ID_TYPE_OPTIONS.find(opt => opt.value === selectedIdType)?.label || "ID";

  return (
    <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          Owner Verification
        </h2>
        <p className="text-sm text-muted-foreground">Personal details and identification of the business owner</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelBase}>First Name</label>
          <input 
            id="firstName" 
            type="text" 
            placeholder="John" 
            {...register("firstName")} 
            className={cn(inputBase, errors.firstName && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
          />
          <FieldError message={errors.firstName?.message} />
        </div>

        <div>
          <label htmlFor="lastName" className={labelBase}>Last Name</label>
          <input 
            id="lastName" 
            type="text" 
            placeholder="Doe" 
            {...register("lastName")} 
            className={cn(inputBase, errors.lastName && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelBase}>Email Address</label>
        <input 
          id="email" 
          type="email" 
          placeholder="john@acme.com" 
          {...register("email")} 
          className={cn(inputBase, errors.email && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <label htmlFor="phone" className={labelBase}>Phone Number</label>
        <PhoneInput 
          value={watch("phone")} 
          onChange={(value) => setValue("phone", value, { shouldValidate: true })} 
          className={cn(errors.phone && "border-red-400 focus-within:ring-red-200")} 
        />
        <FieldError message={errors.phone?.message} />
      </div>

      {/* ID Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="idType" className={labelBase}>ID Type</label>
          <Select
            options={ID_TYPE_OPTIONS}
            value={watch("idType")}
            onChange={(value) => setValue("idType", value as any, { shouldValidate: true })}
            placeholder="Select ID type"
            triggerClassName={cn(
              "rounded-xl",
              errors.idType && "border-red-400 focus:ring-red-200"
            )}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Select the type of identification document you'll upload
          </p>
          <FieldError message={errors.idType?.message} />
        </div>

        <div>
          <label htmlFor="idNumber" className={labelBase}>
            {idTypeLabel} Number
          </label>
          <input 
            id="idNumber" 
            type="text" 
            placeholder={`Enter your ${idTypeLabel} number`}
            {...register("idNumber")} 
            className={cn(inputBase, errors.idNumber && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
          />
          <FieldError message={errors.idNumber?.message} />
        </div>
      </div>

      <div>
        <label className={labelBase}>Are you a software developer?</label>
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((val) => (
            <label 
              key={val} 
              className="flex-1 relative flex items-center gap-2 p-3 border border-border rounded-xl cursor-pointer hover:border-brand-teal/40 transition-colors has-checked:border-brand-teal has-checked:bg-brand-teal/5"
            >
              <input type="radio" value={val} {...register("isDeveloper")} />
              <span className="text-sm font-medium">{val === "yes" ? "Yes, I am" : "No, I'm not"}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.isDeveloper?.message} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button 
          type="button" 
          onClick={onBack} 
          className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Back
        </button>
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
