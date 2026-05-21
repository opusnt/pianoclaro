import type { Lesson } from "@/types/lesson";

type LessonHeaderProps = {
  lesson: Lesson;
};

export function LessonHeader({ lesson }: LessonHeaderProps) {
  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold text-gold-soft">
            Lección {lesson.order} · {lesson.level} · {lesson.estimatedMinutes} min
          </p>
          <h1 className="mt-2 text-3xl font-bold text-blue-deep sm:text-4xl">{lesson.title}</h1>
          <p className="mt-2 text-base font-semibold text-muted">{lesson.subtitle}</p>
        </div>
        <div className="max-w-xl rounded-2xl bg-cream/70 p-4 text-sm font-semibold leading-6 text-blue-deep">
          Primero mira la partitura. Toca una nota para pedir pista. Luego practica con feedback.
        </div>
      </div>
    </section>
  );
}
