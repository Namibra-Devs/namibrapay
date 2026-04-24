"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Blobs — subtle on light top, richer on dark bottom */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-brand-lavender/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-lg h-64 bg-brand-teal/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        {/* Logo — naturally visible on the white area */}
        <div className="flex justify-center mb-10">
          <Logo />
        </div>

        {/* Ghost 404 — dark on white, fades toward navy */}
        <p className="text-[7rem] font-bold font-heading leading-none select-none text-brand-navy/10">
          404
        </p>

        <h1 className="mt-2 text-2xl font-heading font-bold text-brand-navy">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block mt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 transition-colors shadow-lg shadow-brand-teal/25"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
