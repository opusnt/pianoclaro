import { learningUnits } from "@/data/learning-path";
import type { LearningUnit } from "@/types/learning-path";

export function getActiveLearningUnits() {
  return learningUnits.filter((unit) => unit.status === "active");
}

export function getLearningUnitsByRoute(routeSlug: string) {
  return learningUnits.filter((unit) => unit.routeSlug === routeSlug);
}

export function getLearningUnitsByStage(stageId: string) {
  return learningUnits.filter((unit) => unit.stageId === stageId);
}

export function getNextLearningUnit(unit: LearningUnit) {
  if (!unit.nextUnitId) return undefined;
  return learningUnits.find((candidate) => candidate.id === unit.nextUnitId);
}

export function assertLearningUnitIntegrity(units: LearningUnit[] = learningUnits) {
  const ids = new Set(units.map((unit) => unit.id));

  for (const unit of units) {
    if (unit.masteryCriteria.length === 0) {
      throw new Error(`Learning unit without mastery criteria: ${unit.id}`);
    }

    for (const prerequisiteId of unit.prerequisiteUnitIds) {
      if (!ids.has(prerequisiteId)) {
        throw new Error(`Learning unit ${unit.id} has missing prerequisite ${prerequisiteId}`);
      }
    }

    if (unit.nextUnitId && !ids.has(unit.nextUnitId)) {
      throw new Error(`Learning unit ${unit.id} has missing next unit ${unit.nextUnitId}`);
    }
  }
}
