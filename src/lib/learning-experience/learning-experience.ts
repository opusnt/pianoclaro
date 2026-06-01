import { learningExperiences } from "@/data/learning-experiences";
import { learningExperienceTracks, learningUnits } from "@/data/learning-path";
import type { LearningExperience } from "@/types/learning-experience";

const forbiddenAudienceWords = ["docente", "tutor", "profesor"];

function assertNonEmpty(value: string, message: string) {
  if (!value.trim()) {
    throw new Error(message);
  }
}

function assertStudentFacingText(value: string, message: string) {
  const normalized = value.toLowerCase();

  for (const word of forbiddenAudienceWords) {
    if (normalized.includes(word)) {
      throw new Error(`${message}: contains ${word}`);
    }
  }
}

export function assertLearningExperienceIntegrity(
  experiences: LearningExperience[] = learningExperiences,
) {
  const unitIds = new Set(learningUnits.map((unit) => unit.id));
  const trackIds = new Set(learningExperienceTracks.map((track) => track.id));

  for (const experience of experiences) {
    assertNonEmpty(experience.id, "Learning experience id is required");
    assertNonEmpty(experience.title, `${experience.id}: title is required`);
    assertNonEmpty(experience.summary, `${experience.id}: summary is required`);

    if (!unitIds.has(experience.unitId)) {
      throw new Error(`${experience.id}: unknown unit ${experience.unitId}`);
    }

    if (!trackIds.has(experience.trackId)) {
      throw new Error(`${experience.id}: unknown track ${experience.trackId}`);
    }

    if (!experience.entryRoute.startsWith("/")) {
      throw new Error(`${experience.id}: entryRoute must be an internal route`);
    }

    if (experience.pages.length === 0) {
      throw new Error(`${experience.id}: at least one page is required`);
    }

    const orders = experience.pages.map((page) => page.order);
    const expectedOrders = Array.from({ length: experience.pages.length }, (_, index) => index + 1);

    if (JSON.stringify(orders) !== JSON.stringify(expectedOrders)) {
      throw new Error(`${experience.id}: page order must start at 1 and be sequential`);
    }

    for (const page of experience.pages) {
      assertNonEmpty(page.title, `${experience.id}/${page.id}: page title is required`);
      assertNonEmpty(page.goal, `${experience.id}/${page.id}: page goal is required`);

      if (page.activities.length === 0) {
        throw new Error(`${experience.id}/${page.id}: at least one activity is required`);
      }

      if (page.unlocksNextWhen.length === 0) {
        throw new Error(`${experience.id}/${page.id}: unlock criteria are required`);
      }

      for (const activity of page.activities) {
        assertNonEmpty(
          activity.title,
          `${experience.id}/${activity.id}: activity title is required`,
        );
        assertNonEmpty(activity.prompt, `${experience.id}/${activity.id}: prompt is required`);
        assertNonEmpty(
          activity.userAction,
          `${experience.id}/${activity.id}: user action is required`,
        );
        assertStudentFacingText(
          `${activity.title} ${activity.prompt} ${activity.userAction} ${activity.repairHint ?? ""}`,
          `${experience.id}/${activity.id}`,
        );

        if (activity.inputModes.length === 0) {
          throw new Error(`${experience.id}/${activity.id}: input modes are required`);
        }

        if (activity.feedbackModes.length === 0) {
          throw new Error(`${experience.id}/${activity.id}: feedback modes are required`);
        }

        if (activity.successCriteria.length === 0) {
          throw new Error(`${experience.id}/${activity.id}: success criteria are required`);
        }
      }
    }
  }
}
