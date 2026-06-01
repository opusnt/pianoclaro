"use client";

import { useMemo } from "react";

import { scoreRhythmResults } from "@/lib/rhythm/scoring";
import type { TimingResult } from "@/types/rhythm";

export function useRhythmScoring(results: TimingResult[], expectedHitCount: number) {
  return useMemo(() => scoreRhythmResults(results, expectedHitCount), [expectedHitCount, results]);
}
