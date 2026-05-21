"use client";

import { useEffect } from "react";

import type { PianoNoteName, SharpNoteName } from "@/lib/music/notes";
import type { NoteName } from "@/types/lesson";

type UseComputerKeyboardInputOptions = {
  enabled: boolean;
  onNaturalKeyPress: (note: NoteName) => void;
  onSharpKeyPress: (note: SharpNoteName) => void;
};

const noteByCode: Partial<Record<string, PianoNoteName>> = {
  KeyZ: "C",
  KeyS: "C#",
  KeyX: "D",
  KeyD: "D#",
  KeyC: "E",
  KeyV: "F",
  KeyG: "F#",
  KeyB: "G",
  KeyH: "G#",
  KeyN: "A",
  KeyJ: "A#",
  KeyM: "B",
};

export function useComputerKeyboardInput({
  enabled,
  onNaturalKeyPress,
  onSharpKeyPress,
}: UseComputerKeyboardInputOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const isEditableTarget =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (isEditableTarget || event.metaKey || event.ctrlKey || event.altKey || event.repeat) {
        return;
      }

      const note = noteByCode[event.code];

      if (!note) {
        return;
      }

      event.preventDefault();

      if (note.includes("#")) {
        onSharpKeyPress(note as SharpNoteName);
        return;
      }

      onNaturalKeyPress(note as NoteName);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onNaturalKeyPress, onSharpKeyPress]);
}
