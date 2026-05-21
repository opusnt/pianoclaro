import { Check } from "lucide-react";

import { MAJOR_SCALE_INTERVALS } from "@/lib/major-scale/theory";

type MajorScalePatternProps = {
  currentStepIndex: number;
  completedSteps: number;
};

export function MajorScalePattern({ currentStepIndex, completedSteps }: MajorScalePatternProps) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
      <p className="text-xs font-bold uppercase text-muted">Patrón mayor</p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {MAJOR_SCALE_INTERVALS.map((step, index) => {
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
              <p className="text-xl font-bold">{step === 2 ? "T" : "S"}</p>
              <p className="mt-1 text-[0.68rem] font-bold uppercase">
                {step === 2 ? "Tono" : "Semitono"}
              </p>
              <p className="mt-1 text-[0.68rem] font-semibold">
                {step === 2 ? "2 teclas" : "1 tecla"}
              </p>
              {completed ? (
                <Check aria-hidden="true" className="mx-auto mt-2 h-4 w-4" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
