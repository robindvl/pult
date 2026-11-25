"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultMonthId,
  dihaItems as seedDiha,
  getPeriod,
  metrics as seedMetrics,
  type ActionStatus,
  type DihaItem,
  type Metric,
  type MonthId,
} from "@/data/mock";
import { formatNumber } from "@/lib/format";
import { buildSignals } from "@/lib/signals";

const STORAGE_KEY = "pult-live-v2";

type FactMap = Record<string, number>;
type FactsByMonth = Partial<Record<MonthId, FactMap>>;

interface Persisted {
  monthId: MonthId;
  factsByMonth: FactsByMonth;
  diha: DihaItem[];
}

interface PultStore {
  ready: boolean;
  monthId: MonthId;
  monthLabel: string;
  periodLabel: string;
  elapsed: number;
  setMonthId: (id: MonthId) => void;
  metrics: Metric[];
  diha: DihaItem[];
  getMonthFact: (metricId: string) => number;
  setMonthFact: (metricId: string, value: number) => void;
  resetFacts: () => void;
  createDihaFromMetric: (metricId: string) => string | null;
  setDihaStatus: (id: string, status: ActionStatus) => void;
  hasDihaForMetric: (metricId: string) => boolean;
}

const PultContext = createContext<PultStore | null>(null);

function applyPeriod(metric: Metric, monthId: MonthId, fact: number): Metric {
  const point = metric.months[monthId];
  return {
    ...metric,
    month: { plan: point.plan, fact },
  };
}

export function PultProvider({ children }: { children: ReactNode }) {
  const [monthId, setMonthIdState] = useState<MonthId>(defaultMonthId);
  const [factsByMonth, setFactsByMonth] = useState<FactsByMonth>({});
  const [diha, setDiha] = useState<DihaItem[]>(seedDiha);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted;
        if (parsed.monthId) setMonthIdState(parsed.monthId);
        if (parsed.factsByMonth) setFactsByMonth(parsed.factsByMonth);
        if (parsed.diha?.length) setDiha(parsed.diha);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload: Persisted = { monthId, factsByMonth, diha };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [monthId, factsByMonth, diha, ready]);

  const period = getPeriod(monthId);
  const monthFacts = factsByMonth[monthId] ?? {};

  const getMonthFact = useCallback(
    (metricId: string) => {
      const base = seedMetrics.find((m) => m.id === metricId);
      if (!base) return 0;
      return monthFacts[metricId] ?? base.months[monthId].fact;
    },
    [monthFacts, monthId],
  );

  const metrics = useMemo(
    () =>
      seedMetrics.map((m) =>
        applyPeriod(
          m,
          monthId,
          monthFacts[m.id] ?? m.months[monthId].fact,
        ),
      ),
    [monthFacts, monthId],
  );

  const setMonthId = useCallback((id: MonthId) => {
    setMonthIdState(id);
  }, []);

  const setMonthFact = useCallback(
    (metricId: string, value: number) => {
      if (Number.isNaN(value)) return;
      setFactsByMonth((prev) => ({
        ...prev,
        [monthId]: { ...(prev[monthId] ?? {}), [metricId]: value },
      }));
    },
    [monthId],
  );

  const resetFacts = useCallback(() => {
    setFactsByMonth((prev) => ({ ...prev, [monthId]: {} }));
  }, [monthId]);

  const hasDihaForMetric = useCallback(
    (metricId: string) =>
      diha.some((d) => d.metricId === metricId && d.status !== "done"),
    [diha],
  );

  const createDihaFromMetric = useCallback(
    (metricId: string) => {
      const seed = seedMetrics.find((m) => m.id === metricId);
      if (!seed) return null;

      const plan = seed.months[monthId].plan;
      const fact = monthFacts[metricId] ?? seed.months[monthId].fact;
      const live = applyPeriod(seed, monthId, fact);
      const signals = buildSignals(live, fact, period.elapsed);
      const existing = diha.find(
        (d) => d.metricId === metricId && d.status !== "done",
      );
      if (existing) return existing.id;

      const id = `d-${monthId}-${metricId}-${Date.now()}`;
      const item: DihaItem = {
        id,
        data: `${period.label}: ${seed.name} — факт ${formatNumber(fact, seed.unit)} при плане ${formatNumber(plan, seed.unit)} (${signals.planGap > 0 ? "+" : ""}${signals.planGap.toFixed(1)}%)`,
        metricId,
        insight: signals.thresholdBroken
          ? "Пробит порог допустимого значения — нужен срочный разбор"
          : signals.willMissPlan
            ? period.elapsed < 1
              ? "При текущем темпе план месяца не выполним"
              : "Месяц закрыт ниже плана"
            : "Разрыв к плану требует гипотезы ответственного",
        hypothesis:
          "Нужно проверить канал/процесс и зафиксировать одно действие на неделю",
        action: `Разобрать разрыв по «${seed.name}» (${period.label})`,
        expected: `Вернуть метрику к плану ${formatNumber(plan, seed.unit)}`,
        ownerId: seed.ownerId,
        due: period.label,
        hours: 4,
        progress: 0,
        status: "todo",
      };

      setDiha((prev) => [item, ...prev]);
      return id;
    },
    [diha, monthFacts, monthId, period],
  );

  const setDihaStatus = useCallback((id: string, status: ActionStatus) => {
    setDiha((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const progress =
          status === "done" ? 100 : status === "in_progress" ? 50 : 0;
        return { ...item, status, progress };
      }),
    );
  }, []);

  const value = useMemo<PultStore>(
    () => ({
      ready,
      monthId,
      monthLabel: period.label,
      periodLabel: `${period.label} ${period.year} · план на год`,
      elapsed: period.elapsed,
      setMonthId,
      metrics,
      diha,
      getMonthFact,
      setMonthFact,
      resetFacts,
      createDihaFromMetric,
      setDihaStatus,
      hasDihaForMetric,
    }),
    [
      ready,
      monthId,
      period,
      setMonthId,
      metrics,
      diha,
      getMonthFact,
      setMonthFact,
      resetFacts,
      createDihaFromMetric,
      setDihaStatus,
      hasDihaForMetric,
    ],
  );

  return <PultContext.Provider value={value}>{children}</PultContext.Provider>;
}

export function usePult() {
  const ctx = useContext(PultContext);
  if (!ctx) throw new Error("usePult must be used within PultProvider");
  return ctx;
}
