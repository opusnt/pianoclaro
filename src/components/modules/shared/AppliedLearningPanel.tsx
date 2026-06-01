"use client";

import { ArrowRight, Check, ListChecks, Sparkles, Target, Wrench } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { contentRepository } from "@/lib/content";

type AppliedLearningPanelProps = {
  completedCount: number;
  moduleId: string;
  progressPercent: number;
  totalCount: number;
};

export function AppliedLearningPanel({
  completedCount,
  moduleId,
  progressPercent,
  totalCount,
}: AppliedLearningPanelProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const unit = contentRepository.getLearningUnitByPlayableModuleId(moduleId);

  if (!unit) {
    return null;
  }

  const firstLesson = unit.lessonSlugs
    .map((slug) => contentRepository.getLessonBySlug(slug))
    .find(Boolean);

  function toggleItem(item: string) {
    setCheckedItems((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-blue-deep/10 bg-ivory p-4 sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div>
          <p className="text-xs font-black uppercase text-gold-soft">
            Aprendizaje autónomo aplicado
          </p>
          <h2 className="mt-2 text-2xl font-black text-blue-deep">
            Practica, recibe feedback y decide el siguiente paso.
          </h2>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-muted">
            {unit.practiceContract.essentialQuestion}
          </p>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {unit.practiceContract.practicePlan.map((step, index) => {
              const stepThreshold = ((index + 1) / unit.practiceContract.practicePlan.length) * 100;
              const isDone = progressPercent >= stepThreshold || completedCount === totalCount;
              const isActive =
                !isDone &&
                progressPercent >= (index / unit.practiceContract.practicePlan.length) * 100;

              return (
                <article
                  key={step.label}
                  className={`rounded-2xl border p-4 ${
                    isDone
                      ? "border-teal-soft/35 bg-teal-soft/10"
                      : isActive
                        ? "border-gold-soft/45 bg-gold-soft/18"
                        : "border-blue-deep/10 bg-white/75"
                  }`}
                >
                  <p className="text-xs font-black uppercase text-muted">
                    {index + 1}. {step.label}
                  </p>
                  <p className="mt-2 text-sm font-black leading-6 text-blue-deep">{step.action}</p>
                  <p className="mt-3 rounded-xl bg-white/75 p-3 text-xs font-bold leading-5 text-muted">
                    Señal: {step.successSignal}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
              <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                <Wrench aria-hidden="true" className="h-4 w-4 text-gold-soft" />
                Si te atascas
              </p>
              <div className="mt-3 grid gap-3">
                {unit.practiceContract.diagnosticRules.slice(0, 2).map((rule) => (
                  <div key={rule.symptom} className="rounded-2xl bg-cream/70 p-3">
                    <p className="text-sm font-black leading-6 text-blue-deep">{rule.symptom}</p>
                    <p className="mt-2 text-xs font-bold leading-5 text-muted">
                      Vuelve con esto: {rule.intervention}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
              <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                <ListChecks aria-hidden="true" className="h-4 w-4 text-teal-soft" />
                Autoevaluación
              </p>
              <div className="mt-3 space-y-2">
                {unit.practiceContract.selfCheck.map((item) => {
                  const checked = checkedItems.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleItem(item)}
                      className={`focus-ring flex w-full items-start gap-3 rounded-2xl border p-3 text-left text-sm font-bold leading-6 transition ${
                        checked
                          ? "border-teal-soft/40 bg-teal-soft/12 text-blue-deep"
                          : "border-blue-deep/10 bg-ivory text-muted hover:bg-cream"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          checked
                            ? "border-teal-soft bg-teal-soft text-white"
                            : "border-blue-deep/20"
                        }`}
                      >
                        {checked ? <Check aria-hidden="true" className="h-3 w-3" /> : null}
                      </span>
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl bg-blue-deep p-4 text-white">
          <p className="flex items-center gap-2 text-xs font-black uppercase text-gold-soft">
            <Target aria-hidden="true" className="h-4 w-4" />
            Próxima acción
          </p>
          <p className="mt-3 text-sm font-bold leading-6 text-white/85">
            {completedCount}/{totalCount} ejercicios completados. Avanza con el siguiente ejercicio
            disponible o vuelve con pistas si bajó tu precisión.
          </p>
          <div className="mt-4 grid gap-2">
            <a
              href="#module-exercises"
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-blue-deep transition hover:bg-cream"
            >
              Ir al ejercicio
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            {firstLesson ? (
              <Link
                href={`/lecciones/${firstLesson.slug}`}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                Ver lección conectada
                <Sparkles aria-hidden="true" className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-black uppercase text-gold-soft">Reto aplicado</p>
            <p className="mt-2 text-sm font-bold leading-6 text-white/85">
              {unit.practiceContract.transferChallenge}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
