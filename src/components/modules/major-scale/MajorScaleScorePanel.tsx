import { PerformanceScorePanel } from "@/components/modules/shared/PerformanceScorePanel";

type MajorScaleScorePanelProps = {
  score: number;
  accuracy: number;
  combo: number;
  comboMax: number;
  progressLabel: string;
};

export function MajorScaleScorePanel({
  score,
  accuracy,
  combo,
  comboMax,
  progressLabel,
}: MajorScaleScorePanelProps) {
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
