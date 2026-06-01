"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { trackMajorScaleEvent } from "@/lib/major-scale/analytics";
import {
  buildMajorScaleNoteAnswer,
  buildMajorScaleOptionAnswer,
  getQuestionScaleMidiNotes,
} from "@/lib/major-scale/answers";
import {
  playScaleError,
  playScaleNote,
  playScaleSequence,
  playScaleSuccess,
} from "@/lib/major-scale/audio";
import { generateMajorScaleQuestions, getExerciseUnitCount } from "@/lib/major-scale/questions";
import {
  buildMajorScaleAttempt,
  getScaleFeedback,
  scoreScaleAnswers,
} from "@/lib/major-scale/scoring";
import { getScaleById, noteToMidi } from "@/lib/major-scale/theory";
import type {
  MajorScaleAttempt,
  MajorScaleExercise,
  MajorScaleExerciseProgress,
  ScaleAnswer,
  ScaleQuestion,
} from "@/types/major-scale";

type MajorScaleExerciseState = "intro" | "active" | "completed" | "failed";

type UseMajorScaleEngineOptions = {
  exercise: MajorScaleExercise;
  progress?: MajorScaleExerciseProgress;
  onAttemptComplete: (attempt: MajorScaleAttempt) => void;
};

export function useMajorScaleEngine({
  exercise,
  progress,
  onAttemptComplete,
}: UseMajorScaleEngineOptions) {
  const questions = useMemo(() => generateMajorScaleQuestions(exercise), [exercise]);
  const totalUnits = useMemo(() => getExerciseUnitCount(questions), [questions]);
  const [state, setState] = useState<MajorScaleExerciseState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayedNotes, setCurrentPlayedNotes] = useState<string[]>([]);
  const [answers, setAnswers] = useState<ScaleAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<ScaleAnswer | null>(null);
  const [message, setMessage] = useState("Inicia el ejercicio para construir una escala mayor.");
  const [helpUsed, setHelpUsed] = useState(false);
  const [replayUsed, setReplayUsed] = useState(false);
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const audioRef = useRef<PianoAudioEngine | null>(null);
  const currentQuestion = questions[currentIndex];
  const scoring = useMemo(() => scoreScaleAnswers(answers, totalUnits), [answers, totalUnits]);
  const assistedMode = Boolean(progress?.lastAttempt && progress.lastAttempt.accuracy < 0.6);
  const isComplete = state === "completed" || state === "failed";
  const questionComplete = Boolean(
    currentQuestion?.answerOptions
      ? currentAnswer
      : currentQuestion?.expectedNotes &&
          currentPlayedNotes.length >= currentQuestion.expectedNotes.length,
  );

  useEffect(() => {
    resetExercise();
    return () => audioRef.current?.stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  useEffect(() => {
    if (state !== "active" || currentQuestion?.mode !== "audio") {
      return;
    }

    void playQuestionAudio({ markReplay: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id, state]);

  function getAudio() {
    if (!audioRef.current) {
      audioRef.current = new PianoAudioEngine();
    }

    return audioRef.current;
  }

  function startExercise() {
    setState("active");
    setCurrentIndex(0);
    setCurrentPlayedNotes([]);
    setAnswers([]);
    setCurrentAnswer(null);
    setHelpUsed(assistedMode);
    setReplayUsed(false);
    setStartedAt(new Date().toISOString());
    setMessage(
      assistedMode
        ? "Modo ayuda activo: nombres visibles y próxima nota marcada."
        : "Sigue el patrón T - T - S - T - T - T - S.",
    );
    trackMajorScaleEvent("major_scale_exercise_started", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
      exerciseType: exercise.type,
    });
  }

  function resetExercise() {
    setState("intro");
    setCurrentIndex(0);
    setCurrentPlayedNotes([]);
    setAnswers([]);
    setCurrentAnswer(null);
    setHelpUsed(false);
    setReplayUsed(false);
    setMessage("Inicia el ejercicio para construir una escala mayor.");
    audioRef.current?.stopAll();
  }

  async function playQuestionAudio({ markReplay = true }: { markReplay?: boolean } = {}) {
    if (!currentQuestion) {
      return;
    }

    const midiNotes =
      currentQuestion.expectedMidiNotes ?? getQuestionScaleMidiNotes(currentQuestion);
    if (markReplay) {
      setReplayUsed(true);
    }
    await playScaleSequence({
      audio: getAudio(),
      midiNotes,
      noteDurationMs: 280,
    });
  }

  async function playExpectedScale() {
    if (!currentQuestion) {
      return;
    }

    setReplayUsed(true);
    await playScaleSequence({
      audio: getAudio(),
      midiNotes: getQuestionScaleMidiNotes(currentQuestion),
      noteDurationMs: 280,
    });
  }

  function revealHint() {
    setHelpUsed(true);
    setMessage("Ayuda activa: mira la tónica, la ruta y la próxima nota esperada.");
  }

  function answerWithNote(note: string) {
    if (
      !currentQuestion ||
      currentQuestion.answerOptions ||
      state !== "active" ||
      questionComplete
    ) {
      return;
    }

    const selectedMidi = noteToMidi(note);
    void playScaleNote(getAudio(), selectedMidi, 260);
    const expectedNote = currentQuestion.expectedNotes?.[currentPlayedNotes.length];
    const expectedMidi = currentQuestion.expectedMidiNotes?.[currentPlayedNotes.length];

    if (!expectedNote || typeof expectedMidi !== "number") {
      return;
    }

    const isCorrect = selectedMidi === expectedMidi;
    const answer = buildMajorScaleNoteAnswer({
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

    if (!isCorrect) {
      setMessage(getScaleFeedback({ question: currentQuestion, answer }));
      void playScaleError(getAudio());
      return;
    }

    const nextPlayedNotes = [...currentPlayedNotes, expectedNote];
    setCurrentPlayedNotes(nextPlayedNotes);
    void playScaleSuccess(getAudio());

    if (nextPlayedNotes.length >= (currentQuestion.expectedNotes?.length ?? 0)) {
      setMessage(
        `Bien: completaste ${getScaleById(currentQuestion.scaleId)?.displayName ?? "la escala"}.`,
      );
      return;
    }

    const stepIndex = Math.max(0, nextPlayedNotes.length - 1);
    const interval = currentQuestion.expectedMidiNotes
      ? currentQuestion.expectedMidiNotes[nextPlayedNotes.length] -
        currentQuestion.expectedMidiNotes[nextPlayedNotes.length - 1]
      : 0;
    setMessage(
      interval === 1
        ? "Correcto: ese era el semitono."
        : stepIndex >= 0
          ? "Correcto: avanzaste un tono."
          : "Correcto. Sigue la ruta.",
    );
  }

  function answerWithOption(option: string) {
    if (!currentQuestion || !currentQuestion.answerOptions || currentAnswer || state !== "active") {
      return;
    }

    const answer = buildMajorScaleOptionAnswer({
      question: currentQuestion,
      option,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
    });
    const nextAnswers = [...answers, answer];

    setAnswers(nextAnswers);
    setCurrentAnswer(answer);
    setMessage(getScaleFeedback({ question: currentQuestion, answer }));
    trackAnswer(answer, nextAnswers);

    if (answer.isCorrect) {
      void playScaleSuccess(getAudio());
      return;
    }

    void playScaleError(getAudio());
  }

  function nextQuestion() {
    if (!questionComplete) {
      return;
    }

    if (currentIndex >= questions.length - 1) {
      finishExercise();
      return;
    }

    setCurrentIndex((index) => index + 1);
    setCurrentPlayedNotes([]);
    setCurrentAnswer(null);
    setHelpUsed(assistedMode);
    setReplayUsed(false);
    setMessage("Siguiente escala. Identifica primero la tónica.");
  }

  function finishExercise() {
    const attempt = buildMajorScaleAttempt({
      exercise,
      startedAt,
      answers,
      totalUnits,
    });

    setState(attempt.passed ? "completed" : "failed");
    setMessage(
      attempt.passed
        ? "Ejercicio aprobado. Ya puedes construir una escala mayor con patrón."
        : getFailureMessage(attempt),
    );
    onAttemptComplete(attempt);
  }

  function trackAnswer(answer: ScaleAnswer, nextAnswers: ScaleAnswer[]) {
    const nextScoring = scoreScaleAnswers(nextAnswers, totalUnits);
    trackMajorScaleEvent("major_scale_question_answered", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
      questionId: answer.questionId,
      scaleId: answer.scaleId,
      tonic: currentQuestion?.tonic,
      exerciseType: exercise.type,
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
    playExpectedScale,
    revealHint,
    answerWithNote,
    answerWithOption,
    nextQuestion,
  };
}

function getFailureMessage(attempt: MajorScaleAttempt) {
  if (attempt.weakestSteps.length > 0) {
    return "Hay pasos débiles en la fórmula. Revisa especialmente tonos y semitonos.";
  }

  if (attempt.weakestScales.length > 0) {
    return `Conviene repasar: ${attempt.weakestScales.join(", ")}.`;
  }

  return "Casi. Repite el ejercicio siguiendo T - T - S - T - T - T - S.";
}
