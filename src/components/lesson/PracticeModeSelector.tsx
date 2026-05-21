"use client";

import type { PracticeMode } from "@/types/lesson";

type PracticeModeSelectorProps = {
  modes: PracticeMode[];
  selectedPracticeMode: PracticeMode;
  onChange: (mode: PracticeMode) => void;
};

export function PracticeModeSelector({
  modes,
  selectedPracticeMode,
  onChange,
}: PracticeModeSelectorProps) {
  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <p className="text-xs font-bold uppercase text-muted">Modo de práctica</p>
      <div className="mt-4 grid gap-2">
        {modes.map((mode) => {
          const isActive = selectedPracticeMode.id === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode)}
              className={`focus-ring rounded-xl border px-4 py-3 text-left transition ${
                isActive
                  ? "border-blue-deep bg-blue-deep text-white"
                  : "border-blue-deep/10 bg-white text-blue-deep hover:bg-blue-soft/45"
              }`}
            >
              <span className="block text-sm font-bold">{mode.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 rounded-xl bg-cream/65 p-3 text-sm leading-6 text-muted">
        {selectedPracticeMode.description}
      </p>
    </section>
  );
}
