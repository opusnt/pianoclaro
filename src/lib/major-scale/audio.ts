import type { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { getNoteFrequency, noteToMidi } from "@/lib/major-scale/theory";

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function playScaleNote(
  audio: PianoAudioEngine,
  noteOrMidi: string | number,
  durationMs = 360,
) {
  await audio.playFrequency(getNoteFrequency(noteOrMidi), durationMs);
}

export async function playScaleSequence({
  audio,
  midiNotes,
  noteDurationMs = 320,
}: {
  audio: PianoAudioEngine;
  midiNotes: number[];
  noteDurationMs?: number;
}) {
  for (const midi of midiNotes) {
    await playScaleNote(audio, midi, noteDurationMs);
    await wait(Math.max(80, noteDurationMs * 0.45));
  }
}

export async function playScale({
  audio,
  noteNames,
  direction = "ascending",
  noteDurationMs = 320,
}: {
  audio: PianoAudioEngine;
  noteNames: string[];
  direction?: "ascending" | "descending";
  noteDurationMs?: number;
}) {
  const notes = direction === "descending" ? [...noteNames].reverse() : noteNames;
  await playScaleSequence({
    audio,
    midiNotes: notes.map(noteToMidi),
    noteDurationMs,
  });
}

export async function playScaleSuccess(audio: PianoAudioEngine) {
  await audio.playFrequency(880, 90);
}

export async function playScaleError(audio: PianoAudioEngine) {
  await audio.playFrequency(150, 110);
}
