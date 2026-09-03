"use client";

import { cn } from "@/lib/utils";
import PhoneCodePicker from "./phonecodepicker";

interface PhoneInputProps {
  value: string; // Full phone number with code, e.g., "+233 24 555 6789"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "XX XXX XXXX",
  className,
  disabled = false,
}: PhoneInputProps) {
  // Parse the value into code and number
  const parsePhone = (phone: string): { code: string; number: string } => {
    if (!phone) return { code: "+233", number: "" };
    
    // Match pattern like "+233 24 555 6789"
    const match = phone.match(/^(\+\d+)\s*(.*)$/);
    if (match) {
      return { code: match[1], number: match[2].trim() };
    }
    
    return { code: "+233", number: phone };
  };

  const { code, number } = parsePhone(value);

  const handleCodeChange = (newCode: string) => {
    onChange(number ? `${newCode} ${number}` : newCode);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newNumber = e.target.value;
    
    // Auto-format: add spaces after 2 and 5 digits for Ghana numbers
    if (code === "+233" && newNumber.length > 0) {
      // Remove existing spaces
      const digits = newNumber.replace(/\s/g, "");
      
      // Format: XX XXX XXXX
      if (digits.length <= 2) {
        newNumber = digits;
      } else if (digits.length <= 5) {
        newNumber = `${digits.slice(0, 2)} ${digits.slice(2)}`;
      } else {
        newNumber = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
      }
    }
    
    onChange(`${code} ${newNumber}`);
  };

  return (
    <div
      className={cn(
        "flex items-stretch border rounded-lg overflow-hidden transition-all bg-card",
        disabled
          ? "opacity-50 cursor-not-allowed border-border"
          : "border-border hover:border-gray-300 focus-within:ring-2 focus-within:ring-brand-teal/20",
        className
      )}
    >
      {/* Country Code Picker */}
      <div className="w-25 border-r border-border">
        <PhoneCodePicker
          value={code}
          onChange={handleCodeChange}
          className="h-full"
        />
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        value={number}
        onChange={handleNumberChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex-1 px-3 py-2 text-sm text-foreground placeholder-gray-400",
          "bg-transparent focus:outline-none",
          disabled && "cursor-not-allowed"
        )}
      />
    </div>
  );
}
