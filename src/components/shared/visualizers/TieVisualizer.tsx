"use client";

import { useEffect, useState } from "react";
import { RhythmVisualizer } from "@/components/shared/visualizers/RhythmVisualizer";

interface TieVisualizerProps {
  isPlaying: boolean;
}

export function TieVisualizer({ isPlaying }: TieVisualizerProps) {
  const [playingPhase, setPlayingPhase] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      setPlayingPhase(1); // Empieza la primera nota

      const timer = setTimeout(() => {
        setPlayingPhase(2); // Después de 1 seg, empieza la ligadura y la segunda nota
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setPlayingPhase(0);
    }
  }, [isPlaying]);

  return (
    <div className="relative flex items-center justify-center gap-12 w-full max-w-sm mx-auto p-8 bg-white rounded-3xl border-2 border-slate-100 shadow-sm">
      <div className="relative z-10 bg-white">
        <RhythmVisualizer figureId="quarter" durationSeconds={1} isPlaying={playingPhase >= 1} />
      </div>

      <div className="relative z-10 bg-white">
        <RhythmVisualizer figureId="quarter" durationSeconds={1} isPlaying={playingPhase >= 2} />
      </div>

      {/* Ligadura (Tie) */}
      <svg
        viewBox="0 0 400 200"
        className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-700 ease-out z-0 ${
          playingPhase >= 2 ? "opacity-100 stroke-fuchsia-500" : "opacity-20 stroke-slate-300"
        }`}
      >
        {/* Curva desde el centro del primer visualizador al centro del segundo */}
        <path d="M 120 150 Q 200 190 280 150" fill="none" strokeWidth="12" strokeLinecap="round" />
      </svg>
    </div>
  );
}
