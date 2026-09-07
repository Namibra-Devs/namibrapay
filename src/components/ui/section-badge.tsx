import { cn } from "@/lib/utils";

export default function SectionBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-teal/30 bg-brand-teal/5 text-brand-teal text-[10px] font-bold uppercase tracking-widest",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0" />
      {children}
    </div>
  );
}
