import type { ReactNode } from "react";

type ModuleMetricProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export function ModuleMetric({ icon, label, value }: ModuleMetricProps) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <span className="text-gold-soft">{icon}</span>
      <p className="mt-2 text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-xl font-bold text-blue-deep">{value}</p>
    </div>
  );
}
