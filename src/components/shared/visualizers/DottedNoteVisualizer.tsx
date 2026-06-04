"use client";

import { Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { RhythmVisualizer } from "@/components/shared/visualizers/RhythmVisualizer";

interface DottedNoteVisualizerProps {
  isPlaying: boolean;
  onPlay?: () => void;
}

export function DottedNoteVisualizer({ isPlaying, onPlay }: DottedNoteVisualizerProps) {
  const [showDotInfo, setShowDotInfo] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => setShowDotInfo(true), 2000); // Aparece después de que termina la blanca normal
      return () => clearTimeout(timer);
    } else {
      setShowDotInfo(false);
    }
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex items-center gap-16 justify-center w-full">
        {/* Blanca Normal */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Normal</span>
          <div className="relative">
            <RhythmVisualizer figureId="half" durationSeconds={2} isPlaying={isPlaying} />
            <div className="absolute -bottom-8 left-0 right-0 text-center font-bold text-slate-500">
              2 Tiempos
            </div>
          </div>
        </div>

        {/* Blanca con Puntillo */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-sm font-bold text-fuchsia-500 uppercase tracking-wider">
            Con Puntillo
          </span>
          <div className="relative">
            <RhythmVisualizer
              figureId="half"
              isDotted={true}
              durationSeconds={3} // 2 + 1
              isPlaying={isPlaying}
            />

            {/* Animación explicativa del tiempo extra */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center text-center font-bold">
              <span className="text-slate-500">2</span>
              <span
                className={`text-fuchsia-500 transition-all duration-500 ${showDotInfo ? "opacity-100 translate-x-1" : "opacity-0 -translate-x-4"}`}
              >
                &nbsp;+ 1
              </span>
            </div>
          </div>
        </div>
      </div>

      {!isPlaying && onPlay && (
        <button
          onClick={onPlay}
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-fuchsia-50 text-fuchsia-600 font-bold rounded-full hover:bg-fuchsia-100 transition-colors"
        >
          <Play className="w-5 h-5" fill="currentColor" />
          <span>Comparar Duraciones</span>
        </button>
      )}
    </div>
  );
}
