"use client";

import { Pause, Play, Repeat2, RotateCcw, Turtle, Gauge } from "lucide-react";
import type { TempoMode } from "@/types/practice";

type PracticeControlsProps = {
  isPlaying: boolean;
  tempoMode: TempoMode;
  loopFocusEnabled: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRepeat: () => void;
  onLoopFocusChange: (enabled: boolean) => void;
  onTempoChange: (tempoMode: TempoMode) => void;
};

export function PracticeControls({
  isPlaying,
  tempoMode,
  loopFocusEnabled,
  onPlay,
  onPause,
  onRepeat,
  onLoopFocusChange,
  onTempoChange,
}: PracticeControlsProps) {
  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      {/* TODO: integrar Tone.js para metrónomo, swing, cuantización y sampler de piano real. */}
      <p className="text-xs font-bold uppercase text-muted">Controles</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <button
          type="button"
          onClick={onPlay}
          disabled={isPlaying}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-deep px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Play aria-hidden="true" className="h-4 w-4" />
          Reproducir guía
        </button>
        <button
          type="button"
          onClick={onPause}
          disabled={!isPlaying}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-deep/15 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/45 disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Pause aria-hidden="true" className="h-4 w-4" />
          Pausar
        </button>
        <button
          type="button"
          onClick={onRepeat}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-deep/15 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/45"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Repetir foco
        </button>
        <button
          type="button"
          onClick={() => onLoopFocusChange(!loopFocusEnabled)}
          className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
            loopFocusEnabled
              ? "bg-gold-soft text-[#543b12]"
              : "border border-blue-deep/15 bg-white text-blue-deep hover:bg-blue-soft/45"
          }`}
        >
          <Repeat2 aria-hidden="true" className="h-4 w-4" />
          Loop foco
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onTempoChange("lento")}
          className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
            tempoMode === "lento"
              ? "bg-gold-soft text-[#543b12]"
              : "border border-blue-deep/15 bg-white text-blue-deep hover:bg-blue-soft/45"
          }`}
        >
          <Turtle aria-hidden="true" className="h-4 w-4" />
          Tempo lento
        </button>
        <button
          type="button"
          onClick={() => onTempoChange("normal")}
          className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
            tempoMode === "normal"
              ? "bg-gold-soft text-[#543b12]"
              : "border border-blue-deep/15 bg-white text-blue-deep hover:bg-blue-soft/45"
          }`}
        >
          <Gauge aria-hidden="true" className="h-4 w-4" />
          Tempo normal
        </button>
      </div>
      <p className="mt-4 text-sm font-semibold text-muted">
        Estado: {isPlaying ? "guía avanzando nota por nota" : "en pausa"} ·{" "}
        {tempoMode === "lento" ? "lento" : "normal"} ·{" "}
        {loopFocusEnabled ? "loop activo" : "una pasada"}
      </p>
    </section>
  );
}
