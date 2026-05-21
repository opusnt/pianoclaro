import { CheckCircle2, Info, XCircle } from "lucide-react";

import type { ChordInversionAnswer } from "@/types/chord-inversions";

type ChordInversionFeedbackProps = {
  message: string;
  answer?: ChordInversionAnswer | null;
};

export function ChordInversionFeedback({ message, answer }: ChordInversionFeedbackProps) {
  const Icon = !answer ? Info : answer.isCorrect ? CheckCircle2 : XCircle;
  const tone = !answer
    ? "border-blue-deep/10 bg-blue-soft/30 text-blue-deep"
    : answer.isCorrect
      ? "border-emerald-500/30 bg-emerald-50 text-emerald-950"
      : "border-red-500/30 bg-red-50 text-red-950";

  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <p className="flex items-start gap-2 text-sm font-bold leading-6">
        <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <span>{message}</span>
      </p>
    </div>
  );
}

