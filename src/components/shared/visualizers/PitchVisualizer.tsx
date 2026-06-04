"use client";

import { Music } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { RhythmFigureId } from "@/lib/music/rhythmFigures";

export type PitchNote = {
  id: string;
  yPos: number; // 0 (abajo) a 100 (arriba)
  xPos?: number; // 0 (izquierda) a 100 (derecha)
  color?: string;
  pulse?: boolean;
  label?: string;
  rhythm?: RhythmFigureId;
  isDotted?: boolean;
  tieNext?: boolean;
  accidental?: "sharp" | "flat" | "natural";
};

type PitchVisualizerProps = {
  linesCount?: number; // 0 a 5
  showLedgers?: boolean; // Muestra guías para líneas adicionales
  notes: PitchNote[];
  interactive?: boolean;
  onPositionClick?: (yPos: number) => void;
  height?: number; // Altura en px, default 300
  barLines?: number[]; // Arreglo de xPos (0-100) donde dibujar barras divisorias
};

export function PitchVisualizer({
  linesCount = 0,
  showLedgers = false,
  notes,
  interactive = false,
  onPositionClick,
  height, // Make it optional to allow CSS aspect-ratio
  barLines = [], // Líneas divisorias de compás
  className = "",
}: PitchVisualizerProps & { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!interactive || !onPositionClick || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    let clientY;
    if ("touches" in e) {
      clientY = e.touches[0].clientY;
    } else {
      clientY = (e as React.MouseEvent).clientY;
    }

    // Área segura de 32px (top-8, bottom-8) para permitir notas más grandes en pantallas grandes
    const innerTop = rect.top + 32;
    const innerHeight = Math.max(1, rect.height - 64);

    // Calcular posición de 0 a 100 relativa al área segura
    const yPx = clientY - innerTop;
    const yPercentage = 100 - (yPx / innerHeight) * 100;

    // Limitar entre 0 y 100
    const clampedY = Math.max(0, Math.min(100, yPercentage));
    onPositionClick(clampedY);
  };

  // Calcular las líneas horizontales
  // Si tenemos 5 líneas, las ubicaremos entre y=20 y y=80 (por ejemplo)
  const linePositions = [];
  if (linesCount > 0) {
    const spacing = 15; // Espacio entre líneas en porcentaje
    const startY = 50 - ((linesCount - 1) * spacing) / 2; // Centrar las líneas
    for (let i = 0; i < linesCount; i++) {
      linePositions.push(startY + i * spacing);
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl bg-slate-50 border-2 overflow-hidden transition-colors ${
        interactive ? "cursor-pointer hover:border-sky-300 border-sky-100" : "border-slate-100"
      } ${className}`}
      style={{ touchAction: "none", height: height ? `${height}px` : undefined }}
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Fondo de gradiente suave para indicar altura */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 via-transparent to-sky-100/30 pointer-events-none" />

      {/* Área segura para renderizar (evita que las notas toquen los bordes) */}
      <div className="absolute inset-x-0 top-8 bottom-8 pointer-events-none">
        {/* Líneas Adicionales Guías (Opcional) */}
        {showLedgers && (
          <>
            <div
              className="absolute w-1/3 left-1/3 h-px bg-slate-300 border-dashed"
              style={{ bottom: "5%" }}
            />
            <div
              className="absolute w-1/3 left-1/3 h-px bg-slate-300 border-dashed"
              style={{ bottom: "95%" }}
            />
          </>
        )}

        {/* Líneas del Pentagrama */}
        {linePositions.map((y, index) => (
          <div
            key={`line-${index}`}
            className="absolute w-full h-1 bg-slate-800 transition-all duration-1000 ease-out shadow-sm"
            style={{ bottom: `calc(${y}% - 2px)` }}
          />
        ))}

        {/* Barras divisorias de compás */}
        {barLines.map((xPos, index) => (
          <div
            key={`bar-${index}`}
            className="absolute w-[3px] bg-slate-800 z-0"
            style={{
              left: `${xPos}%`,
              bottom: "20%",
              height: "60%",
            }}
          />
        ))}

        {/* Notas */}
        {notes.map((note) => (
          <div
            key={note.id}
            className="absolute transform -translate-x-1/2 translate-y-1/2 transition-all duration-500 ease-out flex flex-col items-center justify-center pointer-events-auto"
            style={{
              bottom: `${note.yPos}%`,
              left: note.xPos !== undefined ? `${note.xPos}%` : "50%",
              height: "14%", // Reducido levemente de 16% a 14% a pedido del usuario
              aspectRatio: "1 / 1",
              zIndex: 10,
            }}
          >
            {/* Si está fuera de las líneas (ej: DO central o LA superior), pintar su propia línea adicional corta */}
            {linesCount === 5 && (note.yPos >= 95 || note.yPos <= 5) && (
              <div
                className="absolute h-1 bg-slate-800 top-1/2 transform -translate-y-1/2 z-0"
                style={{ width: "160%" }}
              />
            )}

            <div
              className={`w-full h-full rounded-full flex items-center justify-center z-10 transition-all ${
                note.pulse ? "animate-pulse ring-4 ring-sky-300/50" : ""
              } ${
                note.rhythm === "whole" || note.rhythm === "half"
                  ? `bg-slate-50 border-[3px] ${note.color ? note.color.replace("bg-", "border-").replace("text-slate-900", "") : "border-slate-100"}`
                  : note.color || "bg-slate-800 text-white shadow-lg"
              } ${(note.rhythm === "whole" || note.rhythm === "half") && note.color?.includes("bg-sky") ? "border-sky-500" : ""}`}
              style={
                note.rhythm === "whole" || note.rhythm === "half"
                  ? { transform: "rotate(-15deg)" }
                  : {}
              }
            >
              {note.label && (
                <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider">
                  {note.label}
                </span>
              )}
              {!note.label && !note.rhythm && <Music className="w-1/2 h-1/2" />}
            </div>

            {/* Accidental */}
            {note.accidental && (
              <div
                className="absolute text-slate-800 font-serif font-bold select-none pointer-events-none z-10"
                style={{
                  right: "105%", // Más cerca de la nota para evitar colisiones
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.75rem", // Ligeramente más pequeño para pantallas apretadas
                  lineHeight: 1,
                  filter: "drop-shadow(0px 1px 2px rgba(255,255,255,0.8))" // Para asegurar contraste sobre las líneas
                }}
              >
                {note.accidental === "sharp" ? "♯" : note.accidental === "flat" ? "♭" : "♮"}
              </div>
            )}

            {/* Puntillo */}
            {note.isDotted && (
              <div
                className="absolute w-2 h-2 rounded-full bg-slate-800 z-10"
                style={{
                  right: "-12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            )}

            {/* Plica (Stem) para Blanca y Negra (Debe estar fuera del div rotado) */}
            {(note.rhythm === "half" || note.rhythm === "quarter") && (
              <div
                className={`absolute w-1 bg-slate-800 rounded-full z-[-1] ${
                  note.color?.includes("bg-sky") ? "bg-sky-500" : ""
                }`}
                style={{
                  height: "250%",
                  ...(note.yPos >= 50
                    ? { top: "50%", left: 0 } // Plica hacia abajo a la izquierda
                    : { bottom: "50%", right: 0 }), // Plica hacia arriba a la derecha
                }}
              />
            )}
          </div>
        ))}

        {/* SVG Overlay para Ligaduras (Ties) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ overflow: "visible" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {notes.map((note, i) => {
            if (note.tieNext && i < notes.length - 1) {
              const nextNote = notes[i + 1];
              // Posiciones en porcentajes (0-100)
              const startX = note.xPos ?? 50;
              const endX = nextNote.xPos ?? 50;
              // El SVG usa un sistema de coordenadas donde y=0 es arriba, yPos es desde abajo (bottom: yPos%)
              const startY = 100 - note.yPos;
              const endY = 100 - nextNote.yPos;

              // Los puntos de control para la curva Bezier
              // Asumimos que las notas ligadas están a la misma altura, así que la curva va por abajo o por arriba
              const midX = (startX + endX) / 2;

              // Si la plica va hacia arriba (nota < 50%), la ligadura va por abajo (+10%)
              // Si la plica va hacia abajo (nota >= 50%), la ligadura va por arriba (-10%)
              const curveDirection = note.yPos >= 50 ? -8 : 8;

              const controlY = startY + curveDirection;

              // Como el SVG está en porcentajes, debemos asegurarnos de que la curva no se deforme demasiado con el aspecto
              // Usaremos un path SVG
              return (
                <path
                  key={`tie-${note.id}`}
                  d={`M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  className="text-slate-800"
                  strokeLinecap="round"
                />
              );
            }
            return null;
          })}
        </svg>
      </div>
    </div>
  );
}
