"use client";

import { periods } from "@/data/mock";
import { usePult } from "@/lib/pult-store";

export function MonthSwitcher({ compact = false }: { compact?: boolean }) {
  const { monthId, setMonthId, elapsed } = usePult();

  return (
    <div className={compact ? "flex flex-col gap-1" : "flex flex-col gap-2"}>
      <div className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5 shadow-sm">
        {periods.map((period) => {
          const active = period.id === monthId;
          return (
            <button
              key={period.id}
              type="button"
              onClick={() => setMonthId(period.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-teal-800 text-white"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              {compact ? period.short : period.label}
            </button>
          );
        })}
      </div>
      {!compact ? (
        <p className="text-[11px] text-stone-500">
          {elapsed >= 1
            ? "Месяц закрыт · прогноз = факт к плану"
            : `Месяц идёт · прошло ~${Math.round(elapsed * 100)}% · считаем «не успеем»`}
        </p>
      ) : null}
    </div>
  );
}
