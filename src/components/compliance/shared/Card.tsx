import { cn } from "@/lib/compliance-utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export default function Card({
  children,
  className,
  padding = "md",
  hover = false,
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] border border-gray-200/70",
        hover && "hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] transition-shadow duration-200",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
