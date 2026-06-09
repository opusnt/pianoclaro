import { THEORY_REGISTRY } from "@/lib/modules/theory-registry";
import { notFound } from "next/navigation";

export default async function TheoryUnitPage({ params }: { params: Promise<{ moduleId: string; unitId: string }> }) {
  const resolvedParams = await params;
  const moduleRegistry = THEORY_REGISTRY[resolvedParams.moduleId];
  if (!moduleRegistry) return notFound();

  const UnitComponent = moduleRegistry[resolvedParams.unitId];
  if (!UnitComponent) return notFound();

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <UnitComponent />
    </div>
  );
}
