import Link from "next/link";
import { Wallet, History, ArrowUpRight } from "lucide-react";
import { mockBalance } from "@/lib/mock-data/dashboard";

export default function BalancePanel() {
  const { amount, currency, available } = mockBalance;

  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-5 flex flex-col gap-5">
      {/* Currency label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-teal/10">
            <Wallet className="w-4 h-4 text-brand-teal" />
          </div>
          <span className="text-sm font-semibold text-gray-700">{currency}</span>
        </div>
        <span className="text-xs text-gray-400 font-medium">Wallet</span>
      </div>

      {/* Balance */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Balance</p>
        <p className="text-3xl font-bold font-heading tracking-tight text-gray-900">
          {amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {available.toLocaleString("en-GH", { minimumFractionDigits: 2 })} Available
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Link
          href="/transactions"
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-gray-200/70 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300/70 transition-all duration-200 group"
        >
          <span className="flex items-center gap-2">
            <History className="w-4 h-4 text-gray-400 group-hover:text-brand-teal transition-colors" />
            View history
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-teal transition-colors" />
        </Link>

        <Link
          href="/payouts"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal/90 active:scale-[0.98] transition-all"
        >
          Topup
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
