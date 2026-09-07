"use client";

import { motion, type Variants } from "motion/react";
import { Store, GraduationCap, Truck, Landmark } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";
import { type LucideIcon } from "lucide-react";

interface UseCase {
  icon: LucideIcon;
  title: string;
  description: string;
  cardBg: string;
  iconBg: string;
}

const useCases: UseCase[] = [
  {
    icon: Store,
    title: "SMEs & Retail",
    description:
      "Unified physical and digital payments for fast-growing merchants across the continent.",
    cardBg: "bg-brand-lavender/20",
    iconBg: "bg-brand-lavender/50",
  },
  {
    icon: GraduationCap,
    title: "Schools & Inst.",
    description:
      "Automated tuition collection, billing cycles, and scholarship disbursement engines.",
    cardBg: "bg-brand-pink/20",
    iconBg: "bg-brand-pink/50",
  },
  {
    icon: Truck,
    title: "Logistics",
    description:
      "Multi-trip payouts and wallet management for drivers and fleet operators.",
    cardBg: "bg-brand-mint/20",
    iconBg: "bg-brand-mint/50",
  },
  {
    icon: Landmark,
    title: "Government",
    description:
      "Secure, high-volume collection systems for public services and national utilities.",
    cardBg: "bg-brand-peach/30",
    iconBg: "bg-brand-peach/70",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardAnim: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function UseCases() {
  return (
    <section className="py-24 bg-[#f9fafb]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header — two-column layout matching the design */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-14">
          <div className="max-w-xs">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <SectionBadge>Ecosystem Adaptation</SectionBadge>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 font-heading font-bold text-3xl md:text-4xl text-brand-navy leading-tight"
            >
              Built for Every High-Scale Scenario.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-gray-500 text-sm leading-relaxed max-w-60 md:mt-14"
          >
            Custom infrastructure tailored to the specific flow dynamics of your
            industry.
          </motion.p>
        </div>

        {/* 2×2 card grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {useCases.map((item) => (
            <motion.div
              key={item.title}
              variants={cardAnim}
              whileHover={{ scale: 1.02, y: -3, transition: { duration: 0.22 } }}
              className={`${item.cardBg} rounded-3xl p-8 cursor-default`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center mb-5`}
              >
                <item.icon className="w-5 h-5 text-brand-navy" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-brand-navy">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
