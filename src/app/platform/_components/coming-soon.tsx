'use client';

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: string;
};

export default function ComingSoonPage({ icon: Icon, title, description, accent = "#64c6c3" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div
        className="size-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `${accent}18`, border: `1px solid ${accent}40` }}
      >
        <Icon className="size-7" style={{ color: accent }} />
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>{title}</h2>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      <div className="mt-6 px-4 py-2 rounded-full text-xs font-medium border"
        style={{ background: `${accent}10`, borderColor: `${accent}40`, color: accent }}>
        Coming in next milestone
      </div>
    </div>
  );
}