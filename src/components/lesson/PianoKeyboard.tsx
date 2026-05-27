"use client";

import type { SharpNoteName } from "@/lib/music/notes";
import type { NoteName, SolfegeName } from "@/types/lesson";

type PianoKeyboardProps = {
  activeNotes?: NoteName[];
  activeBlackNotes?: SharpNoteName[];
  showLabels?: boolean;
  showComputerKeys?: boolean;
  onKeyPress?: (note: NoteName) => void;
  onBlackKeyPress?: (note: SharpNoteName) => void;
};

const whiteKeys: { note: NoteName; solfege: SolfegeName; computerKey: string }[] = [
  { note: "C", solfege: "Do", computerKey: "Z" },
  { note: "D", solfege: "Re", computerKey: "X" },
  { note: "E", solfege: "Mi", computerKey: "C" },
  { note: "F", solfege: "Fa", computerKey: "V" },
  { note: "G", solfege: "Sol", computerKey: "B" },
  { note: "A", solfege: "La", computerKey: "N" },
  { note: "B", solfege: "Si", computerKey: "M" },
];

const blackKeys: {
  note: SharpNoteName;
  label: string;
  spokenLabel: string;
  left: string;
  computerKey: string;
}[] = [
  { note: "C#", label: "Do#", spokenLabel: "Do sostenido", left: "10.8%", computerKey: "S" },
  { note: "D#", label: "Re#", spokenLabel: "Re sostenido", left: "25.1%", computerKey: "D" },
  { note: "F#", label: "Fa#", spokenLabel: "Fa sostenido", left: "53.7%", computerKey: "G" },
  { note: "G#", label: "Sol#", spokenLabel: "Sol sostenido", left: "68%", computerKey: "H" },
  { note: "A#", label: "La#", spokenLabel: "La sostenido", left: "82.3%", computerKey: "J" },
];

export function PianoKeyboard({
  activeNotes = [],
  activeBlackNotes = [],
  showLabels = true,
  showComputerKeys = false,
  onKeyPress,
  onBlackKeyPress,
}: PianoKeyboardProps) {
  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-3 shadow-[0_12px_30px_rgba(18,52,91,0.08)] sm:p-5">
      <div>
        <p className="text-xs font-bold uppercase text-muted">Teclado visual</p>
        <h2 className="mt-1 text-xl font-bold text-blue-deep">Una octava: Do a Si</h2>
      </div>
      <div className="relative mt-4 h-36 overflow-hidden rounded-2xl border border-blue-deep/15 bg-blue-deep/10 sm:h-44 xl:h-56">
        <div className="flex h-full">
          {whiteKeys.map((key) => {
            const isActive = activeNotes.includes(key.note);

            return (
              <button
                key={key.note}
                type="button"
                onClick={() => onKeyPress?.(key.note)}
                aria-label={`Tocar ${key.solfege}`}
                aria-pressed={isActive}
                data-note={key.note}
                data-active={isActive ? "true" : "false"}
                className={`focus-ring relative flex flex-1 items-end justify-center border-r border-blue-deep/15 pb-4 text-sm font-bold transition last:border-r-0 ${
                  isActive
                    ? "bg-gold-soft text-[#543b12] shadow-[inset_0_-8px_0_rgba(18,52,91,0.2)]"
                    : "bg-white text-blue-deep hover:bg-blue-soft/35"
                }`}
              >
                {showLabels ? (
                  <span className="flex flex-col items-center gap-1 rounded-lg bg-white/60 px-2 py-1">
                    <span>{key.solfege}</span>
                    {showComputerKeys ? (
                      <kbd className="rounded-md bg-blue-deep/10 px-1.5 py-0.5 text-[10px] text-blue-deep">
                        {key.computerKey}
                      </kbd>
                    ) : null}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        {blackKeys.map((key) => {
          const isActive = activeBlackNotes.includes(key.note);

          return (
            <button
              key={key.note}
              type="button"
              onClick={() => onBlackKeyPress?.(key.note)}
              aria-label={`Tocar ${key.spokenLabel}`}
              aria-pressed={isActive}
              data-note={key.note}
              data-active={isActive ? "true" : "false"}
              className={`focus-ring absolute top-0 z-10 flex h-[58%] w-[8.5%] items-end justify-center rounded-b-lg pb-3 text-[10px] font-semibold shadow-lg transition ${
                isActive
                  ? "bg-gold-soft text-[#543b12] shadow-[0_12px_24px_rgba(215,180,106,0.32)]"
                  : "bg-ink text-white/72 hover:bg-[#22324a]"
              }`}
              style={{ left: key.left }}
            >
              {showLabels ? (
                <span className="flex flex-col items-center gap-1">
                  <span>{key.label}</span>
                  {showComputerKeys ? (
                    <kbd className="rounded bg-white/15 px-1 py-0.5 text-[9px] text-white">
                      {key.computerKey}
                    </kbd>
                  ) : null}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
