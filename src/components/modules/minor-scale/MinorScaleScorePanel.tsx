import { PerformanceScorePanel } from "@/components/modules/shared/PerformanceScorePanel";

type MinorScaleScorePanelProps = {
  score: number;
  accuracy: number;
  combo: number;
  comboMax: number;
  progressLabel: string;
};

export function MinorScaleScorePanel({
  score,
  accuracy,
  combo,
  comboMax,
  progressLabel,
}: MinorScaleScorePanelProps) {
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
