"use client";

import { useEffect, useState } from "react";
import { InteractiveKeyboard } from "@/components/shared/interactive/InteractiveKeyboard";

export interface IntervalStepperProps {
  steps: string[]; // Ej: ["C4", "C#4", "D4"]
  autoPlay?: boolean;
  intervalMs?: number;
  highlightColor?: string;
  onComplete?: () => void;
}

export function IntervalStepper({
  steps,
  autoPlay = false,
  intervalMs = 800,
  highlightColor = "bg-amber-400",
  onComplete,
}: IntervalStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Extraemos la primera octava del primer paso para centrar el teclado
  const startOctaveStr = steps.length > 0 ? steps[0].replace(/[^0-9]/g, "") : "3";
  const startOctave = parseInt(startOctaveStr, 10) || 3;

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, intervalMs);
      return () => clearTimeout(timer);
    } else if (currentStep === steps.length) {
      setIsPlaying(false);
      if (onComplete) {
        // Añadir pequeño delay para que se vea la última nota
        setTimeout(onComplete, 500);
      }
    }
  }, [currentStep, isPlaying, steps.length, intervalMs, onComplete]);

  // Las notas que ya se han tocado + la actual
  const visibleHighlights = steps.slice(0, currentStep + 1);

  return (
    <div className="w-full">
      <InteractiveKeyboard
        startOctave={startOctave}
        endOctave={startOctave + 1}
        interactive={false}
        highlightedNotes={visibleHighlights}
        highlightColor={highlightColor}
        showLabels={true}
      />
    </div>
  );
}
