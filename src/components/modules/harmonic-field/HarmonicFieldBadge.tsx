import {
  getChordByDegree,
  getChordDisplaySequence,
  getFunctionLabel,
  getQualityLabel,
  requireField,
} from "@/lib/harmonic-field/theory";
import type { ScaleDegree } from "@/types/harmonic-field";

type HarmonicFieldBadgeProps = {
  fieldId?: string;
  degree?: ScaleDegree;
};

export function HarmonicFieldBadge({ fieldId, degree }: HarmonicFieldBadgeProps) {
  if (!fieldId) return null;
  const field = requireField(fieldId);
  const chord = degree ? getChordByDegree(field, degree) : field.chords[0];

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
      <p className="text-xs font-bold uppercase text-muted">Tonalidad</p>
      <h3 className="mt-1 text-xl font-bold text-blue-deep">{field.displayName}</h3>
      <p className="mt-2 text-sm font-semibold text-muted">
        Escala: {field.scaleNotes.join(" · ")}
      </p>
      {chord ? (
        <div className="mt-4 rounded-2xl bg-cream/70 p-4 text-sm font-semibold leading-6 text-blue-deep">
          <p>
            {chord.degree} — {chord.displayName}
          </p>
          <p className="text-muted">Notas: {getChordDisplaySequence(chord)}</p>
          <p className="text-muted">
            Cualidad: {getQualityLabel(chord.quality)} · función:{" "}
            {getFunctionLabel(chord.functionRole)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
