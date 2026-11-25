import Link from "next/link";
import { RadarChart } from "@/components/RadarChart";
import { company } from "@/data/mock";
import {
  currentStageId,
  diagnosticBlocks,
  growthStages,
  priorityBlockIds,
  scoreColor,
  scoreText,
} from "@/data/diagnostics";

export default function DiagnosticsPage() {
  const priority = diagnosticBlocks.filter((b) =>
    priorityBlockIds.includes(b.id),
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500">{company.name} · самодиагностика</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
            Диагностика
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            Стадия роста → оценка 6 блоков → роза ветров → приоритет, с чего
            начинать оцифровку.
          </p>
        </div>
        <Link
          href="/strategy"
          className="rounded-lg bg-teal-800 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-teal-900"
        >
          К стратегии внедрения
        </Link>
      </header>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">
          1. Стадия развития компании
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Сейчас компания между повторными кейсами и систематизацией
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {growthStages.map((stage) => {
            const active = stage.id === currentStageId;
            const doneCount = stage.items.filter((i) => i.done).length;
            return (
              <div
                key={stage.id}
                className={`rounded-xl border p-3 ${
                  active
                    ? "border-teal-300 bg-teal-50/70 ring-1 ring-teal-200"
                    : "border-stone-200 bg-stone-50/50"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Этап {stage.id}
                </p>
                <p className="mt-1 text-sm font-medium text-stone-900">
                  {stage.title}
                </p>
                <p className="mt-2 text-xs text-stone-500">
                  {doneCount}/{stage.items.length} критериев
                </p>
                <ul className="mt-2 space-y-1">
                  {stage.items.map((item) => (
                    <li
                      key={item.label}
                      className={`text-xs ${
                        item.done ? "text-stone-700" : "text-stone-400"
                      }`}
                    >
                      {item.done ? "✓" : "○"} {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">
            2. Состояние по 6 блокам
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Оценка 1–3: красный / жёлтый / зелёный
          </p>
          <div className="mt-4 space-y-3">
            {diagnosticBlocks.map((block) => (
              <div
                key={block.id}
                className="rounded-xl border border-stone-100 bg-stone-50/60 px-3 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-stone-900">
                    {block.name}
                  </p>
                  <span
                    className={`text-sm font-semibold tabular-nums ${scoreText(block.score)}`}
                  >
                    {block.score}/3
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-stone-200">
                  <div
                    className={`h-2 rounded-full ${scoreColor(block.score)}`}
                    style={{ width: `${(block.score / 3) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-stone-500">{block.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">
              3. Роза ветров
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Форма бизнеса: где «провал», туда и приоритет
            </p>
            <div className="mt-2">
              <RadarChart blocks={diagnosticBlocks} />
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
            <h3 className="text-sm font-semibold text-stone-900">
              Приоритет первой очереди
            </h3>
            <p className="mt-1 text-sm text-stone-600">
              Минимальное улучшение этих блоков даст максимум к прибыли при
              текущих ресурсах.
            </p>
            <ul className="mt-3 space-y-2">
              {priority.map((block) => (
                <li
                  key={block.id}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-red-100"
                >
                  <span className="font-medium text-stone-800">{block.name}</span>
                  <span className={`font-semibold ${scoreText(block.score)}`}>
                    {block.score}/3
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/strategy"
              className="mt-4 inline-flex text-sm font-medium text-teal-800 underline-offset-2 hover:underline"
            >
              Собрать план внедрения →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
