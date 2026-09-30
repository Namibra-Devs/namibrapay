'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CreditCard, ArrowRight, Code } from "lucide-react";
import { formatGHS } from "@/lib/constants";
import Logo from "@/components/ui/Logo";

// Auth-style input base
const inputBase =
  "w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed border-gray-200 focus:ring-brand-teal/30 focus:border-brand-teal";

export default function CheckoutDemoPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("150.00");
  const [description, setDescription] = useState("Order #1234 - Organic Shea Butter");
  const [merchantName, setMerchantName] = useState("Kwame Organics");

  const handleInitiatePayment = () => {
    // In production, you'd make an API call to create payment session
    // For demo, we just navigate to checkout
    router.push(`/checkout?amount=${amount}&desc=${encodeURIComponent(description)}&merchant=${encodeURIComponent(merchantName)}`);
  };

  return (
    <div className="relative min-h-screen bg-brand-navy overflow-hidden">
      {/* Decorative background blobs matching auth pages */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-xl h-144 bg-brand-pink/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-xl h-144 bg-brand-teal/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-brand-lavender/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-brand-mint/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 px-8 py-10">
            {/* Logo */}
            <div className="flex justify-center mb-7">
              <Logo />
            </div>
            <div className="border-t border-gray-100 mb-7" />

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-center text-xs font-semibold tracking-[0.18em] uppercase text-gray-400 mb-2 font-heading">
                Checkout Demo
              </h1>
              <p className="text-gray-600 text-sm">
                Test the checkout experience with customizable parameters
              </p>
            </div>

            {/* Demo Configuration */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Name</label>
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className={inputBase}
                  placeholder="Your Business Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (GHS)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={inputBase}
                  placeholder="150.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputBase}
                  placeholder="What is this payment for?"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Merchant</span>
                  <span className="font-medium text-gray-900">{merchantName || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-lg text-gray-900">{formatGHS(parseFloat(amount) || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Description</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs">{description || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-2 mb-6">
              <motion.button
                whileTap={(!amount || !merchantName || !description) ? {} : { scale: 0.98 }}
                onClick={handleInitiatePayment}
                disabled={!amount || !merchantName || !description}
                className="w-full py-3.5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Launch Checkout
                <ArrowRight className="size-4" />
              </motion.button>
            </div>

            {/* Test Instructions */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-start gap-3 text-sm">
                <Code className="size-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-2">Test Payment Methods:</p>
                  <ul className="space-y-1 text-gray-600 text-xs">
                    <li>• <strong>Mobile Money:</strong> Any 10-digit number will simulate approval</li>
                    <li>• <strong>Card:</strong> Use any 16-digit number (e.g., 4111 1111 1111 1111)</li>
                    <li>• <strong>Bank:</strong> Select any bank to simulate redirect</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[
              { label: "Mobile-First", desc: "Responsive design" },
              { label: "Secure", desc: "256-bit encryption" },
              { label: "Fast", desc: "Real-time processing" },
            ].map((feature) => (
              <div key={feature.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="font-semibold text-sm text-white">{feature.label}</p>
                <p className="text-xs text-white/70 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
