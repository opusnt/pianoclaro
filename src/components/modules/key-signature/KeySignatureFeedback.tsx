import { AlertCircle, CheckCircle2 } from "lucide-react";

import type { KeySignatureAnswer } from "@/types/key-signature";

type KeySignatureFeedbackProps = {
  message: string;
  answer?: KeySignatureAnswer | null;
};

export function KeySignatureFeedback({ message, answer }: KeySignatureFeedbackProps) {
  const isCorrect = answer?.isCorrect;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        answer
          ? isCorrect
            ? "border-emerald-500/25 bg-emerald-50 text-emerald-950"
            : "border-red-400/30 bg-red-50 text-red-950"
          : "border-blue-deep/10 bg-ivory text-blue-deep"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-3">
        {answer ? (
          isCorrect ? (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
          )
        ) : null}
        <p className="text-sm font-semibold leading-6">{message}</p>
      </div>
    </div>
  );
}
