"use client";

import { Check } from "lucide-react";

import { LessonStepPanel } from "@/components/lesson/LessonStepPanel";
import { PracticeControls } from "@/components/lesson/PracticeControls";
import type { Lesson, LessonStep } from "@/types/lesson";
import type { TempoMode } from "@/types/practice";

type LessonSidebarProps = {
  lesson: Lesson;
  activeStep: LessonStep;
  activeStepIndex: number;
  completedStepIds: string[];
  isLessonCompleted: boolean;
  isPlaying: boolean;
  tempoMode: TempoMode;
  loopFocusEnabled: boolean;
  onStepChange: (stepIndex: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onPlay: () => void;
  onPause: () => void;
  onRepeat: () => void;
  onLoopFocusChange: (enabled: boolean) => void;
  onTempoChange: (tempoMode: TempoMode) => void;
  onCompleteLesson: () => void;
  itemLabel?: string;
};

export function LessonSidebar({
  lesson,
  activeStep,
  activeStepIndex,
  completedStepIds,
  isLessonCompleted,
  isPlaying,
  tempoMode,
  loopFocusEnabled,
  onStepChange,
  onPrevious,
  onNext,
  onPlay,
  onPause,
  onRepeat,
  onLoopFocusChange,
  onTempoChange,
  onCompleteLesson,
  itemLabel = "Lección",
}: LessonSidebarProps) {
  const completedLabel = itemLabel === "Módulo" ? "Módulo completado" : "Lección completada";
  const markCompletedLabel =
    itemLabel === "Módulo" ? "Marcar módulo como completado" : "Marcar como completada";

  return (
    <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
      <LessonStepPanel
        steps={lesson.steps}
        activeStepIndex={activeStepIndex}
        completedStepIds={completedStepIds}
        onStepChange={onStepChange}
        onPrevious={onPrevious}
        onNext={onNext}
      />

      <section className="rounded-2xl border border-blue-deep/10 bg-blue-deep p-5 text-white shadow-soft">
        <p className="text-xs font-bold uppercase text-gold-soft">Foco de esta etapa</p>
        <h2 className="mt-2 text-xl font-bold">{activeStep.title}</h2>
        <p className="mt-3 text-sm leading-6 text-white/78">{activeStep.instruction}</p>
        <p className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold uppercase text-white/75">
          {activeStep.conceptTitle ?? lesson.objective}
        </p>
      </section>

      <PracticeControls
        isPlaying={isPlaying}
        tempoMode={tempoMode}
        loopFocusEnabled={loopFocusEnabled}
        onPlay={onPlay}
        onPause={onPause}
        onRepeat={onRepeat}
        onLoopFocusChange={onLoopFocusChange}
        onTempoChange={onTempoChange}
      />

      <button
        type="button"
        onClick={onCompleteLesson}
        className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gold-soft px-5 py-3 text-sm font-bold text-[#543b12] shadow-[0_12px_30px_rgba(18,52,91,0.08)] transition hover:bg-[#cba250]"
      >
        <Check aria-hidden="true" className="h-4 w-4" />
        {isLessonCompleted ? completedLabel : markCompletedLabel}
      </button>
    </aside>
  );
}
