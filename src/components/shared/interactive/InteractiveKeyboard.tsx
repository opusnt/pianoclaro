"use client";

import { useEffect, useRef, useState } from "react";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";

export interface InteractiveKeyboardProps {
  startOctave?: number;
  endOctave?: number;
  interactive?: boolean;
  onKeyPress?: (note: string) => void;
  highlightedNotes?: string[]; // ej. ["C4", "E4", "G4"] o ["C"] para todos los DO
  highlightColor?: string; // Color para resaltados. Ej "bg-sky-400"
  showLabels?: boolean;
  className?: string;
  fingeringMap?: Record<string, number>;
}

const WHITE_NOTES = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_NOTES = ["C#", "D#", null, "F#", "G#", "A#", null];

export function InteractiveKeyboard({
  startOctave = 3,
  endOctave = 4,
  interactive = true,
  onKeyPress,
  highlightedNotes = [],
  highlightColor = "bg-sky-400",
  showLabels = false,
  className = "",
  fingeringMap = {},
}: InteractiveKeyboardProps) {
  const engineRef = useRef<PianoAudioEngine | null>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
    return () => {
      engineRef.current?.close();
    };
  }, []);

  // Scroll inicial para centrar el Do Central (C4)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Buscamos la tecla C4
      const c4Key = container.querySelector('[data-note="C4"]') as HTMLElement;
      if (c4Key) {
        // Calculamos el scroll para que quede en el centro de la vista
        const containerWidth = container.clientWidth;
        const keyLeft = c4Key.offsetLeft;
        const keyWidth = c4Key.offsetWidth;
        container.scrollTo({
          left: keyLeft - containerWidth / 2 + keyWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [startOctave, endOctave]);

  const handlePlayNote = async (note: string) => {
    if (!interactive) return;

    setActiveNote(note);
    if (engineRef.current) {
      await engineRef.current.playNote(note);
    }
    if (onKeyPress) {
      onKeyPress(note);
    }

    setTimeout(() => {
      setActiveNote(null);
    }, 200);
  };

  const renderOctave = (octave: number) => {
    return (
      <div key={`octave-${octave}`} className="flex relative h-full shrink-0">
        {WHITE_NOTES.map((noteName, index) => {
          const fullNote = `${noteName}${octave}`;

          // Verificar si esta nota completa o su base está resaltada
          const isHighlighted =
            highlightedNotes.includes(fullNote) || highlightedNotes.includes(noteName);
          const isActive = activeNote === fullNote;

          const blackNoteName = BLACK_NOTES[index];
          const fullBlackNote = blackNoteName ? `${blackNoteName}${octave}` : null;
          const isBlackHighlighted =
            fullBlackNote &&
            (highlightedNotes.includes(fullBlackNote) || highlightedNotes.includes(blackNoteName!));
          const isBlackActive = activeNote === fullBlackNote;

          return (
            <div
              key={fullNote}
              className="relative h-full flex-shrink-0"
              style={{ width: "clamp(40px, 6vw, 60px)" }}
            >
              {/* Tecla Blanca */}
              <button
                type="button"
                data-note={fullNote}
                disabled={!interactive}
                onMouseDown={() => handlePlayNote(fullNote)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handlePlayNote(fullNote);
                }}
                className={`
                  absolute inset-0 w-full h-full border border-slate-300 rounded-b-lg shadow-sm transition-all duration-75 outline-none
                  ${isActive ? "bg-slate-200 translate-y-1 shadow-inner" : "bg-white hover:bg-slate-50"}
                  ${!interactive ? "cursor-default" : "cursor-pointer"}
                `}
              >
                {isHighlighted && (
                  <div
                    className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${highlightColor} animate-pulse shadow-md flex items-center justify-center`}
                  >
                    {fingeringMap[fullNote] && (
                      <span className="text-[10px] font-black text-white">
                        {fingeringMap[fullNote]}
                      </span>
                    )}
                  </div>
                )}
                {showLabels && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 select-none">
                    {
                      { C: "DO", D: "RE", E: "MI", F: "FA", G: "SOL", A: "LA", B: "SI" }[
                        noteName as "C" | "D" | "E" | "F" | "G" | "A" | "B"
                      ]
                    }
                  </span>
                )}
              </button>

              {/* Tecla Negra */}
              {blackNoteName && (
                <button
                  type="button"
                  disabled={!interactive}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handlePlayNote(fullBlackNote!);
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePlayNote(fullBlackNote!);
                  }}
                  className={`
                    absolute top-0 -right-[25%] w-[50%] h-[60%] rounded-b-md shadow-md z-10 transition-all duration-75 outline-none border border-slate-950
                    ${isBlackActive ? "bg-slate-700 translate-y-1" : "bg-slate-900 hover:bg-slate-800"}
                    ${!interactive ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  {isBlackHighlighted && (
                    <div
                      className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${highlightColor} animate-pulse shadow-md flex items-center justify-center`}
                    >
                      {fingeringMap[fullBlackNote!] && (
                        <span className="text-[9px] font-black text-white">
                          {fingeringMap[fullBlackNote!]}
                        </span>
                      )}
                    </div>
                  )}
                  {showLabels && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 select-none whitespace-nowrap">
                      {
                        { "C#": "DO#", "D#": "RE#", "F#": "FA#", "G#": "SOL#", "A#": "LA#" }[
                          blackNoteName as "C#" | "D#" | "F#" | "G#" | "A#"
                        ]
                      }
                    </span>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const octaves = [];
  for (let i = startOctave; i <= endOctave; i++) {
    octaves.push(renderOctave(i));
  }

  return (
    <div
      ref={scrollContainerRef}
      className={`w-full responsive-scroll pb-4 custom-scrollbar scroll-smooth ${className}`}
    >
      <div className="flex h-40 sm:h-48 md:h-56 w-max mx-auto bg-slate-900 p-2 rounded-t-xl border-b-8 border-slate-800">
        {octaves}
      </div>
    </div>
  );
}
