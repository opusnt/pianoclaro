import assert from "node:assert/strict";
import test from "node:test";
import { firstFiveNotesModuleId, keyboardNotesLessonSlug } from "@/data/learning-slugs";
import { contentRepository } from "@/lib/content";

test("expone el catálogo mock a través del repositorio de contenido", () => {
  assert.ok(contentRepository.getRoutes().length > 0);
  assert.ok(contentRepository.getLessons().length >= 3);
  assert.ok(contentRepository.getSongs().length > 0);
  assert.ok(contentRepository.getPricingPlans().length === 3);
  assert.ok(contentRepository.getLearningUnits().length >= 10);
});

test("resuelve entidades por slug sin exponer arreglos de datos al consumidor", () => {
  assert.equal(contentRepository.getRouteBySlug("piano-desde-cero")?.title, "Piano desde cero");
  assert.equal(
    contentRepository.getLessonBySlug(keyboardNotesLessonSlug)?.title,
    "El teclado y las notas",
  );
  assert.equal(
    contentRepository.getPlayableSongLessonBySlug("himno-a-la-alegria")?.title,
    "Himno a la alegría",
  );
  assert.equal(
    contentRepository.getLearningUnitByLessonSlug(keyboardNotesLessonSlug)?.title,
    "Mapa del teclado y primeras notas",
  );
  assert.equal(
    contentRepository.getLearningUnitByPlayableModuleId(firstFiveNotesModuleId)?.title,
    "Mapa del teclado y primeras notas",
  );
  assert.equal(
    contentRepository.getLearningUnitByPlayableModuleId("basic-rhythm")?.title,
    "Pulso y timing básico",
  );
});
