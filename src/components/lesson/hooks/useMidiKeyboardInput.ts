"use client";

import { useEffect } from "react";
import type { PianoNoteName, SharpNoteName } from "@/lib/music/notes";
import type { NoteName } from "@/types/lesson";

type UseMidiKeyboardInputOptions = {
  enabled: boolean;
  onNaturalKeyPress: (note: NoteName) => void;
  onSharpKeyPress: (note: SharpNoteName) => void;
};

const midiPitchClasses: PianoNoteName[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export function useMidiKeyboardInput({
  enabled,
  onNaturalKeyPress,
  onSharpKeyPress,
}: UseMidiKeyboardInputOptions) {
  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !navigator.requestMIDIAccess) {
      return;
    }

    let midiAccess: MIDIAccess | null = null;

    function handleMIDIMessage(event: MIDIMessageEvent) {
      if (!event.data) return;
      const [statusByte, noteNumber, velocity] = event.data;

      // Un estatus de 144 a 159 significa "Note On" en canales 1 a 16.
      // Algunos teclados envían Note On con velocity 0 en lugar de Note Off.
      const isNoteOn = statusByte >= 144 && statusByte <= 159;

      if (isNoteOn && velocity > 0) {
        const note = midiPitchClasses[noteNumber % 12];
        if (!note) return;

        if (note.includes("#")) {
          onSharpKeyPress(note as SharpNoteName);
        } else {
          onNaturalKeyPress(note as NoteName);
        }
      }
    }

    function initMIDI(access: MIDIAccess) {
      midiAccess = access;
      for (const input of access.inputs.values()) {
        input.addEventListener("midimessage", handleMIDIMessage as EventListener);
      }

      // Escuchar cuando se conecta un teclado nuevo
      access.addEventListener("statechange", (event: MIDIConnectionEvent) => {
        const port = event.port;
        if (port && port.type === "input" && port.state === "connected") {
          const input = port as MIDIInput;
          input.addEventListener("midimessage", handleMIDIMessage as EventListener);
        }
      });
    }

    navigator.requestMIDIAccess().then(initMIDI).catch(console.error);

    return () => {
      if (midiAccess) {
        for (const input of midiAccess.inputs.values()) {
          input.removeEventListener("midimessage", handleMIDIMessage as EventListener);
        }
      }
    };
  }, [enabled, onNaturalKeyPress, onSharpKeyPress]);
}
