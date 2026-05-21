import assert from "node:assert/strict";
import test from "node:test";

import { contentRepository } from "@/lib/content";

test("expone el catálogo mock a través del repositorio de contenido", () => {
  assert.ok(contentRepository.getRoutes().length > 0);
  assert.ok(contentRepository.getLessons().length >= 3);
  assert.ok(contentRepository.getSongs().length > 0);
  assert.ok(contentRepository.getPricingPlans().length === 3);
});

test("resuelve entidades por slug sin exponer arreglos de datos al consumidor", () => {
  assert.equal(contentRepository.getRouteBySlug("piano-desde-cero")?.title, "Piano desde cero");
  assert.equal(
    contentRepository.getLessonBySlug("tus-primeras-5-notas")?.title,
    "Tus primeras 5 notas",
  );
  assert.equal(
    contentRepository.getPlayableSongLessonBySlug("himno-a-la-alegria")?.title,
    "Himno a la alegría",
  );
});
