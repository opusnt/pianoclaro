"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { trackHarmonicFieldEvent } from "@/lib/harmonic-field/analytics";
import {
  playArpeggiatedChord,
  playDegreeChord,
  playFieldScale,
  playHarmonicFieldError,
  playHarmonicFieldNote,
  playHarmonicFieldSuccess,
  playProgression,
} from "@/lib/harmonic-field/audio";
import {
  generateHarmonicFieldQuestions,
  getExerciseUnitCount,
  getExpectedOptionForQuestion,
} from "@/lib/harmonic-field/questions";
import {
  buildHarmonicFieldAttempt,
  getHarmonicFieldFeedback,
  pointsForHarmonicFieldAnswer,
  scoreHarmonicFieldAnswers,
} from "@/lib/harmonic-field/scoring";
import {
  countCorrectChordNotes,
  getChordByDegree,
  getDisplayNoteName,
  normalizePitchClasses,
  requireField,
  stripOctave,
  validateChordPitchClasses,
} from "@/lib/harmonic-field/theory";
import type {
  HarmonicFieldAnswer,
  HarmonicFieldAttempt,
  HarmonicFieldExercise,
  HarmonicFieldExerciseProgress,
  HarmonicFieldQuestion,
} from "@/types/harmonic-field";

type HarmonicFieldExerciseState = "intro" | "active" | "completed" | "failed";

type UseHarmonicFieldEngineOptions = {
  exercise: HarmonicFieldExercise;
  progress?: HarmonicFieldExerciseProgress;
  onAttemptComplete: (attempt: HarmonicFieldAttempt) => void;
};

export function useHarmonicFieldEngine({ exercise, progress, onAttemptComplete }: UseHarmonicFieldEngineOptions) {
  const questions = useMemo(() => generateHarmonicFieldQuestions(exercise), [exercise]);
  const totalUnits = useMemo(() => getExerciseUnitCount(questions), [questions]);
  const [state, setState] = useState<HarmonicFieldExerciseState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [answers, setAnswers] = useState<HarmonicFieldAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<HarmonicFieldAnswer | null>(null);
  const [message, setMessage] = useState("Inicia el ejercicio para construir acordes desde la escala.");
  const [helpUsed, setHelpUsed] = useState(false);
  const [replayUsed, setReplayUsed] = useState(false);
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const audioRef = useRef<PianoAudioEngine | null>(null);
  const currentQuestion = questions[currentIndex];
  const scoring = useMemo(() => scoreHarmonicFieldAnswers(answers, totalUnits), [answers, totalUnits]);
  const assistedMode = Boolean(progress?.lastAttempt && progress.lastAttempt.accuracy < 0.6);
  const isComplete = state === "completed" || state === "failed";
  const questionComplete = Boolean(currentAnswer);

  useEffect(() => {
    resetExercise();
    return () => audioRef.current?.stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  function getAudio() {
    if (!audioRef.current) audioRef.current = new PianoAudioEngine();
    return audioRef.current;
  }

  function startExercise() {
    setState("active");
    setCurrentIndex(0);
    setSelectedNotes([]);
    setAnswers([]);
    setCurrentAnswer(null);
    setHelpUsed(assistedMode);
    setReplayUsed(false);
    setStartedAt(new Date().toISOString());
    setMessage(assistedMode ? "Modo ayuda activo: mira las notas del acorde antes de responder." : "Construye el acorde desde su grado.");
    trackHarmonicFieldEvent("harmonic_field_exercise_started", { moduleId: exercise.moduleId, exerciseId: exercise.id });
    void playQuestionAudio({ markReplay: false });
  }

  function resetExercise() {
    setState("intro");
    setCurrentIndex(0);
    setSelectedNotes([]);
    setAnswers([]);
    setCurrentAnswer(null);
    setHelpUsed(false);
    setReplayUsed(false);
    setMessage("Inicia el ejercicio para construir acordes desde la escala.");
    audioRef.current?.stopAll();
  }

  async function playQuestionAudio({ markReplay = true }: { markReplay?: boolean } = {}) {
    if (!currentQuestion) return;
    if (markReplay) setReplayUsed(true);
    if (currentQuestion.progression?.length) {
      await playProgression(getAudio(), currentQuestion.fieldId, currentQuestion.progression);
      trackHarmonicFieldEvent("harmonic_field_progression_played", {
        moduleId: exercise.moduleId,
        exerciseId: exercise.id,
        fieldId: currentQuestion.fieldId,
        progression: currentQuestion.progression,
      });
      return;
    }
    if (currentQuestion.degree) {
      const field = requireField(currentQuestion.fieldId);
      const chord = getChordByDegree(field, currentQuestion.degree);
      await playDegreeChord(getAudio(), currentQuestion.fieldId, currentQuestion.degree);
      await playArpeggiatedChord(getAudio(), chord.midiNotes, 190);
      return;
    }
    await playFieldScale(getAudio(), currentQuestion.fieldId);
  }

  function revealHint() {
    setHelpUsed(true);
    setMessage("Ayuda activa: mira la escala, el grado actual y las notas del acorde esperado.");
  }

  function toggleNote(note: string) {
    if (!currentQuestion || state !== "active" || currentAnswer || currentQuestion.answerOptions) return;
    void playHarmonicFieldNote(getAudio(), note, 220);
    setSelectedNotes((current) => {
      const pitch = stripOctave(note);
      const exists = current.some((selected) => stripOctave(selected) === pitch);
      if (exists) return current.filter((selected) => stripOctave(selected) !== pitch);
      if (current.length >= 3) return [...current.slice(1), note];
      return [...current, note];
    });
  }

  function clearSelection() {
    if (currentAnswer) return;
    setSelectedNotes([]);
  }

  function confirmChord() {
    if (!currentQuestion || currentQuestion.answerOptions || currentAnswer || state !== "active") return;
    if (!currentQuestion.degree) return;
    const field = requireField(currentQuestion.fieldId);
    const chord = getChordByDegree(field, currentQuestion.degree);
    const isCorrect = validateChordPitchClasses(chord.notes, selectedNotes);
    const correctNotesCount = countCorrectChordNotes(chord.notes, selectedNotes);
    const expectedPitchSet = new Set(normalizePitchClasses(chord.notes));
    const selectedPitchSet = new Set(normalizePitchClasses(selectedNotes));
    const missingNotes = chord.notes.filter((note) => !selectedPitchSet.has(normalizePitchClasses([note])[0]));
    const extraNotes = selectedNotes.filter((note) => !expectedPitchSet.has(normalizePitchClasses([note])[0]));
    const answer: HarmonicFieldAnswer = {
      questionId: currentQuestion.id,
      selectedNotes,
      isCorrect,
      expectedAnswer: chord.notes.map(getDisplayNoteName),
      userAnswer: selectedNotes.map(getDisplayNoteName),
      correctNotesCount,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
      fieldId: currentQuestion.fieldId,
      keyId: field.keyId,
      degree: chord.degree,
      chordQuality: chord.quality,
      functionRole: chord.functionRole,
      progressionId: currentQuestion.progressionId,
      points: pointsForHarmonicFieldAnswer({
        isCorrect,
        helpUsed: helpUsed || assistedMode,
        replayUsed,
        correctNotesCount,
      }),
      errorDetails: isCorrect
        ? undefined
        : {
            expectedNotes: chord.notes,
            selectedNotes,
          },
    };
    commitAnswer(answer);
  }

  function answerWithOption(option: string) {
    if (!currentQuestion || !currentQuestion.answerOptions || currentAnswer || state !== "active") return;
    const field = requireField(currentQuestion.fieldId);
    const chord = currentQuestion.degree ? getChordByDegree(field, currentQuestion.degree) : undefined;
    const expectedAnswer = getExpectedOptionForQuestion(currentQuestion);
    const isCorrect = option === expectedAnswer;
    const answer: HarmonicFieldAnswer = {
      questionId: currentQuestion.id,
      selectedOption: option,
      selectedDegree: currentQuestion.expectedDegree,
      isCorrect,
      expectedAnswer,
      userAnswer: option,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
      fieldId: currentQuestion.fieldId,
      keyId: field.keyId,
      degree: currentQuestion.degree,
      chordQuality: chord?.quality ?? currentQuestion.chordQuality,
      functionRole: currentQuestion.expectedFunction ?? chord?.functionRole,
      progressionId: currentQuestion.progressionId,
      points: pointsForHarmonicFieldAnswer({ isCorrect, helpUsed: helpUsed || assistedMode, replayUsed }),
      errorDetails: isCorrect
        ? undefined
        : {
            expectedDegree: currentQuestion.expectedDegree,
            expectedQuality: chord?.quality,
            expectedFunction: currentQuestion.expectedFunction,
          },
    };
    commitAnswer(answer);
  }

  function commitAnswer(answer: HarmonicFieldAnswer) {
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setCurrentAnswer(answer);
    setMessage(getHarmonicFieldFeedback({ question: currentQuestion as HarmonicFieldQuestion, answer }));
    trackAnswer(answer, nextAnswers);
    if (answer.isCorrect) void playHarmonicFieldSuccess(getAudio());
    else void playHarmonicFieldError(getAudio());
  }

  function nextQuestion() {
    if (!questionComplete) return;
    if (currentIndex >= questions.length - 1) {
      finishExercise();
      return;
    }
    setCurrentIndex((index) => index + 1);
    setSelectedNotes([]);
    setCurrentAnswer(null);
    setHelpUsed(assistedMode);
    setReplayUsed(false);
    setMessage("Siguiente ronda. Traduce primero el grado y luego toca el acorde.");
  }

  function finishExercise() {
    const attempt = buildHarmonicFieldAttempt({ exercise, startedAt, answers, totalUnits });
    setState(attempt.passed ? "completed" : "failed");
    setMessage(
      attempt.passed
        ? "Ejercicio aprobado. Ya puedes conectar escala, grado y acorde."
        : "Repite el ejercicio: revisa el patrón mayor, menor, menor, mayor, mayor, menor, disminuido.",
    );
    onAttemptComplete(attempt);
  }

  function trackAnswer(answer: HarmonicFieldAnswer, nextAnswers: HarmonicFieldAnswer[]) {
    const nextScoring = scoreHarmonicFieldAnswers(nextAnswers, totalUnits);
    trackHarmonicFieldEvent("harmonic_field_question_answered", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
      questionId: answer.questionId,
      fieldId: answer.fieldId,
      keyId: answer.keyId,
      degree: answer.degree,
      chordQuality: answer.chordQuality,
      functionRole: answer.functionRole,
      progression: currentQuestion?.progression,
      isCorrect: answer.isCorrect,
      score: nextScoring.score,
      accuracy: nextScoring.accuracy,
      selectedNotes: answer.selectedNotes,
      expectedNotes: answer.expectedAnswer,
      helpUsed: answer.helpUsed,
      replayUsed: answer.replayUsed,
    });
  }

  return {
    state,
    questions,
    totalUnits,
    currentQuestion,
    currentIndex,
    selectedNotes,
    currentAnswer,
    answers,
    scoring,
    message,
    helpUsed,
    replayUsed,
    assistedMode,
    isComplete,
    questionComplete,
    startExercise,
    resetExercise,
    playQuestionAudio,
    revealHint,
    toggleNote,
    clearSelection,
    confirmChord,
    answerWithOption,
    nextQuestion,
  };
}
