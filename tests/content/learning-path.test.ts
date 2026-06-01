import assert from "node:assert/strict";
import test from "node:test";

import { learningUnits, pedagogicalMoments } from "@/data/learning-path";
import { curriculumStages, skillBranches } from "@/data/curriculum";
import { contentRepository } from "@/lib/content";
import { assertLearningUnitIntegrity } from "@/lib/learning-path/learning-path";
import { playableModuleIds } from "@/lib/modules/playable-modules";

test("define una unidad pedagogica para cada modulo jugable activo", () => {
  const activePlayableModuleIds = new Set(
    learningUnits
      .filter((unit) => unit.status === "active")
      .map((unit) => unit.playableModuleId)
      .filter(Boolean),
  );

  for (const moduleId of playableModuleIds) {
    assert.equal(activePlayableModuleIds.has(moduleId), true, moduleId);
  }
});

test("separa la experiencia principal en teoria musical y lecciones de piano", () => {
  const tracks = contentRepository.getLearningExperienceTracks();

  assert.deepEqual(
    tracks.map((track) => track.id),
    ["music-theory", "piano-lessons"],
  );

  for (const track of tracks) {
    assert.ok(track.title.length > 0, track.id);
    assert.ok(track.href.startsWith("/"), track.id);
    assert.ok(track.primaryActionLabel.length > 0, track.id);
    assert.equal(track.experienceRules.length >= 3, true, track.id);
  }
});

test("cada unidad tiene criterios de dominio, evidencia y reparacion", () => {
  assertLearningUnitIntegrity();

  for (const unit of learningUnits) {
    assert.ok(unit.shortGoal.length > 0, unit.id);
    assert.ok(unit.userOutcome.length > 0, unit.id);
    assert.ok(unit.primarySkillIds.length > 0, unit.id);
    assert.ok(unit.masteryCriteria.length > 0, unit.id);
    assert.ok(unit.evidence.length > 0, unit.id);
    assert.ok(unit.remediation.length > 0, unit.id);
    assert.ok(unit.practiceContract.essentialQuestion.length > 0, unit.id);
    assert.equal(unit.practiceContract.diagnosticRules.length >= 2, true, unit.id);
    assert.equal(unit.practiceContract.masteryRubric.length, 3, unit.id);
  }
});

test("cada unidad define contrato de practica, autoevaluacion y transferencia", () => {
  for (const unit of learningUnits) {
    assert.equal(unit.practiceContract.practicePlan.length >= 3, true, unit.id);
    assert.equal(unit.practiceContract.selfCheck.length >= 3, true, unit.id);
    assert.ok(unit.practiceContract.transferChallenge.length > 0, unit.id);

    for (const step of unit.practiceContract.practicePlan) {
      assert.ok(step.label.length > 0, unit.id);
      assert.ok(step.action.length > 0, unit.id);
      assert.ok(step.successSignal.length > 0, unit.id);
    }

    for (const rule of unit.practiceContract.diagnosticRules) {
      assert.ok(rule.symptom.length > 0, unit.id);
      assert.ok(rule.likelyCause.length > 0, unit.id);
      assert.ok(rule.intervention.length > 0, unit.id);
    }

    assert.deepEqual(
      unit.practiceContract.masteryRubric.map((level) => level.id),
      ["exploring", "practicing", "ready"],
      unit.id,
    );
  }
});

test("cada unidad apunta a una etapa y habilidades existentes", () => {
  const stageIds = new Set(curriculumStages.map((stage) => stage.id));
  const skillIds = new Set(skillBranches.map((skill) => skill.id));

  for (const unit of learningUnits) {
    assert.ok(stageIds.has(unit.stageId), `${unit.id}:${unit.stageId}`);

    for (const skillId of unit.primarySkillIds) {
      assert.ok(skillIds.has(skillId), `${unit.id}:${skillId}`);
    }
  }
});

test("las unidades enlazan solo lecciones y modulos existentes", () => {
  for (const unit of learningUnits) {
    for (const slug of unit.lessonSlugs) {
      assert.ok(contentRepository.getLessonBySlug(slug), `${unit.id}:${slug}`);
      assert.equal(contentRepository.getLearningUnitByLessonSlug(slug)?.id, unit.id);
    }

    if (unit.playableModuleId) {
      assert.ok(
        contentRepository.getDetailedLearningModuleById(unit.playableModuleId),
        unit.playableModuleId,
      );
      assert.equal(contentRepository.getLearningUnitByPlayableModuleId(unit.playableModuleId)?.id, unit.id);
    }
  }
});

test("las dependencias pedagogicas apuntan a unidades anteriores", () => {
  const unitById = new Map(learningUnits.map((unit) => [unit.id, unit]));

  for (const unit of learningUnits) {
    for (const prerequisiteId of unit.prerequisiteUnitIds) {
      const prerequisite = unitById.get(prerequisiteId);
      assert.ok(prerequisite, prerequisiteId);
      assert.equal(prerequisite.order < unit.order, true, `${prerequisiteId} -> ${unit.id}`);
    }
  }
});

test("el ciclo pedagogico conserva el contrato observa-entiende-toca-escucha-usa", () => {
  assert.deepEqual(
    pedagogicalMoments.map((moment) => moment.id),
    ["observe", "understand", "practice", "listen", "apply"],
  );
});
