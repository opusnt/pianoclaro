import { Check } from "lucide-react";

import { solfegeByNote } from "@/lib/music/notes";
import type { PianoClaroNoteEvent } from "@/lib/music/song-model";

type PracticeSequenceStripProps = {
  events: PianoClaroNoteEvent[];
  activeIndex: number;
};

export function PracticeSequenceStrip({ events, activeIndex }: PracticeSequenceStripProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-muted">Secuencia esperada</p>
          <h2 className="mt-1 text-lg font-bold text-blue-deep">Toca en este orden</h2>
        </div>
        <p className="text-sm font-bold text-muted">
          {Math.min(activeIndex + 1, events.length)} / {events.length}
        </p>
      </div>

      <div className="responsive-scroll mt-4 flex gap-2 pb-1">
        {events.map((event, index) => {
          const isDone = index < activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <span
              key={event.id}
              className={`inline-flex min-h-12 min-w-14 shrink-0 flex-col items-center justify-center rounded-xl border px-3 py-2 text-sm font-bold transition ${
                isCurrent
                  ? "border-gold-soft bg-gold-soft text-[#543b12]"
                  : isDone
                    ? "border-teal-soft/30 bg-teal-soft/10 text-blue-deep"
                    : "border-blue-deep/10 bg-ivory text-muted"
              }`}
            >
              {isDone ? <Check aria-hidden="true" className="mb-0.5 h-3.5 w-3.5" /> : null}
              {solfegeByNote[event.note]}
              <span className="mt-0.5 text-[10px] font-bold uppercase opacity-70">
                C{event.measureNumber} · {event.beat}
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
