import { KeyRound } from "lucide-react";

import {
  getAccidentalTypeLabel,
  getDisplayPitchName,
  getKeySignatureById,
} from "@/lib/key-signature/theory";

type KeySignatureBadgeProps = {
  keyId: string;
};

export function KeySignatureBadge({ keyId }: KeySignatureBadgeProps) {
  const key = getKeySignatureById(keyId);

  if (!key) return null;

  const accidentalText = key.accidentals.length
    ? key.accidentals.map(getDisplayPitchName).join(", ")
    : "sin alteraciones";

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
      <div className="flex items-start gap-3">
        <KeyRound aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-gold-soft" />
        <div>
          <p className="text-xs font-bold uppercase text-muted">Armadura</p>
          <p className="mt-1 text-lg font-bold text-blue-deep">{key.displayName}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            {getAccidentalTypeLabel(key.accidentalType)} · {accidentalText}
          </p>
          <p className="mt-2 text-xs font-bold text-blue-deep">
            Relativa: {getKeySignatureById(key.relativeKeyId)?.displayName}
          </p>
        </div>
      </div>
    </div>
  );
}
