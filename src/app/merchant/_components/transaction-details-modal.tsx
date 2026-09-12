import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, XCircle, Clock, RefreshCw, ArrowUpCircle, AlertTriangle } from "lucide-react";
import type { MerchantTransaction } from "@/lib/merchant-mock-data";
import { formatGHS, formatDate } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = { txn: MerchantTransaction; onClose: () => void };

const statusConfig = {
  success: { icon: <CheckCircle2 className="size-4" />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  failed: { icon: <XCircle className="size-4" />, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  pending: { icon: <Clock className="size-4" />, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  processing: { icon: <RefreshCw className="size-4" />, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  reversed: { icon: <ArrowUpCircle className="size-4" />, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
};

const timelineSteps = (txn: MerchantTransaction) => [
  { label: "Initiated", time: txn.createdAt, done: true },
  { label: "Processing", time: new Date(new Date(txn.createdAt).getTime() + 2000).toISOString(), done: txn.status !== "pending" },
  {
    label: txn.status === "failed" ? "Failed" : txn.status === "reversed" ? "Reversed" : "Completed",
    time: new Date(new Date(txn.createdAt).getTime() + 8000).toISOString(),
    done: ["success", "failed", "reversed"].includes(txn.status),
    error: txn.status === "failed",
  },
];

export default function TransactionDetail({ txn, onClose }: Props) {
  const sc = statusConfig[txn.status];
  const steps = timelineSteps(txn);

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm m-0"
        style={{ margin: 0 }}
        onClick={onClose}
      />
      {/* Drawer */}
      <motion.div
        key="drawer"
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 h-screen w-full max-w-120 bg-card border-l border-border z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-bold text-base" style={{ fontFamily: "var(--font-heading)" }}>Transaction Detail</h2>
            <p className="font-mono text-xs text-muted-foreground">{txn.reference}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/60 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 pb-20 md:pb-5">
          {/* Status + Amount */}
          <div className={cn("flex items-center gap-4 p-4 rounded-xl border", sc.bg)}>
            <div className={cn("p-2 rounded-lg", sc.color)}>{sc.icon}</div>
            <div>
              <p className={cn("font-bold text-2xl", sc.color)} style={{ fontFamily: "var(--font-heading)" }}>
                {formatGHS(txn.amount)}
              </p>
              <p className={cn("text-xs font-medium capitalize", sc.color)}>{txn.status} · {txn.type}</p>
            </div>
          </div>

          {/* Amounts breakdown */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-2.5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Amount Breakdown</h3>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gross amount</span><span className="font-medium">{formatGHS(txn.amount)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">NamibraPay fee</span><span className="text-destructive">-{formatGHS(txn.fee)}</span></div>
            <div className="flex justify-between text-sm border-t border-border pt-2 mt-2"><span className="font-semibold">Net amount</span><span className="font-bold text-emerald-600">{formatGHS(txn.net)}</span></div>
          </div>

          {/* Payer */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payer Details</h3>
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Identifier</span><span className="font-medium">{txn.payerIdentifier}</span></div>
              {txn.subMerchantName && (
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sub-merchant</span><span className="font-medium">{txn.subMerchantName}</span></div>
              )}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="font-medium">{formatDate(txn.createdAt)}</span></div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timeline</h3>
            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn("size-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                      step.done
                        ? step.error ? "bg-red-50 border-red-400" : "bg-emerald-50 border-emerald-400"
                        : "bg-muted border-border")}>
                      {step.done
                        ? step.error
                          ? <XCircle className="size-3 text-red-500" />
                          : <CheckCircle2 className="size-3 text-emerald-500" />
                        : <div className="size-2 rounded-full bg-border" />}
                    </div>
                    {i < steps.length - 1 && <div className={cn("w-px h-6 mt-0.5", step.done ? "bg-emerald-200" : "bg-border")} />}
                  </div>
                  <div className="pb-4">
                    <p className={cn("text-sm font-medium", step.error ? "text-red-600" : step.done ? "text-foreground" : "text-muted-foreground")}>
                      {step.label}
                    </p>
                    {step.done && <p className="text-[11px] text-muted-foreground">{formatDate(step.time)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Failure reason */}
          {txn.failureReason && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Failure Reason</p>
                <p className="text-xs text-red-600 mt-0.5">{txn.failureReason}</p>
              </div>
            </div>
          )}

          {/* Provider info intentionally hidden */}
          <div className="bg-muted/20 border border-border/50 rounded-xl p-3 flex items-center gap-2">
            <div className="size-5 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0">
              <span className="text-[8px] font-bold text-[#1a6e6c]">i</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Payment routing details are managed by NamibraPay and not visible to merchants.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
