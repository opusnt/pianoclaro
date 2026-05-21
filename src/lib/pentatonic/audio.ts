import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { getNoteFrequency, getPentatonicScaleById, noteToMidi } from "@/lib/pentatonic/theory";

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function playPentatonicNote(
  audio: PianoAudioEngine,
  noteOrMidi: string | number,
  durationMs = 300,
) {
  await audio.playFrequency(getNoteFrequency(noteOrMidi), durationMs);
}

export async function playPentatonicSequence({
  audio,
  midiNotes,
  noteDurationMs = 260,
}: {
  audio: PianoAudioEngine;
  midiNotes: number[];
  noteDurationMs?: number;
}) {
  for (const midi of midiNotes) {
    await playPentatonicNote(audio, midi, noteDurationMs);
    await wait(Math.max(70, noteDurationMs * 0.42));
  }
}

export async function playPentatonicScale({
  audio,
  noteNames,
  noteDurationMs = 260,
}: {
  audio: PianoAudioEngine;
  noteNames: string[];
  noteDurationMs?: number;
}) {
  await playPentatonicSequence({ audio, midiNotes: noteNames.map(noteToMidi), noteDurationMs });
}

export async function playPentatonicScaleById(audio: PianoAudioEngine, scaleId: string) {
  await playPentatonicSequence({ audio, midiNotes: getPentatonicScaleById(scaleId)?.midiNotes ?? [] });
}

export async function playBackingLoop(audio: PianoAudioEngine, scaleId = "c-major-pentatonic") {
  const scale = getPentatonicScaleById(scaleId);
  const bass = scale?.midiNotes[0] ?? 60;
  const fifth = scale?.midiNotes[3] ?? 67;

  for (let index = 0; index < 4; index += 1) {
    await audio.playFrequency(getNoteFrequency(index % 2 === 0 ? bass : fifth), 220);
    await wait(260);
  }
  // TODO: reemplazar este placeholder por backing tracks reales sincronizados a tempo.
}

export async function playPentatonicSuccess(audio: PianoAudioEngine) {
  await audio.playFrequency(880, 90);
}

export async function playPentatonicError(audio: PianoAudioEngine) {
  await audio.playFrequency(150, 110);
}
