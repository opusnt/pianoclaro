import {
  getDisplayPitchName,
  getInversionById,
  getInversionDisplaySequence,
  requireInversion,
} from "@/lib/chord-inversions/theory";

type ChordInversionVisualizerProps = {
  inversionId?: string;
};

export function ChordInversionVisualizer({ inversionId }: ChordInversionVisualizerProps) {
  const inversion = inversionId ? getInversionById(inversionId) : undefined;
  if (!inversion) return null;
  const root = requireInversion(`${inversion.chordId}-root`);

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
      <p className="text-xs font-bold uppercase text-muted">Visualizador de inversión</p>
      <h3 className="mt-2 text-lg font-bold text-blue-deep">{inversion.chordDisplayName}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <InversionLine label="Fundamental" notes={root.notes} bassNote={root.bassNote} />
        <InversionLine
          label={inversion.inversionDisplayName}
          notes={inversion.notes}
          bassNote={inversion.bassNote}
        />
      </div>
      <p className="mt-4 rounded-2xl bg-cream/70 p-3 text-sm font-semibold leading-6 text-blue-deep">
        Bajo actual: {getDisplayPitchName(inversion.bassNote)}. Las notas son{" "}
        {getInversionDisplaySequence(inversion)}.
      </p>
    </div>
  );
}

function InversionLine({
  label,
  notes,
  bassNote,
}: {
  label: string;
  notes: string[];
  bassNote: string;
}) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-3">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {notes.map((note, index) => {
          const isBass = note === bassNote && index === 0;
          return (
            <span
              key={`${label}-${note}-${index}`}
              className={`rounded-xl border px-3 py-2 text-sm font-bold ${
                isBass
                  ? "border-blue-deep bg-blue-deep text-white"
                  : "border-blue-deep/10 bg-white text-blue-deep"
              }`}
            >
              {getDisplayPitchName(note)}
              {isBass ? <span className="ml-1 text-[10px] uppercase opacity-80">bajo</span> : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}
