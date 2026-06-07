"use client";

import { Undo2 } from "lucide-react";
import { useState } from "react";
import { MeasureVisualizer } from "@/components/shared/visualizers/MeasureVisualizer";
import { RhythmVisualizer } from "@/components/shared/visualizers/RhythmVisualizer";
import { getRhythmFigureById, type RhythmFigureId } from "@/lib/music/rhythmFigures";

interface MeasureBuilderProps {
  initialFigures?: RhythmFigureId[];
  targetDuration?: number;
  availableOptions?: RhythmFigureId[];
  onSuccess?: () => void;
}

export function MeasureBuilder({
  initialFigures = [],
  targetDuration = 4,
  availableOptions = ["quarter", "half", "whole"],
  onSuccess,
}: MeasureBuilderProps) {
  const [figures, setFigures] = useState<RhythmFigureId[]>(initialFigures);

  const currentDuration = figures.reduce(
    (sum, fig) => sum + getRhythmFigureById(fig).durationUnits,
    0,
  );
  const isValid = currentDuration === targetDuration;

  const handleAdd = (fig: RhythmFigureId) => {
    if (isValid) return;
    setFigures((prev) => [...prev, fig]);

    // Check if this makes it valid
    const newDuration = currentDuration + getRhythmFigureById(fig).durationUnits;
    if (newDuration === targetDuration && onSuccess) {
      setTimeout(onSuccess, 800);
    }
  };

  const handleUndo = () => {
    if (figures.length > initialFigures.length) {
      setFigures((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-2xl mx-auto">
      <MeasureVisualizer
        figures={figures}
        targetDuration={targetDuration}
        isValid={isValid ? true : currentDuration > targetDuration ? false : undefined}
      />

      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-600">Toca las figuras para agregarlas</h3>
          <button
            onClick={handleUndo}
            disabled={figures.length === initialFigures.length || isValid}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-500 disabled:opacity-30 transition-colors"
          >
            <Undo2 className="w-5 h-5" />
            <span className="font-bold text-sm">Deshacer</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {availableOptions.map((fig) => {
            const figData = getRhythmFigureById(fig);
            const wouldOverfill = currentDuration + figData.durationUnits > targetDuration;

            return (
              <button
                key={fig}
                onClick={() => handleAdd(fig)}
                disabled={wouldOverfill || isValid}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border-2 border-slate-200 transition-all hover:border-sky-300 hover:shadow-md disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:shadow-none disabled:cursor-not-allowed`}
              >
                <div className="scale-75 origin-center">
                  <RhythmVisualizer figureId={fig} />
                </div>
                <span className="font-bold text-slate-500">{figData.name}</span>
                <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">
                  {figData.durationUnits} {figData.durationUnits === 1 ? "Tiempo" : "Tiempos"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
