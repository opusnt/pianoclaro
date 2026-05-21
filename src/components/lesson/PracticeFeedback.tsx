"use client";

import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";

import type { NoteInputEvaluation } from "@/lib/practice/evaluate-note";

type PracticeFeedbackProps = {
  feedback: NoteInputEvaluation | null;
  attemptCount: number;
  correctCount: number;
  streak: number;
};

const statusStyles = {
  correct: {
    icon: CheckCircle2,
    label: "Correcto",
    className: "border-teal-soft/30 bg-teal-soft/10 text-blue-deep",
  },
  incorrect: {
    icon: XCircle,
    label: "Revisa",
    className: "border-gold-soft/35 bg-gold-soft/12 text-blue-deep",
  },
  explore: {
    icon: CircleDashed,
    label: "Exploración",
    className: "border-blue-deep/10 bg-blue-soft/35 text-blue-deep",
  },
};

export function PracticeFeedback({
  feedback,
  attemptCount,
  correctCount,
  streak,
}: PracticeFeedbackProps) {
  const accuracy = attemptCount > 0 ? Math.round((correctCount / attemptCount) * 100) : 0;
  const style = feedback ? statusStyles[feedback.status] : statusStyles.explore;
  const Icon = style.icon;

  return (
    <section className={`rounded-2xl border p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)] ${style.className}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/70">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase text-muted">Feedback de práctica</p>
          <h2 className="mt-1 text-lg font-bold text-blue-deep">{feedback ? style.label : "Listo para escuchar"}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {feedback?.message ??
              "Toca una tecla para comparar tu respuesta con la nota activa de la lección."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-blue-deep">
        <span className="rounded-xl bg-white/70 px-2 py-3">
          {attemptCount}
          <span className="mt-1 block font-semibold text-muted">intentos</span>
        </span>
        <span className="rounded-xl bg-white/70 px-2 py-3">
          {accuracy}%
          <span className="mt-1 block font-semibold text-muted">precisión</span>
        </span>
        <span className="rounded-xl bg-white/70 px-2 py-3">
          {streak}
          <span className="mt-1 block font-semibold text-muted">racha</span>
        </span>
      </div>

      {/* TODO: integrar Web MIDI API para alimentar esta evaluación desde teclados digitales. */}
    </section>
  );
}

