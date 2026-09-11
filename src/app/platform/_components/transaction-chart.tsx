'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TooltipProps } from "recharts";
import { formatGHS } from "@/lib/constants";
import { mockChartData } from "@/lib/mock-data";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import DateRangePicker from "@/components/ui/date-range-picker";

const ranges = ["7d", "14d", "30d", "Custom"] as const;
type Range = (typeof ranges)[number];

type ChartPayloadItem = {
  name?: string;
  value?: number;
  color?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps<number, string> & { payload?: ChartPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-4 py-3 text-xs space-y-1.5">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{p.name === "Volume" ? formatGHS(p.value ?? 0) : (p.value ?? 0).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function TransactionChart() {
  const [range, setRange] = useState<Range>("7d");
  const [showCustom, setShowCustom] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Filter chart data based on selected range or custom dates
  const filteredData = useMemo(() => {
    if (range === "Custom" && customStartDate && customEndDate) {
      // Filter by custom date range
      return mockChartData.filter(item => {
        // Parse the date string (e.g., "05 Sep") and create a comparable date
        const itemDate = new Date(item.date + " 2026"); // Add year for proper parsing
        const start = new Date(customStartDate + "T00:00:00");
        const end = new Date(customEndDate + "T23:59:59");
        return itemDate >= start && itemDate <= end;
      });
    }
    
    const days = range === "7d" ? 7 : range === "14d" ? 14 : range === "30d" ? 30 : mockChartData.length;
    return mockChartData.slice(-days);
  }, [range, customStartDate, customEndDate]);

  const handleRangeClick = (r: Range) => {
    if (r === "Custom") {
      setShowCustom(true);
      setRange(r);
    } else {
      setRange(r);
      setShowCustom(false);
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  const handleCustomDateChange = (start: string, end: string) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setShowCustom(false);
  };

  const handleCustomCancel = () => {
    setShowCustom(false);
    if (!customStartDate || !customEndDate) {
      setRange("7d");
    }
  };

  const formatDateRangeText = () => {
    if (range === "Custom" && customStartDate && customEndDate) {
      const start = new Date(customStartDate + "T00:00:00");
      const end = new Date(customEndDate + "T00:00:00");
      return `${start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} - ${end.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
    }
    return range !== "Custom" ? `Last ${range}` : "";
  };

  // Calculate min and max dates for the date picker (based on available mock data)
  const today = new Date();
  const minDate = new Date();
  minDate.setDate(today.getDate() - 29); // 30 days of data
  const minDateStr = minDate.toISOString().split("T")[0];
  const maxDateStr = today.toISOString().split("T")[0];

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h3 className="font-semibold text-base" style={{ fontFamily: "var(--font-heading)" }}>
            Transaction Volume
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            <span className="hidden sm:inline">Successful vs failed transactions </span>
            {formatDateRangeText() && `${formatDateRangeText()}`}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
          {/* Range Selector Buttons */}
          <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-0.5 overflow-x-auto">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => handleRangeClick(r)}
                className={cn(
                  "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap shrink-0",
                  range === r
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          
          {/* Custom Date Range Picker */}
          {showCustom && (
            <div className="w-full sm:w-64">
              <DateRangePicker
                startDate={customStartDate}
                endDate={customEndDate}
                onChange={handleCustomDateChange}
                onCancel={handleCustomCancel}
                placeholder="Select custom range"
                min={minDateStr}
                max={maxDateStr}
              />
            </div>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={filteredData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradSuccessful" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64c6c3" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#64c6c3" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradFailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffb4b0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ffb4b0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} 
            axisLine={false} 
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            wrapperStyle={{ paddingTop: "12px" }}
          />
          <Area
            type="monotone"
            dataKey="successful"
            name="Successful"
            stroke="#64c6c3"
            strokeWidth={2}
            fill="url(#gradSuccessful)"
            dot={false}
            activeDot={{ r: 4, fill: "#64c6c3" }}
          />
          <Area
            type="monotone"
            dataKey="failed"
            name="Failed"
            stroke="#ffb4b0"
            strokeWidth={2}
            fill="url(#gradFailed)"
            dot={false}
            activeDot={{ r: 4, fill: "#ffb4b0" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}