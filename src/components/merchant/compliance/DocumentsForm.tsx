"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, Upload, X, FileText } from "lucide-react";
import {
  kycDocumentsSchema,
  type KYCDocumentsValues,
} from "@/lib/schemas/auth";
import { FieldError } from "@/components/ui/fielderror";
import { cn } from "@/lib/utils";

const labelBase = "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider";

interface DocumentsFormProps {
  defaultValues: KYCDocumentsValues | null;
  onBack: () => void;
  onComplete: (data: KYCDocumentsValues) => void;
}

export default function DocumentsForm({ defaultValues, onBack, onComplete }: DocumentsFormProps) {
  const { setValue, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<KYCDocumentsValues>({
    resolver: zodResolver(kycDocumentsSchema),
    defaultValues: defaultValues || undefined,
  });

  const businessCert = watch("businessRegistrationCertificate");
  const directorId = watch("directorId");
  const proofOfAddress = watch("proofOfAddress");

  return (
    <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          KYC Documents
        </h2>
        <p className="text-sm text-muted-foreground">Upload clear copies of your business documents (PDF, JPG, PNG • Max 5MB)</p>
      </div>

      <FileUploadField
        label="Business Registration Certificate"
        file={businessCert}
        onChange={(file) => setValue("businessRegistrationCertificate", file as File, { shouldValidate: true })}
        error={errors.businessRegistrationCertificate?.message}
        disabled={isSubmitting}
      />

      <FileUploadField
        label="Director's ID (Passport, Driver's License, or National ID)"
        file={directorId}
        onChange={(file) => setValue("directorId", file as File, { shouldValidate: true })}
        error={errors.directorId?.message}
        disabled={isSubmitting}
      />

      <FileUploadField
        label="Proof of Address (Utility Bill or Bank Statement)"
        file={proofOfAddress}
        onChange={(file) => setValue("proofOfAddress", file as File, { shouldValidate: true })}
        error={errors.proofOfAddress?.message}
        disabled={isSubmitting}
      />

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button 
          type="button" 
          onClick={onBack} 
          disabled={isSubmitting}
          className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
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

// File Upload Component
function FileUploadField({ label, file, onChange, error, disabled }: {
  label: string;
  file?: File;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) onChange(selectedFile);
  };

  const handleRemove = () => onChange(null);

  return (
    <div>
      <label className={labelBase}>{label}</label>
      
      {!file ? (
        <label className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors hover:border-brand-teal hover:bg-brand-teal/5",
          error ? "border-red-300 bg-red-50/50" : "border-border",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          <Upload className="size-8 text-muted-foreground mb-2" />
          <span className="text-sm text-foreground font-medium mb-1">
            Click to upload or drag and drop
          </span>
          <span className="text-xs text-muted-foreground">PDF, JPG, PNG • Max 5MB</span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between border border-border rounded-xl p-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <FileText className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      <FieldError message={error} />
    </div>
  );
}
