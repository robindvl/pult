"use client";

import Link from "next/link";
import { GapBadge } from "@/components/GapBadge";
import { formatNumber } from "@/lib/format";
import { usePult } from "@/lib/pult-store";
import { buildSignals } from "@/lib/signals";

export function WeeklyRedList() {
  const { metrics, createDihaFromMetric, elapsed } = usePult();

  const red = metrics
    .map((m) => ({
      metric: m,
      signals: buildSignals(m, m.month.fact, elapsed),
    }))
    .filter((x) => x.signals.earlyWarning)
    .sort((a, b) => Math.abs(b.signals.planGap) - Math.abs(a.signals.planGap))
    .slice(0, 6);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {red.map(({ metric, signals }) => (
        <div
          key={metric.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3"
        >
          <Link href={`/metrics/${metric.id}`} className="min-w-0 flex-1">
            <p className="text-sm font-medium text-stone-900">{metric.name}</p>
            <p className="text-xs text-stone-500 tabular-nums">
              {formatNumber(metric.month.fact, metric.unit)} / план{" "}
              {formatNumber(metric.month.plan, metric.unit)}
              {signals.willMissPlan ? " · не успеем" : ""}
              {signals.thresholdBroken ? " · порог" : ""}
            </p>
          </Link>
          <button
            type="button"
            onClick={() => createDihaFromMetric(metric.id)}
            className="shrink-0 rounded-md bg-teal-800 px-2 py-1 text-[11px] font-medium text-white hover:bg-teal-900"
          >
            В DIHA
          </button>
          <GapBadge gap={signals.planGap} negative={signals.planNegative} />
        </div>
      ))}
      {red.length === 0 ? (
        <p className="text-sm text-stone-500 sm:col-span-2">
          Красных сигналов нет — попробуй ухудшить факт на дашборде.
        </p>
      ) : null}
    </div>
  );
}
