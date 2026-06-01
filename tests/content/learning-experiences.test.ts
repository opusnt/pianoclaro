import assert from "node:assert/strict";
import test from "node:test";

import { learningExperiences } from "@/data/learning-experiences";
import { contentRepository } from "@/lib/content";
import { assertLearningExperienceIntegrity } from "@/lib/learning-experience/learning-experience";

test("define experiencias renderizables para los dos carriles de aprendizaje", () => {
  assertLearningExperienceIntegrity();

  const trackIds = new Set(learningExperiences.map((experience) => experience.trackId));

  assert.equal(trackIds.has("music-theory"), true);
  assert.equal(trackIds.has("piano-lessons"), true);
});

test("cada experiencia se compone de paginas con actividades accionables", () => {
  for (const experience of learningExperiences) {
    const unit = contentRepository.getLearningUnitById(experience.unitId);

    assert.ok(unit, experience.unitId);
    assert.equal(experience.status, "active", experience.id);
    assert.ok(experience.entryRoute.startsWith("/"), experience.id);

    for (const page of experience.pages) {
      assert.equal(page.activities.length > 0, true, page.id);
      assert.equal(page.unlocksNextWhen.length > 0, true, page.id);

      for (const activity of page.activities) {
        assert.ok(activity.userAction.length > 0, activity.id);
        assert.equal(activity.inputModes.length > 0, true, activity.id);
        assert.equal(activity.feedbackModes.length > 0, true, activity.id);
        assert.equal(activity.successCriteria.length > 0, true, activity.id);
      }
    }
  }
});

test("el repositorio permite consultar experiencias por id, carril y unidad", () => {
  const chordExperience = contentRepository.getLearningExperienceById(
    "experience-chord-construction",
  );

  assert.equal(chordExperience?.trackId, "music-theory");
  assert.equal(
    contentRepository.getLearningExperienceByUnitId("unit-08-chords")?.id,
    "experience-chord-construction",
  );
  assert.equal(contentRepository.getLearningExperiencesByTrack("piano-lessons").length >= 1, true);
});
