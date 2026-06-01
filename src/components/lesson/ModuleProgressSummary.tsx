"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { type LessonProgressStore, lessonProgressRepository } from "@/lib/progress";
import type { Lesson } from "@/types/lesson";

type ModuleProgressSummaryProps = {
  lessons: Lesson[];
};

export function ModuleProgressSummary({ lessons }: ModuleProgressSummaryProps) {
  const [store, setStore] = useState<LessonProgressStore>({});

  useEffect(() => {
    setStore(lessonProgressRepository.readAll());
  }, []);

  const completedCount = lessons.filter((lesson) => store[lesson.slug]?.completed).length;
  const activeLesson =
    lessons.find((lesson) => !store[lesson.slug]?.completed) ?? lessons[lessons.length - 1];
  const percentage = Math.round((completedCount / lessons.length) * 100);

  const lastUpdated = useMemo(() => {
    const updates = Object.values(store)
      .map((item) => item.updatedAt)
      .filter(Boolean)
      .sort()
      .reverse();

    return updates[0];
  }, [store]);

  return (
    <section className="mt-6 rounded-2xl border border-teal-soft/30 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-blue-deep">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-teal-soft" />
            Avance local del módulo
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {completedCount} de {lessons.length} lecciones completadas
            {lastUpdated ? " · progreso guardado en este navegador" : ""}
          </p>
        </div>
        {activeLesson ? (
          <Link
            href={`/lecciones/${activeLesson.slug}`}
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-deep px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
          >
            Continuar módulo
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-blue-deep/10">
        <div className="h-full rounded-full bg-teal-soft" style={{ width: `${percentage}%` }} />
      </div>
    </section>
  );
}
