"use client";

import { Headphones, Keyboard, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMidiKeyboardInput } from "@/components/lesson/hooks/useMidiKeyboardInput";
import { useRhythmEngine } from "@/components/modules/rhythm/hooks/useRhythmEngine";
import { RhythmVisualizer } from "@/components/modules/rhythm/RhythmVisualizer";
import { ScorePanel } from "@/components/modules/rhythm/ScorePanel";
import { TimingFeedback } from "@/components/modules/rhythm/TimingFeedback";
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
  const failedAttempts =
    progress?.lastAttempt && !progress.lastAttempt.passed && progress.attempts >= 2 ? 2 : 0;
  const engine = useRhythmEngine({
    exercise,
    failedAttempts,
    onAttemptComplete,
  });
  const isIntro = engine.state === "intro";
  const submitInputRef = useRef(engine.submitInput);
  const visualizerMode =
    engine.state === "previewing" ? "listen" : engine.state === "playing" ? "play" : "idle";
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

  useMidiKeyboardInput({
    enabled: engine.state === "playing" || engine.state === "countdown",
    onNaturalKeyPress: () => submitInputRef.current("keyboard", "Midi"),
    onSharpKeyPress: () => submitInputRef.current("keyboard", "Midi"),
  });

  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-gold-soft">Ejercicio activo</p>
          <h2 className="mt-1 text-3xl font-bold text-blue-deep">{exercise.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{exercise.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {engine.state === "failed" || engine.state === "completed" ? (
            <button
              type="button"
              onClick={engine.previewExercise}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
            >
              <Headphones aria-hidden="true" className="h-4 w-4" />
              Escuchar ritmo
            </button>
          ) : null}
          {engine.state === "paused" ||
          engine.state === "failed" ||
          engine.state === "completed" ? (
            <button
              type="button"
              onClick={engine.startExercise}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
            >
              <Play aria-hidden="true" className="h-4 w-4" />
              {engine.state === "paused" ? "Reiniciar intento" : "Practicar ahora"}
            </button>
          ) : null}
          {engine.state === "previewing" ? (
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 cursor-wait items-center gap-2 rounded-2xl border border-gold-soft/45 bg-gold-soft/15 px-4 py-3 text-sm font-bold text-blue-deep"
            >
              <Headphones aria-hidden="true" className="h-4 w-4" />
              Escuchando
            </button>
          ) : null}
          <button
            type="button"
            onClick={engine.pauseExercise}
            disabled={
              engine.state !== "playing" &&
              engine.state !== "countdown" &&
              engine.state !== "previewing"
            }
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
        <RhythmLessonFlow state={engine.state} exerciseType={exercise.type} />
      </div>

      {isIntro ? (
        <RhythmStartPanel
          exercise={exercise}
          onPreview={engine.previewExercise}
          onStart={engine.startExercise}
        />
      ) : (
        <>
          <div className="mt-4">
            <ScorePanel
              score={engine.scoring.score}
              accuracy={engine.scoring.accuracy}
              combo={engine.scoring.combo}
              comboMax={engine.scoring.comboMax}
              bpm={engine.currentBeat?.bpm ?? engine.effectiveBpm}
              beatLabel={beatLabel}
            />
          </div>

          <div className="mt-5 grid gap-5 min-[1500px]:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
            <div className="min-w-0">
              <div className="relative">
                <RhythmVisualizer
                  beatEvents={engine.beatEvents}
                  currentBeatIndex={engine.currentBeatIndex}
                  pulseProgress={engine.pulseProgress}
                  lastResult={engine.lastResult}
                  mode={visualizerMode}
                  pulseDisabled={engine.state !== "playing"}
                  onPulsePress={() => engine.submitInput("touch")}
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

            <div className="grid min-w-0 gap-4 md:grid-cols-2 min-[1500px]:block min-[1500px]:space-y-4">
              <TimingFeedback message={engine.feedback} result={engine.lastResult} />
              <InputHint isActive={engine.state === "playing"} />
              <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
                <p className="text-xs font-bold uppercase text-muted">Ayuda inteligente</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-blue-deep">
                  {getAdaptiveHint(progress?.lastAttempt)}
                </p>
              </div>
              <div className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
                <p className="text-xs font-bold uppercase text-muted">Estado</p>
                <p className="mt-2 text-sm font-bold text-blue-deep">
                  {engine.state === "previewing"
                    ? "Escuchando el patrón"
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
        </>
      )}
    </section>
  );
}

function RhythmStartPanel({
  exercise,
  onPreview,
  onStart,
}: {
  exercise: RhythmExercise;
  onPreview: () => void;
  onStart: () => void;
}) {
  const isPatternExercise =
    exercise.type === "pattern_tap" ||
    exercise.type === "pattern_repeat" ||
    exercise.type === "final_performance";

  return (
    <div className="mt-5 rounded-2xl border border-blue-deep/10 bg-ivory p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase text-gold-soft">Antes de tocar</p>
          <h3 className="mt-1 text-2xl font-bold text-blue-deep">
            Primero escucha el patrón. Después replica.
          </h3>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-muted">
            {isPatternExercise
              ? "En esta lección hay momentos de tocar y momentos de esperar. Escucha la secuencia completa para memorizar dónde cae cada pulso activo."
              : "En esta lección el objetivo es sentir una distancia constante entre beats. Escucha el click completo y luego toca el círculo central cuando llegue el pulso."}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <RhythmStartStep title="1. Escucha" text="Detecta la distancia entre cada beat." />
            <RhythmStartStep
              title="2. Anticipa"
              text="Mira el anillo: se acerca al centro antes del toque."
            />
            <RhythmStartStep
              title="3. Toca"
              text="Usa el círculo central, barra espaciadora o Enter."
            />
          </div>
        </div>

        <div className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
          <p className="text-xs font-bold uppercase text-muted">Ritmo de esta lección</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm font-bold text-blue-deep">
            <div className="rounded-xl bg-blue-soft/35 p-3">
              <span className="block text-xs uppercase text-muted">Tempo</span>
              {exercise.bpm} BPM
            </div>
            <div className="rounded-xl bg-blue-soft/35 p-3">
              <span className="block text-xs uppercase text-muted">Duración</span>
              {exercise.totalBeats} beats
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={onPreview}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
            >
              <Headphones aria-hidden="true" className="h-4 w-4" />
              Escuchar ritmo
            </button>
            <button
              type="button"
              onClick={onStart}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
            >
              <Play aria-hidden="true" className="h-4 w-4" />
              Practicar ahora
            </button>
          </div>
          <p className="mt-3 text-xs font-semibold leading-5 text-muted">
            La puntuación empieza solo cuando presionas practicar.
          </p>
        </div>
      </div>
    </div>
  );
}

function RhythmStartStep({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
      <p className="text-sm font-black text-blue-deep">{title}</p>
      <p className="mt-2 text-xs font-semibold leading-5 text-muted">{text}</p>
    </div>
  );
}

function RhythmLessonFlow({
  state,
  exerciseType,
}: {
  state: string;
  exerciseType: RhythmExercise["type"];
}) {
  const steps = [
    {
      title: "1. Escucha",
      description:
        exerciseType === "follow_pulse"
          ? "Identifica la distancia constante entre beats."
          : "Memoriza cuándo suena TOCA y cuándo hay espera.",
      active: state === "intro" || state === "previewing",
    },
    {
      title: "2. Prepárate",
      description: "La cuenta 3, 2, 1 marca el inicio real del intento.",
      active: state === "countdown",
    },
    {
      title: "3. Replica",
      description: "Toca el círculo central, barra espaciadora o Enter.",
      active: state === "playing",
    },
  ];

  return (
    <div className="grid gap-3 rounded-2xl border border-blue-deep/10 bg-ivory p-3 md:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.title}
          className={`rounded-xl border p-3 transition ${
            step.active
              ? "border-gold-soft bg-white shadow-[0_10px_24px_rgba(18,52,91,0.08)]"
              : "border-blue-deep/10 bg-white/65"
          }`}
        >
          <p className="text-sm font-black text-blue-deep">{step.title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-muted">{step.description}</p>
        </div>
      ))}
    </div>
  );
}

function InputHint({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        isActive ? "border-blue-deep/15 bg-blue-soft/35" : "border-blue-deep/10 bg-white/85"
      }`}
    >
      <p className="text-xs font-bold uppercase text-muted">Input</p>
      <p className="mt-2 text-sm font-bold leading-6 text-blue-deep">
        Toca el círculo central cuando llegue el pulso.
      </p>
      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-muted">
        <Keyboard aria-hidden="true" className="h-4 w-4 text-gold-soft" />
        También puedes usar barra espaciadora o Enter.
      </p>
    </div>
  );
}
