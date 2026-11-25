import Link from "next/link";
import { DashboardHero } from "@/components/DashboardHero";
import { DashboardTable } from "@/components/DashboardTable";
import { PeriodHeader } from "@/components/PeriodHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PeriodHeader
          title="Дашборд собственника"
          subtitle="Переключай месяц → смотри план/факт периода → правь факт → сигналы и DIHA."
        />
        <div className="flex flex-wrap gap-2">
          <Link
            href="/diagnostics"
            className="rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm font-medium text-stone-800 transition hover:border-teal-300"
          >
            Диагностика
          </Link>
          <Link
            href="/weekly"
            className="rounded-lg bg-teal-800 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-teal-900"
          >
            Трекинг разрывов
          </Link>
        </div>
      </div>

      <DashboardHero />

      <section id="all-metrics" className="scroll-mt-6">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-stone-900">
            Все метрики дашборда
          </h2>
          <p className="text-sm text-stone-500">
            Обзор периода. Чтобы изменить факт — кликни значение или название
            метрики.
          </p>
        </div>
        <DashboardTable />
      </section>
    </div>
  );
}
