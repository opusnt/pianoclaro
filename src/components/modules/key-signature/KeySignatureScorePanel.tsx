import { PerformanceScorePanel } from "@/components/modules/shared/PerformanceScorePanel";

type KeySignatureScorePanelProps = {
  score: number;
  accuracy: number;
  combo: number;
  comboMax: number;
  progressLabel: string;
};

export function KeySignatureScorePanel({
  score,
  accuracy,
  combo,
  comboMax,
  progressLabel,
}: KeySignatureScorePanelProps) {
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
