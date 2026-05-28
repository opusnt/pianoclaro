"use client";

import { BarChart3, Ear, Eye, Hand, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ExerciseProgressCard } from "@/components/modules/intervals/ExerciseProgressCard";
import { IntervalExerciseScreen } from "@/components/modules/intervals/IntervalExerciseScreen";
import { useIntervalProgress } from "@/components/modules/intervals/hooks/useIntervalProgress";
import { ModuleMetric } from "@/components/modules/shared/ModuleMetric";
import { NextLessonCard } from "@/components/modules/shared/NextLessonCard";
import { trackIntervalAttempt, trackIntervalEvent } from "@/lib/intervals/analytics";
import type { IntervalAttempt, IntervalModule } from "@/types/intervals";

type ModuleIntervalsScreenProps = {
  module: IntervalModule;
};

export function ModuleIntervalsScreen({ module }: ModuleIntervalsScreenProps) {
  const { progress, saveAttempt, resetProgress } = useIntervalProgress(module.id, module.exercises);
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
    trackIntervalEvent("interval_module_started", {
      moduleId: module.id,
      exerciseId: module.exercises[0]?.id,
    });
  }, [module.exercises, module.id]);

  useEffect(() => {
    if (nextExercise) {
      setSelectedExerciseId(nextExercise.id);
    }
  }, [nextExercise]);

  function handleAttemptComplete(attempt: IntervalAttempt) {
    saveAttempt(attempt);
    trackIntervalAttempt(module.id, attempt);

    if (attempt.passed && attempt.exerciseId === module.exercises.at(-1)?.id) {
      trackIntervalEvent("interval_module_completed", {
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
              <p className="text-sm font-bold uppercase text-gold-soft">Módulo 3</p>
              <h1 className="mt-2 text-4xl font-bold text-blue-deep sm:text-5xl">
                {module.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{module.description}</p>
              <p className="mt-4 max-w-3xl rounded-2xl bg-cream/70 p-4 text-sm font-semibold leading-6 text-blue-deep">
                Un intervalo es distancia: primero lo ves, luego lo escuchas, después lo tocas.
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

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <ModuleMetric icon={<Trophy className="h-5 w-5" />} label="Ejercicios" value={`${completedCount}/${module.exercises.length}`} />
            <ModuleMetric icon={<BarChart3 className="h-5 w-5" />} label="Progreso" value={`${progressPercent}%`} />
            <ModuleMetric icon={<BarChart3 className="h-5 w-5" />} label="Estado" value={progress.completed ? "Completado" : "En práctica"} />
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-blue-deep/10">
            <div className="h-full rounded-full bg-gold-soft transition-all" style={{ width: `${progressPercent}%` }} />
          </div>

          <IntervalLearningOverview />
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
            <IntervalExerciseScreen
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

function IntervalLearningOverview() {
  const items = [
    {
      icon: Eye,
      title: "Ver distancia",
      text: "Primero ubicas una nota base y miras cuántas teclas separan la llegada.",
    },
    {
      icon: Ear,
      title: "Oír dirección",
      text: "Luego reconoces si la segunda nota sube, baja o se mantiene.",
    },
    {
      icon: Hand,
      title: "Tocar destino",
      text: "Finalmente respondes tocando la nota correcta o eligiendo lo que escuchaste.",
    },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-gold-soft">Estructura de la lección</p>
          <h2 className="mt-1 text-xl font-black text-blue-deep">Una idea por vez: distancia, dirección y sonido.</h2>
        </div>
        <p className="max-w-md text-sm font-semibold leading-6 text-muted">
          Las preguntas aparecen solo al iniciar cada ejercicio para no mezclar explicación con evaluación.
        </p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-soft/55 text-blue-deep">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-black text-blue-deep">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-muted">{item.text}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
