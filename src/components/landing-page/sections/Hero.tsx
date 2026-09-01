"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Play, CheckCircle2 } from "lucide-react";
import SectionBadge from "@/components/ui/SectionBadge";

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const, delay },
  };
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-white to-[#edfaf9] pointer-events-none" />
      {/* Radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-brand-teal/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div {...fadeUp(0.1)}>
          <SectionBadge>Built for Scalability</SectionBadge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.2)}
          className="mt-8 font-heading font-bold text-[2.75rem] md:text-6xl lg:text-7xl text-brand-navy leading-[1.1] tracking-tight max-w-3xl"
        >
          Payment{" "}
          <span className="text-brand-teal">Infrastructure</span>{" "}
          for Businesses
        </motion.h1>

        {/* Description */}
        <motion.p
          {...fadeUp(0.3)}
          className="mt-6 text-base md:text-lg text-gray-500 max-w-xl leading-relaxed"
        >
          Scale across borders with a unified API. NamibraPay provides the fluid
          architecture needed to accept payments, manage payouts, and grow your
          wealth with confidence.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp(0.4)}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-navy text-white font-semibold text-sm shadow-md hover:bg-brand-navy/90 transition-colors cursor-pointer"
          >
            Start Transacting
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-3 px-2 py-2 pr-6 rounded-full text-brand-navy font-semibold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="w-9 h-9 rounded-full bg-brand-navy/8 flex items-center justify-center shrink-0">
              <Play className="w-3.5 h-3.5 fill-brand-navy text-brand-navy ml-0.5" />
            </span>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Payment card mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mt-20 w-full max-w-md mx-auto"
        >
          {/* Floating notification card */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-6 md:-left-16 z-20 bg-white rounded-2xl px-4 py-3.5 shadow-xl border border-gray-100 w-52"
          >
            <p className="text-[9px] text-gray-400 uppercase tracking-wider font-medium">
              Received from
            </p>
            <p className="font-heading font-semibold text-sm text-gray-800 mt-0.5">
              Kofi Mensah
            </p>
            <p className="text-brand-teal font-bold text-lg leading-tight">
              +GHS 450.00
            </p>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              <span className="text-[9px] text-gray-500 font-medium">
                Payment Verified Instantly
              </span>
            </div>
          </motion.div>

          {/* Main dashboard card */}
          <div className="relative bg-linear-to-br from-brand-navy via-[#1e307a] to-[#162060] rounded-3xl p-7 shadow-2xl text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-brand-lavender/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative">
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
                Balance
              </p>
              <div className="flex items-start justify-between mt-1.5">
                <h2 className="font-heading font-bold text-3xl tracking-tight">
                  GHS 45,000.00
                </h2>
                <span className="text-[11px] bg-brand-teal/20 text-brand-teal px-2.5 py-1 rounded-full font-semibold mt-1">
                  +GHS 1,500
                </span>
              </div>

              <div className="my-5 h-px bg-white/10" />

              <div className="space-y-4">
                {[
                  { name: "Mohammed Amin", time: "2 hrs ago", amount: "-GHS 450" },
                  { name: "Bright Gobka", time: "5 hrs ago", amount: "-GHS 450" },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                        {tx.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight">{tx.name}</p>
                        <p className="text-[11px] text-white/40 mt-0.5">{tx.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-brand-pink">
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Depth shadow */}
          <div className="absolute -bottom-5 left-8 right-8 h-8 bg-brand-navy/25 blur-xl rounded-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
