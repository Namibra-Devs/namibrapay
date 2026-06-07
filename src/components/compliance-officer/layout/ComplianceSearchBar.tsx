"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Search, X, FileText, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/compliance-utils";

// Mock search data - in real app, this would come from API
const searchData = [
  { id: "APP-2024-001", type: "application", title: "TechCorp Ghana Ltd", category: "Applications", href: "/compliance/applications/APP-2024-001" },
  { id: "APP-2024-002", type: "application", title: "QuickMart Trading", category: "Applications", href: "/compliance/applications/APP-2024-002" },
  { id: "MERCH-001", type: "merchant", title: "Global Traders Ltd", category: "Merchants", href: "/compliance/merchants/MERCH-001" },
  { id: "MERCH-002", type: "merchant", title: "Express Logistics", category: "Merchants", href: "/compliance/merchants/MERCH-002" },
  { id: "CASE-2024-001", type: "case", title: "Sanctions Hit Investigation", category: "Cases", href: "/compliance/cases/CASE-2024-001" },
  { id: "CASE-2024-002", type: "case", title: "Suspicious Activity Review", category: "Cases", href: "/compliance/cases/CASE-2024-002" },
];

const getIcon = (type: string) => {
  switch (type) {
    case "application":
      return FileText;
    case "merchant":
      return Users;
    case "case":
      return AlertTriangle;
    default:
      return FileText;
  }
};

export default function ComplianceSearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<typeof searchData>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search function
  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim() === "") {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Filter results based on query
    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered);
    setIsOpen(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear search
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  // Handle result click
  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="flex-1 max-w-md mx-4 relative">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-brand-teal transition-colors pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search applications, merchants, cases..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200 placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200/70 py-2 max-h-96 overflow-y-auto z-50"
          >
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500">
                {results.length} {results.length === 1 ? "result" : "results"} found
              </p>
            </div>
            
            <div className="py-1">
              {results.map((result) => {
                const Icon = getIcon(result.type);
                return (
                  <Link
                    key={result.id}
                    href={result.href}
                    onClick={handleResultClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      result.type === "application" && "bg-blue-100",
                      result.type === "merchant" && "bg-green-100",
                      result.type === "case" && "bg-orange-100"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        result.type === "application" && "text-blue-600",
                        result.type === "merchant" && "text-green-600",
                        result.type === "case" && "text-orange-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-brand-teal transition-colors">
                        {result.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{result.category}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400 font-mono">{result.id}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      <AnimatePresence>
        {isOpen && query && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200/70 py-8 text-center z-50"
          >
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
            <p className="text-xs text-gray-500">
              Try searching for applications, merchants, or cases
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
