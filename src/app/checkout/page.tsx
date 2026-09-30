'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Smartphone,
  Building2,
  Check,
  Lock,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGHS } from "@/lib/constants";
import { BANK_OPTIONS_GHANA } from "@/lib/constants/options";
import Image from "next/image";
import Logo from "@/components/ui/Logo";
import CustomSelect from "@/components/ui/Select";

type PaymentMethod = "card" | "momo" | "bank";
type MomoProvider = "mtn" | "vodafone" | "airteltigo";

// Mock merchant and payment data (in production, these come from URL params or API)
const MERCHANT_INFO = {
  name: "Kwame Organics",
  logo: "/store.png",
  email: "orders@kwameorganics.com",
};

const PAYMENT_INFO = {
  amount: 150.00,
  currency: "GHS",
  reference: "NP-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  description: "Order #1234 - Organic Shea Butter",
};

// Auth-style input base
const inputBase =
  "w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed border-gray-200 focus:ring-brand-teal/30 focus:border-brand-teal";

export default function CheckoutPage() {
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("momo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Card payment state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Mobile Money state
  const [momoProvider, setMomoProvider] = useState<MomoProvider>("mtn");
  const [momoNumber, setMomoNumber] = useState("");

  // Bank transfer state
  const [selectedBank, setSelectedBank] = useState("");

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted;
  };

  // Format expiry as MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  // Detect card type
  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "visa";
    if (cleaned.startsWith("5")) return "mastercard";
    if (cleaned.startsWith("506")) return "verve";
    return null;
  };

  // Handle payment submission
  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock validation
    if (paymentMethod === "momo" && momoNumber.length < 10) {
      setPaymentError("Please enter a valid phone number");
      setIsProcessing(false);
      return;
    }

    if (paymentMethod === "card" && cardNumber.replace(/\s/g, "").length < 16) {
      setPaymentError("Please enter a valid card number");
      setIsProcessing(false);
      return;
    }

    // Success
    setPaymentSuccess(true);
    setIsProcessing(false);
  };

  // Payment success view
  if (paymentSuccess) {
    return (
      <div className="relative min-h-screen bg-brand-navy overflow-hidden">
        {/* Decorative background blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-xl h-144 bg-brand-pink/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-xl h-144 bg-brand-teal/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-brand-lavender/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-black/40 px-8 py-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="size-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
            >
              <Check className="size-6 text-emerald-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-sm text-center mb-6">
              Your payment of <strong className="text-gray-900">{formatGHS(PAYMENT_INFO.amount)}</strong> was processed successfully
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Reference</span>
                <span className="font-mono font-medium text-gray-900">{PAYMENT_INFO.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Merchant</span>
                <span className="font-medium text-gray-900">{MERCHANT_INFO.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="font-medium text-gray-900 capitalize">{paymentMethod === "momo" ? "Mobile Money" : paymentMethod}</span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = "/"}
              className="w-full py-3.5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Return to Merchant
            </motion.button>
            <p className="text-xs text-gray-500 text-center mt-4">
              A receipt has been sent to your email
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

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
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          {/* Payment Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
            {/* Header with Logo & Merchant */}
            <div className="px-8 pt-10 pb-6">
              <div className="flex justify-center mb-6">
                <Logo />
              </div>
              <div className="border-t border-gray-100 mb-5" />
              
              {/* Merchant Info & Amount - Side by Side */}
              <div className="grid grid-cols-2 gap-4 divide-x divide-gray-100">
                {/* Merchant Info */}
                <div className="flex flex-col items-start justify-center pr-4">
                  <p className="text-[10px] text-gray-500 mb-2">Paying to</p>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-xs text-gray-900 truncate">{MERCHANT_INFO.name}</h2>
                    <p className="text-[10px] text-gray-500 truncate">{MERCHANT_INFO.email}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex flex-col items-start justify-center pl-4">
                  <p className="text-[10px] text-gray-500 mb-1.5">Amount to pay</p>
                  <p className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    {formatGHS(PAYMENT_INFO.amount)}
                  </p>
                  <p className="text-[10px] text-gray-500 line-clamp-2">{PAYMENT_INFO.description}</p>
                </div>
              </div>
            </div>
            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 border-y border-gray-100">
              {[
                { value: "momo" as const, label: "Mobile Money", icon: Smartphone },
                { value: "card" as const, label: "Card", icon: CreditCard },
                { value: "bank" as const, label: "Bank", icon: Building2 },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setPaymentMethod(value)}
                  className={cn(
                    "flex flex-col items-center gap-2 py-4 transition-colors relative",
                    paymentMethod === value
                      ? "text-brand-teal bg-brand-teal/5"
                      : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <Icon className="size-5" />
                  <span className="text-xs font-medium">{label}</span>
                  {paymentMethod === value && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Payment Form */}
            <div className="px-8 py-6 space-y-4">
              <AnimatePresence mode="wait">
                {paymentMethod === "momo" && (
                  <motion.div
                    key="momo"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Provider Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Select Provider</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "mtn" as const, name: "MTN", logo: "/mtn.png" },
                          { value: "vodafone" as const, name: "Vodafone", logo: "/telecel.png" },
                          { value: "airteltigo" as const, name: "AirtelTigo", logo: "/airtel.png" },
                        ].map((provider) => (
                          <button
                            key={provider.value}
                            onClick={() => setMomoProvider(provider.value)}
                            className={cn(
                              "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                              momoProvider === provider.value
                                ? "border-brand-teal bg-brand-teal/5"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div className="size-8 relative">
                              <Image src={provider.logo} alt={provider.name} fill className="object-contain" />
                            </div>
                            <span className="text-xs font-medium text-gray-900">{provider.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="024 123 4567"
                          value={momoNumber}
                          onChange={(e) => setMomoNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className={cn(inputBase, "pl-10")}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        You'll receive a prompt on your phone to approve this payment
                      </p>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === "card" && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16));
                            setCardNumber(formatted);
                          }}
                          className={cn(inputBase, "pl-10 font-mono")}
                        />
                        {getCardType(cardNumber) && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 uppercase">
                            {getCardType(cardNumber)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          className={cn(inputBase, "font-mono")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                          className={cn(inputBase, "font-mono")}
                        />
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="JOHN DOE"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className={cn(inputBase, "uppercase")}
                      />
                    </div>
                  </motion.div>
                )}

                {paymentMethod === "bank" && (
                  <motion.div
                    key="bank"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Bank Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Bank</label>
                      <CustomSelect
                        value={selectedBank}
                        onChange={setSelectedBank}
                        options={BANK_OPTIONS_GHANA}
                        placeholder="Choose bank..."
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="size-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Secure Bank Authentication</p>
                        <p className="text-xs text-blue-600">
                          You'll be redirected to your bank's secure portal to complete this payment
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {paymentError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-start gap-3"
                >
                  <AlertCircle className="size-4 text-red-600 shrink-0" />
                  <p className="text-xs text-red-800">{paymentError}</p>
                </motion.div>
              )}

              {/* Pay Button */}
              <div className="pt-2">
                <motion.button
                  whileTap={isProcessing ? {} : { scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-colors flex items-center justify-center gap-2",
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-brand-teal hover:bg-brand-teal/90"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay {formatGHS(PAYMENT_INFO.amount)}</>
                  )}
                </motion.button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                <Lock className="size-3.5" />
                <span>Secured by NamibraPay</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-7 text-xs text-white/60">
            <p>Protected by 256-bit SSL encryption</p>
            <p className="mt-1">Reference: {PAYMENT_INFO.reference}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
