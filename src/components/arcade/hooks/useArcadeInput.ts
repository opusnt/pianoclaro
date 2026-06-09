import { useEffect, useState } from "react";

export type ArcadeInputEvent = {
  type: "noteon" | "noteoff";
  midiNote: number; // 60 = C4
  velocity: number; // 0-127
  source: "midi" | "keyboard" | "acoustic";
};

type UseArcadeInputProps = {
  enabled?: boolean;
  onEvent?: (event: ArcadeInputEvent) => void;
};

// Mapeo básico de teclado de PC a notas MIDI (C4 = 60)
// Fila central del teclado (ASDF...)
const KEYBOARD_TO_MIDI: Record<string, number> = {
  a: 60, // C4
  w: 61, // C#4
  s: 62, // D4
  e: 63, // D#4
  d: 64, // E4
  f: 65, // F4
  t: 66, // F#4
  g: 67, // G4
  y: 68, // G#4
  h: 69, // A4
  u: 70, // A#4
  j: 71, // B4
  k: 72, // C5
  o: 73, // C#5
  l: 74, // D5
};

export function useArcadeInput({ enabled = true, onEvent }: UseArcadeInputProps = {}) {
  const [midiError, setMidiError] = useState<string | null>(null);
  const [midiInputs, setMidiInputs] = useState<any[]>([]);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  // --- PC Keyboard Simulation ---
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Evitar disparos múltiples si se mantiene presionada
      const key = e.key.toLowerCase();
      const midiNote = KEYBOARD_TO_MIDI[key];

      if (midiNote !== undefined) {
        setActiveNotes((prev) => new Set(prev).add(midiNote));
        onEvent?.({ type: "noteon", midiNote, velocity: 100, source: "keyboard" });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const midiNote = KEYBOARD_TO_MIDI[key];

      if (midiNote !== undefined) {
        setActiveNotes((prev) => {
          const next = new Set(prev);
          next.delete(midiNote);
          return next;
        });
        onEvent?.({ type: "noteoff", midiNote, velocity: 0, source: "keyboard" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled, onEvent]);

  // --- Web MIDI Integration ---
  useEffect(() => {
    if (!enabled || !navigator.requestMIDIAccess) {
      if (!navigator.requestMIDIAccess) {
        setMidiError("Web MIDI no soportado en este navegador.");
      }
      return;
    }

    let isMounted = true;
    let midiAccessObj: any = null;

    const handleMidiMessage = (message: any) => {
      const command = message.data[0];
      const midiNote = message.data[1];
      const velocity = message.data.length > 2 ? message.data[2] : 0; // Puede ser 0 para noteoff

      // 144 = Note On, 128 = Note Off
      if (command === 144 && velocity > 0) {
        setActiveNotes((prev) => new Set(prev).add(midiNote));
        onEvent?.({ type: "noteon", midiNote, velocity, source: "midi" });
      } else if (command === 128 || (command === 144 && velocity === 0)) {
        setActiveNotes((prev) => {
          const next = new Set(prev);
          next.delete(midiNote);
          return next;
        });
        onEvent?.({ type: "noteoff", midiNote, velocity: 0, source: "midi" });
      }
    };

    const setupMidi = async () => {
      try {
        const access = await navigator.requestMIDIAccess();
        if (!isMounted) return;

        midiAccessObj = access;
        const inputsArray = Array.from(access.inputs.values());
        setMidiInputs(inputsArray);

        inputsArray.forEach((input) => {
          input.onmidimessage = handleMidiMessage;
        });

        access.onstatechange = (e: any) => {
          // Si conectan o desconectan un cable
          setMidiInputs(Array.from(access.inputs.values()));
          if (e.port.state === "connected" && e.port.type === "input") {
            e.port.onmidimessage = handleMidiMessage;
          }
        };
      } catch (err) {
        console.warn("MIDI Error:", err);
        setMidiError("Permiso denegado o error conectando dispositivo MIDI.");
      }
    };

    void setupMidi();

    return () => {
      isMounted = false;
      if (midiAccessObj) {
        midiAccessObj.onstatechange = null;
        midiAccessObj.inputs.forEach((input: any) => {
          input.onmidimessage = null;
        });
      }
    };
  }, [enabled, onEvent]);

  return {
    midiError,
    midiInputs,
    activeNotes: Array.from(activeNotes),
  };
}
