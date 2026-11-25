"use client";

import Link from "next/link";
import { GapBadge } from "@/components/GapBadge";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { formatNumber, gapPercent, isNegativeGap } from "@/lib/format";
import { usePult } from "@/lib/pult-store";
import { buildSignals } from "@/lib/signals";

export function DashboardHero() {
  const { metrics, createDihaFromMetric, monthLabel, elapsed } = usePult();
  const personal = metrics.find((m) => m.id === "personal_profit")!;
  const gap = gapPercent(personal.month.plan, personal.month.fact);
  const negative = isNegativeGap(gap, personal.higherIsBetter);
  const personalSignals = buildSignals(personal, personal.month.fact, elapsed);

  const red = metrics
    .map((m) => ({
      metric: m,
      signals: buildSignals(m, m.month.fact, elapsed),
    }))
    .filter((x) => x.signals.earlyWarning)
    .sort((a, b) => Math.abs(b.signals.planGap) - Math.abs(a.signals.planGap))
    .slice(0, 4);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-600">
          Период управления: <span className="font-medium text-stone-900">{monthLabel}</span>
        </p>
        <MonthSwitcher />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
          <p className="text-sm text-stone-600">
            Личная прибыль · {monthLabel} (деньги собственника)
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <p className="text-3xl font-semibold tracking-tight text-stone-900 tabular-nums">
              {formatNumber(personal.month.fact, "rub")}
            </p>
            <GapBadge gap={gap} negative={negative} size="lg" />
          </div>
          <p className="mt-2 text-sm tabular-nums text-stone-500">
            План месяца {formatNumber(personal.month.plan, "rub")} · точка Б{" "}
            {formatNumber(personal.pointB, "rub")}
          </p>
          {personalSignals.willMissPlan || personalSignals.thresholdBroken ? (
            <p className="mt-3 text-sm font-medium text-red-700">
              Ранний сигнал:{" "}
              {personalSignals.thresholdBroken
                ? "пробит порог"
                : elapsed < 1
                  ? "при текущем темпе план месяца не успеем"
                  : "месяц закрыт ниже плана"}
            </p>
          ) : (
            <p className="mt-3 text-sm text-emerald-800">
              Темп к плану месяца выглядит нормально
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-stone-900">
                Куда смотреть сегодня
              </p>
              <p className="mt-0.5 text-xs text-stone-500">
                Красные разрывы · {monthLabel}
              </p>
            </div>
            <Link
              href="/weekly"
              className="shrink-0 text-xs font-medium text-teal-800 underline-offset-2 hover:underline"
            >
              DIHA
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {red.map(({ metric, signals }) => (
              <li
                key={metric.id}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-stone-50"
              >
                <Link
                  href={`/metrics/${metric.id}`}
                  className="min-w-0 flex-1 text-sm text-stone-700"
                >
                  {metric.name}
                  <span className="mt-0.5 block text-[10px] text-stone-400">
                    {signals.willMissPlan
                      ? elapsed < 1
                        ? "не успеем к плану"
                        : "месяц ниже плана"
                      : signals.thresholdBroken
                        ? "порог"
                        : "разрыв к плану"}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => createDihaFromMetric(metric.id)}
                  className="shrink-0 rounded-md bg-teal-800 px-2 py-1 text-[11px] font-medium text-white hover:bg-teal-900"
                >
                  В DIHA
                </button>
                <GapBadge
                  gap={signals.planGap}
                  negative={signals.planNegative}
                  size="sm"
                />
              </li>
            ))}
            {red.length === 0 ? (
              <li className="text-sm text-stone-500">Красных сигналов нет</li>
            ) : null}
          </ul>
        </div>
      </div>
    </section>
  );
}
