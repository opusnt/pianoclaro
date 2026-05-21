import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { getNoteFrequency, noteToMidi } from "@/lib/minor-scale/theory";

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function playMinorScaleNote(
  audio: PianoAudioEngine,
  noteOrMidi: string | number,
  durationMs = 360,
) {
  await audio.playFrequency(getNoteFrequency(noteOrMidi), durationMs);
}

export async function playMinorScaleSequence({
  audio,
  midiNotes,
  noteDurationMs = 320,
}: {
  audio: PianoAudioEngine;
  midiNotes: number[];
  noteDurationMs?: number;
}) {
  for (const midi of midiNotes) {
    await playMinorScaleNote(audio, midi, noteDurationMs);
    await wait(Math.max(80, noteDurationMs * 0.45));
  }
}

export async function playMinorScale({
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
  await playMinorScaleSequence({
    audio,
    midiNotes: notes.map(noteToMidi),
    noteDurationMs,
  });
}

export async function playScaleComparison({
  audio,
  firstScaleMidiNotes,
  secondScaleMidiNotes,
  noteDurationMs = 260,
}: {
  audio: PianoAudioEngine;
  firstScaleMidiNotes: number[];
  secondScaleMidiNotes: number[];
  noteDurationMs?: number;
}) {
  await playMinorScaleSequence({ audio, midiNotes: firstScaleMidiNotes, noteDurationMs });
  await wait(420);
  await playMinorScaleSequence({ audio, midiNotes: secondScaleMidiNotes, noteDurationMs });
}

export async function playMinorScaleSuccess(audio: PianoAudioEngine) {
  await audio.playFrequency(880, 90);
}

export async function playMinorScaleError(audio: PianoAudioEngine) {
  await audio.playFrequency(150, 110);
}
