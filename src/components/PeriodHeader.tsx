"use client";

import { usePult } from "@/lib/pult-store";

export function PeriodHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { periodLabel } = usePult();

  return (
    <header>
      <p className="text-sm text-stone-500">{periodLabel}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm text-stone-600">{subtitle}</p>
      ) : null}
    </header>
  );
}
