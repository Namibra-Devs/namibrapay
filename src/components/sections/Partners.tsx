"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  {
    name: "MTN Mobile Money",
    type: "image" as const,
    src: "/mtn.png",
    width: 75,
    height: 36,
  },
  {
    name: "Telecel Cash",
    type: "image" as const,
    src: "/telecel.png",
    width: 120,
    height: 40,
  },
  {
    name: "Nsano",
    type: "image" as const,
    src: "/nsano.png",
    width: 100,
    height: 36,
  },
  {
    name: "Zeepay",
    type: "image" as const,
    src: "/zeepay.png",
    width: 100,
    height: 36,
  },
  {
    name: "AirtelTigo Money",
    type: "image" as const,
    src: "/airtel.png",
    width: 120,
    height: 40,
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
          className="flex flex-wrap items-center justify-center gap-10 md:gap-16"
        >
          {partners.map((p) => (
            <motion.div
              key={p.name}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.2 }}
              className="opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              {p.type === "image" ? (
                <Image
                  src={p.src}
                  alt={p.name}
                  width={p.width}
                  height={p.height}
                  className="object-contain"
                  style={{ height: '32px', width: 'auto' }}
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <span className="font-heading font-semibold text-sm text-gray-700 whitespace-nowrap">
                    Error in loading logos
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
