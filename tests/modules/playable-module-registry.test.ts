import test from "node:test";
import assert from "node:assert/strict";

import { detailedLearningModules } from "@/data/modules";
import {
  getPlayableModuleRegistration,
  isPlayableModuleId,
  playableModuleIds,
  playableModuleRegistry,
} from "@/lib/modules/playable-modules";

test("mantiene un registro para cada módulo jugable", () => {
  assert.deepEqual(Object.keys(playableModuleRegistry).sort(), [...playableModuleIds].sort());

  playableModuleIds.forEach((moduleId) => {
    const registration = getPlayableModuleRegistration(moduleId);
    assert.equal(registration?.id, moduleId);
    assert.equal(typeof registration?.render, "function");
  });
});

test("cada módulo jugable existe en el catálogo curricular detallado", () => {
  const detailedIds = new Set(detailedLearningModules.map((module) => module.id));

  playableModuleIds.forEach((moduleId) => {
    assert.equal(detailedIds.has(moduleId), true, `${moduleId} no existe en detailedLearningModules`);
  });
});

test("distingue módulos futuros no jugables", () => {
  assert.equal(isPlayableModuleId("popular-progressions"), false);
  assert.equal(getPlayableModuleRegistration("popular-progressions"), undefined);
});
