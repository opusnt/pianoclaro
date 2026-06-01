import { ArrowRight, CheckCircle2, Layers3, Music2, Route } from "lucide-react";
import Link from "next/link";

import { LearningUnitCard } from "@/components/learning/LearningUnitCard";
import { firstFiveNotesModuleId } from "@/data/learning-slugs";
import { contentRepository } from "@/lib/content";
import { playableModuleIds } from "@/lib/modules/playable-modules";
import type { LearningUnit } from "@/types/learning-path";
import type { Lesson } from "@/types/lesson";

export const metadata = {
  title: "Teoría musical | Piano Claro",
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

export default function MusicTheoryModulesPage() {
  const tracks = contentRepository.getLearningExperienceTracks();
  const theoryTrack = tracks.find((track) => track.id === "music-theory");
  const pianoTrack = tracks.find((track) => track.id === "piano-lessons");
  const modules = playableModuleIds.flatMap((moduleId) => {
    const module = contentRepository.getDetailedLearningModuleById(moduleId);
    const unit = contentRepository.getLearningUnitByPlayableModuleId(moduleId);
    return module && unit ? [{ module, unit }] : [];
  });

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-6 shadow-soft sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-soft text-blue-deep">
            <Layers3 aria-hidden="true" className="h-6 w-6" />
          </span>
          <p className="mt-5 text-sm font-bold uppercase text-gold-soft">Teoría musical</p>
          <h1 className="mt-3 text-4xl font-bold text-blue-deep sm:text-5xl">
            Aprende teoría tocando, escuchando y respondiendo
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            {theoryTrack?.description ??
              "Módulos interactivos para convertir conceptos musicales en habilidades tocables."}
          </p>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {(theoryTrack?.experienceRules ?? []).map((rule) => (
              <div
                key={rule}
                className="flex items-start gap-3 rounded-2xl border border-blue-deep/10 bg-cream/65 p-4"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-teal-soft"
                />
                <p className="text-sm font-bold leading-6 text-blue-deep">{rule}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/modulos/${firstFiveNotesModuleId}`}
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
            >
              Empezar teoría musical
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/lecciones"
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-5 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
            >
              Ir a lecciones de piano
              <Music2 aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-2">
          {modules.map(({ module, unit }) => (
            <LearningUnitCard
              key={module.id}
              unit={unit}
              lessons={getUnitLessons(unit)}
              module={module}
              compact={unit.order > 4}
            />
          ))}
        </section>

        {pianoTrack ? (
          <section className="mt-8 rounded-2xl border border-blue-deep/10 bg-blue-deep p-6 text-white shadow-soft sm:p-8">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-gold-soft">
              <Route aria-hidden="true" className="h-4 w-4" />
              Segundo carril
            </p>
            <h2 className="mt-3 text-2xl font-bold">{pianoTrack.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">{pianoTrack.outcome}</p>
            <Link
              href={pianoTrack.href}
              className="focus-ring mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
            >
              {pianoTrack.primaryActionLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </section>
        ) : null}
      </div>
    </main>
  );
}
