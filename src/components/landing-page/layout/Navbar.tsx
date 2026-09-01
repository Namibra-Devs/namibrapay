"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
  { label: "Company", href: "#company" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 md:bg-white/80 backdrop-blur-md shadow-[0_1px_10px_rgba(0,0,0,0.04)]"
          : "bg-white",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-500 hover:text-brand-navy transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/signin"
            className="text-sm font-medium text-gray-600 hover:text-brand-navy transition-colors"
          >
            Log in
          </Link>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/signup"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-brand-teal text-white text-sm font-semibold shadow-sm hover:bg-brand-teal/90 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-brand-navy transition-colors"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-gray-100 bg-white px-6 py-5 space-y-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-600 hover:text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-6 pt-2 border-t border-gray-100">
            <Link href="/signin" className="text-sm font-medium text-gray-600">
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex justify-center px-5 py-2.5 rounded-full bg-brand-teal text-white text-sm font-semibold"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
