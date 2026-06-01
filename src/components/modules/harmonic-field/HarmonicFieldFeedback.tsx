import { AlertTriangle, CheckCircle2 } from "lucide-react";

import type { HarmonicFieldAnswer } from "@/types/harmonic-field";

type HarmonicFieldFeedbackProps = {
  message: string;
  answer?: HarmonicFieldAnswer | null;
};

export function HarmonicFieldFeedback({ message, answer }: HarmonicFieldFeedbackProps) {
  const tone = answer ? (answer.isCorrect ? "positive" : "negative") : "neutral";
  return (
    <div
      className={`rounded-2xl border p-4 ${
        tone === "positive"
          ? "border-emerald-500/40 bg-emerald-50 text-emerald-950"
          : tone === "negative"
            ? "border-red-400/40 bg-red-50 text-red-950"
            : "border-blue-deep/10 bg-ivory text-blue-deep"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {tone === "negative" ? (
          <AlertTriangle className="mt-0.5 h-5 w-5" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-5 w-5" />
        )}
        <p className="text-sm font-bold leading-6">{message}</p>
      </div>
    </div>
  );
}
