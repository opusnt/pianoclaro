import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { getChordById, midiToFrequency, noteToMidi } from "@/lib/chords/theory";

export async function playChordNote(engine: PianoAudioEngine, noteOrMidi: string | number, durationMs = 420) {
  const midi = typeof noteOrMidi === "number" ? noteOrMidi : noteToMidi(noteOrMidi);
  await engine.playFrequency(midiToFrequency(midi), durationMs);
}

export async function playChord(engine: PianoAudioEngine, noteNamesOrMidi: Array<string | number>, durationMs = 760) {
  await Promise.all(noteNamesOrMidi.map((note) => playChordNote(engine, note, durationMs)));
}

export async function playArpeggiatedChord(engine: PianoAudioEngine, noteNamesOrMidi: Array<string | number>, noteDurationMs = 280) {
  for (const note of noteNamesOrMidi) {
    await playChordNote(engine, note, noteDurationMs);
    await wait(110);
  }
}

export async function playChordById(engine: PianoAudioEngine, chordId: string) {
  const chord = getChordById(chordId);
  if (!chord) return;
  await playChord(engine, chord.midiNotes);
}

export async function playSingleNoteVsChord(engine: PianoAudioEngine, chordId: string, asChord: boolean) {
  const chord = getChordById(chordId);
  if (!chord) return;
  if (asChord) await playChord(engine, chord.midiNotes);
  else await playChordNote(engine, chord.midiNotes[0], 520);
}

export async function playChordSuccess(engine: PianoAudioEngine) {
  await playChord(engine, [72, 76, 79], 260);
}

export async function playChordError(engine: PianoAudioEngine) {
  await playChord(engine, [48, 49], 220);
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
