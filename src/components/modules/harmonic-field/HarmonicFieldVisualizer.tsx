import {
  getChordDisplaySequence,
  getFunctionLabel,
  requireField,
} from "@/lib/harmonic-field/theory";
import type { ScaleDegree } from "@/types/harmonic-field";

type HarmonicFieldVisualizerProps = {
  fieldId?: string;
  activeDegree?: ScaleDegree;
};

export function HarmonicFieldVisualizer({
  fieldId = "c-major",
  activeDegree,
}: HarmonicFieldVisualizerProps) {
  const field = requireField(fieldId);

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-muted">Campo armónico</p>
          <h3 className="mt-1 text-2xl font-bold text-blue-deep">{field.displayName}</h3>
        </div>
        <p className="text-sm font-semibold text-muted">Patrón: M · m · m · M · M · m · dim</p>
      </div>

      <div className="responsive-scroll mt-4">
        <div className="grid min-w-[760px] grid-cols-7 gap-2">
          {field.chords.map((chord) => {
            const active = chord.degree === activeDegree;
            return (
              <div
                key={chord.degree}
                className={`rounded-2xl border p-3 text-center transition ${
                  active ? "border-gold-soft bg-gold-soft/20" : "border-blue-deep/10 bg-ivory"
                }`}
              >
                <p className="text-xl font-black text-blue-deep">{chord.degree}</p>
                <p className="mt-1 text-sm font-bold text-blue-deep">{chord.displayName}</p>
                <p className="mt-1 text-xs font-semibold text-muted">
                  {getChordDisplaySequence(chord)}
                </p>
                <p className="mt-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-blue-deep">
                  {getFunctionLabel(chord.functionRole)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
