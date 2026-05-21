import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";

import type { ScaleAnswer } from "@/types/major-scale";

type MajorScaleFeedbackProps = {
  message: string;
  answer?: ScaleAnswer | null;
};

export function MajorScaleFeedback({ message, answer }: MajorScaleFeedbackProps) {
  const state = !answer ? "idle" : answer.isCorrect ? "correct" : "error";
  const icon =
    state === "correct" ? (
      <CheckCircle2 className="h-5 w-5" />
    ) : state === "error" ? (
      <XCircle className="h-5 w-5" />
    ) : (
      <HelpCircle className="h-5 w-5" />
    );
  const className =
    state === "correct"
      ? "border-emerald-500/25 bg-emerald-50 text-emerald-900"
      : state === "error"
        ? "border-red-400/25 bg-red-50 text-red-950"
        : "border-blue-deep/10 bg-blue-soft/35 text-blue-deep";

  return (
    <div className={`rounded-2xl border p-4 ${className}`} aria-live="polite">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <p className="text-sm font-bold leading-6">{message}</p>
      </div>
      {answer ? (
        <dl className="mt-3 grid gap-2 text-xs font-semibold sm:grid-cols-2">
          <div>
            <dt className="uppercase opacity-70">Esperado</dt>
            <dd className="mt-1">{Array.isArray(answer.expectedAnswer) ? answer.expectedAnswer.join(" · ") : answer.expectedAnswer}</dd>
          </div>
          <div>
            <dt className="uppercase opacity-70">Respuesta</dt>
            <dd className="mt-1">{Array.isArray(answer.userAnswer) ? answer.userAnswer.join(" · ") : answer.userAnswer}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
