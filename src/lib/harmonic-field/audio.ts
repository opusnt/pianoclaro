import type { PianoAudioEngine } from "@/lib/audio/piano-engine";
import type { ScaleDegree } from "@/types/harmonic-field";
import { getChordByDegree, midiToFrequency, noteToMidi, requireField } from "./theory";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function playHarmonicFieldNote(
  engine: PianoAudioEngine,
  noteName: string,
  durationMs = 360,
) {
  await engine.playFrequency(midiToFrequency(noteToMidi(noteName)), durationMs);
}

export async function playChord(engine: PianoAudioEngine, noteNames: string[], durationMs = 560) {
  await Promise.all(noteNames.map((note) => playHarmonicFieldNote(engine, note, durationMs)));
}

export async function playArpeggiatedChord(
  engine: PianoAudioEngine,
  midiNotes: number[],
  durationMs = 210,
) {
  for (const midi of midiNotes) {
    await engine.playFrequency(midiToFrequency(midi), durationMs);
    await wait(durationMs * 0.72);
  }
}

export async function playFieldScale(engine: PianoAudioEngine, fieldId: string, durationMs = 240) {
  const field = requireField(fieldId);
  for (const midi of [...field.scaleMidiNotes, field.scaleMidiNotes[0] + 12]) {
    await engine.playFrequency(midiToFrequency(midi), durationMs);
    await wait(durationMs * 0.82);
  }
}

export async function playDegreeChord(
  engine: PianoAudioEngine,
  fieldId: string,
  degree: ScaleDegree,
) {
  const field = requireField(fieldId);
  const chord = getChordByDegree(field, degree);
  await Promise.all(
    chord.midiNotes.map((midi) => engine.playFrequency(midiToFrequency(midi), 560)),
  );
}

export async function playProgression(
  engine: PianoAudioEngine,
  fieldId: string,
  degrees: ScaleDegree[],
  durationMs = 900,
) {
  const field = requireField(fieldId);
  for (const degree of degrees) {
    const chord = getChordByDegree(field, degree);
    await playChord(engine, chord.notes, durationMs);
    await wait(durationMs);
  }
}

export async function playHarmonicFieldSuccess(engine: PianoAudioEngine) {
  await engine.playFrequency(659.25, 120);
  await wait(80);
  await engine.playFrequency(783.99, 160);
}

export async function playHarmonicFieldError(engine: PianoAudioEngine) {
  await engine.playFrequency(220, 130);
  await wait(70);
  await engine.playFrequency(196, 160);
}
