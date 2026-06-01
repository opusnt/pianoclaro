import assert from "node:assert/strict";
import test from "node:test";

import { keyboardNotesModule } from "@/data/modules/keyboard-notes-module";
import { firstFiveNotesModuleId } from "@/data/learning-slugs";
import { mockContentRepository } from "@/lib/content/mock-content-repository";

test("define el módulo 1 con microlecciones cortas y completas", () => {
  assert.equal(keyboardNotesModule.id, firstFiveNotesModuleId);
  assert.equal(keyboardNotesModule.microLessons.length, 8);

  for (const lesson of keyboardNotesModule.microLessons) {
    assert.equal(lesson.idealMinutes <= 4, true, lesson.id);
    assert.equal(lesson.successCriteria.length > 0, true, lesson.id);
  }
});

test("incluye ejercicios, gamificación y evaluación final del módulo 1", () => {
  assert.equal(keyboardNotesModule.exercises.length >= 8, true);
  assert.equal(keyboardNotesModule.achievements.length >= 5, true);
  assert.equal(keyboardNotesModule.finalChallenge.tasks.length, 5);
  assert.equal(keyboardNotesModule.finalChallenge.passCriteria.length >= 4, true);
});

test("expone el módulo detallado desde el repositorio de contenido", () => {
  assert.equal(
    mockContentRepository.getDetailedLearningModuleById(firstFiveNotesModuleId)?.name,
    "Tus primeras 5 notas",
  );
});
