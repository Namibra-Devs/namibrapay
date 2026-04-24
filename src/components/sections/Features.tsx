"use client";

import { motion, type Variants } from "framer-motion";
import { Code2, Shield, Zap, BarChart3, ArrowRight } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function Features() {
  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-heading font-bold text-3xl md:text-4xl text-brand-navy"
          >
            Fluid Payment Solutions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-gray-500 text-base leading-relaxed"
          >
            We&apos;ve removed the complexity of African financial systems,
            providing a clean, accessible path to growth.
          </motion.p>
        </div>

        {/* Grid — 3 columns, 2 rows */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {/* ── Developer-First APIs (col-span-2) ── */}
          <motion.div
            variants={card}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="md:col-span-2 bg-brand-lavender/20 rounded-3xl p-8 overflow-hidden relative"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-lavender/50 flex items-center justify-center mb-5">
              <Code2 className="w-5 h-5 text-brand-navy" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-brand-navy">
              Developer-First APIs
            </h3>
            <p className="mt-2 text-sm text-gray-600 max-w-sm leading-relaxed">
              Our robust API suite handles complexity so you don&apos;t have to.
              Real-time webhooks, atomic transactions, and comprehensive
              documentation for every use case.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {["RESTful", "GraphQL", "gRPC"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-brand-navy/8 text-brand-navy text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Code window */}
            <div className="mt-6 bg-brand-navy rounded-2xl p-4 font-mono overflow-hidden">
              <div className="flex gap-1.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="space-y-1 text-[11px] leading-relaxed">
                <p className="text-white/60">
                  <span className="text-brand-teal">const</span>{" "}
                  <span className="text-white">payment</span>{" "}
                  <span className="text-white/40">=</span>{" "}
                  <span className="text-brand-teal">await</span>{" "}
                  <span className="text-brand-mint">namibraPay</span>
                </p>
                <p className="text-white/60">
                  &nbsp;&nbsp;.transactions
                  <span className="text-brand-teal">.create</span>
                  <span className="text-white">({"{"}</span>
                </p>
                <p className="text-white/60">
                  &nbsp;&nbsp;&nbsp;&nbsp;amount:{" "}
                  <span className="text-brand-mint">45000</span>,
                </p>
                <p className="text-white/60">
                  &nbsp;&nbsp;&nbsp;&nbsp;currency:{" "}
                  <span className="text-brand-pink">&apos;GHS&apos;</span>,
                </p>
                <p className="text-white/60">
                  &nbsp;&nbsp;<span className="text-white">{"}"}</span>);
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Fortified Security (col-span-1) ── */}
          <motion.div
            variants={card}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="bg-brand-pink/20 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-pink/50 flex items-center justify-center mb-5">
              <Shield className="w-5 h-5 text-brand-navy" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-brand-navy">
              Fortified Security
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              PCI-DSS Level 1 compliance integrated into every layer of the
              kinetic engine. We protect your data and your users.
            </p>
            <button className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-teal transition-colors">
              Security Overview
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Shield decoration */}
            <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-brand-pink/30 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-brand-pink/60" />
            </div>
          </motion.div>

          {/* ── Atomic Settlement (col-span-1) ── */}
          <motion.div
            variants={card}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="bg-brand-peach/30 rounded-3xl p-8"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-peach/70 flex items-center justify-center mb-5">
              <Zap className="w-5 h-5 text-brand-navy" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-brand-navy">
              Atomic Settlement
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Near-instant settlements across multiple currencies. Stop waiting
              days for your capital to move.
            </p>
          </motion.div>

          {/* ── Kinetic Dashboard (col-span-2) ── */}
          <motion.div
            variants={card}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="md:col-span-2 bg-brand-navy rounded-3xl p-8 overflow-hidden relative"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />

            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
              <BarChart3 className="w-5 h-5 text-brand-teal" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-white">
              Kinetic Dashboard
            </h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-sm">
              Real-time data visualization of your entire financial ecosystem.
              Monitor flows, detect anomalies, and export reports in seconds.
            </p>

            {/* Chart */}
            <div className="mt-6 bg-white/5 rounded-2xl p-5">
              <div className="flex items-end gap-1.5 h-28">
                {[38, 62, 44, 78, 52, 88, 66, 82, 55, 94, 70, 85].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        backgroundColor:
                          i === 9
                            ? "#64C6C3"
                            : `rgba(100,198,195,${0.25 + (h / 100) * 0.45})`,
                      }}
                    />
                  )
                )}
              </div>
              <div className="flex justify-between mt-3">
                {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
                  <span key={m} className="text-[10px] text-white/30">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
