import { BarChart3 } from "lucide-react";

import { ProgressDashboard } from "@/components/lesson/ProgressDashboard";
import { contentRepository } from "@/lib/content";

export const metadata = {
  title: "Progreso | Piano Claro",
};

const activeModule = contentRepository.getLessonModules()[0];
const pianoDesdeCeroLessons = contentRepository.getLessonsByModule(activeModule.id);

export default function ProgressPage() {
  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-6 shadow-soft sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-soft text-blue-deep">
            <BarChart3 aria-hidden="true" className="h-6 w-6" />
          </span>
          <p className="mt-5 text-sm font-bold uppercase text-gold-soft">Progreso</p>
          <h1 className="mt-3 text-4xl font-bold text-blue-deep sm:text-5xl">
            Tu avance en Piano desde cero
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Tu avance local en {activeModule.title}. La estructura ya está lista para sumar nuevos
            módulos sin cambiar la experiencia base.
          </p>
        </section>

        <ProgressDashboard lessons={pianoDesdeCeroLessons} />
      </div>
    </main>
  );
}
