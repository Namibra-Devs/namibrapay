import { cn } from "@/lib/compliance-utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  className,
}: BadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    neutral: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
