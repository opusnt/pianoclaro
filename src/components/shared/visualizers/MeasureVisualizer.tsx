"use client";

import { RhythmVisualizer } from "@/components/shared/visualizers/RhythmVisualizer";
import { getRhythmFigureById, type RhythmFigureId } from "@/lib/music/rhythmFigures";

interface MeasureVisualizerProps {
  figures: RhythmFigureId[];
  targetDuration?: number; // 4 por defecto para 4/4
  isValid?: boolean; // Feedback si la suma es correcta
}

export function MeasureVisualizer({
  figures,
  targetDuration = 4,
  isValid,
}: MeasureVisualizerProps) {
  const currentDuration = figures.reduce(
    (sum, fig) => sum + getRhythmFigureById(fig).durationUnits,
    0,
  );
  const percentage = Math.min(100, (currentDuration / targetDuration) * 100);
  const isOverfilled = currentDuration > targetDuration;

  let borderColor = "border-slate-600";
  let bgColor = "bg-white";

  if (isValid === true) {
    borderColor = "border-emerald-400 shadow-emerald-100";
    bgColor = "bg-emerald-50/30";
  } else if (isOverfilled || isValid === false) {
    borderColor = "border-rose-400";
    bgColor = "bg-rose-50/30";
  }

  return (
    <div
      className={`relative flex flex-col w-full max-w-2xl border-4 ${borderColor} ${bgColor} rounded-3xl p-6 transition-all duration-300 shadow-sm`}
    >
      {/* Etiqueta de capacidad */}
      <div className="absolute -top-4 right-6 bg-white px-4 py-1 rounded-full border-2 border-slate-200 font-bold text-sm text-slate-500 shadow-sm">
        {currentDuration} / {targetDuration} Tiempos
      </div>

      {/* Contenido (Figuras) */}
      <div className="flex items-center gap-4 min-h-[160px] w-full">
        {figures.length === 0 ? (
          <div className="w-full text-center text-slate-500 font-medium">El compás está vacío.</div>
        ) : (
          figures.map((fig, i) => {
            const figureData = getRhythmFigureById(fig);
            // Utilizamos flex-grow proporcional a la duración (ej: blanca = 2, negra = 1)
            // con flex-basis 0 para que distribuya el espacio equitativamente tomando en cuenta el gap
            return (
              <div
                key={`${fig}-${i}`}
                style={{ flex: `${figureData.durationUnits} 1 0%` }}
                className="flex justify-center transition-all animate-in zoom-in duration-300 min-w-0"
              >
                <div className="w-full max-w-[120px] flex justify-center">
                  <RhythmVisualizer figureId={fig} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Barra de progreso de capacidad inferior */}
      <div className="w-full h-4 bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${isOverfilled ? "bg-rose-500" : currentDuration === targetDuration ? "bg-emerald-500" : "bg-sky-400"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
