"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, Upload, X, FileText, Info } from "lucide-react";
import {
  getKycDocumentsSchema,
  type KYCDocumentsValues,
  type OwnerDetailsValues,
  type BusinessDetailsValues,
} from "@/lib/schemas/auth";
import { FieldError } from "@/components/ui/field-error";
import { cn } from "@/lib/utils";

const labelBase = "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider";

const ID_TYPE_LABELS: Record<string, string> = {
  passport: "Passport",
  national_id: "National ID (Ghana Card)",
  drivers_license: "Driver's License",
  voter_id: "Voter ID",
};

interface DocumentsFormProps {
  defaultValues: KYCDocumentsValues | null;
  ownerData: OwnerDetailsValues | null; // Pass owner data to get ID type
  businessData: BusinessDetailsValues | null; // Pass business data to check business type
  onBack: () => void;
  onComplete: (data: KYCDocumentsValues) => void;
}

export default function DocumentsForm({ defaultValues, ownerData, businessData, onBack, onComplete }: DocumentsFormProps) {
  const businessType = businessData?.businessType || "registered";
  const isRegistered = businessType === "registered";
  
  const { setValue, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<KYCDocumentsValues>({
    resolver: zodResolver(getKycDocumentsSchema(businessType)),
    defaultValues: defaultValues || undefined,
  });

  const businessCert = watch("businessRegistrationCertificate");
  const directorIdFront = watch("directorIdFront");
  const directorIdBack = watch("directorIdBack");
  const proofOfAddress = watch("proofOfAddress");

  const idType = ownerData?.idType || "national_id";
  const idTypeLabel = ID_TYPE_LABELS[idType] || "ID";

  return (
    <form onSubmit={handleSubmit(onComplete)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          KYC Documents
        </h2>
        <p className="text-sm text-muted-foreground">Upload clear copies of your business documents (PDF, JPG, PNG • Max 5MB)</p>
      </div>

      {/* Info banner for starter businesses */}
      {!isRegistered && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-900">Starter Business Account</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Business registration certificate is optional for starter accounts. You can upload it later when you register your business.
            </p>
          </div>
        </div>
      )}

      <FileUploadField
        label={`Business Registration Certificate${isRegistered ? "" : " (Optional)"}`}
        file={businessCert}
        onChange={(file) => setValue("businessRegistrationCertificate", file as File, { shouldValidate: true })}
        error={errors.businessRegistrationCertificate?.message}
        disabled={isSubmitting}
        required={isRegistered}
      />

      {/* Director's ID Front */}
      <FileUploadField
        label={`${idTypeLabel} - Front Side`}
        file={directorIdFront}
        onChange={(file) => setValue("directorIdFront", file as File, { shouldValidate: true })}
        error={errors.directorIdFront?.message}
        disabled={isSubmitting}
        helpText="Upload a clear photo of the front side of your ID"
        required
      />

      {/* Director's ID Back */}
      <FileUploadField
        label={`${idTypeLabel} - Back Side`}
        file={directorIdBack}
        onChange={(file) => setValue("directorIdBack", file as File, { shouldValidate: true })}
        error={errors.directorIdBack?.message}
        disabled={isSubmitting}
        helpText="Upload a clear photo of the back side of your ID"
        required
      />

      <FileUploadField
        label="Proof of Address (Utility Bill or Bank Statement)"
        file={proofOfAddress}
        onChange={(file) => setValue("proofOfAddress", file as File, { shouldValidate: true })}
        error={errors.proofOfAddress?.message}
        disabled={isSubmitting}
        helpText="Document must be dated within the last 3 months"
        required
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
function FileUploadField({ label, file, onChange, error, disabled, helpText, required = false }: {
  label: string;
  file?: File;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
  helpText?: string;
  required?: boolean;
}) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) onChange(selectedFile);
  };

  const handleRemove = () => onChange(null);

  return (
    <div>
      <label className={labelBase}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
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
          {helpText && (
            <span className="text-xs text-muted-foreground mt-1 text-center">{helpText}</span>
          )}
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
