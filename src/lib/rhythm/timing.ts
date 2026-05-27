import type {
  BeatEvent,
  RhythmExercise,
  RhythmExerciseRound,
  TimingGrade,
  TimingResult,
  TimingWindows,
  UserHitEvent,
} from "@/types/rhythm";

export const INPUT_LATENCY_OFFSET_MS = 0;
export const MISS_WINDOW_MS = 180;

export const defaultTimingWindows: TimingWindows = {
  perfectMs: 45,
  goodMs: 100,
  earlyLateMs: 180,
};

export const assistedTimingWindows: TimingWindows = {
  perfectMs: 55,
  goodMs: 120,
  earlyLateMs: 180,
};

export type TimingEvaluationOptions = {
  windows?: TimingWindows;
  inputLatencyOffsetMs?: number;
};

export function getBeatIntervalMs(bpm: number) {
  return 60_000 / bpm;
}

export function pointsForGrade(grade: TimingGrade) {
  const points = {
    perfect: 100,
    good: 60,
    early: 25,
    late: 25,
    miss: 0,
  } satisfies Record<TimingGrade, number>;

  return points[grade];
}

export function classifyTiming(errorMs: number, windows: TimingWindows = defaultTimingWindows) {
  const absError = Math.abs(errorMs);

  if (absError <= windows.perfectMs) {
    return "perfect";
  }

  if (absError <= windows.goodMs) {
    return "good";
  }

  if (errorMs < -windows.goodMs && errorMs >= -windows.earlyLateMs) {
    return "early";
  }

  if (errorMs > windows.goodMs && errorMs <= windows.earlyLateMs) {
    return "late";
  }

  return "miss";
}

export function flattenExerciseRounds(exercise: RhythmExercise): RhythmExerciseRound[] {
  if (exercise.rounds?.length) {
    return exercise.rounds;
  }

  if (exercise.patterns?.length) {
    return exercise.patterns.map((pattern) => ({
      bpm: exercise.bpm,
      totalBeats: pattern.beats.length,
      pattern: pattern.beats,
      label: pattern.label,
    }));
  }

  return [
    {
      bpm: exercise.bpm,
      totalBeats: exercise.totalBeats,
      pattern: exercise.pattern,
    },
  ];
}

export function generateBeatEvents({
  exercise,
  startTimestamp,
}: {
  exercise: RhythmExercise;
  startTimestamp: number;
}) {
  const events: BeatEvent[] = [];
  let cursor = startTimestamp;
  let beatIndex = 0;

  flattenExerciseRounds(exercise).forEach((round, roundIndex) => {
    const intervalMs = getBeatIntervalMs(round.bpm);

    Array.from({ length: round.totalBeats }).forEach((_, index) => {
      const shouldTap = round.pattern ? round.pattern[index % round.pattern.length] === 1 : true;

      events.push({
        beatIndex,
        expectedTimestamp: cursor,
        shouldTap,
        wasEvaluated: false,
        bpm: round.bpm,
        roundIndex,
      });

      cursor += intervalMs;
      beatIndex += 1;
    });
  });

  return events;
}

export function findClosestUnevaluatedBeat(userTimestamp: number, beatEvents: BeatEvent[]) {
  const candidates = beatEvents
    .filter((beat) => !beat.wasEvaluated)
    .map((beat) => ({
      beat,
      distance: Math.abs(userTimestamp - beat.expectedTimestamp),
    }))
    .filter((candidate) => candidate.distance <= MISS_WINDOW_MS)
    .sort((a, b) => a.distance - b.distance);

  return candidates[0]?.beat;
}

export function adjustInputTimestamp(
  rawUserTimestamp: number,
  inputLatencyOffsetMs = INPUT_LATENCY_OFFSET_MS,
) {
  return rawUserTimestamp - inputLatencyOffsetMs;
}

export function evaluateHit(
  userHit: UserHitEvent,
  beatEvents: BeatEvent[],
  windowsOrOptions: TimingWindows | TimingEvaluationOptions = defaultTimingWindows,
): TimingResult | null {
  const options =
    "perfectMs" in windowsOrOptions ? { windows: windowsOrOptions } : windowsOrOptions;
  const windows = options.windows ?? defaultTimingWindows;
  const adjustedTimestamp = adjustInputTimestamp(
    userHit.timestamp,
    options.inputLatencyOffsetMs ?? INPUT_LATENCY_OFFSET_MS,
  );
  const candidate = findClosestUnevaluatedBeat(adjustedTimestamp, beatEvents);

  if (!candidate) {
    return null;
  }

  const error = adjustedTimestamp - candidate.expectedTimestamp;
  const grade = candidate.shouldTap ? classifyTiming(error, windows) : "miss";
  candidate.wasEvaluated = true;

  return {
    beatIndex: candidate.beatIndex,
    expectedTimestamp: candidate.expectedTimestamp,
    actualTimestamp: adjustedTimestamp,
    timingErrorMs: error,
    grade,
    points: pointsForGrade(grade),
    shouldTap: candidate.shouldTap,
  };
}

export function getActiveBeatClockState({
  currentTimestamp,
  beatEvents,
}: {
  currentTimestamp: number;
  beatEvents: BeatEvent[];
}) {
  const firstBeat = beatEvents[0];
  const lastBeat = beatEvents.at(-1);

  if (!firstBeat || !lastBeat) {
    return {
      activeBeatIndex: 0,
      pulseProgress: 0,
      isAfterLastBeat: false,
    };
  }

  const rawActiveIndex = beatEvents.findIndex(
    (beat) => currentTimestamp < beat.expectedTimestamp + getBeatIntervalMs(beat.bpm),
  );
  const activeBeatIndex =
    rawActiveIndex === -1 ? beatEvents.length - 1 : Math.max(0, rawActiveIndex);
  const activeBeat = beatEvents[activeBeatIndex] ?? lastBeat;
  const previousBeat = beatEvents[Math.max(0, activeBeatIndex - 1)] ?? firstBeat;
  const interval = getBeatIntervalMs(activeBeat.bpm);
  const pulseProgress = Math.min(
    1,
    Math.max(0, (currentTimestamp - previousBeat.expectedTimestamp) / interval),
  );

  return {
    activeBeatIndex,
    pulseProgress,
    isAfterLastBeat: currentTimestamp > lastBeat.expectedTimestamp + MISS_WINDOW_MS,
  };
}

export function collectMissedBeats(
  currentTimestamp: number,
  beatEvents: BeatEvent[],
): TimingResult[] {
  return beatEvents.flatMap((beat) => {
    if (beat.wasEvaluated || currentTimestamp <= beat.expectedTimestamp + MISS_WINDOW_MS) {
      return [];
    }

    beat.wasEvaluated = true;

    if (!beat.shouldTap) {
      return [];
    }

    return {
      beatIndex: beat.beatIndex,
      expectedTimestamp: beat.expectedTimestamp,
      grade: "miss" as const,
      points: 0,
      shouldTap: beat.shouldTap,
    };
  });
}
