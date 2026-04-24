"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="pb-24 pt-10 px-6 lg:px-8 bg-[#f9fafb]">
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

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left — text + buttons */}
            <div className="max-w-xl text-center md:text-left px-10 py-16 md:px-16 md:py-20">
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full md:w-auto"
                >
                  <Link
                    href="/signup"
                    className="inline-flex w-full md:w-auto items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-teal text-white font-semibold text-sm shadow-lg hover:bg-brand-teal/90 transition-colors"
                  >
                    Create Free Account
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full md:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors cursor-pointer"
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
              className="relative w-96 shrink-0 overflow-hidden"
            >
              <Image
                src="/man.png"
                alt="Man"
                width={500}
                height={1000}
                className=""
              />
              {/* Subtle glow behind */}
              <div className="absolute inset-0 bg-brand-teal/10 rounded-2xl blur-xl -z-10 scale-110" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
