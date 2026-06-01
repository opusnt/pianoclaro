import { Activity, Flame, Gauge, Star } from "lucide-react";

type ChordInversionScorePanelProps = {
  score: number;
  accuracy: number;
  combo: number;
  comboMax: number;
  progressLabel: string;
};

export function ChordInversionScorePanel({
  score,
  accuracy,
  combo,
  comboMax,
  progressLabel,
}: ChordInversionScorePanelProps) {
  const items = [
    { label: "Score", value: score.toString(), icon: Star },
    { label: "Accuracy", value: `${Math.round(accuracy * 100)}%`, icon: Gauge },
    { label: "Combo", value: combo.toString(), icon: Flame },
    { label: "Avance", value: progressLabel, icon: Activity },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
            <item.icon aria-hidden="true" className="h-4 w-4 text-gold-soft" />
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-deep">{item.value}</p>
          {item.label === "Combo" ? (
            <p className="mt-1 text-xs font-semibold text-muted">Máximo: {comboMax}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
