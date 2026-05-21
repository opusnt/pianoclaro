"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";

import { RhythmVisualizer } from "@/components/modules/rhythm/RhythmVisualizer";
import { ScorePanel } from "@/components/modules/rhythm/ScorePanel";
import { TimingFeedback } from "@/components/modules/rhythm/TimingFeedback";
import { VirtualPianoInput } from "@/components/modules/rhythm/VirtualPianoInput";
import { useRhythmEngine } from "@/components/modules/rhythm/hooks/useRhythmEngine";
import { getAdaptiveHint } from "@/lib/rhythm/scoring";
import type { ExerciseAttempt, RhythmExercise, RhythmExerciseProgress } from "@/types/rhythm";

type RhythmExerciseScreenProps = {
  exercise: RhythmExercise;
  progress?: RhythmExerciseProgress;
  onAttemptComplete: (attempt: ExerciseAttempt) => void;
};

export function RhythmExerciseScreen({
  exercise,
  progress,
  onAttemptComplete,
}: RhythmExerciseScreenProps) {
  const failedAttempts = progress?.lastAttempt && !progress.lastAttempt.passed && progress.attempts >= 2 ? 2 : 0;
  const engine = useRhythmEngine({
    exercise,
    failedAttempts,
    onAttemptComplete,
  });
  const submitInputRef = useRef(engine.submitInput);
  const isInputDisabled = engine.state !== "playing";
  const beatLabel =
    engine.beatEvents.length > 0
      ? `${Math.min(engine.currentBeatIndex + 1, engine.beatEvents.length)}/${engine.beatEvents.length}`
      : `0/${exercise.totalBeats}`;

  useEffect(() => {
    submitInputRef.current = engine.submitInput;
  }, [engine.submitInput]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "Space" && event.code !== "Enter") {
        return;
      }

      event.preventDefault();
      submitInputRef.current("keyboard", event.code);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-gold-soft">Ejercicio activo</p>
          <h2 className="mt-1 text-3xl font-bold text-blue-deep">{exercise.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{exercise.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {engine.state === "intro" || engine.state === "paused" || engine.state === "failed" || engine.state === "completed" ? (
            <button
              type="button"
              onClick={engine.startExercise}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
            >
              <Play aria-hidden="true" className="h-4 w-4" />
              {engine.state === "paused" ? "Reiniciar intento" : "Iniciar"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={engine.pauseExercise}
            disabled={engine.state !== "playing" && engine.state !== "countdown"}
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Pause aria-hidden="true" className="h-4 w-4" />
            Pausar
          </button>
          <button
            type="button"
            onClick={engine.resetExercise}
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="mt-5">
        <ScorePanel
          score={engine.scoring.score}
          accuracy={engine.scoring.accuracy}
          combo={engine.scoring.combo}
          comboMax={engine.scoring.comboMax}
          bpm={engine.currentBeat?.bpm ?? engine.effectiveBpm}
          beatLabel={beatLabel}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div>
          <div className="relative">
            <RhythmVisualizer
              beatEvents={engine.beatEvents}
              currentBeatIndex={engine.currentBeatIndex}
              pulseProgress={engine.pulseProgress}
              lastResult={engine.lastResult}
            />
            {engine.state === "countdown" && engine.countdown ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ivory/85 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-sm font-bold uppercase text-gold-soft">Cuenta regresiva</p>
                  <p className="mt-2 text-7xl font-bold text-blue-deep">{engine.countdown}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <TimingFeedback message={engine.feedback} result={engine.lastResult} />
          <VirtualPianoInput disabled={isInputDisabled} onInput={engine.submitInput} />
          <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
            <p className="text-xs font-bold uppercase text-muted">Ayuda inteligente</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-blue-deep">
              {getAdaptiveHint(progress?.lastAttempt)}
            </p>
          </div>
          <div className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
            <p className="text-xs font-bold uppercase text-muted">Estado</p>
            <p className="mt-2 text-sm font-bold text-blue-deep">
              {engine.state === "intro"
                ? "Listo para empezar"
                : engine.state === "countdown"
                  ? "Prepárate"
                  : engine.state === "playing"
                    ? "Tocando"
                    : engine.state === "paused"
                      ? "Pausado"
                      : engine.state === "completed"
                        ? "Aprobado"
                        : "Reintentar"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
