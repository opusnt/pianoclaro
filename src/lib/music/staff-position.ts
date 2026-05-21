import type { NoteName, ScoreMock } from "@/types/lesson";

const whiteStepIndex: Record<NoteName, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

const baseOctaveByClef: Record<ScoreMock["clef"], number> = {
  treble: 4,
  bass: 2,
};

const topLineStepByClef: Record<ScoreMock["clef"], number> = {
  treble: getDiatonicStep("F", 5),
  bass: getDiatonicStep("A", 3),
};

export type StaffPosition = {
  y: number;
  rowOffset: number;
  needsLedgerLine: boolean;
  ledgerY?: number;
};

export function getDiatonicStep(note: NoteName, octave: number) {
  return octave * 7 + whiteStepIndex[note];
}

export function getDefaultOctave(note: NoteName, clef: ScoreMock["clef"]) {
  const baseOctave = baseOctaveByClef[clef];

  if (clef === "treble") {
    return note === "C" || note === "D" ? baseOctave : baseOctave;
  }

  return note === "A" || note === "B" ? baseOctave : baseOctave + 1;
}

export function getStaffPosition({
  note,
  clef,
  staffTopY,
  rowHeight,
  octave = getDefaultOctave(note, clef),
}: {
  note: NoteName;
  clef: ScoreMock["clef"];
  staffTopY: number;
  rowHeight: number;
  octave?: number;
}): StaffPosition {
  const rowOffset = topLineStepByClef[clef] - getDiatonicStep(note, octave);
  const y = staffTopY + rowOffset * rowHeight;
  const ledgerRow = rowOffset < 0 ? 0 : 10;
  const needsLedgerLine = rowOffset < 0 || rowOffset >= 10;

  return {
    y,
    rowOffset,
    needsLedgerLine,
    ledgerY: needsLedgerLine ? staffTopY + ledgerRow * rowHeight : undefined,
  };
}

