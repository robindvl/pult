import { AiDraftPanel } from "@/components/AiDraftPanel";
import { DihaTable } from "@/components/DihaTable";
import { PeriodHeader } from "@/components/PeriodHeader";
import { WeeklyRedList } from "@/components/WeeklyRedList";
import Link from "next/link";

export default function WeeklyPage() {
  return (
    <div className="space-y-8">
      <PeriodHeader
        title="Трекинг разрывов"
        subtitle="Метод DIHA: Данные → Инсайт → Гипотеза → Действие. Период берётся из переключателя месяцев."
      />

      <AiDraftPanel />

      <section>
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2 className="text-lg font-semibold text-stone-900">
            Красные данные дашборда
          </h2>
          <Link
            href="/"
            className="text-sm text-teal-800 underline-offset-2 hover:underline"
          >
            К дашборду
          </Link>
        </div>
        <WeeklyRedList />
      </section>

      <DihaTable />
    </div>
  );
}
