import { Flame, Gauge, Star, Target } from "lucide-react";

type HarmonicFieldScorePanelProps = {
  score: number;
  accuracy: number;
  combo: number;
  comboMax: number;
  progressLabel: string;
};

export function HarmonicFieldScorePanel({
  score,
  accuracy,
  combo,
  comboMax,
  progressLabel,
}: HarmonicFieldScorePanelProps) {
  const metrics = [
    { label: "Score", value: score.toString(), icon: <Star className="h-4 w-4" /> },
    { label: "Accuracy", value: `${Math.round(accuracy * 100)}%`, icon: <Gauge className="h-4 w-4" /> },
    { label: "Combo", value: combo.toString(), icon: <Flame className="h-4 w-4" /> },
    { label: "Progreso", value: progressLabel, icon: <Target className="h-4 w-4" /> },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
          <div className="flex items-center gap-2 text-muted">
            {metric.icon}
            <p className="text-xs font-bold uppercase">{metric.label}</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-deep">{metric.value}</p>
          {metric.label === "Combo" ? <p className="text-xs font-semibold text-muted">Máximo {comboMax}</p> : null}
        </div>
      ))}
    </div>
  );
}
