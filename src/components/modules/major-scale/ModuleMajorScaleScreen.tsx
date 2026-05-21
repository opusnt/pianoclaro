"use client";

import { BarChart3, Music2, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ExerciseProgressCard } from "@/components/modules/major-scale/ExerciseProgressCard";
import { MajorScaleExerciseScreen } from "@/components/modules/major-scale/MajorScaleExerciseScreen";
import { useMajorScaleProgress } from "@/components/modules/major-scale/hooks/useMajorScaleProgress";
import { ModuleMetric } from "@/components/modules/shared/ModuleMetric";
import { trackMajorScaleAttempt, trackMajorScaleEvent } from "@/lib/major-scale/analytics";
import type { MajorScaleAttempt, MajorScaleModule } from "@/types/major-scale";

type ModuleMajorScaleScreenProps = {
  module: MajorScaleModule;
};

export function ModuleMajorScaleScreen({ module }: ModuleMajorScaleScreenProps) {
  const { progress, saveAttempt, resetProgress } = useMajorScaleProgress(module.id, module.exercises);
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
    trackMajorScaleEvent("major_scale_module_started", {
      moduleId: module.id,
      exerciseId: module.exercises[0]?.id,
    });
  }, [module.exercises, module.id]);

  useEffect(() => {
    if (nextExercise) {
      setSelectedExerciseId(nextExercise.id);
    }
  }, [nextExercise]);

  function handleAttemptComplete(attempt: MajorScaleAttempt) {
    saveAttempt(attempt);
    trackMajorScaleAttempt(module.id, attempt);

    if (attempt.passed && attempt.exerciseId === module.exercises.at(-1)?.id) {
      trackMajorScaleEvent("major_scale_module_completed", {
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
              <p className="text-sm font-bold uppercase text-gold-soft">Módulo 4</p>
              <h1 className="mt-2 text-4xl font-bold text-blue-deep sm:text-5xl">
                {module.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{module.description}</p>
              <p className="mt-4 max-w-3xl rounded-2xl bg-cream/70 p-4 text-sm font-semibold leading-6 text-blue-deep">
                La escala mayor es el primer mapa completo: una tónica, una octava y el patrón T - T - S - T - T - T - S.
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
            <ModuleMetric icon={<Trophy className="h-5 w-5" />} label="Ejercicios" value={`${completedCount}/${module.exercises.length}`} />
            <ModuleMetric icon={<BarChart3 className="h-5 w-5" />} label="Progreso" value={`${progressPercent}%`} />
            <ModuleMetric icon={<Music2 className="h-5 w-5" />} label="Escalas" value="DO · SOL · RE · FA" />
            <ModuleMetric icon={<BarChart3 className="h-5 w-5" />} label="Estado" value={progress.completed ? "Completado" : "En práctica"} />
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-blue-deep/10">
            <div className="h-full rounded-full bg-gold-soft transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.65fr]">
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
            <MajorScaleExerciseScreen
              key={selectedExercise.id}
              exercise={selectedExercise}
              progress={progress.exercises[selectedExercise.id]}
              onAttemptComplete={handleAttemptComplete}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}
