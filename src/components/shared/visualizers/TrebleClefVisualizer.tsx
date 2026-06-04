import React from "react";
import { type PitchNote, PitchVisualizer } from "@/components/shared/visualizers/PitchVisualizer";

type TrebleClefVisualizerProps = {
  notes?: PitchNote[];
  interactive?: boolean;
  onPositionClick?: (yPos: number) => void;
  height?: number;
  showTrebleClef?: boolean;
  highlightSecondLine?: boolean;
  animateClef?: boolean;
  barLines?: number[];
};

export function TrebleClefVisualizer({
  notes = [],
  interactive = false,
  onPositionClick,
  height,
  showTrebleClef = true,
  highlightSecondLine = false,
  animateClef = false,
  barLines = [],
  className = "",
}: TrebleClefVisualizerProps & { className?: string }) {
  return (
    <div className={`relative w-full mx-auto ${className}`}>
      <PitchVisualizer
        linesCount={5}
        showLedgers={true}
        height={height}
        className="w-full aspect-[2/1] min-h-[200px]"
        notes={notes}
        interactive={interactive}
        onPositionClick={onPositionClick}
        barLines={barLines}
      />

      {/* Overlay para la Clave de Sol y animaciones, usando la misma zona segura (inset-y-8) que el PitchVisualizer actualizado */}
      <div className="absolute inset-x-0 top-8 bottom-8 pointer-events-none overflow-visible">
        {/* Iluminación de la segunda línea (yPos: 35%) */}
        {highlightSecondLine && (
          <div
            className="absolute w-full h-3 md:h-4 lg:h-5 bg-fuchsia-400/30 blur-sm animate-pulse"
            style={{ bottom: "calc(35% - 6px)" }} // Centrado en la línea de SOL
          />
        )}

        {/* Símbolo de la Clave de Sol */}
        {showTrebleClef && (
          <div
            className={`absolute flex flex-col items-center justify-center transition-all duration-1000 ${
              animateClef ? "animate-bounce text-fuchsia-600 scale-110" : "text-slate-800"
            }`}
            style={{
              left: "-9%", // Movido 2% a la derecha (desde el -11%)
              bottom: "32%", // Línea base en 32%
              height: "140%", // Escala matemática relativa al contenedor (cubre más del 60% que ocupan las 5 líneas)
              transform: "translateY(43%)", // Ajuste porcentual estricto para anclar la espiral a su propio bottom
              zIndex: 5,
            }}
          >
            <svg
              viewBox="0 0 100 150"
              className="h-full w-auto drop-shadow-md overflow-visible"
            >
              <text
                x="50"
                y="100"
                fontSize="120"
                fontFamily="serif"
                dominantBaseline="alphabetic"
                textAnchor="middle"
                fill="currentColor"
              >
                𝄞
              </text>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
