'use client';

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { memo } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField = memo(function FormField({
  label,
  error,
  required = false,
  description,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-red-600 text-xs">
          <AlertCircle className="size-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = memo(function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all",
        error ? "border-red-300 focus:border-red-500" : "border-border",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
});

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = memo(function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all resize-none",
        error ? "border-red-300 focus:border-red-500" : "border-border",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
});

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = memo(function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all",
        error ? "border-red-300 focus:border-red-500" : "border-border",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
