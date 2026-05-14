import { ArrowUpRight, Clock } from "lucide-react";

interface PendingPayoutPanelProps {
  amount?: number;
  currency?: string;
}

export default function PendingPayoutPanel({ amount, currency = "GHS" }: PendingPayoutPanelProps) {
  const hasPending = amount !== undefined && amount > 0;

  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-brand-teal/10 flex items-center justify-center shrink-0">
          <Clock className="w-3.5 h-3.5 text-brand-teal" />
        </div>
        <h2 className="text-sm font-semibold text-gray-900">Pending Payout</h2>
      </div>

      {hasPending ? (
        <div>
          <p className="text-2xl font-bold text-gray-900 font-heading">
            {currency}{" "}
            {amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Scheduled for your next settlement cycle.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 leading-relaxed">
            There&apos;s no pending payout for your business.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors"
          >
            Learn more
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
