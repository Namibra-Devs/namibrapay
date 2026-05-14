"use client";

import { HelpCircle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { mockPaymentIssuesData } from "@/lib/mock-data/dashboard";

const SIZE = 144; // w-36 = 9rem = 144px

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-400 mb-0.5">{item.name}</p>
      <p className="font-semibold text-gray-900">{item.value} transactions</p>
    </div>
  );
}

export default function PaymentIssuesChart() {
  const hasData = mockPaymentIssuesData.length > 0;
  const total = mockPaymentIssuesData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Payment Issues</h3>
        <span className="group relative cursor-help">
          <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-52 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
            This chart breaks down the reasons why your transactions fail
          </span>
        </span>
      </div>

      {hasData ? (
        <div className="flex flex-col items-center flex-1 justify-center">
          <div className="relative w-36 h-36">
            <PieChart width={SIZE} height={SIZE}>
              <Pie
                data={mockPaymentIssuesData}
                cx={SIZE / 2}
                cy={SIZE / 2}
                innerRadius={43}
                outerRadius={61}
                dataKey="count"
                nameKey="reason"
                strokeWidth={0}
              >
                {mockPaymentIssuesData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-bold font-heading text-gray-900">{total}</p>
              <p className="text-[11px] text-gray-400">issues</p>
            </div>
          </div>

          <div className="mt-4 w-full space-y-1.5">
            {mockPaymentIssuesData.map((item) => (
              <div key={item.reason} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.fill }} />
                  <span className="text-gray-500 truncate">{item.reason}</span>
                </div>
                <span className="font-medium text-gray-700 ml-2 shrink-0">
                  {Math.round((item.count / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="w-24 h-24 rounded-full border-10 border-gray-100 flex items-center justify-center mb-3">
            <span className="text-sm font-semibold text-gray-300">—</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            This chart breaks down the reasons why your transactions fail
          </p>
        </div>
      )}
    </div>
  );
}
