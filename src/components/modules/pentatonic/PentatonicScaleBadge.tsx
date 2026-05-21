import { Sparkles } from "lucide-react";

import {
  getPentatonicDisplaySequence,
  getPentatonicScaleById,
} from "@/lib/pentatonic/theory";

type PentatonicScaleBadgeProps = {
  scaleId: string;
};

export function PentatonicScaleBadge({ scaleId }: PentatonicScaleBadgeProps) {
  const scale = getPentatonicScaleById(scaleId);
  const relative = scale?.relativeScaleId ? getPentatonicScaleById(scale.relativeScaleId) : undefined;

  if (!scale) return null;

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
      <div className="flex items-start gap-3">
        <Sparkles aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-gold-soft" />
        <div>
          <p className="text-xs font-bold uppercase text-muted">Escala actual</p>
          <p className="mt-1 text-lg font-bold text-blue-deep">{scale.displayName}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            {scale.type === "major" ? "Pentatónica mayor" : "Pentatónica menor"} · {getPentatonicDisplaySequence(scale)}
          </p>
          {relative ? (
            <p className="mt-2 text-xs font-bold text-blue-deep">Relativa: {relative.displayName}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
