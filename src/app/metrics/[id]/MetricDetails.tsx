import { notFound } from "next/navigation";
import { MetricWorkbench } from "@/components/MetricWorkbench";
import { getMetric } from "@/data/mock";

export async function MetricDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!getMetric(id)) notFound();

  return <MetricWorkbench metricId={id} />;
}
