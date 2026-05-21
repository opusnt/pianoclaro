import { Check } from "lucide-react";

import { getMinorScaleIntervals } from "@/lib/minor-scale/theory";
import type { MinorScaleType } from "@/types/minor-scale";

type MinorScalePatternProps = {
  scaleType: MinorScaleType;
  currentStepIndex: number;
  completedSteps: number;
};

export function MinorScalePattern({
  scaleType,
  currentStepIndex,
  completedSteps,
}: MinorScalePatternProps) {
  const intervals = getMinorScaleIntervals(scaleType);

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
      <p className="text-xs font-bold uppercase text-muted">Patrón menor</p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {intervals.map((step, index) => {
          const completed = index < completedSteps;
          const active = index === currentStepIndex;

          return (
            <div
              key={`${step}-${index}`}
              className={`rounded-2xl border p-3 text-center transition ${
                completed
                  ? "border-emerald-500/25 bg-emerald-50 text-emerald-900"
                  : active
                    ? "border-gold-soft bg-cream text-blue-deep shadow-soft"
                    : "border-blue-deep/10 bg-ivory text-muted"
              }`}
            >
              <p className="text-xl font-bold">{getStepSymbol(step)}</p>
              <p className="mt-1 text-[0.68rem] font-bold uppercase">{getStepName(step)}</p>
              <p className="mt-1 text-[0.68rem] font-semibold">{getStepDescription(step)}</p>
              {completed ? <Check aria-hidden="true" className="mx-auto mt-2 h-4 w-4" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStepSymbol(step: number) {
  if (step === 1) return "S";
  if (step === 3) return "T+S";
  return "T";
}

function getStepName(step: number) {
  if (step === 1) return "Semitono";
  if (step === 3) return "Tono y medio";
  return "Tono";
}

function getStepDescription(step: number) {
  if (step === 1) return "1 tecla";
  if (step === 3) return "3 teclas";
  return "2 teclas";
}
