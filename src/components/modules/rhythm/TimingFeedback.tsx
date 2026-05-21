import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import type { TimingResult } from "@/types/rhythm";

type TimingFeedbackProps = {
  message: string;
  result: TimingResult | null;
};

const feedbackStyle = {
  perfect: "border-teal-soft/40 bg-teal-soft/15 text-blue-deep",
  good: "border-blue-deep/20 bg-blue-soft/45 text-blue-deep",
  early: "border-gold-soft/50 bg-gold-soft/20 text-blue-deep",
  late: "border-gold-soft/50 bg-gold-soft/20 text-blue-deep",
  miss: "border-rose-muted/40 bg-rose-muted/12 text-blue-deep",
};

export function TimingFeedback({ message, result }: TimingFeedbackProps) {
  const grade = result?.grade;
  const icon =
    grade === "perfect" || grade === "good" ? (
      <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
    ) : grade === "miss" ? (
      <XCircle aria-hidden="true" className="h-5 w-5" />
    ) : (
      <Clock3 aria-hidden="true" className="h-5 w-5" />
    );

  return (
    <div
      className={`rounded-2xl border p-4 text-sm font-semibold leading-6 ${
        grade ? feedbackStyle[grade] : "border-blue-deep/10 bg-blue-soft/30 text-blue-deep"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-gold-soft">{icon}</span>
        <div>
          <p>{message}</p>
          {typeof result?.timingErrorMs === "number" ? (
            <p className="mt-1 text-xs font-bold uppercase text-muted">
              Error: {Math.round(result.timingErrorMs)} ms
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
