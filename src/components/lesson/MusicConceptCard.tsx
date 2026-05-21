import { Lightbulb } from "lucide-react";

import type { LessonStep } from "@/types/lesson";

type MusicConceptCardProps = {
  objective: string;
  activeStep: LessonStep;
};

export function MusicConceptCard({ objective, activeStep }: MusicConceptCardProps) {
  return (
    <section className="rounded-2xl border border-gold-soft/35 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-soft/22 text-blue-deep">
          <Lightbulb aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase text-muted">Concepto musical</p>
          <h2 className="text-lg font-bold text-blue-deep">
            {activeStep.conceptTitle ?? "Objetivo de la lección"}
          </h2>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-muted">
        {activeStep.conceptExplanation ?? objective}
      </p>
    </section>
  );
}
