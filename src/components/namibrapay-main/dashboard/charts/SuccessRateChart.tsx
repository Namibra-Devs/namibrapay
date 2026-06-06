"use client";

import { HelpCircle } from "lucide-react";
import { RadialBarChart, RadialBar } from "recharts";
import { mockSuccessRateData } from "@/lib/mock-data/dashboard";

const SIZE = 144; // w-36 = 9rem = 144px

export default function SuccessRateChart() {
  const { rate, successCount, failedCount } = mockSuccessRateData;
  const hasData = successCount + failedCount > 0;

  const chartData = [
    { name: "background", value: 100, fill: "#f1f5f9" },
    { name: "success", value: rate, fill: "#64c6c3" },
  ];

  return (
    <div className="bg-white/88 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Success Rate</h3>
        <span className="group relative cursor-help">
          <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-52 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
            This chart shows how many attempted transactions become successful
          </span>
        </span>
      </div>

      {hasData ? (
        <div className="flex flex-col items-center flex-1 justify-center">
          <div className="relative w-36 h-36">
            <RadialBarChart
              width={SIZE}
              height={SIZE}
              cx={SIZE / 2}
              cy={SIZE / 2}
              innerRadius={46}
              outerRadius={68}
              startAngle={90}
              endAngle={-270}
              data={chartData}
              barSize={10}
            >
              <RadialBar dataKey="value" cornerRadius={8} />
            </RadialBarChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold font-heading text-gray-900">{rate}%</p>
              <p className="text-[11px] text-gray-400">success</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-teal shrink-0" />
              <span className="text-gray-500">{successCount.toLocaleString()} successful</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200 shrink-0" />
              <span className="text-gray-500">{failedCount.toLocaleString()} failed</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="w-24 h-24 rounded-full border-10 border-gray-100 flex items-center justify-center mb-3">
            <span className="text-sm font-semibold text-gray-300">—</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            This chart shows how many attempted transactions become successful
          </p>
        </div>
      )}
    </div>
  );
}
