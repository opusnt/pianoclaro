"use client";

import {
  buildKeyboardNotes,
  getChordByDegree,
  normalizePitchClasses,
  requireField,
  stripOctave,
} from "@/lib/harmonic-field/theory";
import type { ScaleDegree } from "@/types/harmonic-field";

const keyboardNotes = buildKeyboardNotes(48, 78);
const whiteNotes = keyboardNotes.filter((note) => !note.isBlackKey);

type HarmonicFieldKeyboardProps = {
  fieldId?: string;
  degree?: ScaleDegree;
  selectedNotes: string[];
  showLabels: boolean;
  helpVisible: boolean;
  answerCorrect?: boolean;
  disabled: boolean;
  onNoteToggle: (note: string) => void;
};

export function HarmonicFieldKeyboard({
  fieldId = "c-major",
  degree,
  selectedNotes,
  showLabels,
  helpVisible,
  answerCorrect,
  disabled,
  onNoteToggle,
}: HarmonicFieldKeyboardProps) {
  const field = requireField(fieldId);
  const chord = degree ? getChordByDegree(field, degree) : undefined;
  const scalePitches = new Set(normalizePitchClasses(field.scaleNotes));
  const chordPitches = new Set(chord ? normalizePitchClasses(chord.notes) : []);
  const selectedPitches = new Set(normalizePitchClasses(selectedNotes));

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-muted">Teclado</p>
          <p className="text-sm font-semibold text-muted">
            Selecciona las tres notas del acorde. Las inversiones también valen.
          </p>
        </div>
        <p className="text-xs font-bold text-blue-deep">
          Escala resaltada + acorde esperado con ayuda
        </p>
      </div>

      <div className="responsive-scroll mt-4">
        <div className="relative min-w-[900px] pb-2">
          <div className="grid grid-cols-[repeat(18,minmax(42px,1fr))] gap-1">
            {whiteNotes.map((note) => {
              const pitch = normalizePitchClasses([note.internalName])[0];
              const selected = selectedPitches.has(pitch);
              const inScale = scalePitches.has(pitch);
              const inChord = chordPitches.has(pitch);
              const isTonic = stripOctave(note.internalName) === field.scaleNotes[0];
              return (
                <button
                  key={note.internalName}
                  type="button"
                  disabled={disabled}
                  onClick={() => onNoteToggle(note.internalName)}
                  className={`focus-ring relative flex h-44 flex-col justify-end rounded-b-2xl border px-1 pb-3 text-center text-xs font-bold transition ${
                    selected
                      ? answerCorrect === false
                        ? "border-red-500 bg-red-50 text-red-950"
                        : "border-emerald-500 bg-emerald-50 text-emerald-950"
                      : helpVisible && inChord
                        ? "border-gold-soft bg-gold-soft/25 text-blue-deep"
                        : inScale
                          ? "border-blue-deep/20 bg-white text-blue-deep"
                          : "border-blue-deep/10 bg-white/70 text-muted"
                  } disabled:cursor-not-allowed disabled:opacity-75`}
                >
                  {isTonic ? (
                    <span className="absolute left-1 top-2 rounded-full bg-blue-deep px-2 py-0.5 text-[10px] text-white">
                      tónica
                    </span>
                  ) : null}
                  {helpVisible && inChord ? (
                    <span className="text-[10px] uppercase">acorde</span>
                  ) : null}
                  {showLabels ? <span>{note.displayName}</span> : null}
                </button>
              );
            })}
          </div>

          <div className="pointer-events-none absolute left-0 top-0 grid w-full grid-cols-[repeat(18,minmax(42px,1fr))] gap-1">
            {whiteNotes.map((whiteNote, index) => {
              const nextMidi = whiteNote.midi + 1;
              const blackNote = keyboardNotes.find(
                (note) => note.midi === nextMidi && note.isBlackKey,
              );
              if (!blackNote || index === whiteNotes.length - 1)
                return <span key={`${whiteNote.internalName}-gap`} />;
              const pitch = normalizePitchClasses([blackNote.internalName])[0];
              const selected = selectedPitches.has(pitch);
              const inScale = scalePitches.has(pitch);
              const inChord = chordPitches.has(pitch);
              return (
                <button
                  key={blackNote.internalName}
                  type="button"
                  disabled={disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    onNoteToggle(blackNote.internalName);
                  }}
                  className={`focus-ring pointer-events-auto -ml-[42%] h-28 w-[72%] justify-self-end rounded-b-xl border px-1 pb-2 pt-16 text-[10px] font-bold text-white shadow-soft transition ${
                    selected
                      ? answerCorrect === false
                        ? "border-red-400 bg-red-700"
                        : "border-emerald-300 bg-emerald-700"
                      : helpVisible && inChord
                        ? "border-gold-soft bg-[#705215]"
                        : inScale
                          ? "border-blue-deep bg-blue-deep"
                          : "border-slate-800 bg-slate-950"
                  } disabled:cursor-not-allowed disabled:opacity-75`}
                >
                  {showLabels ? blackNote.displayName : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
