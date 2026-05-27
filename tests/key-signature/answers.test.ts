import assert from "node:assert/strict";
import test from "node:test";

import {
  buildKeySignatureNoteAnswer,
  buildKeySignatureOptionAnswer,
  midiToKeySignatureQuestionNote,
} from "@/lib/key-signature/answers";
import type { KeySignatureQuestion } from "@/types/key-signature";

const noteQuestion: KeySignatureQuestion = {
  id: "q-key-note",
  exerciseId: "global-accidental-rule",
  keyId: "g-major",
  mode: "visual",
  taskType: "global_accidental_rule",
  prompt: "En SOL mayor, toca FA#.",
  expectedAnswer: "FA#",
  selectedNoteTargetMidi: 66,
};

test("construye respuestas de nota para armaduras fuera del hook React", () => {
  const correctAnswer = buildKeySignatureNoteAnswer({
    question: noteQuestion,
    note: "F#4",
    expectedNote: "F#4",
    selectedMidi: 66,
    expectedMidi: 66,
    playedNotes: [],
    helpUsed: false,
    replayUsed: false,
  });
  const wrongAnswer = buildKeySignatureNoteAnswer({
    question: noteQuestion,
    note: "F4",
    expectedNote: "F#4",
    selectedMidi: 65,
    expectedMidi: 66,
    playedNotes: [],
    helpUsed: true,
    replayUsed: false,
  });

  assert.equal(midiToKeySignatureQuestionNote(noteQuestion, 66), "F#4");
  assert.equal(correctAnswer.isCorrect, true);
  assert.equal(correctAnswer.points, 100);
  assert.equal(correctAnswer.expectedAnswer, "FA#4");
  assert.equal(wrongAnswer.isCorrect, false);
  assert.equal(wrongAnswer.errorDetails?.wrongNote, "F4");
});

test("construye respuestas de opción para alteraciones y relativas", () => {
  const accidentalsQuestion: KeySignatureQuestion = {
    id: "q-accidentals",
    exerciseId: "identify-accidentals",
    keyId: "d-major",
    mode: "visual",
    taskType: "identify_accidentals",
    prompt: "Qué alteraciones fijas tiene RE mayor?",
    expectedAnswer: "FA# y DO#",
    answerOptions: ["sin alteraciones", "FA#", "FA# y DO#"],
  };
  const relativeQuestion: KeySignatureQuestion = {
    id: "q-relative",
    exerciseId: "find-relative-key",
    keyId: "g-major",
    mode: "visual",
    taskType: "find_relative_key",
    prompt: "Cuál es la relativa de SOL mayor?",
    expectedAnswer: "MI menor",
    answerOptions: ["MI menor", "RE menor"],
  };

  const correctAnswer = buildKeySignatureOptionAnswer({
    question: accidentalsQuestion,
    option: "FA# y DO#",
    helpUsed: false,
    replayUsed: true,
  });
  const wrongAnswer = buildKeySignatureOptionAnswer({
    question: relativeQuestion,
    option: "RE menor",
    helpUsed: false,
    replayUsed: false,
  });

  assert.equal(correctAnswer.isCorrect, true);
  assert.equal(correctAnswer.points, 75);
  assert.equal(wrongAnswer.isCorrect, false);
  assert.equal(wrongAnswer.errorDetails?.expectedRelativeKey, "MI menor");
});
