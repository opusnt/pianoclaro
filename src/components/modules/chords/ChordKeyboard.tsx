"use client";

import { CircleDot } from "lucide-react";
import { useMemo } from "react";

import { getBlackKeyLeftPercent } from "@/lib/music/keyboard-layout";
import {
  buildKeyboardNotes,
  getChordById,
  noteToMidi,
} from "@/lib/chords/theory";

type ChordKeyboardProps = {
  chordId?: string;
  selectedNotes: string[];
  showLabels: boolean;
  disabled?: boolean;
  helpVisible?: boolean;
  answerCorrect?: boolean;
  onNoteToggle: (note: string) => void;
};

export function ChordKeyboard({
  chordId,
  selectedNotes,
  showLabels,
  disabled,
  helpVisible,
  answerCorrect,
  onNoteToggle,
}: ChordKeyboardProps) {
  const notes = useMemo(() => buildKeyboardNotes(57, 77), []);
  const whiteKeys = notes.filter((note) => !note.isBlackKey);
  const blackKeys = notes.filter((note) => note.isBlackKey);
  const chord = chordId ? getChordById(chordId) : undefined;
  const selectedPitchClasses = new Set(selectedNotes.map((note) => noteToMidi(note) % 12));
  const chordPitchClasses = new Set(chord?.midiNotes.map((midi) => midi % 12) ?? []);
  const tonicPitchClass = chord?.midiNotes[0] ? chord.midiNotes[0] % 12 : undefined;
  const thirdPitchClass = chord?.midiNotes[1] ? chord.midiNotes[1] % 12 : undefined;
  const fifthPitchClass = chord?.midiNotes[2] ? chord.midiNotes[2] % 12 : undefined;

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-muted">Teclado de acordes</p>
        <p className="flex items-center gap-2 whitespace-nowrap text-xs font-bold text-blue-deep">
          <CircleDot aria-hidden="true" className="h-4 w-4 text-gold-soft" />
          Selección múltiple
        </p>
      </div>

      <div className="responsive-scroll mt-4 overflow-x-auto pb-2">
        <div className="relative h-48" style={{ minWidth: `${whiteKeys.length * 64}px` }}>
          <div
            className="grid h-full gap-1 pb-1"
            style={{ gridTemplateColumns: `repeat(${whiteKeys.length}, minmax(56px, 1fr))` }}
          >
            {whiteKeys.map((keyNote) => (
              <button
                key={keyNote.midi}
                type="button"
                disabled={disabled}
                onClick={() => onNoteToggle(keyNote.internalName)}
                className={`focus-ring relative flex h-full min-w-14 items-end justify-center rounded-b-2xl border px-1 pb-3 text-sm font-bold shadow-sm transition ${getKeyClass({
                  midi: keyNote.midi,
                  selectedPitchClasses,
                  chordPitchClasses,
                  tonicPitchClass,
                  thirdPitchClass,
                  fifthPitchClass,
                  helpVisible,
                  answerCorrect,
                })}`}
                aria-label={`Seleccionar ${keyNote.displayName}`}
              >
                {getBadge({
                  midi: keyNote.midi,
                  selectedPitchClasses,
                  tonicPitchClass,
                  thirdPitchClass,
                  fifthPitchClass,
                  helpVisible,
                })}
                <span className={showLabels ? "whitespace-nowrap opacity-100" : "opacity-0"}>
                  {keyNote.displayName.replace(/\d/g, "")}
                </span>
              </button>
            ))}
          </div>

          {blackKeys.map((keyNote) => {
            const previousWhiteIndex = whiteKeys.findLastIndex((whiteKey) => whiteKey.midi < keyNote.midi);
            const left = getBlackKeyLeftPercent(previousWhiteIndex, whiteKeys.length);

            return (
              <button
                key={keyNote.midi}
                type="button"
                disabled={disabled}
                onClick={() => onNoteToggle(keyNote.internalName)}
                className={`focus-ring absolute top-0 z-10 flex h-28 min-w-8 -translate-x-1/2 items-end justify-center rounded-b-xl border border-blue-deep/30 px-1 pb-2 text-[0.62rem] font-bold shadow-md transition ${getBlackKeyClass({
                  midi: keyNote.midi,
                  selectedPitchClasses,
                  chordPitchClasses,
                  tonicPitchClass,
                  thirdPitchClass,
                  fifthPitchClass,
                  helpVisible,
                  answerCorrect,
                })}`}
                style={{ left: `${left}%`, width: `calc(100% / ${whiteKeys.length} * 0.58)` }}
                aria-label={`Seleccionar ${keyNote.displayName}`}
              >
                {getBadge({
                  midi: keyNote.midi,
                  selectedPitchClasses,
                  tonicPitchClass,
                  thirdPitchClass,
                  fifthPitchClass,
                  helpVisible,
                })}
                <span className={showLabels ? "whitespace-nowrap opacity-100" : "opacity-0"}>
                  {keyNote.displayName.replace(/\d/g, "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs font-semibold text-muted sm:grid-cols-5">
        <p><span className="font-bold text-blue-deep">Tónica:</span> azul</p>
        <p><span className="font-bold text-purple-700">Tercera:</span> morado</p>
        <p><span className="font-bold text-gold-soft">Quinta:</span> dorado</p>
        <p><span className="font-bold text-emerald-700">Seleccionada:</span> verde</p>
        <p><span className="font-bold text-red-700">Error:</span> rojo</p>
      </div>
    </div>
  );
}

type KeyClassInput = {
  midi: number;
  selectedPitchClasses: Set<number>;
  chordPitchClasses: Set<number>;
  tonicPitchClass?: number;
  thirdPitchClass?: number;
  fifthPitchClass?: number;
  helpVisible?: boolean;
  answerCorrect?: boolean;
};

function getKeyClass(input: KeyClassInput) {
  const pitch = input.midi % 12;
  const selected = input.selectedPitchClasses.has(pitch);
  const expected = input.chordPitchClasses.has(pitch);

  if (selected && input.answerCorrect === false && !expected) return "border-red-500 bg-red-100 text-red-950";
  if (selected) return "border-emerald-500 bg-emerald-100 text-emerald-950";
  if (input.helpVisible && input.tonicPitchClass === pitch) return "border-blue-deep bg-blue-deep text-white";
  if (input.helpVisible && input.thirdPitchClass === pitch) return "border-purple-500 bg-purple-50 text-purple-950 ring-2 ring-purple-200";
  if (input.helpVisible && input.fifthPitchClass === pitch) return "border-gold-soft bg-cream text-blue-deep shadow-soft";
  return "border-blue-deep/10 bg-white text-blue-deep hover:bg-blue-soft/30 disabled:opacity-60";
}

function getBlackKeyClass(input: KeyClassInput) {
  const className = getKeyClass(input);
  if (
    className.includes("emerald") ||
    className.includes("red") ||
    className.includes("cream") ||
    className.includes("purple") ||
    className.includes("bg-blue-deep")
  ) {
    return className;
  }
  return "bg-[#142033] text-white hover:bg-[#0d1726] disabled:opacity-60";
}

function getBadge({
  midi,
  selectedPitchClasses,
  tonicPitchClass,
  thirdPitchClass,
  fifthPitchClass,
  helpVisible,
}: {
  midi: number;
  selectedPitchClasses: Set<number>;
  tonicPitchClass?: number;
  thirdPitchClass?: number;
  fifthPitchClass?: number;
  helpVisible?: boolean;
}) {
  const pitch = midi % 12;
  const text = selectedPitchClasses.has(pitch)
    ? "seleccionada"
    : helpVisible && tonicPitchClass === pitch
      ? "tónica"
      : helpVisible && thirdPitchClass === pitch
        ? "tercera"
        : helpVisible && fifthPitchClass === pitch
          ? "quinta"
          : "";

  if (!text) return null;

  return (
    <span className="absolute left-1/2 top-2 max-w-[calc(100%-0.4rem)] -translate-x-1/2 truncate rounded-full bg-white/90 px-2 py-1 text-[0.58rem] font-bold text-blue-deep shadow-sm">
      {text === "seleccionada" ? "selecc." : text}
    </span>
  );
}
