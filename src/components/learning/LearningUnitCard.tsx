import { ArrowRight, BookOpen, CheckCircle2, Layers3, Wrench } from "lucide-react";
import Link from "next/link";

import { skillBranches } from "@/data/curriculum";
import type { DetailedLearningModule } from "@/types/curriculum";
import type { LearningUnit } from "@/types/learning-path";
import type { Lesson } from "@/types/lesson";

type LearningUnitCardProps = {
  unit: LearningUnit;
  lessons: Lesson[];
  module?: DetailedLearningModule;
  compact?: boolean;
};

const skillNameById = Object.fromEntries(
  skillBranches.map((skill) => [skill.id, skill.name]),
) as Record<string, string>;

export function LearningUnitCard({
  unit,
  lessons,
  module,
  compact = false,
}: LearningUnitCardProps) {
  const primaryHref = lessons[0]
    ? `/lecciones/${lessons[0].slug}`
    : module
      ? `/modulos/${module.id}`
      : undefined;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-blue-deep/10 bg-white/82 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-gold-soft">
            Unidad {unit.order} · {unit.status === "active" ? "Activa" : "Planificada"}
          </p>
          <h3 className="mt-2 text-xl font-bold text-blue-deep">{unit.title}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            unit.status === "active"
              ? "bg-teal-soft/18 text-[#235f55]"
              : "bg-blue-soft text-blue-deep"
          }`}
        >
          {unit.status === "active" ? "Disponible" : "Base futura"}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold leading-6 text-blue-deep">{unit.shortGoal}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{unit.userOutcome}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {unit.primarySkillIds.map((skillId) => (
          <span
            key={skillId}
            className="rounded-lg border border-blue-deep/10 bg-cream/65 px-3 py-2 text-xs font-semibold text-blue-deep"
          >
            {skillNameById[skillId] ?? skillId}
          </span>
        ))}
      </div>

      {!compact ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl bg-ivory p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-teal-soft" />
              Criterio de dominio
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-blue-deep">
              {unit.masteryCriteria.slice(0, 3).map((criteria) => (
                <li key={criteria}>{criteria}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-cream/65 p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
              <Wrench aria-hidden="true" className="h-4 w-4 text-gold-soft" />
              Qué hacer si te atascas
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-blue-deep">
              {unit.remediation.slice(0, 3).map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 border-t border-blue-deep/10 pt-4">
        {lessons.length > 0 ? (
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
              <BookOpen aria-hidden="true" className="h-4 w-4" />
              Lecciones de piano
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/lecciones/${lesson.slug}`}
                  className="focus-ring rounded-xl border border-blue-deep/10 bg-white px-3 py-2 text-xs font-bold text-blue-deep transition hover:bg-blue-soft"
                >
                  {lesson.order}. {lesson.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center">
          {module ? (
            <Link
              href={`/modulos/${module.id}`}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-deep px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
            >
              <Layers3 aria-hidden="true" className="h-4 w-4" />
              Entrenar teoría
            </Link>
          ) : null}
          {unit.status === "planned" ? (
            <span className="text-sm font-semibold text-muted">
              Pendiente de lecciones y experiencia jugable.
            </span>
          ) : null}
          {primaryHref ? (
            <Link
              href={primaryHref}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
            >
              Empezar unidad
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
