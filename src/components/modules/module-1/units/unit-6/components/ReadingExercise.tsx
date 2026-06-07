import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAudioSimulator } from "@/components/shared/audio/useAudioSimulator";
import { TrebleClefVisualizer } from "@/components/shared/visualizers/TrebleClefVisualizer";
import { getNoteById } from "@/lib/music/notesData";

type ReadingExerciseProps = {
  targetNoteId: string;
  question: string;
  options: string[]; // IDs de las notas, ej: ["do", "re", "mi"...]
  showFeedback?: boolean; // Si es true, evalúa visualmente y obliga a dar a "Siguiente"
  flashMode?: boolean; // Si es true, oculta la nota después de 1 segundo
  onAnswer?: (isCorrect: boolean, timeMs: number) => void;
  onNext?: () => void;
};

export function ReadingExercise({
  targetNoteId,
  question,
  options,
  showFeedback = true,
  flashMode = false,
  onAnswer,
  onNext,
}: ReadingExerciseProps) {
  const [selection, setSelection] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isNoteVisible, setIsNoteVisible] = useState(true);

  const { playSimulatedSound } = useAudioSimulator();
  const targetNote = getNoteById(targetNoteId);

  // Resetear el estado cuando cambie el ejercicio
  useEffect(() => {
    setSelection(null);
    setStartTime(Date.now());
    setIsNoteVisible(true);

    if (flashMode) {
      const timer = setTimeout(() => setIsNoteVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [targetNoteId, flashMode]);

  const handleSelect = (optId: string) => {
    if (selection !== null) return; // Ya respondió

    setSelection(optId);
    const isCorrect = optId === targetNoteId;
    const timeMs = Date.now() - startTime;

    // Reproducir feedback auditivo
    if (isCorrect) {
      const n = getNoteById(optId);
      playSimulatedSound({ type: "sine", frequency: n.frequency, duration: 0.5 });
    } else {
      playSimulatedSound({ type: "noise", duration: 0.2 }, 300);
    }

    if (onAnswer) onAnswer(isCorrect, timeMs);

    // Si no hay feedback interactivo esperado (ej: avance automático rápido), disparamos next
    if (!showFeedback && onNext) {
      setTimeout(onNext, isCorrect ? 500 : 1000);
    }
  };

  const isCorrect = selection === targetNoteId;

  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">{question}</h3>

      <div className="mb-8 w-full max-w-2xl">
        <TrebleClefVisualizer
          notes={
            isNoteVisible
              ? [{ id: targetNoteId, yPos: targetNote.yPos, color: "bg-slate-800" }]
              : []
          }
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3 max-w-3xl w-full mb-8">
        {options.map((optId) => {
          const optNote = getNoteById(optId);

          let btnClass = "bg-white border-slate-200 text-slate-600 hover:bg-slate-50";
          if (selection === optId) {
            btnClass = isCorrect
              ? "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-200"
              : "bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-200";
          } else if (selection !== null && optId === targetNoteId && showFeedback) {
            // Mostrar la correcta si se equivocó
            btnClass = "bg-green-50/50 border-green-500/50 text-green-700/50 border-dashed";
          }

          return (
            <button
              key={optId}
              disabled={selection !== null}
              onClick={() => handleSelect(optId)}
              className={`px-5 py-3 rounded-xl border-2 font-bold text-lg transition-all flex-grow sm:flex-grow-0 min-w-[4rem] flex items-center justify-center gap-2 ${btnClass}`}
            >
              {optNote.name}
            </button>
          );
        })}
      </div>

      {showFeedback && selection && (
        <div className="animate-in fade-in zoom-in slide-in-from-bottom-4 flex flex-col items-center">
          <div
            className={`flex items-center gap-2 font-bold text-lg mb-6 ${isCorrect ? "text-green-600" : "text-rose-600"}`}
          >
            {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            {isCorrect ? "¡Correcto!" : `Era ${targetNote.name}`}
          </div>

          {onNext && (
            <button
              onClick={onNext}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl shadow-md transition-colors"
            >
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  );
}
