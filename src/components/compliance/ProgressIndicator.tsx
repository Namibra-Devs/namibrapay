interface ProgressIndicatorProps {
  completed: number;
  total: number;
}

export default function ProgressIndicator({ completed, total }: ProgressIndicatorProps) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="flex flex-col items-end gap-2 pt-1">
      <div className="w-28 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">
        {completed} of {total} complete
      </p>
    </div>
  );
}
