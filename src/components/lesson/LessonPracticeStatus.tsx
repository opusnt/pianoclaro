"use client";

import { PracticeFeedback } from "@/components/lesson/PracticeFeedback";
import type { SharpNoteName } from "@/lib/music/notes";
import { pianoLabelByNote, solfegeByNote } from "@/lib/music/notes";
import type { NoteInputEvaluation } from "@/lib/practice/evaluate-note";
import type { NoteName } from "@/types/lesson";

type LessonPracticeStatusProps = {
  practiceMessage: string;
  audioMessage: string;
  activeNotes: NoteName[];
  activeBlackNotes: SharpNoteName[];
  activeMeasure?: number;
  activePhrase?: "A" | "B";
  feedback: NoteInputEvaluation | null;
  attemptCount: number;
  correctCount: number;
  streak: number;
};

export function LessonPracticeStatus({
  practiceMessage,
  audioMessage,
  activeNotes,
  activeBlackNotes,
  activeMeasure,
  activePhrase,
  feedback,
  attemptCount,
  correctCount,
  streak,
}: LessonPracticeStatusProps) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
        <p className="text-xs font-bold uppercase text-muted">Práctica activa</p>
        <p className="mt-2 text-sm leading-6 text-blue-deep">{practiceMessage}</p>
        <p className="mt-2 text-xs font-bold uppercase text-gold-soft">{audioMessage}</p>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <span className="rounded-xl bg-blue-soft/50 px-3 py-2 font-semibold text-blue-deep">
            Nota:{" "}
            {[
              ...activeNotes.map((note) => solfegeByNote[note]),
              ...activeBlackNotes.map((note) => pianoLabelByNote[note]),
            ].join(", ") || "ninguna"}
          </span>
          <span className="rounded-xl bg-cream/75 px-3 py-2 font-semibold text-blue-deep">
            Compás: {activeMeasure ?? "todos"}
          </span>
          <span className="rounded-xl bg-teal-soft/15 px-3 py-2 font-semibold text-blue-deep">
            Frase: {activePhrase ?? "sin foco"}
          </span>
        </div>
      </div>

      <PracticeFeedback
        feedback={feedback}
        attemptCount={attemptCount}
        correctCount={correctCount}
        streak={streak}
      />
    </section>
  );
}
