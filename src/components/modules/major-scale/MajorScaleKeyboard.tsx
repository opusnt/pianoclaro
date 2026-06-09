"use client";

import { Music2 } from "lucide-react";
import { useMemo } from "react";
import {
  buildKeyboardNotes,
  getDisplayNoteName,
  midiToInternalNote,
  noteToMidi,
} from "@/lib/major-scale/theory";
import { getBlackKeyLeftPercent } from "@/lib/music/keyboard-layout";

type MajorScaleKeyboardProps = {
  tonicMidi?: number;
  expectedMidi?: number;
  selectedNote?: string;
  completedMidiNotes: number[];
  routeMidiNotes: number[];
  showLabels: boolean;
  disabled?: boolean;
  onNotePress: (note: string) => void;
};

export function MajorScaleKeyboard({
  tonicMidi,
  expectedMidi,
  selectedNote,
  completedMidiNotes,
  routeMidiNotes,
  showLabels,
  disabled,
  onNotePress,
}: MajorScaleKeyboardProps) {
  const notes = useMemo(() => buildKeyboardNotes(60, 84), []);
  const whiteKeys = notes.filter((note) => !note.isBlackKey);
  const blackKeys = notes.filter((note) => note.isBlackKey);
  const selectedMidi = selectedNote ? noteToMidi(selectedNote) : undefined;
  const routeSet = new Set(routeMidiNotes);
  const completedSet = new Set(completedMidiNotes);

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-muted">Teclado de escala</p>
        <p className="flex items-center gap-2 text-xs font-bold text-blue-deep">
          <Music2 aria-hidden="true" className="h-4 w-4 text-gold-soft" />
          C4 a C6
        </p>
      </div>

      <div className="responsive-scroll mt-4 pb-2">
        <div className="relative h-48 min-w-[720px]">
          <div className="grid h-full grid-cols-[repeat(15,minmax(34px,1fr))] gap-1 pb-1">
            {whiteKeys.map((key) => (
              <button
                type="button"
                key={key.midi}
                type="button"
                disabled={disabled}
                onClick={() => onNotePress(key.internalName)}
                className={`focus-ring relative flex h-full min-w-[42px] items-end justify-center rounded-b-2xl border px-1 pb-3 text-xs font-bold shadow-sm transition ${getKeyClass(
                  {
                    midi: key.midi,
                    tonicMidi,
                    expectedMidi,
                    selectedMidi,
                    completedSet,
                    routeSet,
                  },
                )}`}
                aria-label={`Tocar ${key.displayName}`}
              >
                {getBadge({ midi: key.midi, tonicMidi, expectedMidi, selectedMidi, completedSet })}
                <span className={showLabels ? "opacity-100" : "opacity-0"}>
                  {key.displayName.replace(/\d/g, "")}
                </span>
              </button>
            ))}
          </div>

          {blackKeys.map((key) => {
            const previousWhiteIndex = whiteKeys.findLastIndex(
              (whiteKey) => whiteKey.midi < key.midi,
            );
            const left = getBlackKeyLeftPercent(previousWhiteIndex, whiteKeys.length);

            return (
              <button
                type="button"
                key={key.midi}
                type="button"
                disabled={disabled}
                onClick={() => onNotePress(key.internalName)}
                className={`focus-ring absolute top-0 z-10 flex h-28 w-[4.2%] min-w-7 -translate-x-1/2 items-end justify-center rounded-b-xl border border-blue-deep/30 px-1 pb-2 text-[0.62rem] font-bold shadow-md transition ${getBlackKeyClass(
                  {
                    midi: key.midi,
                    tonicMidi,
                    expectedMidi,
                    selectedMidi,
                    completedSet,
                    routeSet,
                  },
                )}`}
                style={{ left: `${left}%` }}
                aria-label={`Tocar ${key.displayName}`}
              >
                {getBadge({ midi: key.midi, tonicMidi, expectedMidi, selectedMidi, completedSet })}
                <span className={showLabels ? "opacity-100" : "opacity-0"}>
                  {key.displayName.replace(/\d/g, "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs font-semibold text-muted sm:grid-cols-4">
        <p>
          <span className="font-bold text-blue-deep">Tónica:</span> azul
        </p>
        <p>
          <span className="font-bold text-gold-soft">Próxima:</span> dorado
        </p>
        <p>
          <span className="font-bold text-emerald-700">Completada:</span> verde
        </p>
        <p>
          <span className="font-bold text-red-700">Error:</span> rojo + texto
        </p>
      </div>
    </div>
  );
}

type KeyStateInput = {
  midi: number;
  tonicMidi?: number;
  expectedMidi?: number;
  selectedMidi?: number;
  completedSet: Set<number>;
  routeSet: Set<number>;
};

function getKeyClass(input: KeyStateInput) {
  if (input.selectedMidi === input.midi && input.expectedMidi !== input.midi) {
    return "border-red-400 bg-red-100 text-red-950";
  }

  if (input.completedSet.has(input.midi)) {
    return "border-emerald-500 bg-emerald-100 text-emerald-950";
  }

  if (input.expectedMidi === input.midi) {
    return "border-gold-soft bg-cream text-blue-deep shadow-soft";
  }

  if (input.tonicMidi === input.midi) {
    return "border-blue-deep bg-blue-deep text-white";
  }

  if (input.routeSet.has(input.midi)) {
    return "border-blue-deep/10 bg-blue-soft/35 text-blue-deep";
  }

  return "border-blue-deep/10 bg-white text-blue-deep hover:bg-blue-soft/30 disabled:opacity-60";
}

function getBlackKeyClass(input: KeyStateInput) {
  const className = getKeyClass(input);

  if (
    className.includes("emerald") ||
    className.includes("red") ||
    className.includes("cream") ||
    className.includes("bg-blue-deep") ||
    className.includes("blue-soft")
  ) {
    return className;
  }

  return "bg-[#142033] text-white hover:bg-[#0d1726] disabled:opacity-60";
}

function getBadge({
  midi,
  tonicMidi,
  expectedMidi,
  selectedMidi,
  completedSet,
}: {
  midi: number;
  tonicMidi?: number;
  expectedMidi?: number;
  selectedMidi?: number;
  completedSet: Set<number>;
}) {
  const text =
    tonicMidi === midi
      ? "tónica"
      : expectedMidi === midi
        ? "siguiente"
        : selectedMidi === midi && selectedMidi !== expectedMidi
          ? "tocada"
          : completedSet.has(midi)
            ? "ok"
            : "";

  if (!text) {
    return null;
  }

  return (
    <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-1 text-[0.58rem] font-bold text-blue-deep shadow-sm">
      {text === "siguiente" ? `${text}: ${getDisplayNoteName(midiToInternalNote(midi))}` : text}
    </span>
  );
}
