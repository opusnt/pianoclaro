"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ScoreNoteSelection } from "@/components/lesson/notation/types";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { pianoLabelByNote, solfegeByNote } from "@/lib/music/notes";
import type { PianoNoteName, SharpNoteName } from "@/lib/music/notes";
import {
  lessonToPracticeSong,
  type PianoClaroNoteEvent,
  type PianoClaroTimelineEvent,
} from "@/lib/music/song-model";
import { evaluateNoteInput, type NoteInputEvaluation } from "@/lib/practice/evaluate-note";
import { getLessonFocusFromPracticeSong, getStudyRoutine } from "@/lib/practice/lesson-engine";
import { getPracticeSessionSummary } from "@/lib/practice/session";
import type { Lesson, LessonStep, NoteName } from "@/types/lesson";
import type { TempoMode } from "@/types/practice";

type UseLessonPracticeOptions = {
  lesson: Lesson;
  activeStep: LessonStep;
  onStepComplete: (stepId: string) => void;
};

export function useLessonPractice({
  lesson,
  activeStep,
  onStepComplete,
}: UseLessonPracticeOptions) {
  const [activeNotes, setActiveNotes] = useState<NoteName[]>(activeStep.activeNotes ?? []);
  const [activeBlackNotes, setActiveBlackNotes] = useState<SharpNoteName[]>([]);
  const [activeMeasure, setActiveMeasure] = useState<number | undefined>(activeStep.activeMeasure);
  const [activePhrase, setActivePhrase] = useState<"A" | "B" | undefined>(
    activeStep.activePhrase,
  );
  const [activeNotePosition, setActiveNotePosition] = useState<{
    measureNumber: number;
    noteIndex: number;
  } | null>(null);
  const [hintNotePosition, setHintNotePosition] = useState<ScoreNoteSelection | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempoMode, setTempoMode] = useState<TempoMode>("lento");
  const [loopFocusEnabled, setLoopFocusEnabled] = useState(false);
  const [expectedEventIndex, setExpectedEventIndex] = useState(0);
  const [volume, setVolume] = useState(0.72);
  const [isMuted, setIsMuted] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(true);
  const [practiceMessage, setPracticeMessage] = useState(
    "Elige un paso y usa la guía para ver cómo avanza la lectura.",
  );
  const [audioMessage, setAudioMessage] = useState(
    "El sonido se activará cuando toques una tecla o reproduzcas la guía.",
  );
  const [lastFeedback, setLastFeedback] = useState<NoteInputEvaluation | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const audioEngineRef = useRef<PianoAudioEngine | null>(null);
  const playbackTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const practiceSong = useMemo(() => lessonToPracticeSong(lesson), [lesson]);
  const activeFocus = useMemo(
    () => getLessonFocusFromPracticeSong(practiceSong, activeStep),
    [activeStep, practiceSong],
  );
  const studyRoutine = useMemo(
    () => getStudyRoutine(lesson, activeStep, activeFocus),
    [activeFocus, activeStep, lesson],
  );
  const activePracticeEvent = useMemo(() => {
    if (!activeNotePosition) {
      return undefined;
    }

    return activeFocus.events.find((event) => {
      return (
        event.measureNumber === activeNotePosition.measureNumber &&
        event.noteIndex === activeNotePosition.noteIndex
      );
    });
  }, [activeFocus.events, activeNotePosition]);
  const expectedPracticeEvent = activeFocus.events[expectedEventIndex] ?? activeFocus.events[0];
  const practiceSessionSummary = useMemo(() => {
    return getPracticeSessionSummary({
      song: practiceSong,
      focus: activeFocus,
      activeStep,
      activeEvent: activePracticeEvent ?? expectedPracticeEvent,
    });
  }, [activeFocus, activePracticeEvent, activeStep, expectedPracticeEvent, practiceSong]);

  useEffect(() => {
    const firstFocusEvent = activeFocus.events[0];

    clearPlaybackTimers();
    setIsPlaying(false);
    setExpectedEventIndex(0);
    setActiveNotePosition(
      firstFocusEvent
        ? {
            measureNumber: firstFocusEvent.measureNumber,
            noteIndex: firstFocusEvent.noteIndex,
          }
        : null,
    );
    setActiveNotes(firstFocusEvent ? [firstFocusEvent.note] : activeFocus.notes);
    setActiveBlackNotes([]);
    setActiveMeasure(firstFocusEvent?.measureNumber ?? activeFocus.measure);
    setActivePhrase(firstFocusEvent?.phrase ?? activeFocus.phrase);
    setHintNotePosition(null);
    setPracticeMessage(activeStep.instruction);
    setLastFeedback(null);
  }, [activeFocus, activeStep]);

  useEffect(() => {
    return () => {
      clearPlaybackTimers();
      audioEngineRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const audioEngine = getAudioEngine();
    audioEngine.setVolume(volume);
    audioEngine.setMuted(isMuted);
  }, [isMuted, volume]);

  function clearPlaybackTimers() {
    playbackTimersRef.current.forEach((timer) => clearTimeout(timer));
    playbackTimersRef.current = [];
  }

  function getAudioEngine() {
    if (!audioEngineRef.current) {
      audioEngineRef.current = new PianoAudioEngine();
      audioEngineRef.current.setVolume(volume);
      audioEngineRef.current.setMuted(isMuted);
    }

    return audioEngineRef.current;
  }

  async function playNote(note: PianoNoteName, durationMs = 420) {
    if (isMuted) {
      setAudioMessage(`Silencio activo. ${pianoLabelByNote[note]} queda resaltada sin sonido.`);
      return;
    }

    try {
      await getAudioEngine().playNote(note, durationMs);
      setAudioMessage(`Sonando ${pianoLabelByNote[note]}.`);
    } catch {
      setAudioMessage("No se pudo activar el audio en este navegador.");
    }
  }

  function getExpectedInputNotes() {
    if (expectedPracticeEvent) {
      return [expectedPracticeEvent.note];
    }

    return activeNotes.length > 0 ? activeNotes : (activeStep.activeNotes ?? []);
  }

  function recordStudentInput(note: PianoNoteName) {
    const feedback = evaluateNoteInput({
      playedNote: note,
      expectedNotes: getExpectedInputNotes(),
    });

    setLastFeedback(feedback);

    if (feedback.status !== "explore") {
      setAttemptCount((current) => current + 1);
    }

    if (feedback.status === "correct") {
      setCorrectCount((current) => current + 1);
      setStreak((current) => current + 1);
    }

    if (feedback.status === "incorrect") {
      setStreak(0);
    }

    return feedback;
  }

  function setVisualFocusFromEvent(event: PianoClaroNoteEvent) {
    setActiveNotePosition({
      measureNumber: event.measureNumber,
      noteIndex: event.noteIndex,
    });
    setActiveNotes([event.note]);
    setActiveBlackNotes([]);
    setActiveMeasure(event.measureNumber);
    setActivePhrase(event.phrase);
  }

  function advanceSequenceAfterCorrectInput() {
    if (!expectedPracticeEvent || activeFocus.events.length === 0) {
      return;
    }

    const nextIndex = expectedEventIndex + 1;
    const nextEvent = activeFocus.events[nextIndex];

    if (!nextEvent) {
      onStepComplete(activeStep.id);
      setPracticeMessage(
        `Foco completado: leíste ${activeFocus.events.length} nota${
          activeFocus.events.length === 1 ? "" : "s"
        } en orden.`,
      );
      return;
    }

    setExpectedEventIndex(nextIndex);
    setVisualFocusFromEvent(nextEvent);
    setPracticeMessage(
      `Bien. Ahora sigue con ${solfegeByNote[nextEvent.note]} en el compás ${nextEvent.measureNumber}.`,
    );
  }

  function stopGuidedPractice(message = "Guía pausada. Puedes repetir el foco o cambiar de paso.") {
    clearPlaybackTimers();
    audioEngineRef.current?.stopAll();
    setIsPlaying(false);
    setActiveNotePosition(null);
    setPracticeMessage(message);
  }

  function handleScoreNoteSelect(selection: ScoreNoteSelection) {
    const measure = lesson.score.measures.find((currentMeasure) => {
      return currentMeasure.number === selection.measureNumber;
    });

    stopGuidedPractice(
      `Pista abierta: ${solfegeByNote[selection.note]} está marcada en la partitura y en el teclado.`,
    );
    setHintNotePosition(selection);
    setActiveNotePosition(selection);
    setActiveNotes([selection.note]);
    setActiveBlackNotes([]);
    setActiveMeasure(selection.measureNumber);
    setActivePhrase(measure?.phrase);
    void playNote(selection.note, 360);
  }

  async function playGuidedPractice() {
    const practiceEvents = activeFocus.timelineEvents;

    if (practiceEvents.length === 0) {
      return;
    }

    const audioReady = isMuted ? false : await getAudioEngine().prepare();

    if (isMuted) {
      setAudioMessage("Guía visual activa con el sonido en silencio.");
    } else if (!audioReady) {
      setAudioMessage("Tu navegador no tiene Web Audio disponible.");
    } else {
      setAudioMessage(
        metronomeEnabled ? "Audio y metrónomo activos para la guía." : "Audio activo para la guía.",
      );
    }

    clearPlaybackTimers();
    setIsPlaying(true);
    setPracticeMessage("La guía está recorriendo y sonando nota por nota.");

    const tempoMultiplier = tempoMode === "lento" ? 0.62 : 1;
    const msPerBeat = (60_000 / practiceSong.config.tempoBpm) / tempoMultiplier;
    const firstBeat = practiceEvents[0]?.startsAtBeat ?? 1;
    let playbackEndsAt = 0;

    practiceEvents.forEach((event) => {
      const startsAtMs = Math.max(0, (event.startsAtBeat - firstBeat) * msPerBeat);
      const noteDurationMs = Math.max(220, Math.round(event.durationBeats * msPerBeat * 0.78));
      playbackEndsAt = Math.max(playbackEndsAt, startsAtMs + noteDurationMs);
      const timer = setTimeout(() => {
        handleGuidedTimelineEvent(event, noteDurationMs);
      }, startsAtMs);

      playbackTimersRef.current.push(timer);
    });

    const finishTimer = setTimeout(() => {
      setIsPlaying(false);
      setActiveNotePosition(null);
      if (loopFocusEnabled) {
        setPracticeMessage("Loop activo: repetimos el foco para consolidar lectura y pulso.");
        const loopTimer = setTimeout(() => {
          void playGuidedPractice();
        }, 520);
        playbackTimersRef.current.push(loopTimer);
        return;
      }
      setPracticeMessage("Guía terminada. Repite el foco o avanza al siguiente paso.");
    }, playbackEndsAt + 140);

    playbackTimersRef.current.push(finishTimer);
  }

  function handleGuidedTimelineEvent(event: PianoClaroTimelineEvent, noteDurationMs: number) {
    if (metronomeEnabled && !isMuted) {
      void getAudioEngine().playMetronomeTick(event.beat === 1);
    }

    if (event.kind === "rest") {
      setActiveNotePosition(null);
      setActiveNotes([]);
      setPracticeMessage(`Silencio en el compás ${event.measureNumber}: escucha el pulso y espera.`);
      return;
    }

    setVisualFocusFromEvent(event);
    setPracticeMessage(
      `Ahora mira y toca ${solfegeByNote[event.note]} en el compás ${event.measureNumber}.`,
    );
    void playNote(event.note, noteDurationMs);
  }

  function repeatFocus() {
    stopGuidedPractice("Repitiendo el foco actual.");
    window.setTimeout(() => {
      void playGuidedPractice();
    }, 40);
  }

  function handleKeyboardPress(note: NoteName) {
    const feedback = recordStudentInput(note);
    stopGuidedPractice(feedback.message);
    if (feedback.status === "correct") {
      advanceSequenceAfterCorrectInput();
    } else {
      setActiveNotes([note]);
      setActiveBlackNotes([]);
    }
    void playNote(note, 430);
  }

  function handleBlackKeyboardPress(note: SharpNoteName) {
    const feedback = recordStudentInput(note);
    stopGuidedPractice(feedback.message);
    if (feedback.status === "correct") {
      advanceSequenceAfterCorrectInput();
    } else {
      setActiveNotes([]);
      setActiveBlackNotes([note]);
    }
    void playNote(note, 430);
  }

  return {
    activeNotes,
    activeBlackNotes,
    activeMeasure,
    activePhrase,
    activeNotePosition,
    hintNotePosition,
    isPlaying,
    tempoMode,
    setTempoMode,
    loopFocusEnabled,
    setLoopFocusEnabled,
    expectedEventIndex,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    metronomeEnabled,
    setMetronomeEnabled,
    practiceMessage,
    audioMessage,
    lastFeedback,
    attemptCount,
    correctCount,
    streak,
    practiceSong,
    activeFocus,
    studyRoutine,
    practiceSessionSummary,
    playGuidedPractice,
    stopGuidedPractice,
    repeatFocus,
    handleKeyboardPress,
    handleBlackKeyboardPress,
    handleScoreNoteSelect,
  };
}
