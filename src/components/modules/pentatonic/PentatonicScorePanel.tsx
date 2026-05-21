import { PerformanceScorePanel } from "@/components/modules/shared/PerformanceScorePanel";

type PentatonicScorePanelProps = {
  score: number;
  accuracy: number;
  combo: number;
  comboMax: number;
  progressLabel: string;
};

export function PentatonicScorePanel({
  score,
  accuracy,
  combo,
  comboMax,
  progressLabel,
}: PentatonicScorePanelProps) {
  return (
    <PerformanceScorePanel
      score={score}
      accuracy={accuracy}
      combo={combo}
      comboMax={comboMax}
      finalMetricLabel="Progreso"
      finalMetricValue={progressLabel}
    />
  );
}
