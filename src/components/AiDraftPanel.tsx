"use client";

import { useState } from "react";
import { aiDraft } from "@/data/mock";

export function AiDraftPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            AI‑черновик трекинга
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Демо без вызова модели: черновик «данные → инсайт → гипотеза →
            действие»
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg bg-teal-800 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-teal-900"
        >
          {open ? "Скрыть черновик" : "Сгенерировать черновик"}
        </button>
      </div>

      {open ? (
        <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-stone-50 p-4 text-sm leading-relaxed text-stone-700 ring-1 ring-stone-200">
          {aiDraft}
        </pre>
      ) : null}
    </div>
  );
}
