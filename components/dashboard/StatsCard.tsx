import type { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  progress?: number; // 0–100, renders a progress bar when provided
}

export default function StatsCard({
  icon,
  label,
  value,
  hint,
  progress,
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
        {icon}
      </span>

      <p className="mt-4 text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white tracking-tight">
        {value}
      </p>

      {typeof progress === "number" && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
