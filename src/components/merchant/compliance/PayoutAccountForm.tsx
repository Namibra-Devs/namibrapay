"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight } from "lucide-react";
import {
  payoutAccountSchema,
  type PayoutAccountValues,
} from "@/lib/schemas/auth";
import { BANK_OPTIONS_GHANA } from "@/lib/constants/options";
import { FieldError } from "@/components/ui/field-error";
import Select from "@/components/ui/select";
import { cn } from "@/lib/utils";

const inputBase = "w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all bg-background border-border focus:border-brand-teal/60 focus:ring-2 focus:ring-brand-teal/10 disabled:bg-muted/30 disabled:cursor-not-allowed";
const labelBase = "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider";

interface PayoutAccountFormProps {
  defaultValues: PayoutAccountValues | null;
  onBack: () => void;
  onComplete: (data: PayoutAccountValues) => void;
}

export default function PayoutAccountForm({ defaultValues, onBack, onComplete }: PayoutAccountFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<PayoutAccountValues>({
    resolver: zodResolver(payoutAccountSchema),
    defaultValues: defaultValues || { 
      bankName: "", 
      accountNumber: "", 
      accountName: "" 
    },
  });

  return (
    <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          Payout Account
        </h2>
        <p className="text-sm text-muted-foreground">Provide your business bank account for settlement payouts</p>
      </div>

      <div>
        <label htmlFor="bankName" className={labelBase}>Bank Name</label>
        <Select
          options={BANK_OPTIONS_GHANA}
          value={watch("bankName")}
          onChange={(value) => setValue("bankName", value, { shouldValidate: true })}
          placeholder="Select bank"
          triggerClassName={cn(
            "rounded-xl",
            errors.bankName && "border-red-400 focus:ring-red-200"
          )}
        />
        <FieldError message={errors.bankName?.message} />
      </div>

      <div>
        <label htmlFor="accountNumber" className={labelBase}>Account Number</label>
        <input 
          id="accountNumber" 
          type="text" 
          placeholder="1234567890" 
          {...register("accountNumber")} 
          className={cn(inputBase, errors.accountNumber && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
        />
        <FieldError message={errors.accountNumber?.message} />
      </div>

      <div>
        <label htmlFor="accountName" className={labelBase}>Account Name</label>
        <input 
          id="accountName" 
          type="text" 
          placeholder="Acme Corp Ltd" 
          {...register("accountName")} 
          className={cn(inputBase, errors.accountName && "border-red-400 focus:border-red-400 focus:ring-red-200")} 
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Account name must match your business registration
        </p>
        <FieldError message={errors.accountName?.message} />
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
