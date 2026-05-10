"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Country {
  name: string;
  code: string;
}

const COUNTRIES: Country[] = [
  { name: "Afghanistan", code: "+93" },
  { name: "Albania", code: "+355" },
  { name: "Algeria", code: "+213" },
  { name: "Angola", code: "+244" },
  { name: "Argentina", code: "+54" },
  { name: "Australia", code: "+61" },
  { name: "Austria", code: "+43" },
  { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" },
  { name: "Belgium", code: "+32" },
  { name: "Benin", code: "+229" },
  { name: "Bolivia", code: "+591" },
  { name: "Botswana", code: "+267" },
  { name: "Brazil", code: "+55" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Burundi", code: "+257" },
  { name: "Cameroon", code: "+237" },
  { name: "Canada", code: "+1" },
  { name: "Cape Verde", code: "+238" },
  { name: "Chad", code: "+235" },
  { name: "Chile", code: "+56" },
  { name: "China", code: "+86" },
  { name: "Colombia", code: "+57" },
  { name: "Congo", code: "+242" },
  { name: "Côte d'Ivoire", code: "+225" },
  { name: "Croatia", code: "+385" },
  { name: "Czech Republic", code: "+420" },
  { name: "Denmark", code: "+45" },
  { name: "Djibouti", code: "+253" },
  { name: "DR Congo", code: "+243" },
  { name: "Ecuador", code: "+593" },
  { name: "Egypt", code: "+20" },
  { name: "Eritrea", code: "+291" },
  { name: "Ethiopia", code: "+251" },
  { name: "Finland", code: "+358" },
  { name: "France", code: "+33" },
  { name: "Gabon", code: "+241" },
  { name: "Gambia", code: "+220" },
  { name: "Germany", code: "+49" },
  { name: "Ghana", code: "+233" },
  { name: "Greece", code: "+30" },
  { name: "Guinea", code: "+224" },
  { name: "Guinea-Bissau", code: "+245" },
  { name: "India", code: "+91" },
  { name: "Indonesia", code: "+62" },
  { name: "Iran", code: "+98" },
  { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" },
  { name: "Israel", code: "+972" },
  { name: "Italy", code: "+39" },
  { name: "Japan", code: "+81" },
  { name: "Jordan", code: "+962" },
  { name: "Kenya", code: "+254" },
  { name: "Kuwait", code: "+965" },
  { name: "Lebanon", code: "+961" },
  { name: "Lesotho", code: "+266" },
  { name: "Liberia", code: "+231" },
  { name: "Libya", code: "+218" },
  { name: "Madagascar", code: "+261" },
  { name: "Malawi", code: "+265" },
  { name: "Malaysia", code: "+60" },
  { name: "Mali", code: "+223" },
  { name: "Mauritania", code: "+222" },
  { name: "Mauritius", code: "+230" },
  { name: "Mexico", code: "+52" },
  { name: "Morocco", code: "+212" },
  { name: "Mozambique", code: "+258" },
  { name: "Namibia", code: "+264" },
  { name: "Netherlands", code: "+31" },
  { name: "New Zealand", code: "+64" },
  { name: "Niger", code: "+227" },
  { name: "Nigeria", code: "+234" },
  { name: "Norway", code: "+47" },
  { name: "Oman", code: "+968" },
  { name: "Pakistan", code: "+92" },
  { name: "Peru", code: "+51" },
  { name: "Philippines", code: "+63" },
  { name: "Poland", code: "+48" },
  { name: "Portugal", code: "+351" },
  { name: "Qatar", code: "+974" },
  { name: "Romania", code: "+40" },
  { name: "Russia", code: "+7" },
  { name: "Rwanda", code: "+250" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Senegal", code: "+221" },
  { name: "Sierra Leone", code: "+232" },
  { name: "Singapore", code: "+65" },
  { name: "Somalia", code: "+252" },
  { name: "South Africa", code: "+27" },
  { name: "South Korea", code: "+82" },
  { name: "South Sudan", code: "+211" },
  { name: "Spain", code: "+34" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Sudan", code: "+249" },
  { name: "Sweden", code: "+46" },
  { name: "Switzerland", code: "+41" },
  { name: "Tanzania", code: "+255" },
  { name: "Togo", code: "+228" },
  { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" },
  { name: "Uganda", code: "+256" },
  { name: "Ukraine", code: "+380" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Venezuela", code: "+58" },
  { name: "Vietnam", code: "+84" },
  { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" },
  { name: "Zimbabwe", code: "+263" },
];

interface PhoneCodePickerProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export default function PhoneCodePicker({
  value,
  onChange,
  className,
}: PhoneCodePickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) { setSearch(""); return; }
    setTimeout(() => searchRef.current?.focus(), 30);

    function onMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !dropdownRef.current?.contains(t)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleOpen() {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen((v) => !v);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? COUNTRIES.filter(
          (c) => c.name.toLowerCase().includes(q) || c.code.includes(q)
        )
      : COUNTRIES;
  }, [search]);

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          "flex items-center gap-1 w-full text-left cursor-pointer select-none transition-colors",
          "border rounded-xl px-3 py-3 text-sm bg-white focus:outline-none",
          open
            ? "border-brand-teal ring-2 ring-brand-teal/30"
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        <span className="flex-1 text-gray-900">{value}</span>
        <ChevronDown
          size={13}
          className={cn(
            "shrink-0 text-gray-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                style={{ top: pos.top, left: pos.left, width: 260 }}
                className="fixed z-[500] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
              >
                {/* Search */}
                <div className="p-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search Country"
                      className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                    <Search size={13} className="text-gray-400 shrink-0" />
                  </div>
                </div>

                {/* List */}
                <div className="max-h-52 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">
                      No countries found
                    </p>
                  ) : (
                    filtered.map((c) => (
                      <button
                        key={`${c.name}-${c.code}`}
                        type="button"
                        onClick={() => {
                          onChange(c.code);
                          setOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors",
                          value === c.code
                            ? "bg-brand-teal/5 text-brand-navy font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <span>{c.name}</span>
                        <span
                          className={cn(
                            "text-sm tabular-nums",
                            value === c.code
                              ? "text-brand-teal"
                              : "text-gray-400"
                          )}
                        >
                          {c.code}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
