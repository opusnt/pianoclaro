import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";

type UseOsmdPlayerProps = {
  osmd: any | null; // The OpenSheetMusicDisplay instance
  defaultBpm?: number;
};

export function useOsmdPlayer({ osmd, defaultBpm = 80 }: UseOsmdPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(defaultBpm);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const playLoopRef = useRef<number | null>(null);

  // Initialize Tone.js synth
  useEffect(() => {
    // A simple polyphonic synth for chords
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1 },
    }).toDestination();

    // Lower volume slightly so it's not too harsh
    synth.volume.value = -6;
    synthRef.current = synth;

    return () => {
      synth.dispose();
    };
  }, []);

  // Format OSMD Pitch to Tone.js friendly format
  const formatPitch = (pitch: any): string | number => {
    // OSMD's Pitch class provides a Frequency getter (number in Hz)
    if (typeof pitch.Frequency === "number") {
      return pitch.Frequency;
    }

    // Fallback if we want to build a string manually using the new OSMD properties
    if (typeof pitch.FundamentalNote === "number") {
      const stepArray = { 0: "C", 2: "D", 4: "E", 5: "F", 7: "G", 9: "A", 11: "B" } as any;
      let noteName = stepArray[pitch.FundamentalNote] || "C";

      const acc = pitch.AccidentalHalfTones;
      if (acc === 1) noteName += "#";
      else if (acc === -1) noteName += "b";

      const octave = pitch.Octave || 4;
      return `${noteName}${octave}`;
    }

    return "C4"; // safe default
  };

  const playCurrentNotes = useCallback(() => {
    if (!osmd || !synthRef.current) return;

    try {
      const notes = osmd.cursor.NotesUnderCursor();
      if (!notes || notes.length === 0) return;

      const pitchesToPlay: (string | number)[] = [];

      for (const note of notes) {
        // Only play sounding notes, skip rests and tied-over notes
        if (!note.isRest() && note.Pitch) {
          // If it's part of a tie, only play the first note
          if (note.NoteTie && note.NoteTie.StartNote !== note) {
            continue;
          }
          pitchesToPlay.push(formatPitch(note.Pitch));
        }
      }

      if (pitchesToPlay.length > 0) {
        // Trigger attack and release (8n is just a safe release time for basic playback)
        synthRef.current.triggerAttackRelease(pitchesToPlay, "8n");
      }
    } catch (e) {
      console.warn("Error playing notes under cursor", e);
    }
  }, [osmd]);

  const stepNext = useCallback(() => {
    if (!osmd) return 0;

    try {
      // Get the length of the current beat/note before advancing
      // CurrentVoiceEntries[0].Notes[0].Length.RealValue is relative to a whole note (1.0)
      let fraction = 0.25; // fallback to quarter note

      const voices = osmd.cursor.Iterator.CurrentVoiceEntries;
      if (voices && voices.length > 0 && voices[0].Notes && voices[0].Notes.length > 0) {
        fraction = voices[0].Notes[0].Length.RealValue;
      }

      osmd.cursor.next();
      return fraction;
    } catch (e) {
      console.warn("Error advancing OSMD cursor", e);
      return 0.25;
    }
  }, [osmd]);

  const playLoop = useCallback(async () => {
    if (!osmd || osmd.cursor.Iterator.EndReached) {
      setIsPlaying(false);
      return;
    }

    // Await tone context start to ensure browser allows audio
    await Tone.start();

    playCurrentNotes();
    const fraction = stepNext();

    // Calculate delay based on fraction and BPM
    // 1 whole note = 4 quarter notes = 4 beats
    // bpm = quarter notes per minute
    // 1 quarter note = 60000 / bpm ms
    // 1 whole note = (60000 / bpm) * 4 ms
    const msPerWholeNote = (60000 / bpm) * 4;
    const delayMs = msPerWholeNote * fraction;

    // Use setTimeout for the next tick.
    // Note: This is an MVP approach. Tone.Transport is better for perfect musical timing,
    // but setTimeout is much easier to sync with unpredictable OSMD cursor fractions.
    playLoopRef.current = window.setTimeout(playLoop, delayMs);
  }, [osmd, bpm, playCurrentNotes, stepNext]);

  useEffect(() => {
    if (isPlaying) {
      playLoop();
    } else {
      if (playLoopRef.current) {
        clearTimeout(playLoopRef.current);
        playLoopRef.current = null;
      }
      synthRef.current?.releaseAll();
    }

    return () => {
      if (playLoopRef.current) {
        clearTimeout(playLoopRef.current);
      }
    };
  }, [isPlaying, playLoop]);

  const togglePlay = () => {
    if (!osmd) return;
    setIsPlaying((prev) => !prev);
  };

  const stop = () => {
    setIsPlaying(false);
    if (osmd) {
      osmd.cursor.reset();
    }
    if (playLoopRef.current) {
      clearTimeout(playLoopRef.current);
      playLoopRef.current = null;
    }
    synthRef.current?.releaseAll();
  };

  return {
    isPlaying,
    bpm,
    setBpm,
    togglePlay,
    stop,
  };
}
