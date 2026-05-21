import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { getNoteFrequency } from "@/lib/intervals/theory";

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function playIntervalNote(
  audio: PianoAudioEngine,
  note: string,
  durationMs = 420,
) {
  await audio.playFrequency(getNoteFrequency(note), durationMs);
}

export async function playMelodicInterval({
  audio,
  baseNote,
  targetNote,
  gapMs = 500,
}: {
  audio: PianoAudioEngine;
  baseNote: string;
  targetNote: string;
  gapMs?: number;
}) {
  await playIntervalNote(audio, baseNote, 360);
  await wait(gapMs);
  await playIntervalNote(audio, targetNote, 420);
}

export async function playHarmonicInterval({
  audio,
  baseNote,
  targetNote,
}: {
  audio: PianoAudioEngine;
  baseNote: string;
  targetNote: string;
}) {
  await Promise.all([
    playIntervalNote(audio, baseNote, 520),
    playIntervalNote(audio, targetNote, 520),
  ]);
}

export async function playIntervalSuccess(audio: PianoAudioEngine) {
  await audio.playFrequency(880, 90);
}

export async function playIntervalError(audio: PianoAudioEngine) {
  await audio.playFrequency(150, 110);
}
