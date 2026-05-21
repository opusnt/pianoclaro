import { Activity, ListMusic, Music2, Repeat2 } from "lucide-react";
import type { ReactNode } from "react";

import type { PracticeSessionSummary } from "@/lib/practice/session";

type PracticeSessionPanelProps = {
  summary: PracticeSessionSummary;
  isLoopEnabled: boolean;
};

export function PracticeSessionPanel({ summary, isLoopEnabled }: PracticeSessionPanelProps) {
  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-muted">Sesión de práctica</p>
          <h2 className="mt-1 text-xl font-bold text-blue-deep">{summary.scopeLabel}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Practica un foco pequeño, escucha la guía y confirma tocando en el teclado.
          </p>
        </div>
        <span className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-cream px-3 py-2 text-sm font-bold text-blue-deep">
          <Repeat2 aria-hidden="true" className="h-4 w-4 text-gold-soft" />
          {isLoopEnabled ? "Loop activo" : "Una pasada"}
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-blue-soft/45">
        <div
          className="h-full rounded-full bg-gold-soft transition-all"
          style={{ width: `${summary.completionPercent}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Metric
          icon={<Music2 aria-hidden="true" className="h-4 w-4" />}
          label="Nota actual"
          value={summary.currentNoteLabel}
        />
        <Metric
          icon={<Activity aria-hidden="true" className="h-4 w-4" />}
          label="Pulso"
          value={summary.currentBeatLabel}
        />
        <Metric
          icon={<ListMusic aria-hidden="true" className="h-4 w-4" />}
          label="Línea temporal"
          value={summary.nextTimelineLabel}
        />
        <Metric
          icon={<Repeat2 aria-hidden="true" className="h-4 w-4" />}
          label="Ritmo"
          value={summary.rhythmLabel}
        />
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-3">
      <span className="text-gold-soft">{icon}</span>
      <p className="mt-2 text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold leading-5 text-blue-deep">{value}</p>
    </div>
  );
}
