import assert from "node:assert/strict";
import test from "node:test";

import {
  buildIntervalNoteAnswer,
  buildIntervalOptionAnswer,
  canAnswerIntervalWithNote,
} from "@/lib/intervals/answers";
import type { IntervalQuestion } from "@/types/intervals";

const noteQuestion: IntervalQuestion = {
  id: "q-note",
  exerciseId: "find-interval",
  baseNote: "C4",
  targetNote: "E4",
  intervalSemitones: 4,
  direction: "ascending",
  mode: "visual",
  taskType: "find_interval",
  prompt: "Toca una tercera mayor hacia arriba.",
};

test("construye respuestas de nota para intervalos fuera del hook React", () => {
  const correctAnswer = buildIntervalNoteAnswer({
    question: noteQuestion,
    selectedNote: "E4",
    usedHint: false,
  });
  const wrongAnswer = buildIntervalNoteAnswer({
    question: noteQuestion,
    selectedNote: "D#4",
    usedHint: true,
  });

  assert.equal(canAnswerIntervalWithNote(noteQuestion), true);
  assert.equal(correctAnswer.isCorrect, true);
  assert.equal(correctAnswer.points, 100);
  assert.equal(correctAnswer.expectedAnswer, "Mi4");
  assert.equal(wrongAnswer.isCorrect, false);
  assert.equal(wrongAnswer.intervalError, 3);
  assert.equal(wrongAnswer.points, 0);
});

test("construye respuestas de opción para intervalos auditivos", () => {
  const question: IntervalQuestion = {
    id: "q-option",
    exerciseId: "audio-distance",
    baseNote: "C4",
    targetNote: "G4",
    intervalSemitones: 7,
    direction: "ascending",
    mode: "audio",
    taskType: "audio_distance",
    prompt: "Escucha y elige la distancia.",
  };

  const answer = buildIntervalOptionAnswer({
    question,
    selectedOption: "salto grande",
    usedHint: true,
  });

  assert.equal(canAnswerIntervalWithNote(question), false);
  assert.equal(answer.isCorrect, true);
  assert.equal(answer.points, 60);
  assert.equal(answer.expectedAnswer, "salto grande");
});
