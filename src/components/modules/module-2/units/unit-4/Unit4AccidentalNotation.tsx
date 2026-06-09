"use client";

import { AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { useGlobalStore } from "@/lib/store/useGlobalStore";
import {
  type AccidentalExerciseNote,
  accidentalNotationExercises,
  generateRandomNotationExercises,
} from "./accidentalNotationExercises";
import { AccidentalScopeVisualizer } from "./components/AccidentalScopeVisualizer";
import { MeasureAccidentalTracker } from "./components/MeasureAccidentalTracker";
import { NotationToKeyboardExercise } from "./components/NotationToKeyboardExercise";

const TOTAL_STAGES = 10;

export function Unit4AccidentalNotation() {
  const router = useRouter();
  const [stage, setStage] = useState(1);
  const score = useGlobalStore((state) => state.score);

  const handleNext = () => {
    if (stage < TOTAL_STAGES) {
      setStage(stage + 1);
    } else {
      localStorage.setItem("module2.unit4.completed", "true");
      localStorage.setItem("module2.unit4.score", Math.max(score, 100).toString());
      useGlobalStore.getState().resetSession();
      router.push("/modulos/2");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20">
      <PageHeader
        title="Notas con instrucciones especiales"
        description={`Etapa ${stage} de ${TOTAL_STAGES}`}
      />

      {/* Barra de progreso */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-blue-deep transition-all duration-500 ease-out"
          style={{ width: `${(stage / TOTAL_STAGES) * 100}%` }}
        />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {stage === 1 && <Stage1Mystery onNext={handleNext} />}
        {stage === 2 && <Stage2Change onNext={handleNext} />}
        {stage === 3 && <Stage3Scope onNext={handleNext} />}
        {stage === 4 && <Stage4Barline onNext={handleNext} />}
        {stage === 5 && <Stage5Natural onNext={handleNext} />}
        {stage === 6 && <Stage6InteractiveGame onNext={handleNext} />}
        {stage === 7 && <Stage7Keyboard onNext={handleNext} />}
        {stage === 8 && <Stage8Detective onNext={handleNext} />}
        {stage === 9 && <Stage9GuidedReading onNext={handleNext} />}
        {stage === 10 && <Stage10FinalChallenge onNext={handleNext} />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ETAPAS
// ─────────────────────────────────────────────────────────────────────────────

function Stage1Mystery({ onNext }: { onNext: () => void }) {
  const notes: AccidentalExerciseNote[] = [
    {
      id: "1",
      note: "DO",
      yPos: 5,
      measure: 1,
      expectedMidiBase: "C",
      expectedAccidentalMod: "natural",
    },
    {
      id: "2",
      note: "RE",
      yPos: 12.5,
      measure: 1,
      expectedMidiBase: "D",
      expectedAccidentalMod: "natural",
    },
    {
      id: "3",
      note: "FA",
      yPos: 27.5,
      accidental: "sharp",
      measure: 1,
      expectedMidiBase: "F",
      expectedAccidentalMod: "sharp",
    },
    {
      id: "4",
      note: "SOL",
      yPos: 35,
      measure: 1,
      expectedMidiBase: "G",
      expectedAccidentalMod: "natural",
    },
  ];

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="text-center">
        <h2 className="text-2xl font-black text-blue-deep">El Misterio</h2>
        <p className="mt-2 text-slate-500">Observa atentamente esta pequeña partitura.</p>
      </div>

      <div className="py-8 pointer-events-none">
        <AccidentalScopeVisualizer exerciseNotes={notes} />
      </div>

      <div className="rounded-xl bg-blue-50 p-6 text-center border border-blue-100">
        <AlertCircle className="mx-auto h-8 w-8 text-blue-deep mb-3" />
        <h3 className="text-lg font-bold text-blue-900">
          ¿Por qué esa nota tiene un símbolo especial?
        </h3>
        <p className="mt-2 text-blue-700">
          Hay un pequeño "michi" o numeral (♯) al lado de una nota. ¿Qué crees que significa?
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} className="gap-2">
          Descubrámoslo <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Stage2Change({ onNext }: { onNext: () => void }) {
  const notes: AccidentalExerciseNote[] = [
    {
      id: "1",
      note: "FA",
      yPos: 27.5,
      measure: 1,
      expectedMidiBase: "F",
      expectedAccidentalMod: "natural",
    },
    {
      id: "2",
      note: "FA",
      yPos: 27.5,
      accidental: "sharp",
      measure: 1,
      expectedMidiBase: "F",
      expectedAccidentalMod: "sharp",
    },
  ];

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="text-center">
        <h2 className="text-2xl font-black text-blue-deep">Una nota cambia</h2>
        <p className="mt-2 text-slate-500">Compara cómo se ve y cómo suena.</p>
      </div>

      <div className="py-8">
        <NotationToKeyboardExercise
          exercise={{ id: "e1", title: "", description: "", notes }}
          onSuccess={onNext}
        />
      </div>

      <div className="rounded-xl bg-emerald-50 p-6 border border-emerald-100">
        <p className="font-bold text-emerald-900 text-center">
          ¡El símbolo modifica esta nota específica!
        </p>
        <p className="text-emerald-700 text-center text-sm mt-2">
          Ese símbolo se llama <strong>Sostenido</strong>. Al aparecer junto a la nota, te indica
          que debes tocar la tecla negra inmediatamente a la derecha.
        </p>
      </div>
    </div>
  );
}

function Stage3Scope({ onNext }: { onNext: () => void }) {
  const notes: AccidentalExerciseNote[] = [
    {
      id: "1",
      note: "FA",
      yPos: 27.5,
      accidental: "sharp",
      measure: 1,
      expectedMidiBase: "F",
      expectedAccidentalMod: "sharp",
    },
    {
      id: "2",
      note: "SOL",
      yPos: 35,
      measure: 1,
      expectedMidiBase: "G",
      expectedAccidentalMod: "natural",
    },
    {
      id: "3",
      note: "FA",
      yPos: 27.5,
      measure: 1,
      expectedMidiBase: "F",
      expectedAccidentalMod: "sharp",
    },
  ];

  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="text-center">
        <h2 className="text-2xl font-black text-blue-deep">Sigue Vigente</h2>
        <p className="mt-2 text-slate-500">¿Qué pasa si la misma nota se repite?</p>
      </div>

      <div className="py-8 pointer-events-none">
        <AccidentalScopeVisualizer exerciseNotes={notes} showAura={revealed} />
      </div>

      {!revealed ? (
        <div className="text-center space-y-4">
          <p className="text-lg font-bold text-slate-700">¿Cómo crees que se toca el último FA?</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setRevealed(true)}>
              Se toca FA normal (tecla blanca)
            </Button>
            <Button variant="outline" onClick={() => setRevealed(true)}>
              Se toca FA# (tecla negra)
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-fuchsia-50 p-6 border border-fuchsia-100 animate-in zoom-in">
          <p className="font-bold text-fuchsia-900 text-center text-xl">¡Sigue siendo FA#!</p>
          <p className="text-fuchsia-800 text-center mt-2">
            Una alteración accidental sigue activa <strong>durante todo el compás</strong> para esa
            misma nota. Piensa que deja un "rastro de magia" que afecta a todas las notas iguales
            que vengan después.
          </p>
          <div className="flex justify-center mt-6">
            <Button onClick={onNext}>Entendido</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stage4Barline({ onNext }: { onNext: () => void }) {
  const notes: AccidentalExerciseNote[] = [
    {
      id: "1",
      note: "FA",
      yPos: 27.5,
      accidental: "sharp",
      measure: 1,
      expectedMidiBase: "F",
      expectedAccidentalMod: "sharp",
    },
    {
      id: "2",
      note: "SOL",
      yPos: 35,
      measure: 1,
      expectedMidiBase: "G",
      expectedAccidentalMod: "natural",
    },
    {
      id: "3",
      note: "FA",
      yPos: 27.5,
      measure: 1,
      expectedMidiBase: "F",
      expectedAccidentalMod: "sharp",
    },
    {
      id: "4",
      note: "FA",
      yPos: 27.5,
      measure: 2,
      expectedMidiBase: "F",
      expectedAccidentalMod: "natural",
    },
  ];

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="text-center">
        <h2 className="text-2xl font-black text-blue-deep">La barra borra la instrucción</h2>
        <p className="mt-2 text-slate-500">¿Hasta cuándo dura la magia?</p>
      </div>

      <div className="py-8 pointer-events-none">
        <AccidentalScopeVisualizer exerciseNotes={notes} showAura={true} />
      </div>

      <div className="rounded-xl bg-blue-50 p-6 border border-blue-100 text-center">
        <p className="font-bold text-blue-900 text-lg">
          La barra divisoria cancela automáticamente la alteración.
        </p>
        <p className="text-blue-700 mt-2">
          Cuando pasamos a un nuevo compás, todas las notas vuelven a la normalidad. El último FA
          del ejemplo ya no tiene el rastro mágico.
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} className="gap-2">
          Siguiente <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Stage5Natural({ onNext }: { onNext: () => void }) {
  const notes: AccidentalExerciseNote[] = [
    {
      id: "1",
      note: "FA",
      yPos: 27.5,
      accidental: "sharp",
      measure: 1,
      expectedMidiBase: "F",
      expectedAccidentalMod: "sharp",
    },
    {
      id: "2",
      note: "FA",
      yPos: 27.5,
      accidental: "natural",
      measure: 1,
      expectedMidiBase: "F",
      expectedAccidentalMod: "natural",
    },
  ];

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="text-center">
        <h2 className="text-2xl font-black text-blue-deep">El Becuadro</h2>
        <p className="mt-2 text-slate-500">
          ¿Y si queremos cancelar la alteración antes de que termine el compás?
        </p>
      </div>

      <div className="py-8 pointer-events-none">
        <AccidentalScopeVisualizer exerciseNotes={notes} showAura={true} />
      </div>

      <div className="rounded-xl bg-amber-50 p-6 border border-amber-100 text-center">
        <p className="font-bold text-amber-900 text-lg">
          El becuadro (♮) cancela la alteración inmediatamente.
        </p>
        <p className="text-amber-800 mt-2">
          Actúa como una "goma de borrar" mágica. Si ves un becuadro, la nota vuelve a ser una tecla
          blanca normal, incluso dentro del mismo compás.
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} className="gap-2">
          A jugar <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Stage6InteractiveGame({ onNext }: { onNext: () => void }) {
  const [exercises] = useState(() => generateRandomNotationExercises(5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const addScore = useGlobalStore((state) => state.addScore);

  const currentExercise = exercises[currentIndex];
  const lastNote = currentExercise.notes[currentExercise.notes.length - 1];

  const handleGuess = (guess: "sharp" | "flat" | "natural") => {
    if (feedback !== null) return;

    if (guess === lastNote.expectedAccidentalMod) {
      setFeedback("correct");
      addScore(10);
    } else {
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex((c) => c + 1);
      } else {
        onNext();
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="text-center">
        <h2 className="text-2xl font-black text-blue-deep">¿Sigue alterada?</h2>
        <p className="mt-2 text-slate-500">
          Ronda {currentIndex + 1} de {exercises.length}
        </p>
      </div>

      <div className="py-8 pointer-events-none">
        <AccidentalScopeVisualizer exerciseNotes={currentExercise.notes} showAura={false} />
      </div>

      <div className="text-center space-y-6">
        <p className="text-lg font-bold text-slate-700">¿Cómo se toca la ÚLTIMA nota?</p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => handleGuess("natural")}
            variant="outline"
            className="text-lg py-6 px-8"
          >
            Natural
          </Button>
          <Button
            onClick={() => handleGuess("sharp")}
            variant="outline"
            className="text-lg py-6 px-8"
          >
            Alterada
          </Button>
        </div>

        <div className="h-8">
          {feedback === "correct" && (
            <p className="text-emerald-500 font-bold text-lg animate-bounce">¡Correcto!</p>
          )}
          {feedback === "incorrect" && (
            <p className="text-red-500 font-bold text-lg animate-bounce">
              Ups, fíjate en el compás o el símbolo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stage7Keyboard({ onNext }: { onNext: () => void }) {
  const exercise = accidentalNotationExercises[0]; // "El efecto del compás"

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-blue-deep">Partitura → Teclado</h2>
        <p className="mt-2 text-slate-500">Demuestra que puedes leer y tocar al mismo tiempo.</p>
      </div>

      <NotationToKeyboardExercise exercise={exercise} onSuccess={onNext} />
    </div>
  );
}

function Stage8Detective({ onNext }: { onNext: () => void }) {
  const exercise = accidentalNotationExercises[3]; // Desafío final de datos
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const addScore = useGlobalStore((state) => state.addScore);

  const handleNextNote = () => {
    if (activeNoteIndex < exercise.notes.length - 1) {
      setActiveNoteIndex((a) => a + 1);
    } else {
      addScore(20);
      onNext();
    }
  };

  // Determinar si en este índice hay alteraciones activas
  const currentNote = exercise.notes[activeNoteIndex];
  const activeNotesList: { note: string; accidental: "sharp" | "flat" }[] = [];

  // Buscar hacia atrás en el mismo compás
  const measureNotes = exercise.notes.filter((n) => n.measure === currentNote.measure);
  const indexOfCurrentInMeasure = measureNotes.indexOf(currentNote);

  // Rastrear el último estado de cada nota en este compás hasta el punto actual
  const noteStates = new Map<string, "sharp" | "flat" | "natural">();
  for (let i = 0; i <= indexOfCurrentInMeasure; i++) {
    const n = measureNotes[i];
    if (n.accidental) {
      noteStates.set(n.note, n.accidental);
    }
  }

  noteStates.forEach((state, noteStr) => {
    if (state === "sharp" || state === "flat") {
      activeNotesList.push({ note: noteStr[0], accidental: state });
    }
  });

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="text-center">
        <h2 className="text-2xl font-black text-blue-deep">Detective de Alteraciones</h2>
        <p className="mt-2 text-slate-500">Avanza nota por nota y observa el panel del compás.</p>
      </div>

      <div className="space-y-8">
        <div className="pointer-events-none">
          <AccidentalScopeVisualizer
            exerciseNotes={exercise.notes}
            activeStepIndex={activeNoteIndex}
            showAura={true}
          />
        </div>
        <div className="max-w-md mx-auto">
          <MeasureAccidentalTracker
            activeNotes={activeNotesList}
            measureNumber={currentNote.measure}
          />
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <Button onClick={handleNextNote} className="px-12 py-6 text-lg rounded-full">
          {activeNoteIndex < exercise.notes.length - 1 ? "Siguiente Nota" : "¡Lo logré!"}
        </Button>
      </div>
    </div>
  );
}

function Stage9GuidedReading({ onNext }: { onNext: () => void }) {
  const exercise = accidentalNotationExercises[1]; // El poder del becuadro

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-blue-deep">Lectura Guiada</h2>
        <p className="mt-2 text-slate-500">Pon mucha atención a los becuadros y cancelaciones.</p>
      </div>

      <NotationToKeyboardExercise exercise={exercise} onSuccess={onNext} />
    </div>
  );
}

function Stage10FinalChallenge({ onNext }: { onNext: () => void }) {
  const score = useGlobalStore((state) => state.score);

  return (
    <div className="space-y-8 rounded-2xl bg-white p-10 shadow-sm border border-slate-100 text-center">
      <div className="mx-auto w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
        <Sparkles className="h-10 w-10" />
      </div>

      <h2 className="text-4xl font-black text-blue-deep">
        ¡Ahora entiendes las alteraciones en partituras!
      </h2>
      <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
        Las alteraciones accidentales son instrucciones temporales que modifican notas dentro de un
        compás. Y desaparecen cuando llega la barra divisoria.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mt-8">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-sm font-bold uppercase text-muted">Puntuación</p>
          <p className="text-3xl font-black text-blue-deep mt-1">{score + 50} XP</p>
        </div>
        <div className="bg-fuchsia-50 p-4 rounded-xl border border-fuchsia-100">
          <p className="text-sm font-bold uppercase text-fuchsia-600">Logro Desbloqueado</p>
          <p className="text-lg font-black text-fuchsia-900 mt-1 flex items-center justify-center gap-2">
            🏆 Detective
          </p>
        </div>
      </div>

      <div className="pt-8">
        <Button
          onClick={onNext}
          className="px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Finalizar Módulo 2
        </Button>
      </div>
    </div>
  );
}
