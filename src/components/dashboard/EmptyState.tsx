import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 p-4 rounded-2xl bg-gray-50 text-gray-300">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="mt-1.5 text-sm text-gray-400 max-w-xs">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
