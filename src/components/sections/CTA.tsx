"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#f9fafb]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative bg-brand-navy rounded-[2.5rem] overflow-hidden"
        >
          {/* Colour blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-pink/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-brand-teal/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-brand-mint/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-brand-peach/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-16 md:px-16 md:py-20">
            {/* Left — text + buttons */}
            <div className="max-w-md text-center md:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-heading font-bold text-3xl md:text-4xl text-white leading-tight"
              >
                Ready to architect your business growth?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-white/55 text-sm leading-relaxed"
              >
                Join 10,000+ businesses already using NamibraPay to power their
                payments across Africa.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 flex flex-wrap justify-center md:justify-start gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-teal text-white font-semibold text-sm shadow-lg hover:bg-brand-teal/90 transition-colors cursor-pointer"
                >
                  Create Free Account
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center px-7 py-3.5 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Contact Sales
                </motion.button>
              </motion.div>
            </div>

            {/* Right — person image area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-72 h-72 flex-shrink-0"
            >
              {/* Placeholder — replace with <Image> once asset is available */}
              <div className="w-full h-full rounded-2xl bg-white/8 border border-white/10 flex flex-col items-center justify-center gap-3">
                {/* Silhouette placeholder */}
                <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center">
                  <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    className="w-9 h-9 text-white/40"
                  >
                    <circle cx="20" cy="14" r="7" fill="currentColor" />
                    <path
                      d="M4 36c0-8.837 7.163-16 16-16s16 7.163 16 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-white/25 text-xs font-medium">
                  Person image
                </p>
              </div>

              {/* Subtle glow behind */}
              <div className="absolute inset-0 bg-brand-teal/10 rounded-2xl blur-xl -z-10 scale-110" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
