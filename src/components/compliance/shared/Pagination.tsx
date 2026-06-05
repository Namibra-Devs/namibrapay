"use client";

import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/compliance-utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show only 5 pages at a time on desktop, 3 on mobile
  let displayPages = pages;
  if (totalPages > 5) {
    if (currentPage <= 3) {
      displayPages = pages.slice(0, 5);
    } else if (currentPage >= totalPages - 2) {
      displayPages = pages.slice(totalPages - 5);
    } else {
      displayPages = pages.slice(currentPage - 3, currentPage + 2);
    }
  }

  // On mobile, show only 3 pages
  let mobileDisplayPages = displayPages;
  if (displayPages.length > 3) {
    const currentIndex = displayPages.indexOf(currentPage);
    if (currentIndex === 0) {
      mobileDisplayPages = displayPages.slice(0, 3);
    } else if (currentIndex === displayPages.length - 1) {
      mobileDisplayPages = displayPages.slice(-3);
    } else {
      mobileDisplayPages = displayPages.slice(
        Math.max(0, currentIndex - 1),
        Math.min(displayPages.length, currentIndex + 2)
      );
    }
  }

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <p className="text-sm text-gray-600 hidden sm:block">
        Page <span className="font-medium">{currentPage}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial justify-center sm:justify-start">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "p-2 rounded-lg border border-gray-200 transition-colors",
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          )}
          aria-label="Previous page"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Page Numbers - Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          {displayPages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-[40px]",
                page === currentPage
                  ? "bg-brand-teal text-white"
                  : "text-gray-700 hover:bg-gray-50 border border-gray-200"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Page Numbers - Mobile */}
        <div className="flex sm:hidden items-center gap-1.5">
          {mobileDisplayPages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors min-w-[32px]",
                page === currentPage
                  ? "bg-brand-teal text-white"
                  : "text-gray-700 hover:bg-gray-50 border border-gray-200"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "p-2 rounded-lg border border-gray-200 transition-colors",
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          )}
          aria-label="Next page"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
