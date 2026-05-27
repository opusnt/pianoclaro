"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import {
  buildIntervalNoteAnswer,
  buildIntervalOptionAnswer,
  canAnswerIntervalWithNote,
} from "@/lib/intervals/answers";
import {
  playHarmonicInterval,
  playIntervalError,
  playIntervalNote,
  playIntervalSuccess,
  playMelodicInterval,
} from "@/lib/intervals/audio";
import { trackIntervalEvent } from "@/lib/intervals/analytics";
import { generateIntervalQuestions } from "@/lib/intervals/questions";
import {
  buildIntervalAttempt,
  getIntervalFeedback,
  scoreIntervalAnswers,
} from "@/lib/intervals/scoring";
import type {
  IntervalAnswer,
  IntervalAttempt,
  IntervalExercise,
  IntervalExerciseProgress,
} from "@/types/intervals";

type IntervalExerciseState = "intro" | "active" | "completed" | "failed";

type UseIntervalEngineOptions = {
  exercise: IntervalExercise;
  progress?: IntervalExerciseProgress;
  onAttemptComplete: (attempt: IntervalAttempt) => void;
};

export function useIntervalEngine({
  exercise,
  progress,
  onAttemptComplete,
}: UseIntervalEngineOptions) {
  const questions = useMemo(() => generateIntervalQuestions(exercise), [exercise]);
  const [state, setState] = useState<IntervalExerciseState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<IntervalAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<IntervalAnswer | null>(null);
  const [message, setMessage] = useState("Inicia el ejercicio y responde una pregunta a la vez.");
  const [showHint, setShowHint] = useState(false);
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const audioRef = useRef<PianoAudioEngine | null>(null);
  const currentQuestion = questions[currentIndex];
  const scoring = useMemo(
    () => scoreIntervalAnswers(answers, questions.length),
    [answers, questions.length],
  );
  const assistedMode = Boolean(progress?.lastAttempt && progress.lastAttempt.accuracy < 0.6);
  const isComplete = state === "completed" || state === "failed";

  useEffect(() => {
    resetExercise();
    return () => audioRef.current?.stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  useEffect(() => {
    if (state !== "active" || !currentQuestion || currentQuestion.mode === "visual") {
      return;
    }

    void playQuestion();
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
    setAnswers([]);
    setCurrentAnswer(null);
    setShowHint(assistedMode);
    setStartedAt(new Date().toISOString());
    setMessage(
      assistedMode
        ? "Modo ayuda activo: etiquetas visibles y pista visual inicial."
        : "Responde con calma. La distancia importa más que memorizar nombres.",
    );
    trackIntervalEvent("interval_exercise_started", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
    });
  }

  function resetExercise() {
    setState("intro");
    setCurrentIndex(0);
    setAnswers([]);
    setCurrentAnswer(null);
    setShowHint(false);
    setMessage("Inicia el ejercicio y responde una pregunta a la vez.");
    audioRef.current?.stopAll();
  }

  async function playQuestion() {
    if (!currentQuestion?.targetNote) {
      return;
    }

    const audio = getAudio();

    if (currentQuestion.taskType === "melodic_vs_harmonic" && currentQuestion.playbackType === "harmonic") {
      await playHarmonicInterval({
        audio,
        baseNote: currentQuestion.baseNote,
        targetNote: currentQuestion.targetNote,
      });
      return;
    }

    await playMelodicInterval({
      audio,
      baseNote: currentQuestion.baseNote,
      targetNote: currentQuestion.targetNote,
      gapMs: currentQuestion.taskType === "direction_recognition" ? 420 : 520,
    });
  }

  async function playBaseNote() {
    if (!currentQuestion) {
      return;
    }

    await playIntervalNote(getAudio(), currentQuestion.baseNote, 340);
  }

  function revealHint() {
    setShowHint(true);
    setMessage("Pista activada: mira la nota base, la nota objetivo y el arco de distancia.");
  }

  function answerWithNote(note: string) {
    if (!canAnswerIntervalWithNote(currentQuestion)) {
      return;
    }

    void playIntervalNote(getAudio(), note, 320);
    submitAnswer(
      buildIntervalNoteAnswer({
        question: currentQuestion,
        selectedNote: note,
        usedHint: showHint || assistedMode,
      }),
    );
  }

  function answerWithOption(option: string) {
    if (!currentQuestion || currentAnswer || state !== "active") {
      return;
    }

    submitAnswer(
      buildIntervalOptionAnswer({
        question: currentQuestion,
        selectedOption: option,
        usedHint: showHint || assistedMode,
      }),
    );
  }

  function submitAnswer(answer: IntervalAnswer) {
    const nextAnswers = [...answers, answer];

    setAnswers(nextAnswers);
    setCurrentAnswer(answer);
    setMessage(getIntervalFeedback({ question: currentQuestion!, answer }));
    trackIntervalEvent("interval_question_answered", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
      questionId: answer.questionId,
      intervalSemitones: answer.intervalSemitones,
      intervalName: answer.intervalName,
      direction: currentQuestion?.direction,
      isCorrect: answer.isCorrect,
      accuracy: scoreIntervalAnswers(nextAnswers, questions.length).accuracy,
      score: scoreIntervalAnswers(nextAnswers, questions.length).score,
    });

    if (answer.isCorrect) {
      void playIntervalSuccess(getAudio());
      return;
    }

    void playIntervalError(getAudio());
  }

  function nextQuestion() {
    if (!currentAnswer) {
      return;
    }

    if (currentIndex >= questions.length - 1) {
      finishExercise();
      return;
    }

    setCurrentIndex((value) => value + 1);
    setCurrentAnswer(null);
    setShowHint(assistedMode);
    setMessage("Siguiente distancia. Mira primero la nota base.");
  }

  function finishExercise() {
    const attempt = buildIntervalAttempt({
      exercise,
      startedAt,
      answers,
      totalQuestions: questions.length,
    });

    setState(attempt.passed ? "completed" : "failed");
    setMessage(
      attempt.passed
        ? "Ejercicio aprobado. Ya estás pensando en distancias."
        : getFailureMessage(attempt),
    );
    onAttemptComplete(attempt);
  }

  return {
    state,
    questions,
    currentQuestion,
    currentIndex,
    currentAnswer,
    answers,
    scoring,
    message,
    showHint,
    assistedMode,
    isComplete,
    startExercise,
    resetExercise,
    playQuestion,
    playBaseNote,
    revealHint,
    answerWithNote,
    answerWithOption,
    nextQuestion,
  };
}

function getFailureMessage(attempt: IntervalAttempt) {
  if (attempt.weakestIntervals.length > 0) {
    return `Conviene repasar: ${attempt.weakestIntervals.join(", ")}.`;
  }

  if (attempt.mistakes > 5) {
    return "Hubo muchos errores. Reduce velocidad: mira base, cuenta semitonos y responde.";
  }

  return "Casi. Repite el ejercicio buscando la distancia antes de tocar.";
}
