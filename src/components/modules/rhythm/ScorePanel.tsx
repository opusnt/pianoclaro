import { PerformanceScorePanel } from "@/components/modules/shared/PerformanceScorePanel";

type ScorePanelProps = {
  score: number;
  accuracy: number;
  combo: number;
  comboMax: number;
  bpm: number;
  beatLabel: string;
};

export function ScorePanel({
  score,
  accuracy,
  combo,
  comboMax,
  bpm,
  beatLabel,
}: ScorePanelProps) {
  return (
    <PerformanceScorePanel
      score={score}
      accuracy={accuracy}
      combo={combo}
      comboMax={comboMax}
      finalMetricLabel="BPM / Beat"
      finalMetricValue={`${bpm} · ${beatLabel}`}
    />
  );
}
