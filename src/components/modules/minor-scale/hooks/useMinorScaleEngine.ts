"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import {
  playMinorScaleError,
  playMinorScaleNote,
  playMinorScaleSequence,
  playMinorScaleSuccess,
  playScaleComparison,
} from "@/lib/minor-scale/audio";
import { trackMinorScaleEvent } from "@/lib/minor-scale/analytics";
import {
  generateMinorScaleQuestions,
  getComparisonMidiNotes,
  getExerciseUnitCount,
  getExpectedOptionForQuestion,
} from "@/lib/minor-scale/questions";
import {
  buildMinorScaleAttempt,
  getMinorScaleFeedback,
  pointsForMinorScaleAnswer,
  scoreMinorScaleAnswers,
} from "@/lib/minor-scale/scoring";
import {
  getDisplayNoteName,
  getDisplayPitchName,
  getIntervalBetweenMidiNotes,
  getMinorScaleById,
  noteToMidi,
} from "@/lib/minor-scale/theory";
import type {
  MinorScaleAnswer,
  MinorScaleAttempt,
  MinorScaleExercise,
  MinorScaleExerciseProgress,
  MinorScaleQuestion,
} from "@/types/minor-scale";

type MinorScaleExerciseState = "intro" | "active" | "completed" | "failed";

type UseMinorScaleEngineOptions = {
  exercise: MinorScaleExercise;
  progress?: MinorScaleExerciseProgress;
  onAttemptComplete: (attempt: MinorScaleAttempt) => void;
};

export function useMinorScaleEngine({
  exercise,
  progress,
  onAttemptComplete,
}: UseMinorScaleEngineOptions) {
  const questions = useMemo(() => generateMinorScaleQuestions(exercise), [exercise]);
  const totalUnits = useMemo(() => getExerciseUnitCount(questions), [questions]);
  const [state, setState] = useState<MinorScaleExerciseState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayedNotes, setCurrentPlayedNotes] = useState<string[]>([]);
  const [answers, setAnswers] = useState<MinorScaleAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<MinorScaleAnswer | null>(null);
  const [message, setMessage] = useState("Inicia el ejercicio para comparar mayor y menor.");
  const [helpUsed, setHelpUsed] = useState(false);
  const [replayUsed, setReplayUsed] = useState(false);
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const audioRef = useRef<PianoAudioEngine | null>(null);
  const currentQuestion = questions[currentIndex];
  const scoring = useMemo(() => scoreMinorScaleAnswers(answers, totalUnits), [answers, totalUnits]);
  const assistedMode = Boolean(progress?.lastAttempt && progress.lastAttempt.accuracy < 0.6);
  const isComplete = state === "completed" || state === "failed";
  const questionComplete = Boolean(
    currentQuestion?.answerOptions
      ? currentAnswer
      : currentQuestion?.expectedNotes
        ? currentPlayedNotes.length >= currentQuestion.expectedNotes.length
        : currentQuestion?.selectedNoteTargetMidi && currentAnswer,
  );

  useEffect(() => {
    resetExercise();
    return () => audioRef.current?.stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  useEffect(() => {
    if (state !== "active" || currentQuestion?.mode !== "audio") return;

    void playQuestionAudio({ markReplay: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id, state]);

  function getAudio() {
    if (!audioRef.current) audioRef.current = new PianoAudioEngine();
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
        : "Escucha el color menor y construye con tonos y semitonos.",
    );
    trackMinorScaleEvent("minor_scale_exercise_started", {
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
    setMessage("Inicia el ejercicio para comparar mayor y menor.");
    audioRef.current?.stopAll();
  }

  async function playQuestionAudio({ markReplay = true }: { markReplay?: boolean } = {}) {
    if (!currentQuestion) return;
    if (markReplay) setReplayUsed(true);

    const comparisonMidi = getComparisonMidiNotes(currentQuestion);

    if (comparisonMidi.length > 0) {
      await playScaleComparison({
        audio: getAudio(),
        firstScaleMidiNotes: comparisonMidi,
        secondScaleMidiNotes: getQuestionScaleMidiNotes(currentQuestion),
        noteDurationMs: 240,
      });
      return;
    }

    await playMinorScaleSequence({
      audio: getAudio(),
      midiNotes: currentQuestion.expectedMidiNotes ?? getQuestionScaleMidiNotes(currentQuestion),
      noteDurationMs: 280,
    });
  }

  async function playExpectedScale() {
    if (!currentQuestion) return;
    setReplayUsed(true);
    await playMinorScaleSequence({
      audio: getAudio(),
      midiNotes: getQuestionScaleMidiNotes(currentQuestion),
      noteDurationMs: 280,
    });
  }

  function revealHint() {
    setHelpUsed(true);
    setMessage("Ayuda activa: mira la tónica, la ruta y las notas que cambian.");
  }

  function answerWithNote(note: string) {
    if (!currentQuestion || currentQuestion.answerOptions || state !== "active" || questionComplete) return;

    const selectedMidi = noteToMidi(note);
    void playMinorScaleNote(getAudio(), selectedMidi, 260);
    const expectedMidi =
      currentQuestion.selectedNoteTargetMidi ??
      currentQuestion.expectedMidiNotes?.[currentPlayedNotes.length];
    const expectedNote =
      typeof currentQuestion.selectedNoteTargetMidi === "number"
        ? midiToScaleNote(currentQuestion, currentQuestion.selectedNoteTargetMidi)
        : currentQuestion.expectedNotes?.[currentPlayedNotes.length];

    if (!expectedNote || typeof expectedMidi !== "number") return;

    const answer = buildNoteAnswer({
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
      setMessage(getMinorScaleFeedback({ question: currentQuestion, answer }));
      void playMinorScaleError(getAudio());
      return;
    }

    void playMinorScaleSuccess(getAudio());

    if (typeof currentQuestion.selectedNoteTargetMidi === "number") {
      setMessage(getMinorScaleFeedback({ question: currentQuestion, answer }));
      return;
    }

    const nextPlayedNotes = [...currentPlayedNotes, expectedNote];
    setCurrentPlayedNotes(nextPlayedNotes);

    if (nextPlayedNotes.length >= (currentQuestion.expectedNotes?.length ?? 0)) {
      setMessage(`Bien: completaste ${getMinorScaleById(currentQuestion.scaleId)?.displayName ?? "la escala"}.`);
      return;
    }

    const nextInterval = getNextInterval(currentQuestion, nextPlayedNotes.length);
    setMessage(
      nextInterval === 1
        ? "Correcto: ese era el semitono."
        : nextInterval === 3
          ? "Correcto: ese era el tono y medio."
          : "Correcto: avanzaste un tono.",
    );
  }

  function answerWithOption(option: string) {
    if (!currentQuestion || !currentQuestion.answerOptions || currentAnswer || state !== "active") return;

    const answer = buildOptionAnswer({
      question: currentQuestion,
      option,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
    });
    const nextAnswers = [...answers, answer];

    setAnswers(nextAnswers);
    setCurrentAnswer(answer);
    setMessage(getMinorScaleFeedback({ question: currentQuestion, answer }));
    trackAnswer(answer, nextAnswers);

    if (answer.isCorrect) {
      void playMinorScaleSuccess(getAudio());
      return;
    }

    void playMinorScaleError(getAudio());
  }

  function nextQuestion() {
    if (!questionComplete) return;

    if (currentIndex >= questions.length - 1) {
      finishExercise();
      return;
    }

    setCurrentIndex((index) => index + 1);
    setCurrentPlayedNotes([]);
    setCurrentAnswer(null);
    setHelpUsed(assistedMode);
    setReplayUsed(false);
    setMessage("Siguiente escala. Identifica primero la tónica y el tipo menor.");
  }

  function finishExercise() {
    const attempt = buildMinorScaleAttempt({ exercise, startedAt, answers, totalUnits });

    setState(attempt.passed ? "completed" : "failed");
    setMessage(
      attempt.passed
        ? "Ejercicio aprobado. Ya puedes comparar y construir escalas menores."
        : getFailureMessage(attempt),
    );
    onAttemptComplete(attempt);
  }

  function trackAnswer(answer: MinorScaleAnswer, nextAnswers: MinorScaleAnswer[]) {
    const nextScoring = scoreMinorScaleAnswers(nextAnswers, totalUnits);
    trackMinorScaleEvent("minor_scale_question_answered", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
      questionId: answer.questionId,
      scaleId: answer.scaleId,
      tonic: currentQuestion?.tonic,
      scaleType: answer.scaleType,
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

function buildNoteAnswer({
  question,
  note,
  expectedNote,
  selectedMidi,
  expectedMidi,
  playedNotes,
  helpUsed,
  replayUsed,
}: {
  question: MinorScaleQuestion;
  note: string;
  expectedNote: string;
  selectedMidi: number;
  expectedMidi: number;
  playedNotes: string[];
  helpUsed: boolean;
  replayUsed: boolean;
}): MinorScaleAnswer {
  const isCorrect = selectedMidi === expectedMidi;
  const scale = getMinorScaleById(question.scaleId);
  const previousMidi =
    playedNotes.length > 0
      ? noteToMidi(playedNotes[playedNotes.length - 1])
      : scale?.midiNotes[0] ?? question.expectedMidiNotes?.[0] ?? expectedMidi;
  const actualInterval = getIntervalBetweenMidiNotes(previousMidi, selectedMidi);
  const expectedInterval = getIntervalBetweenMidiNotes(previousMidi, expectedMidi);

  return {
    questionId: question.id,
    selectedNote: note,
    playedNotes: [...playedNotes, note],
    isCorrect,
    expectedAnswer: getDisplayNoteName(expectedNote),
    userAnswer: getDisplayNoteName(note),
    helpUsed,
    replayUsed,
    scaleId: question.scaleId,
    scaleType: question.scaleType,
    points: pointsForMinorScaleAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          wrongNote: note,
          expectedNote,
          wrongStepIndex: currentWrongStep(question, playedNotes.length),
          expectedInterval,
          actualInterval,
        },
  };
}

function buildOptionAnswer({
  question,
  option,
  helpUsed,
  replayUsed,
}: {
  question: MinorScaleQuestion;
  option: string;
  helpUsed: boolean;
  replayUsed: boolean;
}): MinorScaleAnswer {
  const expectedAnswer = getExpectedOptionForQuestion(question);
  const isCorrect = option === expectedAnswer;

  return {
    questionId: question.id,
    selectedOption: option,
    isCorrect,
    expectedAnswer,
    userAnswer: option,
    helpUsed,
    replayUsed,
    scaleId: question.scaleId,
    scaleType: question.scaleType,
    points: pointsForMinorScaleAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          wrongStepIndex: question.missingNoteIndex,
          expectedScaleType: question.scaleType,
        },
  };
}

function getQuestionScaleMidiNotes(question: MinorScaleQuestion) {
  const scale = getMinorScaleById(question.scaleId);
  return scale?.midiNotes ?? [];
}

function midiToScaleNote(question: MinorScaleQuestion, midi: number) {
  const scale = getMinorScaleById(question.scaleId);
  const index = scale?.midiNotes.findIndex((scaleMidi) => scaleMidi === midi) ?? -1;

  if (scale && index >= 0) {
    return `${scale.notes[index]}${Math.floor(midi / 12) - 1}`;
  }

  return "";
}

function getNextInterval(question: MinorScaleQuestion, nextPlayedCount: number) {
  const scale = getMinorScaleById(question.scaleId);
  const sequenceStartsOnTonic = question.expectedMidiNotes?.[0] === scale?.midiNotes[0];
  const intervalIndex = sequenceStartsOnTonic ? nextPlayedCount - 1 : nextPlayedCount;
  return scale?.formula[Math.max(0, Math.min(6, intervalIndex))] ?? 2;
}

function currentWrongStep(question: MinorScaleQuestion, playedCount: number) {
  const scale = getMinorScaleById(question.scaleId);
  const sequenceStartsOnTonic = question.expectedMidiNotes?.[0] === scale?.midiNotes[0];
  return sequenceStartsOnTonic ? Math.max(0, playedCount - 1) : playedCount;
}

function getFailureMessage(attempt: MinorScaleAttempt) {
  if (attempt.weakestScaleTypes.includes("harmonic")) {
    return "Revisa la menor armónica: el séptimo grado sube.";
  }

  if (attempt.weakestScaleTypes.includes("melodic_ascending")) {
    return "Revisa la menor melódica ascendente: suben sexto y séptimo grado.";
  }

  if (attempt.weakestSteps.length > 0) {
    return "Hay pasos débiles en la fórmula menor. Revisa tonos, semitonos y tono y medio.";
  }

  return "Casi. Repite escuchando la tercera nota y siguiendo el patrón menor.";
}
