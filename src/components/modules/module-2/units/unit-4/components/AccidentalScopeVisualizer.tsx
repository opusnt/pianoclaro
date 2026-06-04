"use client";

import { useEffect, useState } from "react";
import { TrebleClefVisualizer } from "@/components/shared/visualizers/TrebleClefVisualizer";
import type { PitchNote } from "@/components/shared/visualizers/PitchVisualizer";
import type { AccidentalExerciseNote } from "../accidentalNotationExercises";

type AccidentalScopeVisualizerProps = {
  exerciseNotes: AccidentalExerciseNote[];
  activeStepIndex?: number;
  showAura?: boolean;
};

export function AccidentalScopeVisualizer({
  exerciseNotes,
  activeStepIndex = -1,
  showAura = false,
}: AccidentalScopeVisualizerProps) {
  const notesCount = exerciseNotes.length;
  const leftPadding = 25; // Aumentado para no chocar con la clave de Sol (que es más grande ahora)
  const rightPadding = 8; // Restaurado a 8 para que la última nota no se corte en el borde derecho
  const availableWidth = 100 - leftPadding - rightPadding;

  // Calculamos las unidades de separación (los compases tendrán una separación mayor)
  let normalStepsCount = 0;
  let barlineStepsCount = 0;
  for (let i = 1; i < notesCount; i++) {
    if (exerciseNotes[i].measure > exerciseNotes[i - 1].measure) {
      barlineStepsCount++;
    } else {
      normalStepsCount++;
    }
  }

  const barlineMultiplier = 2.5; // La transición de compás ocupa 2.5x más espacio que un paso normal
  const totalUnits = normalStepsCount + barlineStepsCount * barlineMultiplier;
  
  const maxUnitStep = 10;
  let unitStep = totalUnits > 0 ? availableWidth / totalUnits : 0;
  if (unitStep > maxUnitStep) unitStep = maxUnitStep;
  
  const totalNotesWidth = totalUnits * unitStep;
  const startOffset = leftPadding + (availableWidth - totalNotesWidth) / 2;

  const barLines: number[] = [];
  let currentUnits = 0;

  const visualNotes: PitchNote[] = exerciseNotes.map((note, index) => {
    if (index > 0) {
      const prevNote = exerciseNotes[index - 1];
      if (note.measure > prevNote.measure) {
        // Transición de compás
        const prevX = startOffset + currentUnits * unitStep;
        currentUnits += barlineMultiplier;
        const currentX = startOffset + currentUnits * unitStep;
        // Ponemos la barra ligeramente hacia la nota anterior para dejar más espacio al accidente
        barLines.push(prevX + (currentX - prevX) * 0.45);
      } else {
        // Paso normal
        currentUnits += 1;
      }
    }
    
    const xPos = startOffset + currentUnits * unitStep;

    return {
      id: note.id,
      yPos: note.yPos,
      xPos,
      accidental: note.accidental,
      pulse: activeStepIndex === index,
      color: activeStepIndex === index ? "bg-sky-400 text-slate-900 shadow-sky-200" : "bg-slate-800 text-white",
      label: note.note,
    };
  });

  // Calculate aura scopes
  // An aura starts at an accidental note and ends at the next barline or natural
  const scopes: { startX: number; endX: number; yPos: number; color: string }[] = [];
  
  if (showAura) {
    let activeSharpFlat: { x: number, y: number, type: string, noteBase: string } | null = null;
    let currentMeasure = exerciseNotes[0]?.measure || 1;
    
    for (let i = 0; i < exerciseNotes.length; i++) {
      const note = exerciseNotes[i];
      const vNote = visualNotes[i];
      
      // Cancel at new measure
      if (note.measure > currentMeasure) {
        if (activeSharpFlat) {
          // Find the barline xPos before this note
          const barlineX = barLines.find(b => b < (vNote.xPos || 0) && b > activeSharpFlat!.x);
          if (barlineX) {
            scopes.push({
              startX: activeSharpFlat.x,
              endX: barlineX,
              yPos: activeSharpFlat.y,
              color: activeSharpFlat.type === "sharp" ? "bg-fuchsia-400" : "bg-blue-400"
            });
            activeSharpFlat = null;
          }
        }
        currentMeasure = note.measure;
      }
      
      if (note.accidental === "sharp" || note.accidental === "flat") {
        if (activeSharpFlat) {
          scopes.push({
            startX: activeSharpFlat.x,
            endX: vNote.xPos || 0,
            yPos: activeSharpFlat.y,
            color: activeSharpFlat.type === "sharp" ? "bg-fuchsia-400" : "bg-blue-400"
          });
        }
        activeSharpFlat = { x: vNote.xPos || 0, y: vNote.yPos, type: note.accidental, noteBase: note.note[0] };
      } else if (note.accidental === "natural" && activeSharpFlat && note.note[0] === activeSharpFlat.noteBase) {
         scopes.push({
            startX: activeSharpFlat.x,
            endX: vNote.xPos || 0,
            yPos: activeSharpFlat.y,
            color: activeSharpFlat.type === "sharp" ? "bg-fuchsia-400" : "bg-blue-400"
          });
          activeSharpFlat = null;
      }
    }
    
    // If still active at the end, extend to end of visualizer
    if (activeSharpFlat) {
       scopes.push({
          startX: activeSharpFlat.x,
          endX: 95,
          yPos: activeSharpFlat.y,
          color: activeSharpFlat.type === "sharp" ? "bg-fuchsia-400" : "bg-blue-400"
        });
    }
  }

  return (
    <div className="relative w-full">
      <TrebleClefVisualizer
        notes={visualNotes}
        barLines={barLines}
        interactive={false}
      />
      
      {/* Auras rendering layer */}
      {showAura && (
        <div className="absolute inset-x-0 top-8 bottom-8 pointer-events-none z-0">
           {scopes.map((scope, i) => (
             <div
                key={`scope-${i}`}
                className={`absolute h-8 ${scope.color} opacity-20 blur-sm rounded-full transition-all duration-700`}
                style={{
                  left: `${scope.startX}%`,
                  width: `${scope.endX - scope.startX}%`,
                  bottom: `calc(${scope.yPos}% - 16px)`,
                }}
             />
           ))}
           
           {/* Solid line for scope */}
           {scopes.map((scope, i) => (
             <div
                key={`scope-line-${i}`}
                className={`absolute h-1 ${scope.color.replace('bg-', 'bg-')} opacity-60 rounded-full transition-all duration-700`}
                style={{
                  left: `${scope.startX}%`,
                  width: `${scope.endX - scope.startX}%`,
                  bottom: `calc(${scope.yPos}% - 2px)`,
                }}
             />
           ))}
        </div>
      )}
    </div>
  );
}
