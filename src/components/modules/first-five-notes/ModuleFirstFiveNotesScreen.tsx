"use client";

import { BarChart3, CheckCircle2, Music2, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMidiKeyboardInput } from "@/components/lesson/hooks/useMidiKeyboardInput";
import { NotationViewer } from "@/components/lesson/NotationViewer";
import type { ScoreNoteSelection } from "@/components/lesson/notation/types";
import { AppliedLearningPanel } from "@/components/modules/shared/AppliedLearningPanel";
import { ExerciseProgressCard } from "@/components/modules/shared/ExerciseProgressCard";
import { ModuleMetric } from "@/components/modules/shared/ModuleMetric";
import { NextLessonCard } from "@/components/modules/shared/NextLessonCard";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { solfegeByNote } from "@/lib/music/notes";
import type { DetailedLearningModule } from "@/types/curriculum";
import type { Lesson } from "@/types/lesson";
import type { NoteName } from "@/types/music";

type FirstFiveNotesExercise = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  expectedAnswer: string;
  options: string[];
  activeMeasure?: number;
  activeNotes?: NoteName[];
  meta: string[];
};

type FirstFiveNotesModuleProgress = {
  completedIds: string[];
  score: number;
  attempts: number;
  correct: number;
  combo: number;
  comboMax: number;
};

type ModuleFirstFiveNotesScreenProps = {
  module: DetailedLearningModule;
  sourceLesson: Lesson;
};

const firstFiveNotesExercises: FirstFiveNotesExercise[] = [
  {
    id: "direction-reading",
    title: "Lee la dirección",
    description: "Observa DO-RE-MI-FA y decide cómo se mueve la melodía.",
    prompt: "En el primer compás, la melodía principalmente:",
    expectedAnswer: "Sube",
    options: ["Sube", "Baja", "Repite"],
    activeMeasure: 1,
    activeNotes: ["C", "D", "E", "F"],
    meta: ["partitura", "dirección"],
  },
  {
    id: "find-re",
    title: "Encuentra RE",
    description: "Ubica RE como la nota vecina a la derecha de DO.",
    prompt: "Haz click en RE en la partitura o elige su nombre.",
    expectedAnswer: "Re",
    options: ["Do", "Re", "Mi", "Fa"],
    activeMeasure: 1,
    activeNotes: ["D"],
    meta: ["nota", "lectura"],
  },
  {
    id: "black-note-rhythm",
    title: "Ritmo de negras",
    description: "Reconoce que cada nota negra ocupa un pulso en 4/4.",
    prompt: "Si el compás tiene cuatro negras, debes contar:",
    expectedAnswer: "4 pulsos",
    options: ["2 pulsos", "3 pulsos", "4 pulsos"],
    activeMeasure: 1,
    activeNotes: ["C", "D", "E", "F"],
    meta: ["ritmo", "4/4"],
  },
  {
    id: "five-note-sequence",
    title: "Mini lectura completa",
    description: "Sigue la partitura en orden: DO, RE, MI, FA y SOL.",
    prompt: "Haz click en las notas de la partitura en orden ascendente.",
    expectedAnswer: "Do-Re-Mi-Fa-Sol",
    options: [],
    activeMeasure: 1,
    activeNotes: ["C", "D", "E", "F", "G"],
    meta: ["secuencia", "aplicación"],
  },
];

const sequenceTargets: Array<ScoreNoteSelection & { answer: string }> = [
  { measureNumber: 1, noteIndex: 0, note: "C", answer: "Do" },
  { measureNumber: 1, noteIndex: 1, note: "D", answer: "Re" },
  { measureNumber: 1, noteIndex: 2, note: "E", answer: "Mi" },
  { measureNumber: 1, noteIndex: 3, note: "F", answer: "Fa" },
  { measureNumber: 2, noteIndex: 0, note: "G", answer: "Sol" },
];

const initialProgress: FirstFiveNotesModuleProgress = {
  completedIds: [],
  score: 0,
  attempts: 0,
  correct: 0,
  combo: 0,
  comboMax: 0,
};

export function ModuleFirstFiveNotesScreen({
  module,
  sourceLesson,
}: ModuleFirstFiveNotesScreenProps) {
  const storageKey = `piano-claro.${module.id}.module-progress`;
  const [selectedExerciseId, setSelectedExerciseId] = useState(firstFiveNotesExercises[0].id);
  const [progress, setProgress] = useState<FirstFiveNotesModuleProgress>(initialProgress);
  const [feedback, setFeedback] = useState(
    "Empieza observando la partitura: no respondas de memoria, busca la evidencia visual.",
  );
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const audioRef = useRef<PianoAudioEngine | null>(null);

  const selectedExercise =
    firstFiveNotesExercises.find((exercise) => exercise.id === selectedExerciseId) ??
    firstFiveNotesExercises[0];
  const completedCount = firstFiveNotesExercises.filter((exercise) =>
    progress.completedIds.includes(exercise.id),
  ).length;
  const progressPercent = Math.round((completedCount / firstFiveNotesExercises.length) * 100);
  const accuracy =
    progress.attempts > 0 ? Math.round((progress.correct / progress.attempts) * 100) : 100;
  const sequenceTarget = sequenceTargets[sequenceIndex] ?? sequenceTargets.at(-1);

  const activeNotePosition = useMemo(() => {
    if (selectedExercise.id !== "five-note-sequence") {
      return null;
    }

    return sequenceTarget
      ? {
          measureNumber: sequenceTarget.measureNumber,
          noteIndex: sequenceTarget.noteIndex,
        }
      : null;
  }, [selectedExercise.id, sequenceTarget]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        setProgress({ ...initialProgress, ...JSON.parse(stored) });
      }
    } catch {
      setProgress(initialProgress);
    }

    return () => {
      audioRef.current?.close();
    };
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  useEffect(() => {
    setSequenceIndex(0);
  }, [selectedExerciseId]);

  useMidiKeyboardInput({
    enabled: true,
    onNaturalKeyPress: (note) => {
      if (selectedExercise.id === "find-re") {
        answerExercise(solfegeByNote[note]);
      } else if (selectedExercise.id === "five-note-sequence" && sequenceTarget) {
        if (note === sequenceTarget.note) {
          handleScoreNoteSelect({
            measureNumber: sequenceTarget.measureNumber,
            noteIndex: sequenceTarget.noteIndex,
            note,
          });
        } else {
          handleScoreNoteSelect({
            measureNumber: sequenceTarget.measureNumber,
            noteIndex: -1,
            note,
          });
        }
      }
    },
    onSharpKeyPress: () => {},
  });

  function getAudio() {
    if (!audioRef.current) {
      audioRef.current = new PianoAudioEngine();
    }

    return audioRef.current;
  }

  async function playActiveExercise() {
    if (selectedExercise.id === "five-note-sequence") {
      for (const target of sequenceTargets) {
        await getAudio().playNote(target.note, 260);
        await new Promise((resolve) => window.setTimeout(resolve, 90));
      }
      return;
    }

    const note = selectedExercise.activeNotes?.[0];
    if (note) {
      await getAudio().playNote(note, 360);
    }
  }

  function isExerciseUnlocked(index: number) {
    if (index === 0) return true;
    const previousExercise = firstFiveNotesExercises[index - 1];
    return progress.completedIds.includes(previousExercise.id);
  }

  function updateAfterAnswer(isCorrect: boolean, message: string, completedExerciseId?: string) {
    setFeedback(message);
    setProgress((current) => {
      const nextCombo = isCorrect ? current.combo + 1 : 0;
      const completedIds =
        isCorrect && completedExerciseId && !current.completedIds.includes(completedExerciseId)
          ? [...current.completedIds, completedExerciseId]
          : current.completedIds;

      return {
        completedIds,
        score: current.score + (isCorrect ? 100 + Math.floor(nextCombo / 5) * 10 : 0),
        attempts: current.attempts + 1,
        correct: current.correct + (isCorrect ? 1 : 0),
        combo: nextCombo,
        comboMax: Math.max(current.comboMax, nextCombo),
      };
    });
  }

  function answerExercise(answer: string) {
    const isCorrect = answer === selectedExercise.expectedAnswer;
    updateAfterAnswer(
      isCorrect,
      isCorrect
        ? `Correcto: ${answer} es la lectura esperada.`
        : `Revisa la partitura: aquí la respuesta era ${selectedExercise.expectedAnswer}.`,
      selectedExercise.id,
    );
  }

  function handleScoreNoteSelect(selection: ScoreNoteSelection) {
    if (selectedExercise.id === "find-re") {
      answerExercise(solfegeByNote[selection.note]);
      return;
    }

    if (selectedExercise.id !== "five-note-sequence" || !sequenceTarget) {
      return;
    }

    const isCorrect =
      selection.measureNumber === sequenceTarget.measureNumber &&
      selection.noteIndex === sequenceTarget.noteIndex &&
      selection.note === sequenceTarget.note;

    if (!isCorrect) {
      updateAfterAnswer(
        false,
        `Aún no: ahora toca ${sequenceTarget.answer}. Sigue el orden visual de izquierda a derecha.`,
      );
      return;
    }

    const nextIndex = sequenceIndex + 1;

    if (nextIndex >= sequenceTargets.length) {
      setSequenceIndex(0);
      updateAfterAnswer(
        true,
        "Secuencia completa: leíste DO-RE-MI-FA-SOL en orden.",
        selectedExercise.id,
      );
      return;
    }

    setSequenceIndex(nextIndex);
    setFeedback(
      `Bien: ${sequenceTarget.answer}. Ahora sigue con ${sequenceTargets[nextIndex].answer}.`,
    );
    setProgress((current) => ({
      ...current,
      score: current.score + 20,
    }));
  }

  function resetProgress() {
    setProgress(initialProgress);
    setSequenceIndex(0);
    setSelectedExerciseId(firstFiveNotesExercises[0].id);
    setFeedback("Progreso reiniciado. Vuelve a observar antes de responder.");
    window.localStorage.removeItem(storageKey);
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gold-soft">Módulo 1</p>
              <h1 className="mt-2 text-4xl font-bold text-blue-deep sm:text-5xl">{module.name}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
                {module.shortDescription}
              </p>
              <p className="mt-4 max-w-3xl rounded-2xl bg-cream/70 p-4 text-sm font-semibold leading-6 text-blue-deep">
                Este módulo entrena lectura inicial: observa la partitura, identifica dirección,
                reconoce negras y confirma las notas antes de pasar a la lección práctica.
              </p>
            </div>
            <button
              type="button"
              onClick={resetProgress}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Reiniciar módulo
            </button>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            <ModuleMetric
              icon={<Trophy className="h-5 w-5" />}
              label="Score"
              value={`${progress.score}`}
            />
            <ModuleMetric
              icon={<BarChart3 className="h-5 w-5" />}
              label="Precisión"
              value={`${accuracy}%`}
            />
            <ModuleMetric
              icon={<Music2 className="h-5 w-5" />}
              label="Combo"
              value={`${progress.combo}x`}
            />
            <ModuleMetric
              icon={<CheckCircle2 className="h-5 w-5" />}
              label="Progreso"
              value={`${completedCount}/${firstFiveNotesExercises.length}`}
            />
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-blue-deep/10">
            <div
              className="h-full rounded-full bg-gold-soft transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <AppliedLearningPanel
            moduleId={module.id}
            completedCount={completedCount}
            totalCount={firstFiveNotesExercises.length}
            progressPercent={progressPercent}
          />
        </section>

        <section
          id="module-exercises"
          className="mt-6 grid gap-6 scroll-mt-28 lg:grid-cols-[0.86fr_1.64fr]"
        >
          <aside className="space-y-3">
            {firstFiveNotesExercises.map((exercise, index) => (
              <ExerciseProgressCard
                key={exercise.id}
                index={index}
                title={exercise.title}
                description={exercise.description}
                selected={exercise.id === selectedExercise.id}
                unlocked={isExerciseUnlocked(index)}
                completed={progress.completedIds.includes(exercise.id)}
                meta={exercise.meta}
                onSelect={() => setSelectedExerciseId(exercise.id)}
              />
            ))}
          </aside>

          <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4 shadow-soft sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-gold-soft">Ejercicio activo</p>
                <h2 className="mt-2 text-2xl font-bold text-blue-deep">{selectedExercise.title}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                  {selectedExercise.prompt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  void playActiveExercise();
                }}
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
              >
                Escuchar
              </button>
            </div>

            <div className="mt-5">
              <NotationViewer
                score={sourceLesson.score}
                activeNotes={selectedExercise.activeNotes}
                activeMeasure={selectedExercise.activeMeasure}
                activeNotePosition={activeNotePosition}
                onNoteSelect={handleScoreNoteSelect}
              />
            </div>

            {selectedExercise.id === "five-note-sequence" ? (
              <div className="mt-4 rounded-2xl border border-blue-deep/10 bg-ivory p-4">
                <p className="text-sm font-bold text-blue-deep">
                  Nota actual: {sequenceTarget?.answer ?? "secuencia completa"}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Haz click directamente en la partitura. El módulo solo avanza si lees la nota
                  correcta en la posición correcta.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {selectedExercise.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => answerExercise(option)}
                    className="focus-ring min-h-12 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-blue-deep/10 bg-cream/65 p-4">
              <p className="text-sm font-bold leading-6 text-blue-deep">{feedback}</p>
            </div>
          </section>
        </section>

        <NextLessonCard
          currentModuleId={module.id}
          isCompleted={completedCount === firstFiveNotesExercises.length}
        />
      </div>
    </main>
  );
}
