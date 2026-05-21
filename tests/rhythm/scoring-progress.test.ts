import assert from "node:assert/strict";
import test from "node:test";

import { rhythmExercises } from "@/data/rhythm-basics";
import { applyRhythmAttemptToProgress, createInitialRhythmProgress } from "@/lib/rhythm/progress";
import { scoreRhythmResults } from "@/lib/rhythm/scoring";
import type { ExerciseAttempt, TimingResult } from "@/types/rhythm";

test("calcula score, accuracy y combo con multiplicador gradual", () => {
  const results: TimingResult[] = [
    { beatIndex: 0, expectedTimestamp: 0, grade: "perfect", points: 100, shouldTap: true },
    { beatIndex: 1, expectedTimestamp: 1000, grade: "perfect", points: 100, shouldTap: true },
    { beatIndex: 2, expectedTimestamp: 2000, grade: "perfect", points: 100, shouldTap: true },
    { beatIndex: 3, expectedTimestamp: 3000, grade: "perfect", points: 100, shouldTap: true },
    { beatIndex: 4, expectedTimestamp: 4000, grade: "perfect", points: 100, shouldTap: true },
    { beatIndex: 5, expectedTimestamp: 5000, grade: "good", points: 60, shouldTap: true },
  ];

  const scoring = scoreRhythmResults(results, 6);

  assert.equal(scoring.score, 576);
  assert.equal(scoring.accuracy, 1);
  assert.equal(scoring.comboMax, 6);
  assert.equal(scoring.misses, 0);
});

test("desbloquea el siguiente ejercicio al aprobar", () => {
  const exercises = rhythmExercises.slice(0, 2);
  const progress = createInitialRhythmProgress("basic-rhythm", exercises);
  const attempt: ExerciseAttempt = {
    exerciseId: "follow-pulse",
    startedAt: "2026-05-18T00:00:00.000Z",
    finishedAt: "2026-05-18T00:01:00.000Z",
    bpm: 60,
    results: [],
    score: 1000,
    maxScore: 2000,
    accuracy: 0.75,
    comboMax: 8,
    misses: 2,
    averageTimingErrorMs: 12,
    tendency: "balanced",
    completed: true,
    passed: true,
  };

  const nextProgress = applyRhythmAttemptToProgress({ progress, exercises, attempt });

  assert.equal(nextProgress.exercises["follow-pulse"]?.completed, true);
  assert.equal(nextProgress.exercises["tempo-compare"]?.unlocked, true);
  assert.equal(nextProgress.currentExerciseId, "tempo-compare");
});
