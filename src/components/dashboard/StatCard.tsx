import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ColorKey, TrendKey } from "@/lib/mock-data/dashboard";

const colorConfig: Record<
  ColorKey,
  { iconBg: string; iconText: string; trendText: string }
> = {
  teal: {
    iconBg: "bg-brand-teal/10",
    iconText: "text-brand-teal",
    trendText: "text-brand-teal",
  },
  blue: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-500",
    trendText: "text-blue-500",
  },
  violet: {
    iconBg: "bg-violet-50",
    iconText: "text-violet-500",
    trendText: "text-violet-500",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-500",
    trendText: "text-amber-600",
  },
};

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: TrendKey;
  subtext: string;
  colorKey: ColorKey;
  icon: React.ComponentType<{ className?: string }>;
}

export default function StatCard({
  label,
  value,
  change,
  trend,
  subtext,
  colorKey,
  icon: Icon,
}: StatCardProps) {
  const colors = colorConfig[colorKey];

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-red-500"
        : "text-gray-400";

  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 p-5 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] hover:shadow-[0_30px_60px_-40px_rgba(15,23,42,0.55)] transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className={cn("p-2.5 rounded-xl", colors.iconBg)}>
          <Icon className={cn("w-5 h-5", colors.iconText)} />
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
          <TrendIcon className="w-3.5 h-3.5" />
          <span>{change}</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 font-heading tracking-tight">
          {value}
        </p>
        <p className="mt-1 text-sm text-gray-500">{label}</p>
        <p className="mt-0.5 text-xs text-gray-400">{subtext}</p>
      </div>
    </div>
  );
}
