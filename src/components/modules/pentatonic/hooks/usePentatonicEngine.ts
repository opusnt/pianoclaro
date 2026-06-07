"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { trackPentatonicEvent } from "@/lib/pentatonic/analytics";
import {
  buildPentatonicImprovisationAnswer,
  buildPentatonicNoteAnswer,
  buildPentatonicOptionAnswer,
  isNoteAllowedInPentatonicScale,
} from "@/lib/pentatonic/answers";
import {
  playBackingLoop,
  playPentatonicError,
  playPentatonicNote,
  playPentatonicScaleById,
  playPentatonicSuccess,
} from "@/lib/pentatonic/audio";
import { generatePentatonicQuestions, getExerciseUnitCount } from "@/lib/pentatonic/questions";
import {
  buildPentatonicAttempt,
  getPentatonicFeedback,
  scorePentatonicAnswers,
} from "@/lib/pentatonic/scoring";
import { getPentatonicScaleById, noteToMidi } from "@/lib/pentatonic/theory";
import type {
  PentatonicAnswer,
  PentatonicAttempt,
  PentatonicExercise,
  PentatonicExerciseProgress,
} from "@/types/pentatonic";

type PentatonicExerciseState = "intro" | "active" | "completed" | "failed";

type UsePentatonicEngineOptions = {
  exercise: PentatonicExercise;
  progress?: PentatonicExerciseProgress;
  onAttemptComplete: (attempt: PentatonicAttempt) => void;
};

export function usePentatonicEngine({
  exercise,
  progress,
  onAttemptComplete,
}: UsePentatonicEngineOptions) {
  const questions = useMemo(() => generatePentatonicQuestions(exercise), [exercise]);
  const totalUnits = useMemo(() => getExerciseUnitCount(questions), [questions]);
  const [state, setState] = useState<PentatonicExerciseState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayedNotes, setCurrentPlayedNotes] = useState<string[]>([]);
  const [improvisedNotes, setImprovisedNotes] = useState<string[]>([]);
  const [answers, setAnswers] = useState<PentatonicAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<PentatonicAnswer | null>(null);
  const [message, setMessage] = useState(
    "Inicia el ejercicio para tocar con una zona pentatónica segura.",
  );
  const [helpUsed, setHelpUsed] = useState(false);
  const [replayUsed, setReplayUsed] = useState(false);
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const audioRef = useRef<PianoAudioEngine | null>(null);
  const currentQuestion = questions[currentIndex];
  const scoring = useMemo(() => scorePentatonicAnswers(answers, totalUnits), [answers, totalUnits]);
  const assistedMode = Boolean(progress?.lastAttempt && progress.lastAttempt.accuracy < 0.6);
  const isComplete = state === "completed" || state === "failed";
  const questionComplete = Boolean(
    currentQuestion?.mode === "improvisation"
      ? currentAnswer
      : currentQuestion?.answerOptions
        ? currentAnswer
        : currentQuestion?.expectedNotes
          ? currentPlayedNotes.length >= currentQuestion.expectedNotes.length
          : currentAnswer,
  );

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
    setCurrentPlayedNotes([]);
    setImprovisedNotes([]);
    setAnswers([]);
    setCurrentAnswer(null);
    setHelpUsed(assistedMode);
    setReplayUsed(false);
    setStartedAt(new Date().toISOString());
    setMessage(
      assistedMode
        ? "Modo ayuda activo: notas permitidas visibles."
        : "Toca solo las notas iluminadas.",
    );
    trackPentatonicEvent("pentatonic_exercise_started", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
    });
  }

  function resetExercise() {
    setState("intro");
    setCurrentIndex(0);
    setCurrentPlayedNotes([]);
    setImprovisedNotes([]);
    setAnswers([]);
    setCurrentAnswer(null);
    setHelpUsed(false);
    setReplayUsed(false);
    setMessage("Inicia el ejercicio para tocar con una zona pentatónica segura.");
    audioRef.current?.stopAll();
  }

  async function playQuestionAudio({ markReplay = true }: { markReplay?: boolean } = {}) {
    if (!currentQuestion) return;
    if (markReplay) setReplayUsed(true);
    await playPentatonicScaleById(getAudio(), currentQuestion.scaleId);
  }

  async function playBacking() {
    if (!currentQuestion) return;
    setReplayUsed(true);
    await playBackingLoop(getAudio(), currentQuestion.scaleId);
  }

  function revealHint() {
    setHelpUsed(true);
    setMessage(
      "Ayuda activa: usa las notas iluminadas. Las notas apagadas quedan fuera de esta pentatónica.",
    );
  }

  function answerWithNote(note: string) {
    if (!currentQuestion || state !== "active" || questionComplete) return;
    const scale = getPentatonicScaleById(currentQuestion.scaleId);
    if (!scale) return;

    const selectedMidi = noteToMidi(note);
    void playPentatonicNote(getAudio(), selectedMidi, 230);

    if (currentQuestion.mode === "improvisation") {
      if (!isNoteAllowedInPentatonicScale(currentQuestion.scaleId, selectedMidi)) {
        setMessage("Esa nota no pertenece a esta pentatónica.");
        void playPentatonicError(getAudio());
        return;
      }

      setImprovisedNotes((notes) => [...notes, note]);
      setMessage("Bien: nota dentro de la escala. Prueba crear una frase con espacio.");
      return;
    }

    if (currentQuestion.answerOptions) return;

    const expectedMidi = currentQuestion.expectedMidiNotes?.[currentPlayedNotes.length];
    const expectedNote = currentQuestion.expectedNotes?.[currentPlayedNotes.length];
    if (!expectedNote || typeof expectedMidi !== "number") return;

    const answer = buildPentatonicNoteAnswer({
      question: currentQuestion,
      note,
      expectedNote,
      selectedMidi,
      expectedMidi,
      playedNotes: currentPlayedNotes,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
    });
    const nextAnswers = [...answers, answer];

    setAnswers(nextAnswers);
    setCurrentAnswer(answer);
    trackAnswer(answer, nextAnswers);

    if (!answer.isCorrect) {
      setMessage(getPentatonicFeedback({ question: currentQuestion, answer }));
      void playPentatonicError(getAudio());
      return;
    }

    void playPentatonicSuccess(getAudio());
    const nextPlayedNotes = [...currentPlayedNotes, expectedNote];
    setCurrentPlayedNotes(nextPlayedNotes);

    if (nextPlayedNotes.length >= (currentQuestion.expectedNotes?.length ?? 0)) {
      setMessage(`Bien: completaste ${scale.displayName}.`);
      return;
    }

    setMessage("Correcto: esa nota pertenece a la pentatónica.");
  }

  function answerWithOption(option: string) {
    if (!currentQuestion?.answerOptions || currentAnswer || state !== "active") return;

    const answer = buildPentatonicOptionAnswer({
      question: currentQuestion,
      option,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
    });
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setCurrentAnswer(answer);
    setMessage(getPentatonicFeedback({ question: currentQuestion, answer }));
    trackAnswer(answer, nextAnswers);

    if (answer.isCorrect) void playPentatonicSuccess(getAudio());
    else void playPentatonicError(getAudio());
  }

  function completeImprovisation() {
    if (currentQuestion?.mode !== "improvisation" || currentAnswer) return;
    const answer = buildPentatonicImprovisationAnswer({
      question: currentQuestion,
      playedNotes: improvisedNotes,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
    });
    const notesPlayed = answer.improvisationMetrics?.notesPlayed ?? 0;
    const uniqueNotesUsed = answer.improvisationMetrics?.uniqueNotesUsed ?? 0;
    const nextAnswers = [...answers, answer];

    setAnswers(nextAnswers);
    setCurrentAnswer(answer);
    setMessage(getPentatonicFeedback({ question: currentQuestion, answer }));
    trackPentatonicEvent("pentatonic_improvisation_completed", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
      questionId: answer.questionId,
      scaleId: answer.scaleId,
      notesPlayed,
      uniqueNotesUsed,
      isCorrect: answer.isCorrect,
    });
  }

  function nextQuestion() {
    if (!questionComplete) return;

    if (currentIndex >= questions.length - 1) {
      finishExercise();
      return;
    }

    setCurrentIndex((index) => index + 1);
    setCurrentPlayedNotes([]);
    setImprovisedNotes([]);
    setCurrentAnswer(null);
    setHelpUsed(assistedMode);
    setReplayUsed(false);
    setMessage("Siguiente ronda. Mira primero las notas permitidas.");
  }

  function finishExercise() {
    const attempt = buildPentatonicAttempt({ exercise, startedAt, answers, totalUnits });
    setState(attempt.passed ? "completed" : "failed");
    setMessage(
      attempt.passed
        ? "Ejercicio aprobado. Ya puedes usar la pentatónica como zona creativa."
        : "Repite: busca más variedad y mantente dentro de las notas permitidas.",
    );
    onAttemptComplete(attempt);
  }

  function trackAnswer(answer: PentatonicAnswer, nextAnswers: PentatonicAnswer[]) {
    const nextScoring = scorePentatonicAnswers(nextAnswers, totalUnits);
    trackPentatonicEvent("pentatonic_question_answered", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
      questionId: answer.questionId,
      scaleId: answer.scaleId,
      pentatonicType: answer.pentatonicType,
      isCorrect: answer.isCorrect,
      score: nextScoring.score,
      accuracy: nextScoring.accuracy,
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
    currentPlayedNotes,
    improvisedNotes,
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
    playBacking,
    revealHint,
    answerWithNote,
    answerWithOption,
    completeImprovisation,
    nextQuestion,
  };
}
