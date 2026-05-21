import { PerformanceScorePanel } from "@/components/modules/shared/PerformanceScorePanel";

type IntervalScorePanelProps = {
  score: number;
  accuracy: number;
  combo: number;
  comboMax: number;
  progressLabel: string;
};

export function IntervalScorePanel({
  score,
  accuracy,
  combo,
  comboMax,
  progressLabel,
}: IntervalScorePanelProps) {
  return (
    <PerformanceScorePanel
      score={score}
      accuracy={accuracy}
      combo={combo}
      comboMax={comboMax}
      finalMetricLabel="Ronda"
      finalMetricValue={progressLabel}
    />
  );
}
