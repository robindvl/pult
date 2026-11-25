import Link from "next/link";
import type { Role } from "@/data/mock";
import { blockLabels, getMetric } from "@/data/mock";
import { formatNumber, gapPercent, isNegativeGap } from "@/lib/format";
import { GapBadge } from "./GapBadge";

export function OrgCard({ role }: { role: Role }) {
  const linked = role.metricIds
    .map((id) => getMetric(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-stone-600">
            {blockLabels[role.block]}
          </span>
          <h3 className="mt-2 text-base font-semibold text-stone-900">
            {role.title}
          </h3>
          <p className="mt-1 text-sm text-stone-500">{role.person}</p>
        </div>
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-medium ${
            role.working
              ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200"
              : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
          }`}
        >
          {role.working ? "работает" : "не работает"}
        </span>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-400">
            ЦКП · ценный конечный продукт
          </p>
          <p className="mt-1 text-stone-800">{role.ckp}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Риск, если функция не работает
          </p>
          <p className="mt-1 text-stone-700">{role.risk}</p>
        </div>
      </div>

      {linked.length > 0 ? (
        <div className="mt-5 border-t border-stone-100 pt-4">
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Метрики дашборда
          </p>
          <ul className="mt-2 space-y-2">
            {linked.map((metric) => {
              const gap = gapPercent(metric.month.plan, metric.month.fact);
              const negative = isNegativeGap(gap, metric.higherIsBetter);
              return (
                <li key={metric.id}>
                  <Link
                    href={`/metrics/${metric.id}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition hover:bg-stone-50"
                  >
                    <span className="text-sm text-stone-700">
                      {metric.name}{" "}
                      <span className="tabular-nums text-stone-400">
                        {formatNumber(metric.month.fact, metric.unit)}
                      </span>
                    </span>
                    <GapBadge gap={gap} negative={negative} size="sm" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
