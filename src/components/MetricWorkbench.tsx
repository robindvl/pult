"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GapBadge } from "@/components/GapBadge";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import {
  childMetrics,
  getRole,
  groupLabels,
  type Metric,
} from "@/data/mock";
import { formatNumber, gapPercent, isNegativeGap } from "@/lib/format";
import { usePult } from "@/lib/pult-store";
import { buildSignals, signalLabels } from "@/lib/signals";

export function MetricWorkbench({ metricId }: { metricId: string }) {
  const router = useRouter();
  const {
    metrics,
    setMonthFact,
    createDihaFromMetric,
    hasDihaForMetric,
    monthLabel,
    elapsed,
    resetFacts,
  } = usePult();

  const metric = metrics.find((m) => m.id === metricId);
  if (!metric) {
    return (
      <p className="text-sm text-stone-600">
        Метрика не найдена.{" "}
        <Link href="/" className="text-teal-800 underline">
          На дашборд
        </Link>
      </p>
    );
  }

  const owner = getRole(metric.ownerId);
  const signals = buildSignals(metric, metric.month.fact, elapsed);
  const labels = signalLabels(metric, signals);
  const parent = metric.parentId
    ? metrics.find((m) => m.id === metric.parentId)
    : undefined;
  const children = childMetrics(metric.id)
    .map((c) => metrics.find((m) => m.id === c.id))
    .filter((m): m is Metric => Boolean(m));
  const maxFact = Math.max(
    ...metric.history.map((h) => Math.max(h.plan, h.fact)),
    1,
  );
  const already = hasDihaForMetric(metric.id);

  return (
    <div className="space-y-8">
      <header>
        <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-stone-800">
            Дашборд
          </Link>
          <span>/</span>
          <span>{groupLabels[metric.group]}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
              {metric.name}
            </h1>
            <p className="mt-2 text-sm text-stone-600">{metric.formula}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <GapBadge
              gap={signals.planGap}
              negative={signals.planNegative}
              size="lg"
            />
            <MonthSwitcher compact />
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-teal-900/70">
              Факт · {monthLabel} · редактируется здесь
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <input
                type="number"
                className="w-40 rounded-lg border border-teal-300 bg-white px-3 py-2 text-2xl font-semibold tabular-nums text-stone-900 outline-none ring-teal-700 focus:ring-2"
                value={metric.month.fact}
                step="any"
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!Number.isNaN(next)) setMonthFact(metric.id, next);
                }}
              />
              <div className="text-sm text-stone-600">
                <p>
                  План:{" "}
                  <span className="font-medium tabular-nums text-stone-900">
                    {formatNumber(metric.month.plan, metric.unit)}
                  </span>
                </p>
                <p className="text-xs text-stone-500">
                  Порог: {formatNumber(metric.threshold, metric.unit)} · точка Б:{" "}
                  {formatNumber(metric.pointB, metric.unit)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {signals.earlyWarning ? (
              <button
                type="button"
                onClick={() => {
                  createDihaFromMetric(metric.id);
                  router.push("/weekly");
                }}
                className="rounded-lg bg-teal-800 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-900"
              >
                {already ? "Открыть DIHA" : "Создать DIHA"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={resetFacts}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
            >
              Сбросить факт месяца
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-stone-700 ring-1 ring-stone-200">
            {labels.plan}
          </span>
          {labels.vsPrev ? (
            <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-stone-700 ring-1 ring-stone-200">
              {labels.vsPrev}
            </span>
          ) : null}
          <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-stone-700 ring-1 ring-stone-200">
            {labels.toB}
          </span>
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              signals.thresholdBroken
                ? "bg-red-100 text-red-800 ring-red-300"
                : "bg-white text-stone-700 ring-stone-200"
            }`}
          >
            {labels.threshold}
          </span>
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              signals.willMissPlan
                ? "bg-amber-50 text-amber-900 ring-amber-200"
                : "bg-emerald-50 text-emerald-800 ring-emerald-200"
            }`}
          >
            {labels.forecast}
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-stone-400">
            План года
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-stone-900">
            {formatNumber(metric.yearPlan, metric.unit)}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Факт года
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-stone-900">
            {formatNumber(metric.yearFact, metric.unit)}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Ответственный
          </p>
          <p className="mt-2 text-lg font-semibold text-stone-900">
            {owner?.person ?? "—"}
          </p>
          <p className="text-sm text-stone-500">{owner?.title}</p>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="text-base font-semibold text-stone-900">
          История 5 недель
        </h2>
        <div className="mt-5 space-y-3">
          {metric.history.map((point) => {
            const planWidth = Math.max(4, (point.plan / maxFact) * 100);
            const factWidth = Math.max(4, (point.fact / maxFact) * 100);
            const pointGap = gapPercent(point.plan, point.fact);
            const pointNegative = isNegativeGap(pointGap, metric.higherIsBetter);

            return (
              <div
                key={point.week}
                className="grid grid-cols-[3rem_1fr_auto] items-center gap-3"
              >
                <span className="text-xs font-medium text-stone-500">
                  {point.week}
                </span>
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-stone-100">
                    <div
                      className="h-2 rounded-full bg-stone-300"
                      style={{ width: `${planWidth}%` }}
                    />
                  </div>
                  <div className="h-2.5 rounded-full bg-stone-100">
                    <div
                      className={`h-2.5 rounded-full ${
                        pointNegative ? "bg-red-500" : "bg-teal-700"
                      }`}
                      style={{ width: `${factWidth}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs tabular-nums text-stone-600">
                  {formatNumber(point.fact, metric.unit)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {parent ? (
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-stone-400">
              Родительская метрика
            </p>
            <Link
              href={`/metrics/${parent.id}`}
              className="mt-2 inline-flex text-sm font-medium text-teal-800 underline-offset-2 hover:underline"
            >
              {parent.name}
            </Link>
          </div>
        ) : null}

        {children.length > 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white p-5 md:col-span-2">
            <p className="text-xs uppercase tracking-wide text-stone-400">
              Декомпозиция
            </p>
            <ul className="mt-3 space-y-2">
              {children.map((child) => {
                const childSignals = buildSignals(
                  child,
                  child.month.fact,
                  elapsed,
                );
                return (
                  <li key={child.id}>
                    <Link
                      href={`/metrics/${child.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition hover:bg-stone-50"
                    >
                      <span className="text-sm text-stone-800">{child.name}</span>
                      <GapBadge
                        gap={childSignals.planGap}
                        negative={childSignals.planNegative}
                        size="sm"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/weekly"
          className="text-sm text-teal-800 underline-offset-2 hover:underline"
        >
          Открыть DIHA →
        </Link>
        <Link
          href="/org"
          className="text-sm text-teal-800 underline-offset-2 hover:underline"
        >
          Функции конвейера →
        </Link>
      </div>
    </div>
  );
}
