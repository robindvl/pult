"use client";

import Link from "next/link";
import { getMetric, getRole, type ActionStatus } from "@/data/mock";
import { usePult } from "@/lib/pult-store";

const statusLabel: Record<ActionStatus, string> = {
  todo: "К запуску",
  in_progress: "В работе",
  done: "Сделано",
};

const nextStatus: Record<ActionStatus, ActionStatus> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

export function DihaTable() {
  const { diha, setDihaStatus } = usePult();

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 px-4 py-3">
        <p className="text-sm font-semibold text-stone-900">
          Журнал разрывов (DIHA)
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Кликай статус, чтобы провести действие: к запуску → в работе →
          сделано. Новые строки появляются с дашборда кнопкой «В DIHA».
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold tracking-wide">
          {["D · Данные", "I · Инсайт", "H · Гипотеза", "A · Действие"].map(
            (label) => (
              <span
                key={label}
                className="rounded-md bg-teal-800 px-2 py-1 text-white"
              >
                {label}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-[11px] uppercase tracking-wide text-stone-500">
              <th className="px-3 py-3 font-medium">Данные</th>
              <th className="px-3 py-3 font-medium">Инсайт</th>
              <th className="px-3 py-3 font-medium">Гипотеза</th>
              <th className="px-3 py-3 font-medium">Действие</th>
              <th className="px-3 py-3 font-medium">Ожидаемый результат</th>
              <th className="px-3 py-3 font-medium">Ответственный</th>
              <th className="px-3 py-3 font-medium">Срок</th>
              <th className="px-3 py-3 font-medium">Часы</th>
              <th className="px-3 py-3 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {diha.map((item, i) => {
              const owner = getRole(item.ownerId);
              const metric = getMetric(item.metricId);

              return (
                <tr
                  key={item.id}
                  className={`border-b border-stone-100 align-top ${
                    i % 2 ? "bg-stone-50/70" : "bg-white"
                  }`}
                >
                  <td className="px-3 py-3 text-sm text-stone-800">
                    <Link
                      href={`/metrics/${item.metricId}`}
                      className="font-medium text-teal-800 underline-offset-2 hover:underline"
                    >
                      {item.data}
                    </Link>
                    {metric ? (
                      <span className="mt-1 block text-xs text-stone-400">
                        {metric.name}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 text-sm text-stone-700">
                    {item.insight}
                  </td>
                  <td className="px-3 py-3 text-sm text-stone-700">
                    {item.hypothesis}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-stone-900">
                    {item.action}
                  </td>
                  <td className="px-3 py-3 text-sm text-stone-700">
                    {item.expected}
                  </td>
                  <td className="px-3 py-3 text-sm text-stone-700">
                    {owner?.person}
                    <span className="block text-xs text-stone-400">
                      {owner?.title}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm tabular-nums text-stone-600">
                    {item.due}
                  </td>
                  <td className="px-3 py-3 text-sm tabular-nums text-stone-600">
                    {item.hours}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setDihaStatus(item.id, nextStatus[item.status])
                      }
                      className="min-w-[5.5rem] rounded-md border border-stone-200 bg-white px-2 py-1 text-left hover:border-teal-400"
                    >
                      <p className="text-xs font-medium text-stone-700">
                        {statusLabel[item.status]} · {item.progress}%
                      </p>
                      <div className="mt-1.5 h-1.5 rounded-full bg-stone-100">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.progress >= 100
                              ? "bg-emerald-500"
                              : "bg-teal-700"
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-stone-400">
                        клик = следующий статус
                      </p>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
