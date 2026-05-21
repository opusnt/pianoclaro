import { Layers3 } from "lucide-react";

import { getChordById, getChordDisplaySequence, getChordQualityLabel } from "@/lib/chords/theory";

type ChordBadgeProps = {
  chordId: string;
};

export function ChordBadge({ chordId }: ChordBadgeProps) {
  const chord = getChordById(chordId);
  if (!chord) return null;

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
        <Layers3 aria-hidden="true" className="h-4 w-4 text-gold-soft" />
        Acorde actual
      </p>
      <h3 className="mt-2 text-2xl font-bold text-blue-deep">{chord.displayName}</h3>
      <div className="mt-3 grid gap-2 text-sm font-semibold text-muted">
        <p><span className="font-bold text-blue-deep">Tipo:</span> {getChordQualityLabel(chord.quality)}</p>
        <p><span className="font-bold text-blue-deep">Fórmula:</span> [{chord.formula.join(", ")}]</p>
        <p><span className="font-bold text-blue-deep">Notas:</span> {getChordDisplaySequence(chord)}</p>
      </div>
    </div>
  );
}
