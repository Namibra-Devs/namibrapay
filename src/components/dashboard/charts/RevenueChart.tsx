"use client";

import { useState } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockRevenueData } from "@/lib/mock-data/dashboard";

const currencies = ["GHS", "USD", "EUR", "GBP"];

function formatRevenue(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-400 mb-0.5">{label}</p>
      <p className="font-semibold text-gray-900">
        GHS {payload[0].value.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default function RevenueChart() {
  const [currency, setCurrency] = useState("GHS");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const total = mockRevenueData.reduce((sum, d) => sum + d.revenue, 0);
  const hasData = total > 0;

  const transactionCount = mockRevenueData.filter((d) => d.revenue > 0).length;

  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1 relative">
        <TrendingUp className="w-4 h-4 text-gray-400" />
        <div className="relative">
          <button
            onClick={() => setCurrencyOpen((v) => !v)}
            className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Revenue {currency}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {currencyOpen && (
            <div className="absolute left-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-xl shadow-lg z-10 fade-in overflow-hidden">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-gray-50 ${c === currency ? "text-brand-teal" : "text-gray-700"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue total */}
      <div className="mb-4">
        <p className="text-3xl font-bold font-heading tracking-tight text-gray-900">
          {hasData
            ? total.toLocaleString("en-GH", { minimumFractionDigits: 2 })
            : "0"}
        </p>
      </div>

      {/* Chart area */}
      {hasData ? (
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockRevenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64c6c3" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#64c6c3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                interval={5}
              />
              <YAxis
                tickFormatter={formatRevenue}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#64c6c3"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#64c6c3", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-36 flex items-center justify-center">
          <p className="text-sm text-gray-400">No activity for this period</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
        <span>{transactionCount} transactions</span>
        <span className="text-gray-300">·</span>
        <span>
          0 abandoned
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-[9px] text-gray-400 ml-1 cursor-help">?</span>
        </span>
      </div>
    </div>
  );
}
