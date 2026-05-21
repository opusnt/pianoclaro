import { Clock3, Hand, Music2, Timer } from "lucide-react";
import type { ReactNode } from "react";

import type { PracticeSong } from "@/lib/music/song-model";

type PracticeSongSummaryProps = {
  song: PracticeSong;
};

export function PracticeSongSummary({ song }: PracticeSongSummaryProps) {
  const track = song.tracks[0];
  const duration = Math.round(song.durationSeconds);

  return (
    <details className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4 shadow-[0_12px_30px_rgba(18,52,91,0.06)]">
      <summary className="cursor-pointer text-sm font-bold text-blue-deep">
        Arquitectura musical de esta lección
      </summary>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<Timer aria-hidden="true" className="h-4 w-4" />}
          label="Tempo"
          value={`${song.config.tempoBpm} BPM`}
        />
        <Metric
          icon={<Music2 aria-hidden="true" className="h-4 w-4" />}
          label="Eventos"
          value={`${song.events.length} notas`}
        />
        <Metric
          icon={<Clock3 aria-hidden="true" className="h-4 w-4" />}
          label="Duración"
          value={`${duration} s`}
        />
        <Metric
          icon={<Hand aria-hidden="true" className="h-4 w-4" />}
          label="Pista"
          value={track?.label ?? "Mano derecha"}
        />
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-muted">
        Cada nota ya tiene compás, pulso, duración, MIDI y mano asignada. Esta capa permitirá
        importar MIDI real, practicar por loops y evaluar entradas del teclado digital.
      </p>
    </details>
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
      <div className="flex items-center gap-2 text-gold-soft">{icon}</div>
      <p className="mt-2 text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-blue-deep">{value}</p>
    </div>
  );
}
