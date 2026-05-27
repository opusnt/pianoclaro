"use client";

import { useCallback } from "react";

import { evaluateHit } from "@/lib/rhythm/timing";
import type { BeatEvent, TimingWindows, UserHitEvent } from "@/types/rhythm";

export function useTimingEvaluator(windows: TimingWindows, inputLatencyOffsetMs = 0) {
  return useCallback(
    (userHit: UserHitEvent, beatEvents: BeatEvent[]) =>
      evaluateHit(userHit, beatEvents, { windows, inputLatencyOffsetMs }),
    [inputLatencyOffsetMs, windows],
  );
}
