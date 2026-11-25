import { formatGap } from "@/lib/format";

export function GapBadge({
  gap,
  negative,
  size = "md",
}: {
  gap: number;
  negative: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "text-base px-2.5 py-1"
      : size === "sm"
        ? "text-xs px-1.5 py-0.5"
        : "text-sm px-2 py-0.5";

  return (
    <span
      title={
        negative
          ? "Отклонение факта от плана (хуже плана)"
          : "Отклонение факта от плана (не хуже плана)"
      }
      className={`inline-flex items-center rounded-md font-medium tabular-nums ${sizeClass} ${
        negative
          ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
          : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
      }`}
    >
      {formatGap(gap)}
    </span>
  );
}
