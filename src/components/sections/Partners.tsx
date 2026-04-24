"use client";

import { motion } from "framer-motion";

const partners = [
  {
    name: "MTN Mobile Money",
    abbr: "MTN",
    bg: "#FFCA00",
    text: "#1a1a1a",
  },
  {
    name: "Telecel Cash",
    abbr: "TC",
    bg: "#E4001B",
    text: "#ffffff",
  },
  {
    name: "Nano",
    abbr: "N",
    bg: "#2D2D2D",
    text: "#ffffff",
  },
  {
    name: "Zeepay",
    abbr: "ZP",
    bg: "#00A651",
    text: "#ffffff",
  },
  {
    name: "AirtelTigo Money",
    abbr: "AT",
    bg: "#E4001B",
    text: "#ffffff",
  },
];

export default function Partners() {
  return (
    <section className="py-14 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-heading font-semibold text-brand-navy text-lg mb-10"
        >
          Partners
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {partners.map((p) => (
            <motion.div
              key={p.name}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5 opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                style={{ backgroundColor: p.bg, color: p.text }}
              >
                {p.abbr}
              </div>
              <span className="font-heading font-semibold text-sm text-gray-700 whitespace-nowrap">
                {p.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
