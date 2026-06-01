import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import Link from "next/link";

import { getNextModule } from "@/lib/modules/module-sequence";

type NextLessonCardProps = {
  currentModuleId: string;
  isCompleted: boolean;
};

export function NextLessonCard({ currentModuleId, isCompleted }: NextLessonCardProps) {
  const nextModule = getNextModule(currentModuleId);

  if (!nextModule) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-blue-deep/10 bg-blue-deep p-5 text-white shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase text-gold-soft">Siguiente lección</p>
          <h2 className="mt-2 text-2xl font-black">{nextModule.title}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/75">
            Próximo objetivo: {nextModule.shortGoal}.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white/80">
            {isCompleted ? (
              <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-gold-soft" />
            ) : (
              <LockKeyhole aria-hidden="true" className="h-4 w-4 text-gold-soft" />
            )}
            {isCompleted
              ? "Esta lección ya quedó lista para avanzar."
              : "Puedes avanzar para explorar, pero lo ideal es completar esta lección primero."}
          </p>
        </div>
        <Link
          href={nextModule.href}
          className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-blue-deep transition hover:bg-cream"
        >
          Siguiente lección
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
