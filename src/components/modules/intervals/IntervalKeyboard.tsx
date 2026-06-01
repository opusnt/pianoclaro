"use client";

import { Music2 } from "lucide-react";
import { useMemo } from "react";
import { buildKeyboardNotes, getNoteLabel, noteToMidi } from "@/lib/intervals/theory";
import { getBlackKeyLeftPercent } from "@/lib/music/keyboard-layout";

type IntervalKeyboardProps = {
  baseNote?: string;
  targetNote?: string;
  selectedNote?: string;
  isCorrect?: boolean;
  showLabels: boolean;
  disabled?: boolean;
  onNotePress: (note: string) => void;
};

export function IntervalKeyboard({
  baseNote,
  targetNote,
  selectedNote,
  isCorrect,
  showLabels,
  disabled,
  onNotePress,
}: IntervalKeyboardProps) {
  const notes = useMemo(() => buildKeyboardNotes("C4", "C5"), []);
  const whiteKeys = notes.filter((note) => !note.isBlack);
  const blackKeys = notes.filter((note) => note.isBlack);
  const centerByNote = useMemo(
    () =>
      Object.fromEntries(
        notes.map((note, index) => [note.id, ((index + 0.5) / notes.length) * 100]),
      ),
    [notes],
  );
  const arcStart =
    baseNote && targetNote
      ? Math.min(centerByNote[baseNote] ?? 0, centerByNote[targetNote] ?? 0)
      : 0;
  const arcEnd =
    baseNote && targetNote
      ? Math.max(centerByNote[baseNote] ?? 0, centerByNote[targetNote] ?? 0)
      : 0;
  const shouldShowArc = Boolean(baseNote && targetNote && showLabels);

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-muted">Teclado de intervalos</p>
        <p className="flex items-center gap-2 text-xs font-bold text-blue-deep">
          <Music2 aria-hidden="true" className="h-4 w-4 text-gold-soft" />
          C4 a C5
        </p>
      </div>

      <div className="relative mt-8 pb-1 pt-10">
        {shouldShowArc ? (
          <div
            className="absolute top-0 h-8 rounded-t-full border-x-2 border-t-2 border-gold-soft/80"
            style={{
              left: `${arcStart}%`,
              width: `${Math.max(4, arcEnd - arcStart)}%`,
            }}
          >
            <span className="absolute left-1/2 top-[-1.35rem] -translate-x-1/2 whitespace-nowrap rounded-full bg-gold-soft px-2 py-1 text-[0.68rem] font-bold text-blue-deep">
              distancia
            </span>
          </div>
        ) : null}

        <div className="relative h-44">
          <div className="grid h-full grid-cols-8">
            {whiteKeys.map((key) => (
              <button
                key={key.id}
                type="button"
                disabled={disabled}
                onClick={() => onNotePress(key.id)}
                className={`focus-ring relative flex h-full items-end justify-center rounded-b-2xl border px-1 pb-3 text-sm font-bold shadow-sm transition ${getKeyClass(
                  {
                    note: key.id,
                    baseNote,
                    targetNote,
                    selectedNote,
                    isCorrect,
                    showLabels,
                  },
                )}`}
                aria-label={`Tocar ${getNoteLabel(key.id)}`}
              >
                {getKeyBadge({
                  note: key.id,
                  baseNote,
                  targetNote,
                  selectedNote,
                  isCorrect,
                  showLabels,
                })}
                <span className={showLabels ? "opacity-100" : "opacity-0"}>{key.label}</span>
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
                key={key.id}
                type="button"
                disabled={disabled}
                onClick={() => onNotePress(key.id)}
                className={`focus-ring absolute top-0 z-10 flex h-28 w-[7.5%] min-w-8 max-w-14 -translate-x-1/2 items-end justify-center rounded-b-xl border border-blue-deep/30 px-1 pb-2 text-[0.68rem] font-bold shadow-md transition ${getBlackKeyClass(
                  {
                    note: key.id,
                    baseNote,
                    targetNote,
                    selectedNote,
                    isCorrect,
                    showLabels,
                  },
                )}`}
                style={{ left: `${left}%` }}
                aria-label={`Tocar ${getNoteLabel(key.id)}`}
              >
                {getKeyBadge({
                  note: key.id,
                  baseNote,
                  targetNote,
                  selectedNote,
                  isCorrect,
                  showLabels,
                })}
                <span className={showLabels ? "opacity-100" : "opacity-0"}>
                  {key.label.replace(/\d/g, "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs font-semibold text-muted sm:grid-cols-3">
        <p>
          <span className="font-bold text-blue-deep">Base:</span> azul
        </p>
        <p>
          <span className="font-bold text-emerald-700">Correcta:</span> verde
        </p>
        <p>
          <span className="font-bold text-red-700">Error:</span> rojo + texto
        </p>
      </div>
    </div>
  );
}

function getKeyClass({
  note,
  baseNote,
  targetNote,
  selectedNote,
  isCorrect,
  showLabels,
}: KeyStateInput) {
  if (selectedNote === note && isCorrect === false) {
    return "border-red-400 bg-red-100 text-red-950";
  }

  if ((selectedNote === note && isCorrect) || (showLabels && targetNote === note)) {
    return "border-emerald-500 bg-emerald-100 text-emerald-950";
  }

  if (baseNote === note) {
    return "border-blue-deep bg-blue-deep text-white";
  }

  return "border-blue-deep/10 bg-white text-blue-deep hover:bg-blue-soft/30 disabled:opacity-60";
}

function getBlackKeyClass(input: KeyStateInput) {
  const whiteClass = getKeyClass(input);

  if (
    whiteClass.includes("emerald") ||
    whiteClass.includes("red") ||
    whiteClass.includes("bg-blue-deep")
  ) {
    return whiteClass;
  }

  return "bg-[#142033] text-white hover:bg-[#0d1726] disabled:opacity-60";
}

type KeyStateInput = {
  note: string;
  baseNote?: string;
  targetNote?: string;
  selectedNote?: string;
  isCorrect?: boolean;
  showLabels: boolean;
};

function getKeyBadge({
  note,
  baseNote,
  targetNote,
  selectedNote,
  isCorrect,
  showLabels,
}: KeyStateInput) {
  const badge =
    baseNote === note
      ? "base"
      : selectedNote === note && isCorrect === false
        ? "tu respuesta"
        : (selectedNote === note && isCorrect) || (showLabels && targetNote === note)
          ? "correcta"
          : "";

  if (!badge) {
    return null;
  }

  return (
    <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-1 text-[0.62rem] font-bold text-blue-deep shadow-sm">
      {badge}
    </span>
  );
}
