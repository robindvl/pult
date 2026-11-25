import Link from "next/link";
import { GapBadge } from "@/components/GapBadge";
import {
  company,
  dashboardGroups,
  getRole,
  groupLabels,
  metricsByGroup,
  sortedGaps,
} from "@/data/mock";
import { formatNumber } from "@/lib/format";

export default function MetricsIndexPage() {
  const withGaps = sortedGaps();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-stone-500">{company.periodLabel}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
          Все метрики
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Полный список строк дашборда. Красные — разрыв к плану месяца; клик —
          карточка метрики и ответственный.
        </p>
      </header>

      {dashboardGroups.map((group) => {
        const rows = metricsByGroup(group);
        return (
          <section key={group}>
            <h2 className="mb-3 text-lg font-semibold text-stone-900">
              {groupLabels[group]}
            </h2>
            <ul className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200 bg-white">
              {rows.map((metric) => {
                const gapRow = withGaps.find((m) => m.id === metric.id)!;
                const owner = getRole(metric.ownerId);
                return (
                  <li key={metric.id}>
                    <Link
                      href={`/metrics/${metric.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition hover:bg-stone-50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900">
                          {metric.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          Ответственный: {owner?.person} · факт{" "}
                          {formatNumber(metric.month.fact, metric.unit)} / план{" "}
                          {formatNumber(metric.month.plan, metric.unit)}
                        </p>
                      </div>
                      <GapBadge
                        gap={gapRow.gap}
                        negative={gapRow.negative}
                        size="sm"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <Link
        href="/#all-metrics"
        className="inline-flex text-sm font-medium text-teal-800 underline-offset-2 hover:underline"
      >
        ← Вернуться к таблице дашборда
      </Link>
    </div>
  );
}
