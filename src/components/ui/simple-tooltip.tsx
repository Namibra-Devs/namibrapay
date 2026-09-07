"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface SimpleTooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

export function SimpleTooltip({
  children,
  content,
  side = "right",
  sideOffset = 8,
}: SimpleTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (side) {
      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + sideOffset;
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - sideOffset;
        break;
      case "top":
        top = rect.top - sideOffset;
        left = rect.left + rect.width / 2;
        break;
      case "bottom":
        top = rect.bottom + sideOffset;
        left = rect.left + rect.width / 2;
        break;
    }

    setPosition({ top, left });
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const tooltipContent = isVisible && mounted && (
    <div
      className={cn(
        "fixed z-9999 px-3 py-1.5 text-xs font-medium text-background bg-foreground rounded-md shadow-lg pointer-events-none whitespace-nowrap",
        side === "right" && "-translate-y-1/2",
        side === "left" && "-translate-y-1/2 -translate-x-full",
        side === "top" && "-translate-x-1/2 -translate-y-full",
        side === "bottom" && "-translate-x-1/2"
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {content}
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </div>
      {mounted && createPortal(tooltipContent, document.body)}
    </>
  );
}
