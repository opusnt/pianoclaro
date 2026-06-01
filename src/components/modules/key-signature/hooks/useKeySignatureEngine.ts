"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { trackKeySignatureEvent } from "@/lib/key-signature/analytics";
import {
  buildKeySignatureNoteAnswer,
  buildKeySignatureOptionAnswer,
  midiToKeySignatureQuestionNote,
} from "@/lib/key-signature/answers";
import {
  playKeySignatureComparison,
  playKeySignatureError,
  playKeySignatureNote,
  playKeySignatureSequence,
  playKeySignatureSuccess,
} from "@/lib/key-signature/audio";
import {
  generateKeySignatureQuestions,
  getComparisonScaleMidiNotes,
  getExerciseUnitCount,
  getQuestionScaleMidiNotes,
} from "@/lib/key-signature/questions";
import {
  buildKeySignatureAttempt,
  getKeySignatureFeedback,
  scoreKeySignatureAnswers,
} from "@/lib/key-signature/scoring";
import { getKeySignatureById, noteToMidi } from "@/lib/key-signature/theory";
import type {
  KeySignatureAnswer,
  KeySignatureAttempt,
  KeySignatureExercise,
  KeySignatureExerciseProgress,
} from "@/types/key-signature";

type KeySignatureExerciseState = "intro" | "active" | "completed" | "failed";

type UseKeySignatureEngineOptions = {
  exercise: KeySignatureExercise;
  progress?: KeySignatureExerciseProgress;
  onAttemptComplete: (attempt: KeySignatureAttempt) => void;
};

export function useKeySignatureEngine({
  exercise,
  progress,
  onAttemptComplete,
}: UseKeySignatureEngineOptions) {
  const questions = useMemo(() => generateKeySignatureQuestions(exercise), [exercise]);
  const totalUnits = useMemo(() => getExerciseUnitCount(questions), [questions]);
  const [state, setState] = useState<KeySignatureExerciseState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayedNotes, setCurrentPlayedNotes] = useState<string[]>([]);
  const [answers, setAnswers] = useState<KeySignatureAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<KeySignatureAnswer | null>(null);
  const [message, setMessage] = useState(
    "Inicia el ejercicio para entender tonalidad como casa musical.",
  );
  const [helpUsed, setHelpUsed] = useState(false);
  const [replayUsed, setReplayUsed] = useState(false);
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const audioRef = useRef<PianoAudioEngine | null>(null);
  const currentQuestion = questions[currentIndex];
  const scoring = useMemo(
    () => scoreKeySignatureAnswers(answers, totalUnits),
    [answers, totalUnits],
  );
  const assistedMode = Boolean(progress?.lastAttempt && progress.lastAttempt.accuracy < 0.6);
  const isComplete = state === "completed" || state === "failed";
  const questionComplete = Boolean(
    currentQuestion?.answerOptions
      ? currentAnswer
      : currentQuestion?.expectedNotes
        ? currentPlayedNotes.length >= currentQuestion.expectedNotes.length
        : typeof currentQuestion?.selectedNoteTargetMidi === "number" && currentAnswer,
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
        ? "Modo ayuda activo: nombres y alteraciones visibles."
        : "Primero identifica la tónica. Luego aplica la regla de armadura.",
    );
    trackKeySignatureEvent("key_signature_exercise_started", {
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
    setMessage("Inicia el ejercicio para entender tonalidad como casa musical.");
    audioRef.current?.stopAll();
  }

  async function playQuestionAudio({ markReplay = true }: { markReplay?: boolean } = {}) {
    if (!currentQuestion) return;
    if (markReplay) setReplayUsed(true);

    const comparisonMidi = getComparisonScaleMidiNotes(currentQuestion);

    if (comparisonMidi.length > 0) {
      await playKeySignatureComparison({
        audio: getAudio(),
        firstScaleMidiNotes: getQuestionScaleMidiNotes(currentQuestion),
        secondScaleMidiNotes: comparisonMidi,
      });
      return;
    }

    await playKeySignatureSequence({
      audio: getAudio(),
      midiNotes: getQuestionScaleMidiNotes(currentQuestion),
    });
  }

  async function playExpectedScale() {
    if (!currentQuestion) return;
    setReplayUsed(true);
    await playKeySignatureSequence({
      audio: getAudio(),
      midiNotes: getQuestionScaleMidiNotes(currentQuestion),
    });
  }

  function revealHint() {
    setHelpUsed(true);
    setMessage("Ayuda activa: mira la tónica, la armadura y las teclas alteradas persistentes.");
  }

  function answerWithNote(note: string) {
    if (!currentQuestion || currentQuestion.answerOptions || state !== "active" || questionComplete)
      return;

    const selectedMidi = noteToMidi(note);
    void playKeySignatureNote(getAudio(), selectedMidi, 250);
    const expectedMidi =
      currentQuestion.selectedNoteTargetMidi ??
      currentQuestion.expectedMidiNotes?.[currentPlayedNotes.length];
    const expectedNote =
      typeof currentQuestion.selectedNoteTargetMidi === "number"
        ? midiToKeySignatureQuestionNote(currentQuestion, currentQuestion.selectedNoteTargetMidi)
        : currentQuestion.expectedNotes?.[currentPlayedNotes.length];

    if (!expectedNote || typeof expectedMidi !== "number") return;

    const answer = buildKeySignatureNoteAnswer({
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
      setMessage(getKeySignatureFeedback({ question: currentQuestion, answer }));
      void playKeySignatureError(getAudio());
      return;
    }

    void playKeySignatureSuccess(getAudio());

    if (typeof currentQuestion.selectedNoteTargetMidi === "number") {
      setMessage(getKeySignatureFeedback({ question: currentQuestion, answer }));
      return;
    }

    const nextPlayedNotes = [...currentPlayedNotes, expectedNote];
    setCurrentPlayedNotes(nextPlayedNotes);

    if (nextPlayedNotes.length >= (currentQuestion.expectedNotes?.length ?? 0)) {
      setMessage(
        `Bien: completaste ${getKeySignatureById(currentQuestion.keyId)?.displayName ?? "la escala"} respetando la armadura.`,
      );
      return;
    }

    setMessage("Correcto: sigue aplicando la armadura como regla global.");
  }

  function answerWithOption(option: string) {
    if (!currentQuestion || !currentQuestion.answerOptions || currentAnswer || state !== "active")
      return;

    const answer = buildKeySignatureOptionAnswer({
      question: currentQuestion,
      option,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
    });
    const nextAnswers = [...answers, answer];

    setAnswers(nextAnswers);
    setCurrentAnswer(answer);
    setMessage(getKeySignatureFeedback({ question: currentQuestion, answer }));
    trackAnswer(answer, nextAnswers);

    if (answer.isCorrect) {
      void playKeySignatureSuccess(getAudio());
      return;
    }

    void playKeySignatureError(getAudio());
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
    setMessage("Siguiente tonalidad. Mira primero la tónica y la armadura.");
  }

  function finishExercise() {
    const attempt = buildKeySignatureAttempt({ exercise, startedAt, answers, totalUnits });

    setState(attempt.passed ? "completed" : "failed");
    setMessage(
      attempt.passed
        ? "Ejercicio aprobado. Ya conectas tonalidad, armadura y teclado."
        : getFailureMessage(attempt),
    );
    onAttemptComplete(attempt);
  }

  function trackAnswer(answer: KeySignatureAnswer, nextAnswers: KeySignatureAnswer[]) {
    const nextScoring = scoreKeySignatureAnswers(nextAnswers, totalUnits);
    const key = getKeySignatureById(answer.keyId);
    trackKeySignatureEvent("key_signature_question_answered", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
      questionId: answer.questionId,
      keyId: answer.keyId,
      mode: key?.mode,
      accidentalType: key?.accidentalType,
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

function getFailureMessage(attempt: KeySignatureAttempt) {
  if (attempt.weakestRelativePairs.length > 0) {
    return "Revisa relativas: la relativa menor está 3 semitonos abajo de la mayor.";
  }

  if (attempt.weakestAccidentals.length > 0) {
    return "Revisa alteraciones fijas: una armadura afecta todas las notas con ese nombre.";
  }

  if (attempt.weakestKeys.length > 0) {
    return "Hay tonalidades débiles. Repite mirando tónica, armadura y ruta de escala.";
  }

  return "Casi. Repite con ayuda visual y escucha primero la tónica.";
}
