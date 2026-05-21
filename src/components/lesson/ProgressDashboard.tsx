"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Keyboard, Music, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { lessonProgressRepository, type LessonProgressStore } from "@/lib/progress";
import type { Lesson } from "@/types/lesson";

type ProgressDashboardProps = {
  lessons: Lesson[];
};

const skillConfig = [
  { label: "Lectura musical", base: 28, icon: BookOpen },
  { label: "Ritmo", base: 22, icon: Timer },
  { label: "Coordinación", base: 20, icon: Music },
  { label: "Teclado", base: 34, icon: Keyboard },
];

function SkillBar({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-sm font-bold text-blue-deep">
          <Icon aria-hidden="true" className="h-4 w-4 text-gold-soft" />
          {label}
        </p>
        <span className="text-sm font-bold text-muted">{value}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-deep/10">
        <div className="h-full rounded-full bg-gold-soft" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ProgressDashboard({ lessons }: ProgressDashboardProps) {
  const [store, setStore] = useState<LessonProgressStore>({});

  useEffect(() => {
    setStore(lessonProgressRepository.readAll());
  }, []);

  const completedCount = lessons.filter((lesson) => store[lesson.slug]?.completed).length;
  const nextLesson =
    lessons.find((lesson) => !store[lesson.slug]?.completed) ?? lessons[lessons.length - 1];

  const skills = useMemo(
    () =>
      skillConfig.map((skill) => ({
        ...skill,
        value: Math.min(100, skill.base + completedCount * 14),
      })),
    [completedCount],
  );

  return (
    <>
      <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
          <h2 className="text-2xl font-bold text-blue-deep">Lecciones</h2>
          <div className="mt-5 space-y-3">
            {lessons.map((lesson, index) => {
              const progress = store[lesson.slug];
              const stepProgress = progress
                ? Math.round((progress.completedStepIds.length / lesson.steps.length) * 100)
                : 0;
              const status = progress?.completed
                ? "Completada"
                : index === completedCount
                  ? "En curso"
                  : "Próxima";

              return (
                <article
                  key={lesson.slug}
                  className="rounded-2xl border border-blue-deep/10 bg-ivory p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-gold-soft">Lección {lesson.order}</p>
                      <h3 className="mt-1 text-lg font-bold text-blue-deep">{lesson.title}</h3>
                      <p className="mt-1 text-sm text-muted">{lesson.subtitle}</p>
                    </div>
                    <span className="rounded-lg bg-blue-soft px-3 py-2 text-xs font-bold text-blue-deep">
                      {status}
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-blue-deep/10">
                    <div
                      className="h-full rounded-full bg-blue-deep"
                      style={{ width: `${progress?.completed ? 100 : stepProgress}%` }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-deep">Habilidades</h2>
          {skills.map((skill) => (
            <SkillBar key={skill.label} {...skill} />
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-gold-soft/35 bg-blue-deep p-6 text-white shadow-soft">
        <p className="text-sm font-bold uppercase text-gold-soft">Siguiente recomendación</p>
        <h2 className="mt-3 text-2xl font-bold">
          {nextLesson ? `Continúa con ${nextLesson.title}` : "Módulo completado"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
          Leer música es aprender a ver movimiento, no solo nombres de notas.
        </p>
        {nextLesson ? (
          <Link
            href={`/lecciones/${nextLesson.slug}`}
            className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
          >
            Abrir recomendación
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : null}
      </section>
    </>
  );
}
