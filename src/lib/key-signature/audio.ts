import type { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { getNoteFrequency, noteToMidi } from "@/lib/key-signature/theory";

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function playKeySignatureNote(
  audio: PianoAudioEngine,
  noteOrMidi: string | number,
  durationMs = 320,
) {
  await audio.playFrequency(getNoteFrequency(noteOrMidi), durationMs);
}

export async function playKeySignatureSequence({
  audio,
  midiNotes,
  noteDurationMs = 280,
}: {
  audio: PianoAudioEngine;
  midiNotes: number[];
  noteDurationMs?: number;
}) {
  for (const midi of midiNotes) {
    await playKeySignatureNote(audio, midi, noteDurationMs);
    await wait(Math.max(70, noteDurationMs * 0.42));
  }
}

export async function playKeySignatureScale({
  audio,
  noteNames,
  noteDurationMs = 280,
}: {
  audio: PianoAudioEngine;
  noteNames: string[];
  noteDurationMs?: number;
}) {
  await playKeySignatureSequence({
    audio,
    midiNotes: noteNames.map(noteToMidi),
    noteDurationMs,
  });
}

export async function playKeySignatureComparison({
  audio,
  firstScaleMidiNotes,
  secondScaleMidiNotes,
  noteDurationMs = 220,
}: {
  audio: PianoAudioEngine;
  firstScaleMidiNotes: number[];
  secondScaleMidiNotes: number[];
  noteDurationMs?: number;
}) {
  await playKeySignatureSequence({ audio, midiNotes: firstScaleMidiNotes, noteDurationMs });
  await wait(300);
  await playKeySignatureSequence({ audio, midiNotes: secondScaleMidiNotes, noteDurationMs });
}

export async function playKeySignatureSuccess(audio: PianoAudioEngine) {
  await audio.playFrequency(880, 90);
}

export async function playKeySignatureError(audio: PianoAudioEngine) {
  await audio.playFrequency(150, 110);
}
