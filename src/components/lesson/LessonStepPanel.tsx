"use client";

import { CheckCircle2, ChevronLeft, ChevronRight, Circle } from "lucide-react";

import type { LessonStep } from "@/types/lesson";

type LessonStepPanelProps = {
  steps: LessonStep[];
  activeStepIndex: number;
  completedStepIds: string[];
  onStepChange: (stepIndex: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function LessonStepPanel({
  steps,
  activeStepIndex,
  completedStepIds,
  onStepChange,
  onPrevious,
  onNext,
}: LessonStepPanelProps) {
  return (
    <aside className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <p className="px-2 text-xs font-bold uppercase text-muted">Pasos de la lección</p>
      <div className="mt-4 flex flex-col gap-2">
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex;
          const isCompleted = completedStepIds.includes(step.id);
          const Icon = isCompleted ? CheckCircle2 : Circle;

          return (
            <button
              type="button"
              key={step.id}
              onClick={() => onStepChange(index)}
              className={`focus-ring rounded-xl px-3 py-3 text-left transition ${
                isActive ? "bg-blue-deep text-white" : "text-blue-deep hover:bg-blue-soft/45"
              }`}
            >
              <span className="flex gap-3">
                <Icon
                  aria-hidden="true"
                  className={`mt-0.5 h-4 w-4 shrink-0 ${isActive ? "text-gold-soft" : "text-teal-soft"}`}
                />
                <span>
                  <span className="block text-sm font-bold">{step.title}</span>
                  <span
                    className={`mt-1 block text-xs ${isActive ? "text-white/72" : "text-muted"}`}
                  >
                    {step.description}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={activeStepIndex === 0}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-deep/15 bg-white px-3 py-2 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/45 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={activeStepIndex === steps.length - 1}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-deep px-3 py-2 text-sm font-bold text-white transition hover:bg-[#0d2949] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Siguiente
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
