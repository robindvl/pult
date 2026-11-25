import type { Metric } from "@/data/mock";
import { completionPercent, gapPercent } from "@/data/mock";
import { formatGap, formatNumber, isNegativeGap } from "@/lib/format";

/** Доля месяца по умолчанию (если период не передан). */
export const MONTH_ELAPSED = 0.55;

export interface MetricSignals {
  monthFact: number;
  planPct: number;
  planGap: number;
  planNegative: boolean;
  prevFact: number | null;
  vsPrevGap: number | null;
  vsPrevNegative: boolean | null;
  toBPct: number;
  thresholdBroken: boolean;
  projected: number;
  willMissPlan: boolean;
  earlyWarning: boolean;
}

export function previousFact(metric: Metric): number | null {
  if (metric.history.length < 2) return null;
  return metric.history[metric.history.length - 2].fact;
}

export function buildSignals(
  metric: Metric,
  monthFact: number,
  elapsed: number = MONTH_ELAPSED,
): MetricSignals {
  const plan = metric.month.plan;
  const planGap = gapPercent(plan, monthFact);
  const planNegative = isNegativeGap(planGap, metric.higherIsBetter);
  const planPct = completionPercent(plan, monthFact, metric.higherIsBetter);

  const prev = previousFact(metric);
  const vsPrevGap = prev === null ? null : gapPercent(prev, monthFact);
  const vsPrevNegative =
    vsPrevGap === null
      ? null
      : isNegativeGap(vsPrevGap, metric.higherIsBetter);

  const toBPct = completionPercent(
    metric.pointB,
    metric.yearFact,
    metric.higherIsBetter,
  );

  const thresholdBroken = metric.higherIsBetter
    ? monthFact < metric.threshold
    : monthFact > metric.threshold;

  const safeElapsed = Math.max(0.05, Math.min(1, elapsed));
  const projected = monthFact / safeElapsed;
  // Для закрытого месяца (elapsed=1) «не успеем» = просто факт < плана
  const willMissPlan = metric.higherIsBetter
    ? projected < plan
    : projected > plan;

  const earlyWarning = willMissPlan || thresholdBroken || planNegative;

  return {
    monthFact,
    planPct,
    planGap,
    planNegative,
    prevFact: prev,
    vsPrevGap,
    vsPrevNegative,
    toBPct,
    thresholdBroken,
    projected,
    willMissPlan,
    earlyWarning,
  };
}

export function signalLabels(metric: Metric, s: MetricSignals) {
  return {
    plan: `${s.planPct.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}% плана`,
    vsPrev:
      s.vsPrevGap === null
        ? null
        : `${formatGap(s.vsPrevGap)} к пред. неделе`,
    toB: `${s.toBPct.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}% к точке Б`,
    threshold: `порог ${formatNumber(metric.threshold, metric.unit)}`,
    forecast: s.willMissPlan
      ? `прогноз ${formatNumber(s.projected, metric.unit)} — не успеем к плану`
      : `прогноз ${formatNumber(s.projected, metric.unit)} — в темпе плана`,
  };
}
