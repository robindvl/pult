"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  completionPercent,
  dashboardGroups,
  getRole,
  groupLabels,
  type Metric,
} from "@/data/mock";
import { formatNumber } from "@/lib/format";
import { usePult } from "@/lib/pult-store";
import { buildSignals, signalLabels } from "@/lib/signals";
import { MonthSwitcher } from "./MonthSwitcher";

function pctClass(pct: number): string {
  if (pct >= 100) return "bg-emerald-500";
  if (pct >= 85) return "bg-amber-400";
  return "bg-red-500";
}

function pctText(pct: number): string {
  if (pct >= 100) return "text-emerald-700";
  if (pct >= 85) return "text-amber-700";
  return "text-red-700";
}

function PctCell({
  plan,
  fact,
  higherIsBetter,
}: {
  plan: number;
  fact: number;
  higherIsBetter: boolean;
}) {
  const pct = completionPercent(plan, fact, higherIsBetter);
  const width = Math.min(100, Math.max(4, pct));

  return (
    <div className="min-w-[5.5rem]">
      <span className={`text-xs font-semibold tabular-nums ${pctText(pct)}`}>
        {pct.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}%
      </span>
      <div className="mt-1 h-1.5 rounded-full bg-stone-100">
        <div
          className={`h-1.5 rounded-full ${pctClass(pct)}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function MetricRow({
  metric,
  striped,
  personal,
}: {
  metric: Metric;
  striped: boolean;
  personal?: boolean;
}) {
  const router = useRouter();
  const { createDihaFromMetric, hasDihaForMetric, elapsed } = usePult();
  const owner = getRole(metric.ownerId);
  const signals = buildSignals(metric, metric.month.fact, elapsed);
  const labels = signalLabels(metric, signals);
  const already = hasDihaForMetric(metric.id);

  return (
    <tr
      className={`border-b border-stone-100 ${
        personal
          ? "bg-orange-50/80"
          : striped
            ? "bg-stone-50/70"
            : "bg-white"
      } ${signals.earlyWarning ? "outline outline-1 -outline-offset-1 outline-red-200/80" : ""}`}
    >
      <td className="sticky left-0 z-10 bg-inherit px-3 py-2.5 align-top">
        <Link
          href={`/metrics/${metric.id}`}
          className="text-sm font-medium text-stone-900 underline-offset-2 hover:text-teal-800 hover:underline"
        >
          {metric.name}
        </Link>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {signals.planNegative ? (
            <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700 ring-1 ring-inset ring-red-200">
              {labels.plan}
            </span>
          ) : null}
          {labels.vsPrev && signals.vsPrevNegative ? (
            <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-800 ring-1 ring-inset ring-orange-200">
              {labels.vsPrev}
            </span>
          ) : null}
          {signals.thresholdBroken ? (
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-800 ring-1 ring-inset ring-red-300">
              порог
            </span>
          ) : null}
          {signals.willMissPlan ? (
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-900 ring-1 ring-inset ring-amber-200">
              не успеем
            </span>
          ) : null}
        </div>
      </td>
      <td className="px-3 py-2.5 text-right text-sm tabular-nums text-stone-700 align-top">
        {formatNumber(metric.yearPlan, metric.unit)}
        <span className="mt-1 block text-[10px] text-stone-400">
          Б: {formatNumber(metric.pointB, metric.unit)}
        </span>
      </td>
      <td className="px-3 py-2.5 text-sm text-stone-800 align-top">
        {owner?.person ?? "—"}
        <span className="block text-xs text-stone-500">{owner?.title}</span>
      </td>
      <td className="px-3 py-2.5 text-right text-sm font-medium tabular-nums text-stone-900 align-top">
        {formatNumber(metric.yearFact, metric.unit)}
        <span className="mt-1 block text-[10px] text-stone-500">
          {labels.toB}
        </span>
      </td>
      <td className="px-3 py-2.5 align-top">
        <PctCell
          plan={metric.yearPlan}
          fact={metric.yearFact}
          higherIsBetter={metric.higherIsBetter}
        />
      </td>
      <td className="px-3 py-2.5 text-right text-sm tabular-nums text-stone-600 align-top">
        {formatNumber(metric.month.plan, metric.unit)}
      </td>
      <td className="px-3 py-2.5 text-right align-top">
        <Link
          href={`/metrics/${metric.id}`}
          className="inline-block rounded-md px-1.5 py-0.5 text-sm font-medium tabular-nums text-stone-900 underline-offset-2 hover:bg-teal-50 hover:text-teal-900 hover:underline"
          title="Открыть метрику и изменить факт"
        >
          {formatNumber(metric.month.fact, metric.unit)}
        </Link>
        <p className="mt-1 text-[10px] text-stone-400">
          править на странице метрики
        </p>
      </td>
      <td className="px-3 py-2.5 align-top">
        <PctCell
          plan={metric.month.plan}
          fact={metric.month.fact}
          higherIsBetter={metric.higherIsBetter}
        />
      </td>
      <td className="px-3 py-2.5 align-top">
        {signals.earlyWarning ? (
          <button
            type="button"
            onClick={() => {
              createDihaFromMetric(metric.id);
              router.push("/weekly");
            }}
            className="rounded-md bg-teal-800 px-2 py-1 text-[11px] font-medium text-white hover:bg-teal-900"
          >
            {already ? "Открыть DIHA" : "В DIHA"}
          </button>
        ) : (
          <span className="text-[11px] text-stone-400">ок</span>
        )}
      </td>
    </tr>
  );
}

export function DashboardTable() {
  const { metrics, resetFacts, ready, monthLabel } = usePult();

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-stone-900">
            Таблица метрик · {monthLabel}
          </p>
          <p className="text-xs text-stone-500">
            Переключай месяц и правь факт → сигналы пересчитаются
            {!ready ? " · загрузка…" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MonthSwitcher />
          <button
            type="button"
            onClick={resetFacts}
            className="rounded-md border border-stone-300 px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-50"
          >
            Сбросить факты месяца
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1080px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-[11px] uppercase tracking-wide text-stone-500">
              <th className="sticky left-0 z-10 bg-stone-50 px-3 py-3 font-medium">
                Метрика / сигналы
              </th>
              <th className="px-3 py-3 text-right font-medium">План года / Б</th>
              <th className="px-3 py-3 font-medium">Ответственный</th>
              <th className="px-3 py-3 text-right font-medium">Факт года</th>
              <th className="px-3 py-3 font-medium">% года</th>
              <th className="px-3 py-3 text-right font-medium">
                {monthLabel} план
              </th>
              <th className="px-3 py-3 text-right font-medium">Факт</th>
              <th className="px-3 py-3 font-medium">%</th>
              <th className="px-3 py-3 font-medium">Действие</th>
            </tr>
          </thead>
          <tbody>
            {dashboardGroups.map((group) => {
              const rows = metrics.filter((m) => m.group === group);
              return (
                <GroupBlock key={group} group={group} rows={rows} />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GroupBlock({
  group,
  rows,
}: {
  group: (typeof dashboardGroups)[number];
  rows: Metric[];
}) {
  return (
    <>
      <tr className="border-b border-stone-200 bg-stone-100/90">
        <td
          colSpan={9}
          className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-stone-600"
        >
          {groupLabels[group]}
        </td>
      </tr>
      {rows.map((metric, i) => (
        <MetricRow
          key={metric.id}
          metric={metric}
          striped={i % 2 === 1}
          personal={group === "personal"}
        />
      ))}
    </>
  );
}
