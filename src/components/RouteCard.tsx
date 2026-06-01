import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import Link from "next/link";
import { clampPercentage } from "@/lib/format";
import type { Route } from "@/types/learning";

const accentStyles = {
  blue: "bg-blue-soft text-blue-deep",
  gold: "bg-gold-soft/25 text-[#77561a]",
  teal: "bg-teal-soft/20 text-[#235f55]",
  rose: "bg-rose-muted/18 text-[#834533]",
};

export function RouteCard({ route }: { route: Route }) {
  const progress = clampPercentage(route.progress);

  return (
    <article className="flex h-full flex-col rounded-lg border border-blue-deep/10 bg-white/78 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex min-h-8 items-center rounded-lg px-3 text-xs font-bold ${accentStyles[route.accent]}`}
        >
          {route.level}
        </span>
        <span className="text-sm font-semibold text-muted">{progress}%</span>
      </div>
      <h3 className="mt-5 text-xl font-bold text-blue-deep">{route.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{route.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-ink">
        <span className="inline-flex items-center gap-2">
          <Clock aria-hidden="true" className="h-4 w-4 text-gold-soft" />
          {route.estimatedDuration}
        </span>
        <span className="inline-flex items-center gap-2">
          <GraduationCap aria-hidden="true" className="h-4 w-4 text-teal-soft" />
          {route.lessonCount} lecciones
        </span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-blue-deep/10">
        <div className="h-full rounded-full bg-blue-deep" style={{ width: `${progress}%` }} />
      </div>
      <Link
        href={`/rutas/${route.slug}`}
        className="focus-ring mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-deep px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2949]"
      >
        Entrar
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </article>
  );
}
