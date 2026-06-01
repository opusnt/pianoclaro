import { BarChart3, Flame, Gauge, Trophy } from "lucide-react";

type ChordScorePanelProps = {
  score: number;
  accuracy: number;
  combo: number;
  comboMax: number;
  progressLabel: string;
};

export function ChordScorePanel({
  score,
  accuracy,
  combo,
  comboMax,
  progressLabel,
}: ChordScorePanelProps) {
  const items = [
    { icon: Trophy, label: "Score", value: String(score) },
    { icon: Gauge, label: "Accuracy", value: `${Math.round(accuracy * 100)}%` },
    { icon: Flame, label: "Combo", value: `${combo} / ${comboMax}` },
    { icon: BarChart3, label: "Progreso", value: progressLabel },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
            <Icon aria-hidden="true" className="h-4 w-4 text-gold-soft" />
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-deep">{value}</p>
        </div>
      ))}
    </div>
  );
}
