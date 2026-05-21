"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { trackChordEvent } from "@/lib/chords/analytics";
import {
  playArpeggiatedChord,
  playChord,
  playChordById,
  playChordError,
  playChordNote,
  playChordSuccess,
  playSingleNoteVsChord,
} from "@/lib/chords/audio";
import {
  generateChordQuestions,
  getExerciseUnitCount,
  getExpectedOptionForQuestion,
} from "@/lib/chords/questions";
import {
  buildChordAttempt,
  getChordFeedback,
  pointsForChordAnswer,
  scoreChordAnswers,
} from "@/lib/chords/scoring";
import {
  countCorrectChordNotes,
  getChordById,
  getChordQualityLabel,
  getDisplayNoteName,
  normalizePitchSet,
  stripOctave,
  validateChordNotes,
} from "@/lib/chords/theory";
import type {
  ChordAnswer,
  ChordAttempt,
  ChordExercise,
  ChordExerciseProgress,
  ChordQuestion,
} from "@/types/chords";

type ChordExerciseState = "intro" | "active" | "completed" | "failed";

type UseChordEngineOptions = {
  exercise: ChordExercise;
  progress?: ChordExerciseProgress;
  onAttemptComplete: (attempt: ChordAttempt) => void;
};

export function useChordEngine({ exercise, progress, onAttemptComplete }: UseChordEngineOptions) {
  const questions = useMemo(() => generateChordQuestions(exercise), [exercise]);
  const totalUnits = useMemo(() => getExerciseUnitCount(questions), [questions]);
  const [state, setState] = useState<ChordExerciseState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [answers, setAnswers] = useState<ChordAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<ChordAnswer | null>(null);
  const [message, setMessage] = useState("Inicia el ejercicio para construir y escuchar tríadas.");
  const [helpUsed, setHelpUsed] = useState(false);
  const [replayUsed, setReplayUsed] = useState(false);
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const audioRef = useRef<PianoAudioEngine | null>(null);
  const currentQuestion = questions[currentIndex];
  const scoring = useMemo(() => scoreChordAnswers(answers, totalUnits), [answers, totalUnits]);
  const assistedMode = Boolean(progress?.lastAttempt && progress.lastAttempt.accuracy < 0.6);
  const isComplete = state === "completed" || state === "failed";
  const questionComplete = Boolean(currentQuestion?.answerOptions ? currentAnswer : currentAnswer);

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
    setMessage(assistedMode ? "Modo ayuda activo: las notas objetivo están visibles." : "Selecciona las notas del acorde.");
    trackChordEvent("chord_exercise_started", { moduleId: exercise.moduleId, exerciseId: exercise.id });
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
    setMessage("Inicia el ejercicio para construir y escuchar tríadas.");
    audioRef.current?.stopAll();
  }

  async function playQuestionAudio({ markReplay = true }: { markReplay?: boolean } = {}) {
    if (!currentQuestion) return;
    if (markReplay) setReplayUsed(true);
    const chord = getChordById(currentQuestion.chordId);
    if (!chord) return;

    if (currentQuestion.taskType === "single_note_vs_chord") {
      await playSingleNoteVsChord(getAudio(), currentQuestion.chordId, currentQuestion.expectedAnswer === "Acorde");
      return;
    }

    if (currentQuestion.taskType === "major_vs_minor_audio") {
      await playChordById(getAudio(), currentQuestion.chordId);
      return;
    }

    await playArpeggiatedChord(getAudio(), chord.midiNotes);
  }

  function revealHint() {
    setHelpUsed(true);
    setMessage("Ayuda activa: mira tónica, tercera y quinta. El orden no importa.");
  }

  function toggleNote(note: string) {
    if (!currentQuestion || state !== "active" || currentAnswer || currentQuestion.answerOptions) return;
    void playChordNote(getAudio(), note, 220);
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
    const chord = getChordById(currentQuestion.chordId);
    if (!chord) return;
    const expectedNotes = chord.midiNotes.map((midi) => {
      const expected = currentQuestion.expectedNotes?.find((note) => normalizePitchSet([note])[0] === midi % 12);
      return expected ?? chord.notes[chord.midiNotes.indexOf(midi)];
    });
    const isCorrect = validateChordNotes(expectedNotes, selectedNotes);
    const correctNotesCount = countCorrectChordNotes(expectedNotes, selectedNotes);
    const expectedPitchSet = new Set(normalizePitchSet(expectedNotes));
    const selectedPitchSet = new Set(normalizePitchSet(selectedNotes));
    const missingNotes = expectedNotes.filter((note) => !selectedPitchSet.has(normalizePitchSet([note])[0]));
    const wrongNote = selectedNotes.find((note) => !expectedPitchSet.has(normalizePitchSet([note])[0]));
    const answer: ChordAnswer = {
      questionId: currentQuestion.id,
      selectedNotes,
      isCorrect,
      expectedAnswer: chord.notes.map(getDisplayNoteName),
      userAnswer: selectedNotes.map(getDisplayNoteName),
      correctNotesCount,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
      chordId: currentQuestion.chordId,
      chordQuality: chord.quality,
      points: pointsForChordAnswer({ isCorrect, helpUsed: helpUsed || assistedMode, replayUsed, correctNotesCount }),
      errorDetails: isCorrect ? undefined : { wrongNote, missingNotes },
    };
    commitAnswer(answer);
    void playChord(getAudio(), selectedNotes);
  }

  function answerWithOption(option: string) {
    if (!currentQuestion || !currentQuestion.answerOptions || currentAnswer || state !== "active") return;
    const chord = getChordById(currentQuestion.chordId);
    if (!chord) return;
    const expectedAnswer = getExpectedOptionForQuestion(currentQuestion);
    const isCorrect = option === expectedAnswer;
    const answer: ChordAnswer = {
      questionId: currentQuestion.id,
      selectedOption: option,
      isCorrect,
      expectedAnswer,
      userAnswer: option,
      helpUsed: helpUsed || assistedMode,
      replayUsed,
      chordId: currentQuestion.chordId,
      chordQuality: chord.quality,
      points: pointsForChordAnswer({ isCorrect, helpUsed: helpUsed || assistedMode, replayUsed }),
      errorDetails: isCorrect
        ? undefined
        : {
            selectedQuality: option === "mayor" ? "major" : option === "menor" ? "minor" : undefined,
            expectedQuality: chord.quality,
          },
    };
    commitAnswer(answer);
  }

  function commitAnswer(answer: ChordAnswer) {
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);
    setCurrentAnswer(answer);
    setMessage(getChordFeedback({ question: currentQuestion as ChordQuestion, answer }));
    trackAnswer(answer, nextAnswers);
    if (answer.isCorrect) void playChordSuccess(getAudio());
    else void playChordError(getAudio());
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
    setMessage("Siguiente ronda. Escucha y revisa la fórmula.");
  }

  function finishExercise() {
    const attempt = buildChordAttempt({ exercise, startedAt, answers, totalUnits });
    setState(attempt.passed ? "completed" : "failed");
    setMessage(
      attempt.passed
        ? "Ejercicio aprobado. Ya estás construyendo tríadas con criterio."
        : "Repite el ejercicio: revisa tónica, tercera y quinta antes de confirmar.",
    );
    onAttemptComplete(attempt);
  }

  function trackAnswer(answer: ChordAnswer, nextAnswers: ChordAnswer[]) {
    const nextScoring = scoreChordAnswers(nextAnswers, totalUnits);
    trackChordEvent("chord_question_answered", {
      moduleId: exercise.moduleId,
      exerciseId: exercise.id,
      questionId: answer.questionId,
      chordId: answer.chordId,
      chordQuality: answer.chordQuality,
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
