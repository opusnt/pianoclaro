"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { InteractiveKeyboard } from "@/components/shared/interactive/InteractiveKeyboard";
import type { AccidentalNotationExercise } from "../accidentalNotationExercises";
import { AccidentalScopeVisualizer } from "./AccidentalScopeVisualizer";

type NotationToKeyboardExerciseProps = {
  exercise: AccidentalNotationExercise;
  onSuccess: () => void;
};

export function NotationToKeyboardExercise({
  exercise,
  onSuccess,
}: NotationToKeyboardExerciseProps) {
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Reset state when exercise changes
  useEffect(() => {
    setActiveNoteIndex(0);
    setFeedback("idle");
    setErrorMsg("");
  }, [exercise]);

  const activeNote = exercise.notes[activeNoteIndex];

  const handleKeyPress = (notePlayed: string) => {
    if (!activeNote || feedback === "success") return;

    // notePlayed format: "C4", "C#4", etc.
    const playedBase = notePlayed.replace(/[0-9#b]/g, "");
    const isSharp = notePlayed.includes("#");
    const isFlat = notePlayed.includes("b"); // Tone.js usually outputs sharp for black keys, but let's be safe

    const playedAccidental = isSharp ? "sharp" : isFlat ? "flat" : "natural";

    if (
      playedBase === activeNote.expectedMidiBase &&
      playedAccidental === activeNote.expectedAccidentalMod
    ) {
      // Correct!
      setFeedback("success");
      setErrorMsg("");
      setTimeout(() => {
        if (activeNoteIndex < exercise.notes.length - 1) {
          setActiveNoteIndex((prev) => prev + 1);
          setFeedback("idle");
        } else {
          onSuccess();
        }
      }, 600);
    } else {
      // Error
      setFeedback("error");
      // Generate helpful message
      if (playedBase !== activeNote.expectedMidiBase) {
        setErrorMsg("Esa no es la nota base correcta.");
      } else if (playedAccidental === "natural" && activeNote.expectedAccidentalMod !== "natural") {
        setErrorMsg("¡Olvidaste la alteración! Esa nota sigue alterada en este compás.");
      } else if (playedAccidental !== "natural" && activeNote.expectedAccidentalMod === "natural") {
        setErrorMsg("Esa nota ya no está alterada (la canceló la barra o un becuadro).");
      } else {
        setErrorMsg("Nota incorrecta.");
      }

      setTimeout(() => {
        setFeedback("idle");
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-blue-deep/10 bg-white/80 p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold text-blue-deep">
            Toca las notas en orden: {activeNoteIndex + 1} / {exercise.notes.length}
          </p>
          <div className="h-2 flex-1 mx-4 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gold-soft transition-all duration-300"
              style={{ width: `${(activeNoteIndex / exercise.notes.length) * 100}%` }}
            />
          </div>
        </div>

        <AccidentalScopeVisualizer
          exerciseNotes={exercise.notes}
          activeStepIndex={activeNoteIndex}
          showAura={true}
        />

        <div className="mt-4 h-12 flex items-center justify-center">
          {feedback === "success" && (
            <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in zoom-in">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-bold">¡Correcto!</span>
            </div>
          )}
          {feedback === "error" && (
            <div className="flex items-center gap-2 text-red-500 animate-in fade-in zoom-in">
              <XCircle className="h-6 w-6" />
              <span className="font-bold">{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-blue-deep/10 bg-slate-900 p-2 shadow-xl">
        <InteractiveKeyboard
          startOctave={4}
          endOctave={4}
          showLabels={true}
          onKeyPress={handleKeyPress}
          interactive={feedback !== "success"} // Disable briefly on success
        />
      </div>
    </div>
  );
}
