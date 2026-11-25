import Link from "next/link";
import { company } from "@/data/mock";
import {
  currentStatusLabels,
  pointALabels,
  sectionLabels,
  strategyTools,
  trainingStartDate,
  type PointAStatus,
  type ToolCurrentStatus,
  type ToolSection,
} from "@/data/diagnostics";

function pointAClass(status: PointAStatus): string {
  if (status === "exists")
    return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  if (status === "needs_work")
    return "bg-amber-50 text-amber-800 ring-amber-200";
  return "bg-red-50 text-red-700 ring-red-200";
}

function currentClass(status: ToolCurrentStatus): string {
  if (status === "result")
    return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  if (status === "studied")
    return "bg-orange-50 text-orange-800 ring-orange-200";
  if (status === "in_progress")
    return "bg-sky-50 text-sky-800 ring-sky-200";
  return "bg-stone-100 text-stone-500 ring-stone-200";
}

export default function StrategyPage() {
  const sections: ToolSection[] = ["system", "scale"];
  const planned = strategyTools.filter((t) => t.implement).length;
  const withResult = strategyTools.filter((t) => t.current === "result").length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500">
            Дата старта обучения: {trainingStartDate}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
            Персональная стратегия
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            Реестр инструментов «Система / Масштаб»: точка А, план внедрения и
            текущий статус. {company.name}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-lg bg-white px-3 py-2 ring-1 ring-stone-200">
            К внедрению: <strong>{planned}</strong>
          </span>
          <span className="rounded-lg bg-white px-3 py-2 ring-1 ring-stone-200">
            С результатом: <strong>{withResult}</strong>
          </span>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-[11px] uppercase tracking-wide text-stone-500">
                <th className="px-3 py-3 font-medium">#</th>
                <th className="px-3 py-3 font-medium">Инструмент</th>
                <th className="px-3 py-3 font-medium">План изучения</th>
                <th className="px-3 py-3 font-medium">Статус точки А</th>
                <th className="px-3 py-3 font-medium">Внедряем</th>
                <th className="px-3 py-3 font-medium">Текущий статус</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => {
                const rows = strategyTools.filter((t) => t.section === section);
                return (
                  <SectionRows key={section} section={section} rows={rows} />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="text-base font-semibold text-stone-900">
          План внедрения дашборда (чеклист)
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-stone-700">
          {[
            "Связать личную цель собственника и бизнес‑цель компании",
            "Разделить годовой план на периоды",
            "Декомпозировать бизнес‑цель на метрики и утвердить отслеживаемые",
            "Выбрать ответственного за регулярное заполнение метрик",
            "Начать регулярно заполнять план‑факт‑разрыв",
          ].map((task, i) => (
            <li
              key={task}
              className="flex items-start gap-3 rounded-lg border border-stone-100 px-3 py-2"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-teal-700 text-[11px] font-semibold text-teal-800">
                {i < 3 ? "✓" : ""}
              </span>
              <span>{task}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link
            href="/"
            className="font-medium text-teal-800 underline-offset-2 hover:underline"
          >
            Открыть дашборд →
          </Link>
          <Link
            href="/weekly"
            className="font-medium text-teal-800 underline-offset-2 hover:underline"
          >
            Модуль трекинга →
          </Link>
          <Link
            href="/org"
            className="font-medium text-teal-800 underline-offset-2 hover:underline"
          >
            Модуль оргструктуры →
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionRows({
  section,
  rows,
}: {
  section: ToolSection;
  rows: typeof strategyTools;
}) {
  return (
    <>
      <tr className="border-b border-stone-200 bg-stone-100/90">
        <td
          colSpan={6}
          className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-stone-600"
        >
          {sectionLabels[section]}
        </td>
      </tr>
      {rows.map((tool) => (
        <tr key={tool.id} className="border-b border-stone-100">
          <td className="px-3 py-2.5 text-sm tabular-nums text-stone-400">
            {tool.id}
          </td>
          <td className="px-3 py-2.5 text-sm font-medium text-stone-900">
            {tool.href ? (
              <Link
                href={tool.href}
                className="underline-offset-2 hover:text-teal-800 hover:underline"
              >
                {tool.name}
              </Link>
            ) : (
              tool.name
            )}
          </td>
          <td className="px-3 py-2.5 text-sm tabular-nums text-stone-600">
            {tool.plannedDate ?? "—"}
          </td>
          <td className="px-3 py-2.5">
            <span
              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${pointAClass(tool.pointA)}`}
            >
              {pointALabels[tool.pointA]}
            </span>
          </td>
          <td className="px-3 py-2.5 text-sm text-stone-700">
            {tool.implement ? (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-teal-700 text-[11px] text-teal-800">
                ✓
              </span>
            ) : (
              <span className="inline-flex h-5 w-5 rounded border border-stone-300" />
            )}
          </td>
          <td className="px-3 py-2.5">
            <span
              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${currentClass(tool.current)}`}
            >
              {currentStatusLabels[tool.current]}
            </span>
          </td>
        </tr>
      ))}
    </>
  );
}
