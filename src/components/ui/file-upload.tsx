"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  error?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  required?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export default function FileUpload({
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 5 * 1024 * 1024, // 5MB default
  error,
  disabled = false,
  label,
  description,
  required = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }

    // Check file type
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const mimeType = file.type;

    const isValidExtension = acceptedTypes.some((type) => 
      type.startsWith(".") ? fileExtension === type : mimeType.startsWith(type)
    );

    if (!isValidExtension) {
      return "File type not supported. Please upload PDF, JPG, or PNG.";
    }

    return null;
  }, [accept, maxSize]);

  const handleFile = useCallback((file: File) => {
    setUploadError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    onChange(file);
  }, [onChange, validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [disabled, handleFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    onChange(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const displayError = error || uploadError;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && !value && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      {/* Upload area or file preview */}
      {!value ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl px-6 py-8 transition-all cursor-pointer",
            "hover:border-brand-teal hover:bg-brand-teal/5",
            isDragging && "border-brand-teal bg-brand-teal/10",
            displayError && "border-red-400 bg-red-50/50",
            !displayError && !isDragging && "border-gray-300 bg-gray-50/50",
            disabled && "opacity-50 cursor-not-allowed hover:border-gray-300 hover:bg-gray-50/50"
          )}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className={cn(
                "size-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                displayError ? "bg-red-100" : "bg-brand-teal/10"
              )}
            >
              <Upload
                className={cn(
                  "size-6",
                  displayError ? "text-red-500" : "text-brand-teal"
                )}
              />
            </div>
            
            <p className="text-sm font-medium text-gray-700 mb-1">
              {isDragging ? "Drop file here" : "Click to upload or drag and drop"}
            </p>
            
            <p className="text-xs text-gray-500">
              PDF, JPG, or PNG (max {formatFileSize(maxSize)})
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative border-2 rounded-xl px-4 py-4 transition-all",
            displayError ? "border-red-400 bg-red-50/50" : "border-brand-teal/30 bg-brand-teal/5"
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              displayError ? "bg-red-100" : "bg-brand-teal/20"
            )}>
              <FileText className={cn(
                "size-5",
                displayError ? "text-red-600" : "text-brand-teal"
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate mb-0.5">
                {value.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(value.size)}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!displayError && (
                <div className="size-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="size-4 text-emerald-600" />
                </div>
              )}
              
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center transition-colors",
                  "hover:bg-red-100 text-gray-400 hover:text-red-600",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {displayError && (
        <div className="flex items-start gap-2 mt-2">
          <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{displayError}</p>
        </div>
      )}
    </div>
  );
}
