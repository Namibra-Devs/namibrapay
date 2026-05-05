"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { toast } from "@/components/ui/Toast";
import { confirmEmail, getErrorMessage } from "@/lib/auth-api";

type Status = "verifying" | "success" | "error";

export default function ConfirmEmailView() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    if (!token) {
      setStatus("error");
      setErrorMsg("Invalid or missing verification link. Please request a new one.");
      return;
    }

    let active = true;

    (async () => {
      try {
        await confirmEmail(token);
        if (!active) return;
        setStatus("success");
        toast.success("Email verified!", {
          description: "Your account is ready. Sign in to continue.",
        });
        await new Promise((r) => setTimeout(r, 2000));
        if (active) router.push("/signin");
      } catch (err) {
        if (!active) return;
        setStatus("error");
        setErrorMsg(getErrorMessage(err));
      }
    })();

    return () => {
      active = false;
    };
  }, [token, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 px-8 py-10">
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <Logo />
        </div>
        <div className="border-t border-gray-100 mb-7" />

        {/* Heading */}
        <h1 className="text-center text-xs font-semibold tracking-[0.18em] uppercase text-gray-400 mb-8 font-heading">
          Confirm email address
        </h1>

        {/* States */}
        <AnimatePresence mode="wait">
          {status === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center py-10"
            >
              <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-brand-teal animate-spin" />
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-8 gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-brand-teal" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Email verified!
                </p>
                <p className="text-xs text-gray-400">
                  Redirecting you to sign in…
                </p>
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-8 gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle size={36} className="text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Verification failed
                </p>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  {errorMsg}
                </p>
              </div>
              <Link
                href="/signup"
                className="mt-1 text-sm font-semibold text-brand-teal hover:text-brand-teal/75 transition-colors"
              >
                Back to sign up
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
