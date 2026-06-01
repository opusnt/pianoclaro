"use client";

import { BarChart3, Music2, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ExerciseProgressCard } from "@/components/modules/pentatonic/ExerciseProgressCard";
import { usePentatonicProgress } from "@/components/modules/pentatonic/hooks/usePentatonicProgress";
import { PentatonicExerciseScreen } from "@/components/modules/pentatonic/PentatonicExerciseScreen";
import { AppliedLearningPanel } from "@/components/modules/shared/AppliedLearningPanel";
import { ModuleMetric } from "@/components/modules/shared/ModuleMetric";
import { NextLessonCard } from "@/components/modules/shared/NextLessonCard";
import { trackPentatonicAttempt, trackPentatonicEvent } from "@/lib/pentatonic/analytics";
import type { PentatonicAttempt, PentatonicModule } from "@/types/pentatonic";

type ModulePentatonicScreenProps = {
  module: PentatonicModule;
};

export function ModulePentatonicScreen({ module }: ModulePentatonicScreenProps) {
  const { progress, saveAttempt, resetProgress } = usePentatonicProgress(
    module.id,
    module.exercises,
  );
  const [selectedExerciseId, setSelectedExerciseId] = useState(module.exercises[0]?.id ?? "");
  const selectedExercise =
    module.exercises.find((exercise) => exercise.id === selectedExerciseId) ?? module.exercises[0];
  const completedCount = module.exercises.filter(
    (exercise) => progress.exercises[exercise.id]?.completed,
  ).length;
  const progressPercent = Math.round((completedCount / module.exercises.length) * 100);
  const nextExercise = useMemo(
    () =>
      module.exercises.find(
        (exercise) =>
          progress.exercises[exercise.id]?.unlocked && !progress.exercises[exercise.id]?.completed,
      ) ?? module.exercises.at(-1),
    [module.exercises, progress.exercises],
  );

  useEffect(() => {
    trackPentatonicEvent("pentatonic_module_started", {
      moduleId: module.id,
      exerciseId: module.exercises[0]?.id,
    });
  }, [module.exercises, module.id]);

  useEffect(() => {
    if (nextExercise) setSelectedExerciseId(nextExercise.id);
  }, [nextExercise]);

  function handleAttemptComplete(attempt: PentatonicAttempt) {
    saveAttempt(attempt);
    trackPentatonicAttempt(module.id, attempt);

    if (attempt.passed && attempt.exerciseId === module.exercises.at(-1)?.id) {
      trackPentatonicEvent("pentatonic_module_completed", {
        moduleId: module.id,
        exerciseId: attempt.exerciseId,
        accuracy: attempt.accuracy,
        score: attempt.score,
      });
    }
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gold-soft">Módulo 7</p>
              <h1 className="mt-2 text-4xl font-bold text-blue-deep sm:text-5xl">{module.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{module.description}</p>
              <p className="mt-4 max-w-3xl rounded-2xl bg-cream/70 p-4 text-sm font-semibold leading-6 text-blue-deep">
                La pentatónica es una zona segura de cinco notas: menos teoría en pantalla, más
                frases tocadas.
              </p>
            </div>
            <button
              type="button"
              onClick={resetProgress}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Reiniciar progreso
            </button>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            <ModuleMetric
              icon={<Trophy className="h-5 w-5" />}
              label="Ejercicios"
              value={`${completedCount}/${module.exercises.length}`}
            />
            <ModuleMetric
              icon={<BarChart3 className="h-5 w-5" />}
              label="Progreso"
              value={`${progressPercent}%`}
            />
            <ModuleMetric
              icon={<Sparkles className="h-5 w-5" />}
              label="Escalas"
              value="6 pentatónicas"
            />
            <ModuleMetric
              icon={<Music2 className="h-5 w-5" />}
              label="Creativo"
              value="Improvisación"
            />
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-blue-deep/10">
            <div
              className="h-full rounded-full bg-gold-soft transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <AppliedLearningPanel
            moduleId={module.id}
            completedCount={completedCount}
            totalCount={module.exercises.length}
            progressPercent={progressPercent}
          />
        </section>

        <section
          id="module-exercises"
          className="mt-6 grid gap-6 scroll-mt-28 lg:grid-cols-[0.85fr_1.65fr]"
        >
          <aside className="space-y-3">
            {module.exercises.map((exercise, index) => (
              <ExerciseProgressCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                progress={progress.exercises[exercise.id]}
                selected={exercise.id === selectedExercise?.id}
                onSelect={() => setSelectedExerciseId(exercise.id)}
              />
            ))}
          </aside>

          {selectedExercise ? (
            <PentatonicExerciseScreen
              key={selectedExercise.id}
              exercise={selectedExercise}
              progress={progress.exercises[selectedExercise.id]}
              onAttemptComplete={handleAttemptComplete}
            />
          ) : null}
        </section>

        <NextLessonCard currentModuleId={module.id} isCompleted={progress.completed} />
      </div>
    </main>
  );
}
