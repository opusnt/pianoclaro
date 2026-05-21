"use client";

import { Volume2, VolumeX } from "lucide-react";

type AudioSettingsProps = {
  volume: number;
  isMuted: boolean;
  metronomeEnabled: boolean;
  onVolumeChange: (volume: number) => void;
  onMutedChange: (isMuted: boolean) => void;
  onMetronomeChange: (isEnabled: boolean) => void;
};

export function AudioSettings({
  volume,
  isMuted,
  metronomeEnabled,
  onVolumeChange,
  onMutedChange,
  onMetronomeChange,
}: AudioSettingsProps) {
  const volumePercent = Math.round(volume * 100);

  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-muted">Audio</p>
          <p className="mt-1 text-sm font-semibold text-blue-deep">
            {isMuted ? "Silencio activo" : `Volumen ${volumePercent}%`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onMutedChange(!isMuted)}
          aria-pressed={isMuted}
          className={`focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border text-blue-deep transition ${
            isMuted
              ? "border-gold-soft bg-gold-soft/35"
              : "border-blue-deep/15 bg-white hover:bg-blue-soft/45"
          }`}
        >
          {isMuted ? (
            <VolumeX aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Volume2 aria-hidden="true" className="h-5 w-5" />
          )}
          <span className="sr-only">{isMuted ? "Activar sonido" : "Silenciar"}</span>
        </button>
      </div>

      <label className="mt-4 block text-xs font-bold uppercase text-muted" htmlFor="lesson-volume">
        Volumen
      </label>
      <input
        id="lesson-volume"
        type="range"
        min="0"
        max="100"
        step="5"
        value={volumePercent}
        onChange={(event) => onVolumeChange(Number(event.target.value) / 100)}
        className="mt-2 w-full accent-gold-soft"
      />

      <label className="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-blue-deep/10 bg-cream/55 px-3 py-3">
        <span>
          <span className="block text-sm font-bold text-blue-deep">Metrónomo en la guía</span>
          <span className="mt-1 block text-xs font-semibold text-muted">
            Marca el pulso mientras avanza la partitura.
          </span>
        </span>
        <input
          type="checkbox"
          checked={metronomeEnabled}
          onChange={(event) => onMetronomeChange(event.target.checked)}
          className="h-5 w-5 accent-gold-soft"
        />
      </label>
    </section>
  );
}

