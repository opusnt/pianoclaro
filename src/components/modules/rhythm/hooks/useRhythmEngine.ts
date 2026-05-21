"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { trackEvent } from "@/lib/rhythm/analytics";
import { buildExerciseAttempt } from "@/lib/rhythm/scoring";
import {
  assistedTimingWindows,
  collectMissedBeats,
  defaultTimingWindows,
  generateBeatEvents,
  getBeatIntervalMs,
} from "@/lib/rhythm/timing";
import type {
  BeatEvent,
  ExerciseAttempt,
  InputType,
  RhythmExercise,
  RhythmExerciseState,
  TimingResult,
} from "@/types/rhythm";
import { useMetronome } from "@/components/modules/rhythm/hooks/useMetronome";
import { useRhythmScoring } from "@/components/modules/rhythm/hooks/useRhythmScoring";
import { useTimingEvaluator } from "@/components/modules/rhythm/hooks/useTimingEvaluator";

type UseRhythmEngineOptions = {
  exercise: RhythmExercise;
  failedAttempts: number;
  onAttemptComplete: (attempt: ExerciseAttempt) => void;
};

const countdownValues = [3, 2, 1];

export function useRhythmEngine({
  exercise,
  failedAttempts,
  onAttemptComplete,
}: UseRhythmEngineOptions) {
  const [state, setState] = useState<RhythmExerciseState>("intro");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [beatEvents, setBeatEvents] = useState<BeatEvent[]>([]);
  const [results, setResults] = useState<TimingResult[]>([]);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const [pulseProgress, setPulseProgress] = useState(0);
  const [feedback, setFeedback] = useState("Pulsa iniciar y toca cuando el anillo llegue al centro.");
  const [lastResult, setLastResult] = useState<TimingResult | null>(null);
  const [effectiveBpm, setEffectiveBpm] = useState(exercise.bpm);
  const audioRef = useRef<PianoAudioEngine | null>(null);
  const beatEventsRef = useRef<BeatEvent[]>([]);
  const resultsRef = useRef<TimingResult[]>([]);
  const countdownTimersRef = useRef<number[]>([]);
  const tickedBeatIdsRef = useRef(new Set<number>());
  const startedAtIsoRef = useRef<string>(new Date().toISOString());
  const completedRef = useRef(false);
  const { startMetronome, stopMetronome } = useMetronome();

  const windows = failedAttempts >= 2 ? assistedTimingWindows : defaultTimingWindows;
  const evaluateUserHit = useTimingEvaluator(windows);
  const expectedHitCount = useMemo(
    () => beatEvents.filter((beat) => beat.shouldTap).length,
    [beatEvents],
  );
  const scoring = useRhythmScoring(results, expectedHitCount);

  const effectiveExercise = useMemo(() => {
    const scale = failedAttempts >= 2 ? 0.9 : 1;
    const speedUp = failedAttempts === 0 && scoring.accuracy >= 0.9 && results.length > 0 ? 1.05 : 1;
    const tempoScale = scale * speedUp;
    const scaleBpm = (bpm: number) => Math.max(40, Math.round(bpm * tempoScale));

    return {
      ...exercise,
      bpm: scaleBpm(exercise.bpm),
      rounds: exercise.rounds?.map((round) => ({
        ...round,
        bpm: scaleBpm(round.bpm),
      })),
    };
  }, [exercise, failedAttempts, results.length, scoring.accuracy]);

  const currentBeat = beatEvents[currentBeatIndex];

  useEffect(() => {
    resetExercise();
    return () => stopClock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  function getAudio() {
    if (!audioRef.current) {
      audioRef.current = new PianoAudioEngine();
    }

    return audioRef.current;
  }

  function stopClock() {
    stopMetronome();
    countdownTimersRef.current.forEach((timer) => clearTimeout(timer));
    countdownTimersRef.current = [];
    audioRef.current?.stopAll();
  }

  function appendResults(nextResults: TimingResult[]) {
    if (nextResults.length === 0) {
      return;
    }

    resultsRef.current = [...resultsRef.current, ...nextResults].sort(
      (a, b) => a.beatIndex - b.beatIndex,
    );
    setResults(resultsRef.current);
    const latest = nextResults.at(-1) ?? null;
    setLastResult(latest);

    if (latest) {
      setFeedback(getFeedbackText(latest));
      trackEvent("rhythm_hit_evaluated", {
        moduleId: exercise.moduleId,
        exerciseId: exercise.id,
        bpm: latest.beatIndex >= 0 ? beatEventsRef.current[latest.beatIndex]?.bpm : exercise.bpm,
        score: latest.points,
        accuracy: scoring.accuracy,
        averageTimingErrorMs: latest.timingErrorMs,
      });
      if (latest.grade === "perfect" || latest.grade === "good") {
        void getAudio().playFrequency(880, 90);
      } else if (latest.grade === "miss") {
        void getAudio().playFrequency(160, 110);
      }
    }
  }

  const finishAttempt = useCallback(() => {
    if (completedRef.current || beatEventsRef.current.length === 0) {
      return;
    }

    completedRef.current = true;
    stopClock();
    const attempt = buildExerciseAttempt({
      exercise: effectiveExercise,
      startedAt: startedAtIsoRef.current,
      finishedAt: new Date().toISOString(),
      results: resultsRef.current,
      beatEvents: beatEventsRef.current,
    });
    setState(attempt.passed ? "completed" : "failed");
    setFeedback(
      attempt.passed
        ? "Ejercicio aprobado. El pulso está entrando en el cuerpo."
        : getFailureFeedback(attempt),
    );
    onAttemptComplete(attempt);
  }, [effectiveExercise, onAttemptComplete]);

  function monitorClock() {
    const now = performance.now();
    const currentEvents = beatEventsRef.current;
    const firstBeat = currentEvents[0];
    const lastBeat = currentEvents.at(-1);

    if (!firstBeat || !lastBeat) {
      return;
    }

    const rawActiveIndex = currentEvents.findIndex(
      (beat) => now < beat.expectedTimestamp + getBeatIntervalMs(beat.bpm),
    );
    const nextIndex = rawActiveIndex === -1 ? currentEvents.length - 1 : Math.max(0, rawActiveIndex);
    const activeBeat = currentEvents[nextIndex] ?? lastBeat;
    const previousBeat = currentEvents[Math.max(0, nextIndex - 1)] ?? firstBeat;
    const interval = getBeatIntervalMs(activeBeat.bpm);
    const progress = Math.min(
      1,
      Math.max(0, (now - (previousBeat.expectedTimestamp ?? firstBeat.expectedTimestamp)) / interval),
    );

    setCurrentBeatIndex(nextIndex);
    setPulseProgress(progress);

    currentEvents.forEach((beat) => {
      if (now >= beat.expectedTimestamp && !tickedBeatIdsRef.current.has(beat.beatIndex)) {
        tickedBeatIdsRef.current.add(beat.beatIndex);
        void getAudio().playMetronomeTick(beat.beatIndex % 4 === 0);
      }
    });

    const misses = collectMissedBeats(now, currentEvents);
    appendResults(misses);

    const allExpectedEvaluated = currentEvents
      .filter((beat) => beat.shouldTap)
      .every((beat) => beat.wasEvaluated);

    if (allExpectedEvaluated && now > lastBeat.expectedTimestamp + 260) {
      finishAttempt();
      return;
    }

    if (now > lastBeat.expectedTimestamp + 420) {
      finishAttempt();
      return;
    }

  }

  function startExercise() {
    resetRuntime();
    setState("countdown");
    setFeedback(
      failedAttempts >= 2
        ? "Modo ayuda activo: tempo un poco más lento y ventana de precisión más amable."
        : "Prepárate. Toca cuando el anillo llegue al centro.",
    );
    countdownValues.forEach((value, index) => {
      const timer = window.setTimeout(() => {
        setCountdown(value);
        void getAudio().playMetronomeTick(value === 1);
      }, index * 720);
      countdownTimersRef.current.push(timer);
    });
    const startTimer = window.setTimeout(() => {
      const startTimestamp = performance.now() + 520;
      const events = generateBeatEvents({
        exercise: effectiveExercise,
        startTimestamp,
      });
      beatEventsRef.current = events;
      setBeatEvents(events);
      startedAtIsoRef.current = new Date().toISOString();
      setEffectiveBpm(events[0]?.bpm ?? effectiveExercise.bpm);
      setCountdown(null);
      setState("playing");
      trackEvent("rhythm_exercise_started", {
        moduleId: exercise.moduleId,
        exerciseId: exercise.id,
        bpm: events[0]?.bpm ?? exercise.bpm,
      });
      startMetronome(monitorClock);
    }, countdownValues.length * 720 + 120);
    countdownTimersRef.current.push(startTimer);
  }

  function submitInput(inputType: InputType, key?: string) {
    if (state !== "playing") {
      return;
    }

    void getAudio().playNote("C", 140);
    const result = evaluateUserHit(
      {
        timestamp: performance.now(),
        inputType,
        key,
      },
      beatEventsRef.current,
    );

    if (!result) {
      setFeedback("Fuera de la ventana del beat. Espera el anillo y vuelve a tocar.");
      setLastResult({
        beatIndex: currentBeatIndex,
        expectedTimestamp: currentBeat?.expectedTimestamp ?? performance.now(),
        grade: "miss",
        points: 0,
        shouldTap: true,
      });
      void getAudio().playFrequency(160, 100);
      return;
    }

    appendResults([result]);
  }

  function pauseExercise() {
    if (state !== "playing" && state !== "countdown") {
      return;
    }

    stopClock();
    setState("paused");
    setFeedback("Pausa activa. Al continuar reiniciaremos el intento para mantener el timing limpio.");
  }

  function resetRuntime() {
    stopClock();
    completedRef.current = false;
    tickedBeatIdsRef.current = new Set();
    beatEventsRef.current = [];
    resultsRef.current = [];
    setBeatEvents([]);
    setResults([]);
    setCurrentBeatIndex(0);
    setPulseProgress(0);
    setLastResult(null);
    setCountdown(null);
  }

  function resetExercise() {
    resetRuntime();
    setState("intro");
    setEffectiveBpm(effectiveExercise.bpm);
    setFeedback("Pulsa iniciar y toca cuando el anillo llegue al centro.");
  }

  return {
    state,
    countdown,
    beatEvents,
    results,
    currentBeatIndex,
    currentBeat,
    pulseProgress,
    feedback,
    lastResult,
    effectiveBpm,
    scoring,
    windows,
    startExercise,
    submitInput,
    pauseExercise,
    resetExercise,
  };
}

function getFeedbackText(result: TimingResult) {
  if (!result.shouldTap) {
    return "Silencio: ahí no se tocaba. Escucha el beat y espera.";
  }

  if (result.grade === "perfect") {
    return "Perfecto. Entraste justo en el pulso.";
  }

  if (result.grade === "good") {
    return "Bien. Estás cerca del beat.";
  }

  if (result.grade === "early") {
    return "Muy pronto. Espera un poco más.";
  }

  if (result.grade === "late") {
    return "Muy tarde. Prepara la mano antes del centro.";
  }

  return "Miss. Ese beat se fue sin tocar a tiempo.";
}

function getFailureFeedback(attempt: ExerciseAttempt) {
  if (attempt.averageTimingErrorMs < -70) {
    return "Estás tocando un poco antes del pulso. Repite esperando el centro del anillo.";
  }

  if (attempt.averageTimingErrorMs > 70) {
    return "Estás tocando un poco después del pulso. Prepara la mano antes del beat.";
  }

  if (attempt.misses > 5) {
    return "Hubo muchos misses. Repite con calma y escucha el click.";
  }

  return "Casi. Repite el ejercicio y busca mantener el mismo pulso.";
}
