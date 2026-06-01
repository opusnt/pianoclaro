import { ArrowRight, BookOpen, Clock, Compass, Gamepad2, Music2 } from "lucide-react";
import Link from "next/link";

import { LearningUnitCard } from "@/components/learning/LearningUnitCard";
import { ModuleProgressSummary } from "@/components/lesson/ModuleProgressSummary";
import { extractedTheoryKnowledge } from "@/data/theory-knowledge";
import { contentRepository } from "@/lib/content";
import { playableModuleIds } from "@/lib/modules/playable-modules";

export const metadata = {
  title: "Rutas | Piano Claro",
};

const lessonModules = contentRepository.getLessonModules();
const activeModule = lessonModules[0];
const pianoDesdeCeroLessons = contentRepository.getLessonsByModule(activeModule.id);
const upcomingModules = lessonModules.slice(1);
const theoryHighlights = extractedTheoryKnowledge.slice(0, 4);
const learningTracks = contentRepository.getLearningExperienceTracks();
const activeLearningUnits = contentRepository
  .getLearningUnits()
  .filter((unit) => unit.status === "active");
const interactiveModules = playableModuleIds.flatMap((moduleId) => {
  const module = contentRepository.getDetailedLearningModuleById(moduleId);
  return module ? [module] : [];
});

export default function RoutesPage() {
  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-6 shadow-soft sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-soft text-blue-deep">
            <Compass aria-hidden="true" className="h-6 w-6" />
          </span>
          <p className="mt-5 text-sm font-bold uppercase text-gold-soft">Centro de aprendizaje</p>
          <h1 className="mt-3 text-4xl font-bold text-blue-deep sm:text-5xl">
            Avanza por teoría musical y lecciones de piano
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            La plataforma se divide en dos carriles complementarios: teoría musical interactiva para
            entender patrones, y lecciones de piano para tocar fragmentos reales paso a paso.
          </p>
          <p className="mt-4 max-w-3xl rounded-2xl bg-cream/70 p-4 text-sm font-semibold leading-6 text-blue-deep">
            Aprendizaje autónomo: cada pantalla debe decirte qué observar, qué tocar, cómo saber si
            vas bien y qué repetir si te atascas.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/modulos"
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
            >
              Entrar a teoría musical
              <Gamepad2 aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/lecciones"
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-5 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
            >
              Entrar a lecciones de piano
              <BookOpen aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-blue-deep/10 bg-white/75 p-6 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
          <p className="text-sm font-bold uppercase text-gold-soft">Dos formas de aprender</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-deep">
            La teoría explica el lenguaje. Las lecciones lo convierten en piano.
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {learningTracks.map((track) => (
              <article
                key={track.id}
                className="rounded-2xl border border-blue-deep/10 bg-ivory p-5"
              >
                <p className="text-xs font-bold uppercase text-gold-soft">{track.shortLabel}</p>
                <h3 className="mt-2 text-2xl font-bold text-blue-deep">{track.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-muted">
                  {track.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-blue-deep">
                  {track.experienceRules.map((rule) => (
                    <li key={rule} className="flex gap-2">
                      <span aria-hidden="true" className="text-gold-soft">
                        -
                      </span>
                      {rule}
                    </li>
                  ))}
                </ul>
                <Link
                  href={track.href}
                  className="focus-ring mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/60"
                >
                  {track.primaryActionLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-blue-deep/10 bg-[#f8f3e8] p-6 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gold-soft">Motor teórico</p>
              <h2 className="mt-2 text-2xl font-bold text-blue-deep">
                Conocimiento musical listo para nuevas lecciones
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted">
              Extraído y adaptado desde patrones abiertos de lectura musical: teclado, solfeo,
              armaduras, MIDI y práctica por manos.
            </p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {theoryHighlights.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-soft text-blue-deep">
                  <Music2 aria-hidden="true" className="h-4 w-4" />
                </span>
                <p className="mt-3 text-xs font-bold uppercase text-gold-soft">{item.area}</p>
                <h3 className="mt-2 text-base font-bold text-blue-deep">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.pianoClaroUse}</p>
              </article>
            ))}
          </div>
        </section>

        <ModuleProgressSummary lessons={pianoDesdeCeroLessons} />

        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gold-soft">Mapa integrado</p>
              <h2 className="mt-2 text-3xl font-bold text-blue-deep">
                Cada unidad une teoría, práctica y evidencia
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-muted">
              La unidad decide qué concepto aprendes, dónde lo practicas y qué señal confirma que
              puedes avanzar por tu cuenta.
            </p>
          </div>
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {activeLearningUnits.slice(0, 6).map((unit) => (
              <LearningUnitCard
                key={unit.id}
                unit={unit}
                lessons={unit.lessonSlugs.flatMap((slug) => {
                  const lesson = contentRepository.getLessonBySlug(slug);
                  return lesson ? [lesson] : [];
                })}
                module={
                  unit.playableModuleId
                    ? contentRepository.getDetailedLearningModuleById(unit.playableModuleId)
                    : undefined
                }
                compact
              />
            ))}
          </div>
          <Link
            href="/lecciones"
            className="focus-ring mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
          >
            Ver secuencia completa
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>

        {interactiveModules.length > 0 ? (
          <section className="mt-8 rounded-2xl border border-blue-deep/10 bg-blue-deep p-6 text-white shadow-soft sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-gold-soft">
                  <Gamepad2 aria-hidden="true" className="h-4 w-4" />
                  Teoría musical interactiva
                </p>
                <h2 className="mt-3 text-3xl font-bold">Módulos para entender haciendo</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
                  Módulos interactivos con teclado, audio, feedback inmediato y progreso local.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {interactiveModules.map((module, index) => (
                <article
                  key={module.id}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5"
                >
                  <p className="text-xs font-bold uppercase text-gold-soft">Módulo {index + 1}</p>
                  <h3 className="mt-2 text-2xl font-bold">{module.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">{module.shortDescription}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {module.microLessons.slice(0, 3).map((lesson) => (
                      <span
                        key={lesson.id}
                        className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white/85"
                      >
                        {lesson.name}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/modulos/${module.id}`}
                    className="focus-ring mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
                  >
                    Entrenar teoría {index + 1}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gold-soft">Lecciones de piano</p>
              <h2 className="mt-2 text-3xl font-bold text-blue-deep">
                Primer bloque: lectura y teclado en 3 sesiones
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted">
              Primero miras la partitura. Luego tocas por compases. Cada lección cierra con una mini
              habilidad concreta.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {pianoDesdeCeroLessons.map((lesson) => (
              <article
                key={lesson.slug}
                className="flex h-full flex-col rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]"
              >
                <p className="text-sm font-bold text-gold-soft">Lección {lesson.order}</p>
                <h3 className="mt-3 text-2xl font-bold text-blue-deep">{lesson.title}</h3>
                <p className="mt-1 text-sm font-semibold text-muted">{lesson.subtitle}</p>
                <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-muted">
                  <Clock aria-hidden="true" className="h-4 w-4 text-gold-soft" />
                  {lesson.estimatedMinutes} minutos
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs font-bold uppercase text-muted">
                  <BookOpen aria-hidden="true" className="h-4 w-4" />
                  Conceptos
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lesson.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="rounded-lg border border-blue-deep/10 bg-cream/65 px-3 py-2 text-xs font-semibold text-blue-deep"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/lecciones/${lesson.slug}`}
                  className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-deep px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
                >
                  Abrir lección
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <p className="text-sm font-bold uppercase text-gold-soft">Preparado para crecer</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-deep">Próximos módulos</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {upcomingModules.map((module) => (
              <article
                key={module.id}
                className="rounded-2xl border border-blue-deep/10 bg-white/75 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]"
              >
                <p className="text-sm font-bold text-gold-soft">{module.level}</p>
                <h3 className="mt-2 text-2xl font-bold text-blue-deep">{module.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{module.description}</p>
                <p className="mt-4 rounded-2xl bg-cream/70 p-3 text-sm font-semibold text-blue-deep">
                  {module.nextModuleHint ?? "Listo para recibir nuevas lecciones."}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
