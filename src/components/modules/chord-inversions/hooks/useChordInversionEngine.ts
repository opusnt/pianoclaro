"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { trackChordInversionEvent } from "@/lib/chord-inversions/analytics";
import {
  playArpeggiatedChord,
  playChord,
  playChordInversion,
  playInversionError,
  playInversionNote,
  playInversionSuccess,
} from "@/lib/chord-inversions/audio";
import {
  generateChordInversionQuestions,
  getExerciseUnitCount,
  getExpectedOptionForQuestion,
} from "@/lib/chord-inversions/questions";
import {
  buildChordInversionAttempt,
  getChordInversionFeedback,
  pointsForChordInversionAnswer,
  scoreChordInversionAnswers,
} from "@/lib/chord-inversions/scoring";
import {
  countCorrectInversionNotes,
  getDisplayNoteName,
  getInversionById,
  getInversionLabel,
  getPlayedBassPitchClass,
  normalizePitchClasses,
  stripOctave,
  validateInversion,
} from "@/lib/chord-inversions/theory";
import type {
  ChordInversionAnswer,
  ChordInversionAttempt,
  ChordInversionExercise,
  ChordInversionExerciseProgress,
  ChordInversionQuestion,
} from "@/types/chord-inversions";

type ChordInversionExerciseState = "intro" | "active" | "completed" | "failed";

type UseChordInversionEngineOptions = {
  exercise: ChordInversionExercise;
  progress?: ChordInversionExerciseProgress;
  onAttemptComplete: (attempt: ChordInversionAttempt) => void;
};

export function useChordInversionEngine({
  exercise,
  progress,
  onAttemptComplete,
}: UseChordInversionEngineOptions) {
  const questions = useMemo(() => generateChordInversionQuestions(exercise), [exercise]);
  const totalUnits = useMemo(() => getExerciseUnitCount(questions), [questions]);
  const [state, setState] = useState<ChordInversionExerciseState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [answers, setAnswers] = useState<ChordInversionAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<ChordInversionAnswer | null>(null);
  const [message, setMessage] = useState(
    "Inicia el ejercicio para escuchar y construir inversiones.",
  );
  const [helpUsed, setHelpUsed] = useState(false);
  const [replayUsed, setReplayUsed] = useState(false);
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const audioRef = useRef<PianoAudioEngine | null>(null);
  const currentQuestion = questions[currentIndex];
  const scoring = useMemo(
    () => scoreChordInversionAnswers(answers, totalUnits),
    [answers, totalUnits],
  );
  const assistedMode = Boolean(
    progress?.lastAttempt && (progress.lastAttempt.accuracy < 0.6 || progress.bassMistakes > 3),
  );
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
    setMessage(
      assistedMode
        ? "Modo ayuda activo: mira la nota del bajo antes de confirmar."
        : "Revisa el bajo: define la inversión.",
    );
    trackChordInversionEvent("chord_inversion_exercise_started", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
    });
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
    setMessage("Inicia el ejercicio para escuchar y construir inversiones.");
    audioRef.current?.stopAll();
  }

  async function playQuestionAudio({ markReplay = true }: { markReplay?: boolean } = {}) {
    if (!currentQuestion) return;
    if (markReplay) setReplayUsed(true);
    const inversion = getInversionById(currentQuestion.inversionId);
    if (!inversion) return;

    await playChordInversion(getAudio(), inversion.id);
    await playArpeggiatedChord(getAudio(), inversion.midiNotes, 220);
  }

  function revealHint() {
    setHelpUsed(true);
    setMessage(
      "Ayuda activa: el bajo esperado está marcado. Las mismas notas con otro bajo cambian la inversión.",
    );
  }

  function toggleNote(note: string) {
    if (!currentQuestion || state !== "active" || currentAnswer || currentQuestion.answerOptions)
      return;
    void playInversionNote(getAudio(), note, 220);
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

  function confirmInversion() {
    if (!currentQuestion || currentQuestion.answerOptions || currentAnswer || state !== "active")
      return;
    const inversion = getInversionById(currentQuestion.inversionId);
    if (!inversion) return;

    const validation = validateInversion(inversion.notes, inversion.bassNote, selectedNotes);
    const correctNotesCount = countCorrectInversionNotes(inversion.notes, selectedNotes);
    const expectedPitchSet = new Set(normalizePitchClasses(inversion.notes));
    const selectedPitchSet = new Set(normalizePitchClasses(selectedNotes));
    const missingNotes = inversion.notes.filter(
      (note) => !selectedPitchSet.has(normalizePitchClasses([note])[0]),
    );
    const extraNotes = selectedNotes.filter(
      (note) => !expectedPitchSet.has(normalizePitchClasses([note])[0]),
    );
    const userBass = getPlayedBassPitchClass(selectedNotes);
    const answer: ChordInversionAnswer = {
      questionId: currentQuestion.id,
      selectedNotes,
      bassNote: userBass,
      isCorrect: validation.isCorrect,
      hasCorrectNotes: validation.hasCorrectNotes,
      hasCorrectBass: validation.hasCorrectBass,
      expectedAnswer: inversion.notes.map(getDisplayNoteName),
      userAnswer: selectedNotes.map(getDisplayNoteName),
      correctNotesCount,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
      inversionId: currentQuestion.inversionId,
      chordId: inversion.chordId,
      inversionType: inversion.inversionType,
      points: pointsForChordInversionAnswer({
        isCorrect: validation.isCorrect,
        helpUsed: helpUsed || assistedMode,
        replayUsed,
        hasCorrectNotes: validation.hasCorrectNotes,
        hasCorrectBass: validation.hasCorrectBass,
        correctNotesCount,
      }),
      errorDetails: validation.isCorrect
        ? undefined
        : {
            expectedBassNote: inversion.bassNote,
            userBassNote: userBass,
            missingNotes,
            extraNotes,
          },
    };
    commitAnswer(answer);
    void playChord(getAudio(), selectedNotes);
  }

  function answerWithOption(option: string) {
    if (!currentQuestion || !currentQuestion.answerOptions || currentAnswer || state !== "active")
      return;
    const inversion = getInversionById(currentQuestion.inversionId);
    if (!inversion) return;
    const expectedAnswer = getExpectedOptionForQuestion(currentQuestion);
    const isCorrect = option === expectedAnswer;
    const answer: ChordInversionAnswer = {
      questionId: currentQuestion.id,
      selectedOption: option,
      isCorrect,
      hasCorrectNotes: isCorrect,
      hasCorrectBass: isCorrect,
      expectedAnswer,
      userAnswer: option,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
      inversionId: currentQuestion.inversionId,
      chordId: inversion.chordId,
      inversionType: inversion.inversionType,
      points: pointsForChordInversionAnswer({
        isCorrect,
        helpUsed: helpUsed || assistedMode,
        replayUsed,
      }),
      errorDetails: isCorrect
        ? undefined
        : {
            selectedInversion:
              option === "primera inversión"
                ? "first_inversion"
                : option === "segunda inversión"
                  ? "second_inversion"
                  : "root_position",
            expectedInversion: inversion.inversionType,
          },
    };
    commitAnswer(answer);
  }

  function commitAnswer(answer: ChordInversionAnswer) {
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setCurrentAnswer(answer);
    setMessage(
      getChordInversionFeedback({ question: currentQuestion as ChordInversionQuestion, answer }),
    );
    trackAnswer(answer, nextAnswers);
    if (answer.isCorrect) void playInversionSuccess(getAudio());
    else void playInversionError(getAudio());
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
    setMessage("Siguiente ronda. Mira qué nota queda más grave.");
  }

  function finishExercise() {
    const attempt = buildChordInversionAttempt({ exercise, startedAt, answers, totalUnits });
    setState(attempt.passed ? "completed" : "failed");
    setMessage(
      attempt.passed
        ? "Ejercicio aprobado. Ya entiendes que el bajo define la inversión."
        : "Repite el ejercicio: conserva las mismas notas y revisa la nota más grave.",
    );
    onAttemptComplete(attempt);
  }

  function trackAnswer(answer: ChordInversionAnswer, nextAnswers: ChordInversionAnswer[]) {
    const nextScoring = scoreChordInversionAnswers(nextAnswers, totalUnits);
    trackChordInversionEvent("chord_inversion_question_answered", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
      questionId: answer.questionId,
      inversionId: answer.inversionId,
      chordId: answer.chordId,
      inversionType: answer.inversionType,
      isCorrect: answer.isCorrect,
      hasCorrectNotes: answer.hasCorrectNotes,
      hasCorrectBass: answer.hasCorrectBass,
      score: nextScoring.score,
      accuracy: nextScoring.accuracy,
      selectedNotes: answer.selectedNotes,
      expectedNotes: answer.expectedAnswer,
      expectedBassNote: answer.errorDetails?.expectedBassNote,
      userBassNote: answer.bassNote,
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
    confirmInversion,
    answerWithOption,
    nextQuestion,
  };
}
