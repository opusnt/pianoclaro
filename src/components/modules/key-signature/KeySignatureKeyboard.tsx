"use client";

import { Music2 } from "lucide-react";
import { useMemo } from "react";

import {
  buildKeyboardNotes,
  getDisplayNoteName,
  getKeySignatureById,
  midiToInternalNote,
  noteToMidi,
} from "@/lib/key-signature/theory";

type KeySignatureKeyboardProps = {
  keyId?: string;
  tonicMidi?: number;
  expectedMidi?: number;
  selectedNote?: string;
  completedMidiNotes: number[];
  routeMidiNotes: number[];
  showLabels: boolean;
  disabled?: boolean;
  onNotePress: (note: string) => void;
};

export function KeySignatureKeyboard({
  keyId,
  tonicMidi,
  expectedMidi,
  selectedNote,
  completedMidiNotes,
  routeMidiNotes,
  showLabels,
  disabled,
  onNotePress,
}: KeySignatureKeyboardProps) {
  const notes = useMemo(() => buildKeyboardNotes(57, 84), []);
  const whiteKeys = notes.filter((note) => !note.isBlackKey);
  const blackKeys = notes.filter((note) => note.isBlackKey);
  const selectedMidi = selectedNote ? noteToMidi(selectedNote) : undefined;
  const routeSet = new Set(routeMidiNotes);
  const completedSet = new Set(completedMidiNotes);
  const key = keyId ? getKeySignatureById(keyId) : undefined;
  const accidentalSet = new Set(key?.accidentals.map((accidental) => noteToMidi(`${accidental}4`) % 12) ?? []);

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-muted">Teclado de tonalidad</p>
        <p className="flex items-center gap-2 text-xs font-bold text-blue-deep">
          <Music2 aria-hidden="true" className="h-4 w-4 text-gold-soft" />
          A3 a C6
        </p>
      </div>

      <div className="responsive-scroll mt-4 pb-2">
        <div className="relative h-48 min-w-[820px]">
          <div className="grid h-full grid-cols-[repeat(17,minmax(34px,1fr))] gap-1 pb-1">
            {whiteKeys.map((keyNote) => (
              <button
                key={keyNote.midi}
                type="button"
                disabled={disabled}
                onClick={() => onNotePress(keyNote.internalName)}
                className={`focus-ring relative flex h-full min-w-[42px] items-end justify-center rounded-b-2xl border px-1 pb-3 text-xs font-bold shadow-sm transition ${getKeyClass({
                  midi: keyNote.midi,
                  tonicMidi,
                  expectedMidi,
                  selectedMidi,
                  completedSet,
                  routeSet,
                  accidentalSet,
                })}`}
                aria-label={`Tocar ${keyNote.displayName}`}
              >
                {getBadge({ midi: keyNote.midi, tonicMidi, expectedMidi, selectedMidi, completedSet, accidentalSet })}
                <span className={showLabels ? "opacity-100" : "opacity-0"}>{keyNote.displayName.replace(/\d/g, "")}</span>
              </button>
            ))}
          </div>

          {blackKeys.map((keyNote) => {
            const previousWhiteIndex = whiteKeys.findLastIndex((whiteKey) => whiteKey.midi < keyNote.midi);
            const left = ((previousWhiteIndex + 1) / whiteKeys.length) * 100;

            return (
              <button
                key={keyNote.midi}
                type="button"
                disabled={disabled}
                onClick={() => onNotePress(keyNote.internalName)}
                className={`focus-ring absolute top-0 z-10 flex h-28 w-[3.8%] min-w-7 -translate-x-1/2 items-end justify-center rounded-b-xl border border-blue-deep/30 px-1 pb-2 text-[0.62rem] font-bold shadow-md transition ${getBlackKeyClass({
                  midi: keyNote.midi,
                  tonicMidi,
                  expectedMidi,
                  selectedMidi,
                  completedSet,
                  routeSet,
                  accidentalSet,
                })}`}
                style={{ left: `${left}%` }}
                aria-label={`Tocar ${keyNote.displayName}`}
              >
                {getBadge({ midi: keyNote.midi, tonicMidi, expectedMidi, selectedMidi, completedSet, accidentalSet })}
                <span className={showLabels ? "opacity-100" : "opacity-0"}>{keyNote.displayName.replace(/\d/g, "")}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs font-semibold text-muted sm:grid-cols-5">
        <p><span className="font-bold text-blue-deep">Tónica:</span> azul</p>
        <p><span className="font-bold text-gold-soft">Próxima:</span> dorado</p>
        <p><span className="font-bold text-emerald-700">Completada:</span> verde</p>
        <p><span className="font-bold text-purple-700">Armadura:</span> borde</p>
        <p><span className="font-bold text-red-700">Error:</span> rojo + texto</p>
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
  accidentalSet: Set<number>;
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

  if (input.accidentalSet.has(input.midi % 12)) {
    return "border-purple-500 bg-purple-50 text-purple-950 ring-2 ring-purple-200";
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
    className.includes("purple") ||
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
  accidentalSet,
}: {
  midi: number;
  tonicMidi?: number;
  expectedMidi?: number;
  selectedMidi?: number;
  completedSet: Set<number>;
  accidentalSet: Set<number>;
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
            : accidentalSet.has(midi % 12)
              ? "armadura"
              : "";

  if (!text) return null;

  return (
    <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-1 text-[0.58rem] font-bold text-blue-deep shadow-sm">
      {text === "siguiente" ? `${text}: ${getDisplayNoteName(midiToInternalNote(midi))}` : text}
    </span>
  );
}
