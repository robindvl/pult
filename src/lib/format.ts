export function gapPercent(plan: number, fact: number): number {
  if (plan === 0) return fact === 0 ? 0 : 100;
  return ((fact - plan) / Math.abs(plan)) * 100;
}

export function formatNumber(
  value: number,
  unit: "rub" | "pct" | "count" | "days",
): string {
  if (unit === "rub") {
    if (Math.abs(value) >= 1_000_000) {
      return `${(value / 1_000_000).toLocaleString("ru-RU", {
        maximumFractionDigits: 1,
      })} млн ₽`;
    }
    if (Math.abs(value) >= 1_000) {
      return `${(value / 1_000).toLocaleString("ru-RU", {
        maximumFractionDigits: 0,
      })} тыс ₽`;
    }
    return `${value.toLocaleString("ru-RU")} ₽`;
  }

  if (unit === "pct") {
    return `${value.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;
  }

  if (unit === "days") {
    return `${value.toLocaleString("ru-RU", { maximumFractionDigits: 0 })} дн.`;
  }

  return value.toLocaleString("ru-RU", { maximumFractionDigits: 0 });
}

export function formatGap(gap: number): string {
  const sign = gap > 0 ? "+" : "";
  return `${sign}${gap.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;
}

export function isNegativeGap(gap: number, higherIsBetter: boolean): boolean {
  return higherIsBetter ? gap < 0 : gap > 0;
}
