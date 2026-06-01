import { ArrowRight, BookOpen, CheckCircle2, Route } from "lucide-react";
import Link from "next/link";

import { LearningUnitCard } from "@/components/learning/LearningUnitCard";
import { ModuleProgressSummary } from "@/components/lesson/ModuleProgressSummary";
import { contentRepository } from "@/lib/content";
import type { LearningUnit } from "@/types/learning-path";
import type { Lesson } from "@/types/lesson";

export const metadata = {
  title: "Lecciones de piano | Piano Claro",
};

function isLesson(value: Lesson | undefined): value is Lesson {
  return Boolean(value);
}

function getUnitLessons(unit: LearningUnit) {
  return unit.lessonSlugs
    .map((slug) => contentRepository.getLessonBySlug(slug))
    .filter(isLesson)
    .sort((a, b) => a.order - b.order);
}

export default function LessonsPage() {
  const allLessons = contentRepository.getLessons().sort((a, b) => a.order - b.order);
  const firstOpenLesson = allLessons[0];
  const learningUnits = contentRepository
    .getLearningUnits()
    .filter((unit) => unit.status === "active");
  const plannedUnits = contentRepository
    .getLearningUnits()
    .filter((unit) => unit.status === "planned");
  const pianoTrack = contentRepository
    .getLearningExperienceTracks()
    .find((track) => track.id === "piano-lessons");

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-6 shadow-soft sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-soft text-blue-deep">
            <BookOpen aria-hidden="true" className="h-6 w-6" />
          </span>
          <p className="mt-5 text-sm font-bold uppercase text-gold-soft">Lecciones de piano</p>
          <h1 className="mt-3 text-4xl font-bold text-blue-deep sm:text-5xl">
            Sesiones cortas para leer, tocar y confirmar
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            {pianoTrack?.description ??
              "Lecciones paso a paso para practicar lectura, teclado y repertorio por tu cuenta."}
          </p>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {(pianoTrack?.experienceRules ?? []).map((rule) => (
              <p
                key={rule}
                className="rounded-2xl border border-blue-deep/10 bg-cream/70 p-4 text-sm font-bold leading-6 text-blue-deep"
              >
                {rule}
              </p>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {firstOpenLesson ? (
              <Link
                href={`/lecciones/${firstOpenLesson.slug}`}
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
              >
                Empezar lección 1
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ) : null}
            <Link
              href="/modulos"
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-5 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
            >
              Ver teoría musical
              <Route aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <ModuleProgressSummary lessons={allLessons} />

        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gold-soft">
                Secuencia de autoaprendizaje
              </p>
              <h2 className="mt-2 text-3xl font-bold text-blue-deep">
                Unidades que conectan lección, teoría y práctica
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-muted">
              Cada unidad muestra qué vas a lograr, dónde practicarlo y cómo saber si ya puedes
              avanzar.
            </p>
          </div>
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {learningUnits.map((unit) => (
              <LearningUnitCard
                key={unit.id}
                unit={unit}
                lessons={getUnitLessons(unit)}
                module={
                  unit.playableModuleId
                    ? contentRepository.getDetailedLearningModuleById(unit.playableModuleId)
                    : undefined
                }
              />
            ))}
          </div>
        </section>

        {plannedUnits.length > 0 ? (
          <section className="mt-8">
            <p className="text-sm font-bold uppercase text-gold-soft">Base futura</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-deep">
              Unidades preparadas para próximas tandas
            </h2>
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {plannedUnits.map((unit) => (
                <LearningUnitCard
                  key={unit.id}
                  unit={unit}
                  lessons={getUnitLessons(unit)}
                  module={
                    unit.playableModuleId
                      ? contentRepository.getDetailedLearningModuleById(unit.playableModuleId)
                      : undefined
                  }
                  compact
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 rounded-2xl border border-blue-deep/10 bg-blue-deep p-6 text-white shadow-soft sm:p-8">
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-gold-soft">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            Regla de diseño
          </p>
          <h2 className="mt-3 text-2xl font-bold">Una unidad debe producir una habilidad usable</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
            Para agregar contenido nuevo, primero se define qué aprende la persona, cómo lo
            practica, cómo confirma dominio y qué camino aparece si se equivoca.
          </p>
        </section>
      </div>
    </main>
  );
}
