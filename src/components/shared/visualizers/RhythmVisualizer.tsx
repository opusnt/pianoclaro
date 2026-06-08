"use client";

import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { getRhythmFigureById, type RhythmFigureId } from "@/lib/music/rhythmFigures";

interface RhythmVisualizerProps {
  figureId: RhythmFigureId;
  durationSeconds?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  showPlayButton?: boolean;
  isDotted?: boolean;
}

export function RhythmVisualizer({
  figureId,
  durationSeconds,
  isPlaying = false,
  onPlay,
  showPlayButton = false,
  isDotted = false,
}: RhythmVisualizerProps) {
  const [progress, setProgress] = useState(0);

  const actualDuration =
    durationSeconds ??
    (isDotted
      ? getRhythmFigureById(figureId).durationUnits * 1.5
      : getRhythmFigureById(figureId).durationUnits);

  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const percentage = Math.min(100, (elapsed / actualDuration) * 100);

      setProgress(percentage);

      if (elapsed < actualDuration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, actualDuration]);

  const renderFigure = () => {
    switch (figureId) {
      case "whole": // Redonda
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-12 rounded-[50%] border-4 border-slate-800 rotate-[-15deg] bg-transparent" />
            {isDotted && (
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rounded-full" />
            )}
          </div>
        );
      case "dotted-half":
      case "half": {
        // Blanca
        const showDotHalf = isDotted || figureId === "dotted-half";
        return (
          <div className="relative flex items-end h-24 mr-2">
            {/* Plica (Palo) */}
            <div className="absolute right-0 bottom-3 w-1 h-20 bg-slate-800" />
            {/* Cabeza */}
            <div className="w-12 h-10 rounded-[50%] border-4 border-slate-800 rotate-[-15deg] bg-slate-50" />
            {showDotHalf && (
              <div className="absolute -right-4 bottom-4 w-2 h-2 bg-slate-800 rounded-full" />
            )}
          </div>
        );
      }
      case "quarter": // Negra
        return (
          <div className="relative flex items-end h-24 mr-2">
            {/* Plica (Palo) */}
            <div className="absolute right-0 bottom-3 w-1 h-20 bg-slate-800" />
            {/* Cabeza */}
            <div className="w-12 h-10 rounded-[50%] rotate-[-15deg] bg-slate-800" />
            {isDotted && (
              <div className="absolute -right-4 bottom-4 w-2 h-2 bg-slate-800 rounded-full" />
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative flex justify-center items-center aspect-square w-full max-w-[8rem] min-w-[7rem] min-h-[7rem] bg-slate-50 rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
        {renderFigure()}

        {showPlayButton && !isPlaying && onPlay && (
          <button
            onClick={onPlay}
            className="absolute inset-0 m-auto w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-slate-900 opacity-0 hover:opacity-100 transition-opacity"
          >
            <Play fill="currentColor" className="w-5 h-5 ml-1" />
          </button>
        )}
      </div>

      {/* Progress Bar para visualizar la duración temporal */}
      <div className="w-full max-w-xs h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-200">
        <div className="h-full bg-fuchsia-500 transition-none" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
