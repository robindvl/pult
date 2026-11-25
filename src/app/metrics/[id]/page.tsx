import { Suspense } from "react";
import { metrics } from "@/data/mock";
import { MetricDetails } from "./MetricDetails";

export function generateStaticParams() {
  return metrics.map((m) => ({ id: m.id }));
}

function MetricFallback() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-stone-200" />
      <div className="h-24 rounded-xl bg-stone-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-24 rounded-xl bg-stone-200" />
        <div className="h-24 rounded-xl bg-stone-200" />
        <div className="h-24 rounded-xl bg-stone-200" />
      </div>
      <div className="h-64 rounded-xl bg-stone-200" />
    </div>
  );
}

export default function MetricPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<MetricFallback />}>
      <MetricDetails params={params} />
    </Suspense>
  );
}
