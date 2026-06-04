export type DistanceType = "semitone" | "tone";

export interface DistanceExercise {
  id: string;
  start: string;
  end: string;
  semitones: number;
  type: DistanceType;
}

export const semitoneExercises: DistanceExercise[] = [
  { id: "semi-01", start: "E4", end: "F4", semitones: 1, type: "semitone" },
  { id: "semi-02", start: "B3", end: "C4", semitones: 1, type: "semitone" },
  { id: "semi-03", start: "C4", end: "C#4", semitones: 1, type: "semitone" },
  { id: "semi-04", start: "F4", end: "F#4", semitones: 1, type: "semitone" },
  { id: "semi-05", start: "A3", end: "A#3", semitones: 1, type: "semitone" },
  { id: "semi-06", start: "D#4", end: "E4", semitones: 1, type: "semitone" },
  { id: "semi-07", start: "G3", end: "G#3", semitones: 1, type: "semitone" },
  { id: "semi-08", start: "C#4", end: "D4", semitones: 1, type: "semitone" },
  { id: "semi-09", start: "G#3", end: "A3", semitones: 1, type: "semitone" },
  { id: "semi-10", start: "D4", end: "D#4", semitones: 1, type: "semitone" },
  { id: "semi-11", start: "A#3", end: "B3", semitones: 1, type: "semitone" },
  { id: "semi-12", start: "F#3", end: "G3", semitones: 1, type: "semitone" },
];

export const toneExercises: DistanceExercise[] = [
  { id: "tone-01", start: "C4", end: "D4", semitones: 2, type: "tone" },
  { id: "tone-02", start: "F4", end: "G4", semitones: 2, type: "tone" },
  { id: "tone-03", start: "A3", end: "B3", semitones: 2, type: "tone" },
  { id: "tone-04", start: "G3", end: "A3", semitones: 2, type: "tone" },
  { id: "tone-05", start: "D4", end: "E4", semitones: 2, type: "tone" },
  { id: "tone-06", start: "E4", end: "F#4", semitones: 2, type: "tone" },
  { id: "tone-07", start: "B3", end: "C#4", semitones: 2, type: "tone" },
  { id: "tone-08", start: "C#4", end: "D#4", semitones: 2, type: "tone" },
  { id: "tone-09", start: "F#3", end: "G#3", semitones: 2, type: "tone" },
  { id: "tone-10", start: "G#3", end: "A#3", semitones: 2, type: "tone" },
  { id: "tone-11", start: "A#3", end: "C4", semitones: 2, type: "tone" },
  { id: "tone-12", start: "D#4", end: "F4", semitones: 2, type: "tone" },
];

// Helper to check distance
export function isSemitone(note1: string, note2: string): boolean {
  return Math.abs(getMidiFromNote(note1) - getMidiFromNote(note2)) === 1;
}

export function isTone(note1: string, note2: string): boolean {
  return Math.abs(getMidiFromNote(note1) - getMidiFromNote(note2)) === 2;
}

// Simple MIDI conversion for checking distances
export function getMidiFromNote(note: string): number {
  const noteRegex = /^([A-G])(#?)(\d)$/;
  const match = note.match(noteRegex);
  if (!match) return 0;

  const baseNote = match[1];
  const sharp = match[2] === "#";
  const octave = parseInt(match[3], 10);

  const baseMidiMap: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };

  const baseMidi = baseMidiMap[baseNote];
  // C4 in MIDI is usually 60, but C3 is 48. Let's use standard MIDI where C-1 = 0
  const midi = baseMidi + (sharp ? 1 : 0) + (octave + 1) * 12;
  return midi;
}
