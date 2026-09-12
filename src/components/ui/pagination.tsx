import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of items currently showing */
  currentItemCount?: number;
  /** Whether to show page size selector */
  showPageSize?: boolean;
  /** Available page sizes */
  pageSizes?: number[];
  /** Current page size */
  pageSize?: number;
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void;
  /** Additional className */
  className?: string;
}

/**
 * Pagination - Mobile-responsive pagination component
 * 
 * Features:
 * - Mobile: Compact with only essential buttons
 * - Desktop: Full pagination with page numbers
 * - Shows "X-Y of Z items"
 * - First/Last page navigation
 * - Optional page size selector
 * 
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={page}
 *   totalPages={totalPages}
 *   totalItems={1000}
 *   itemsPerPage={20}
 *   onPageChange={setPage}
 * />
 * ```
 */
const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      onPageChange,
      currentItemCount,
      showPageSize = false,
      pageSizes = [10, 20, 50, 100],
      pageSize = 20,
      onPageSizeChange,
      className,
    },
    ref
  ) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = currentItemCount 
      ? (currentPage - 1) * itemsPerPage + currentItemCount
      : Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers to show (max 5 on desktop)
    const getPageNumbers = () => {
      const delta = 2; // Number of pages to show on each side of current page
      const range: number[] = [];
      const rangeWithDots: (number | string)[] = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-card/30",
          className
        )}
      >
        {/* Items info */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="hidden sm:inline">Showing </span>
            <span className="font-semibold text-foreground">
              {totalItems === 0 ? 0 : startItem}–{endItem}
            </span>
            <span className="hidden xs:inline"> of </span>
            <span className="xs:hidden"> / </span>
            <span className="font-semibold text-foreground">{totalItems}</span>
          </p>

          {/* Page size selector (desktop only) */}
          {showPageSize && onPageSizeChange && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="px-2 py-1 text-xs border border-border rounded-lg bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-mint/50 transition-all"
              >
                {pageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Mobile: Compact buttons */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              onClick={() => onPageChange(1)}
              disabled={!canGoPrevious}
              className={cn(
                "p-1.5 rounded-lg border transition-all",
                canGoPrevious
                  ? "border-border bg-background hover:bg-muted/50"
                  : "border-border/50 bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
              aria-label="First page"
            >
              <ChevronsLeft className="size-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoPrevious}
              className={cn(
                "p-1.5 rounded-lg border transition-all",
                canGoPrevious
                  ? "border-border bg-background hover:bg-muted/50"
                  : "border-border/50 bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-3 text-xs font-medium text-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoNext}
              className={cn(
                "p-1.5 rounded-lg border transition-all",
                canGoNext
                  ? "border-border bg-background hover:bg-muted/50"
                  : "border-border/50 bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={!canGoNext}
              className={cn(
                "p-1.5 rounded-lg border transition-all",
                canGoNext
                  ? "border-border bg-background hover:bg-muted/50"
                  : "border-border/50 bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
              aria-label="Last page"
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>

          {/* Desktop: Full pagination with page numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {/* First page button */}
            <button
              onClick={() => onPageChange(1)}
              disabled={!canGoPrevious}
              className={cn(
                "p-2 rounded-lg border transition-all",
                canGoPrevious
                  ? "border-border bg-background hover:bg-muted/50"
                  : "border-border/50 bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
              aria-label="First page"
            >
              <ChevronsLeft className="size-4" />
            </button>

            {/* Previous button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoPrevious}
              className={cn(
                "p-2 rounded-lg border transition-all",
                canGoPrevious
                  ? "border-border bg-background hover:bg-muted/50"
                  : "border-border/50 bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, idx) =>
              typeof page === "number" ? (
                <button
                  key={`page-${page}`}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "min-w-9 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    page === currentPage
                      ? "bg-brand-navy text-white"
                      : "border border-border bg-background hover:bg-muted/50"
                  )}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={`dots-${idx}`}
                  className="px-2 py-2 text-sm text-muted-foreground"
                >
                  {page}
                </span>
              )
            )}

            {/* Next button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoNext}
              className={cn(
                "p-2 rounded-lg border transition-all",
                canGoNext
                  ? "border-border bg-background hover:bg-muted/50"
                  : "border-border/50 bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>

            {/* Last page button */}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={!canGoNext}
              className={cn(
                "p-2 rounded-lg border transition-all",
                canGoNext
                  ? "border-border bg-background hover:bg-muted/50"
                  : "border-border/50 bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
              aria-label="Last page"
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
