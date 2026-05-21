import assert from "node:assert/strict";
import test from "node:test";

import { curriculumStages, exerciseTypes, moduleBlueprints, skillBranches } from "@/data/curriculum";

test("define el mapa curricular completo de 5 etapas y 16 módulos", () => {
  assert.equal(curriculumStages.length, 5);
  assert.equal(moduleBlueprints.length, 16);
  assert.deepEqual(
    curriculumStages.map((stage) => stage.order),
    [1, 2, 3, 4, 5],
  );
});

test("cada módulo pertenece a una etapa, aporta habilidades y referencia ejercicios existentes", () => {
  const stageIds = new Set(curriculumStages.map((stage) => stage.id));
  const skillIds = new Set(skillBranches.map((skill) => skill.id));
  const exerciseIds = new Set(exerciseTypes.map((exercise) => exercise.id));

  for (const module of moduleBlueprints) {
    assert.equal(stageIds.has(module.stageId), true, module.id);
    assert.equal(Object.keys(module.contributesToSkills).length > 0, true, module.id);

    for (const skillId of Object.keys(module.contributesToSkills)) {
      assert.equal(skillIds.has(skillId as never), true, `${module.id}:${skillId}`);
    }

    for (const exerciseId of [
      ...module.auditoryExercises,
      ...module.executionExercises,
      ...module.recognitionExercises,
    ]) {
      assert.equal(exerciseIds.has(exerciseId), true, `${module.id}:${exerciseId}`);
    }
  }
});
