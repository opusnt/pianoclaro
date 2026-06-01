import { Rotate3D } from "lucide-react";

import {
  getDisplayPitchName,
  getInversionById,
  getInversionDisplaySequence,
} from "@/lib/chord-inversions/theory";

type ChordInversionBadgeProps = {
  inversionId: string;
};

export function ChordInversionBadge({ inversionId }: ChordInversionBadgeProps) {
  const inversion = getInversionById(inversionId);
  if (!inversion) return null;

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
        <Rotate3D aria-hidden="true" className="h-4 w-4 text-gold-soft" />
        Inversión actual
      </p>
      <h3 className="mt-2 text-2xl font-bold text-blue-deep">{inversion.chordDisplayName}</h3>
      <div className="mt-3 grid gap-2 text-sm font-semibold text-muted">
        <p>
          <span className="font-bold text-blue-deep">Posición:</span>{" "}
          {inversion.inversionDisplayName}
        </p>
        <p>
          <span className="font-bold text-blue-deep">Bajo:</span>{" "}
          {getDisplayPitchName(inversion.bassNote)}
        </p>
        <p>
          <span className="font-bold text-blue-deep">Notas:</span>{" "}
          {getInversionDisplaySequence(inversion)}
        </p>
      </div>
    </div>
  );
}
