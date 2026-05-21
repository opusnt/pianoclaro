import { CheckCircle2, Info, XCircle } from "lucide-react";

import type { ChordAnswer } from "@/types/chords";

type ChordFeedbackProps = {
  message: string;
  answer?: ChordAnswer | null;
};

export function ChordFeedback({ message, answer }: ChordFeedbackProps) {
  const Icon = answer ? (answer.isCorrect ? CheckCircle2 : XCircle) : Info;
  const className = answer
    ? answer.isCorrect
      ? "border-emerald-500 bg-emerald-50 text-emerald-950"
      : "border-red-400 bg-red-50 text-red-950"
    : "border-blue-deep/10 bg-blue-soft/30 text-blue-deep";

  return (
    <div className={`rounded-2xl border p-4 ${className}`} role="status" aria-live="polite">
      <p className="flex items-start gap-3 text-sm font-bold leading-6">
        <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        {message}
      </p>
    </div>
  );
}
