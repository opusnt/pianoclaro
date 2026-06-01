import type { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { getInversionById, midiToFrequency, noteToMidi } from "./theory";

export async function playInversionNote(
  engine: PianoAudioEngine,
  noteOrMidi: string | number,
  durationMs = 420,
) {
  const midi = typeof noteOrMidi === "number" ? noteOrMidi : noteToMidi(noteOrMidi);
  await engine.playFrequency(midiToFrequency(midi), durationMs);
}

export async function playChordInversion(
  engine: PianoAudioEngine,
  inversionId: string,
  durationMs = 760,
) {
  const inversion = getInversionById(inversionId);
  if (!inversion) return;
  await playChord(engine, inversion.midiNotes, durationMs);
}

export async function playChord(
  engine: PianoAudioEngine,
  noteNamesOrMidi: Array<string | number>,
  durationMs = 760,
) {
  await Promise.all(noteNamesOrMidi.map((note) => playInversionNote(engine, note, durationMs)));
}

export async function playArpeggiatedChord(
  engine: PianoAudioEngine,
  noteNamesOrMidi: Array<string | number>,
  noteDurationMs = 280,
) {
  for (const note of noteNamesOrMidi) {
    await playInversionNote(engine, note, noteDurationMs);
    await wait(110);
  }
}

export async function playInversionComparison(
  engine: PianoAudioEngine,
  rootPositionId: string,
  inversionId: string,
) {
  await playChordInversion(engine, rootPositionId, 520);
  await wait(360);
  await playChordInversion(engine, inversionId, 520);
}

export async function playInversionSuccess(engine: PianoAudioEngine) {
  await playChord(engine, [72, 76, 79], 260);
}

export async function playInversionError(engine: PianoAudioEngine) {
  await playChord(engine, [48, 49], 220);
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
