"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { company } from "@/data/mock";
import { usePult } from "@/lib/pult-store";
import { MonthSwitcher } from "./MonthSwitcher";

const nav = [
  { href: "/", label: "Дашборд" },
  { href: "/diagnostics", label: "Диагностика" },
  { href: "/strategy", label: "Стратегия" },
  { href: "/org", label: "Конвейер" },
  { href: "/weekly", label: "DIHA" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { periodLabel } = usePult();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-stone-200 bg-stone-50">
      <div className="border-b border-stone-200 px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-teal-800">
          Пульт
        </p>
        <p className="mt-1 text-sm font-semibold text-stone-900">Собственника</p>
        <p className="mt-3 text-xs leading-relaxed text-stone-500">
          {company.name}
          <br />
          {periodLabel}
        </p>
        <div className="mt-3">
          <MonthSwitcher compact />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-white font-medium text-stone-900 shadow-sm ring-1 ring-stone-200"
                  : "text-stone-600 hover:bg-white/70 hover:text-stone-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/metrics/personal_profit"
          className={`rounded-lg px-3 py-2 text-sm transition ${
            pathname.startsWith("/metrics")
              ? "bg-white font-medium text-stone-900 shadow-sm ring-1 ring-stone-200"
              : "text-stone-600 hover:bg-white/70 hover:text-stone-900"
          }`}
        >
          Метрики
        </Link>
      </nav>

      <div className="border-t border-stone-200 px-5 py-4 text-xs text-stone-500">
        Демо · шаблоны методологии
      </div>
    </aside>
  );
}
