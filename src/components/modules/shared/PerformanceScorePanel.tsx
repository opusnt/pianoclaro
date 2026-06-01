import { Activity, Gauge, Star, Target } from "lucide-react";
import type { ReactNode } from "react";

type PerformanceScorePanelProps = {
  score: number;
  accuracy: number;
  combo: number;
  comboMax: number;
  finalMetricLabel: string;
  finalMetricValue: string;
};

export function PerformanceScorePanel({
  score,
  accuracy,
  combo,
  comboMax,
  finalMetricLabel,
  finalMetricValue,
}: PerformanceScorePanelProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <Metric icon={<Star className="h-4 w-4" />} label="Score" value={score.toString()} />
      <Metric
        icon={<Target className="h-4 w-4" />}
        label="Accuracy"
        value={`${Math.round(accuracy * 100)}%`}
      />
      <Metric icon={<Activity className="h-4 w-4" />} label="Combo" value={`${combo}x`} />
      <Metric icon={<Gauge className="h-4 w-4" />} label="Mejor combo" value={`${comboMax}x`} />
      <Metric
        icon={<Gauge className="h-4 w-4" />}
        label={finalMetricLabel}
        value={finalMetricValue}
      />
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
      <span className="text-gold-soft">{icon}</span>
      <p className="mt-2 text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-blue-deep">{value}</p>
    </div>
  );
}
