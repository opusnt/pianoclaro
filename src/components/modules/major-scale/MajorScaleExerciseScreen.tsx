"use client";

import {
  Eye,
  HelpCircle,
  Play,
  RotateCcw,
  SkipForward,
  Volume2,
} from "lucide-react";

import { MajorScaleFeedback } from "@/components/modules/major-scale/MajorScaleFeedback";
import { MajorScaleKeyboard } from "@/components/modules/major-scale/MajorScaleKeyboard";
import { MajorScalePattern } from "@/components/modules/major-scale/MajorScalePattern";
import { MajorScaleScorePanel } from "@/components/modules/major-scale/MajorScaleScorePanel";
import { useMajorScaleEngine } from "@/components/modules/major-scale/hooks/useMajorScaleEngine";
import { ExerciseStartPanel } from "@/components/modules/shared/ExerciseStartPanel";
import {
  getDisplayPitchName,
  getScaleById,
  getScaleDisplaySequence,
  noteToMidi,
} from "@/lib/major-scale/theory";
import {
  getCompletedScaleStepCount,
  getCompletedUnits,
  getCurrentScaleStepIndex,
} from "@/lib/scale-practice/progress-units";
import type {
  MajorScaleAttempt,
  MajorScaleExercise,
  MajorScaleExerciseProgress,
  ScaleQuestion,
} from "@/types/major-scale";

type MajorScaleExerciseScreenProps = {
  exercise: MajorScaleExercise;
  progress?: MajorScaleExerciseProgress;
  onAttemptComplete: (attempt: MajorScaleAttempt) => void;
};

export function MajorScaleExerciseScreen({
  exercise,
  progress,
  onAttemptComplete,
}: MajorScaleExerciseScreenProps) {
  const engine = useMajorScaleEngine({
    exercise,
    progress,
    onAttemptComplete,
  });
  const isIntro = engine.state === "intro";
  const question = isIntro ? undefined : engine.currentQuestion;
  const scale = question ? getScaleById(question.scaleId) : undefined;
  const currentProgressUnits = getCompletedUnits({
    questions: engine.questions,
    currentIndex: engine.currentIndex,
    currentQuestion: question,
    currentPlayedNotes: engine.currentPlayedNotes,
    currentAnswer: engine.currentAnswer,
  });
  const progressLabel = `${Math.min(currentProgressUnits, engine.totalUnits)}/${engine.totalUnits}`;
  const progressPercent =
    engine.totalUnits > 0 ? Math.min(100, (currentProgressUnits / engine.totalUnits) * 100) : 0;
  const expectedMidi = question?.expectedMidiNotes?.[engine.currentPlayedNotes.length];
  const completedMidiNotes = engine.currentPlayedNotes.map(noteToMidi);
  const routeMidiNotes = question?.expectedMidiNotes ?? scale?.midiNotes ?? [];
  const currentStepIndex = getCurrentScaleStepIndex({
    expectedMidiNotes: question?.expectedMidiNotes,
    tonicMidi: scale?.midiNotes[0],
    playedCount: engine.currentPlayedNotes.length,
  });
  const completedSteps = getCompletedScaleStepCount({
    expectedMidiNotes: question?.expectedMidiNotes,
    tonicMidi: scale?.midiNotes[0],
    playedCount: engine.currentPlayedNotes.length,
  });
  const showLabels =
    exercise.showNoteLabels || engine.helpUsed || engine.assistedMode;

  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-gold-soft">Ejercicio activo</p>
          <h2 className="mt-1 text-3xl font-bold text-blue-deep">{exercise.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{exercise.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {engine.isComplete ? (
            <button
              type="button"
              onClick={engine.startExercise}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
            >
              <Play aria-hidden="true" className="h-4 w-4" />
              Reintentar
            </button>
          ) : null}
          <button
            type="button"
            onClick={engine.resetExercise}
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Reiniciar
          </button>
        </div>
      </div>

      {isIntro ? (
        <ExerciseStartPanel
          moduleKind="major-scale"
          title={exercise.title}
          description={exercise.description}
          rounds={exercise.totalRounds}
          assistedMode={engine.assistedMode}
          onStart={engine.startExercise}
        />
      ) : (
        <>
      <div className="mt-5">
        <MajorScaleScorePanel
          score={engine.scoring.score}
          accuracy={engine.scoring.accuracy}
          combo={engine.scoring.combo}
          comboMax={engine.scoring.comboMax}
          progressLabel={progressLabel}
        />
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-blue-deep/10">
        <div className="h-full rounded-full bg-gold-soft transition-all" style={{ width: `${progressPercent}%` }} />
      </div>

      <MajorScaleExerciseGuide type={exercise.type} />

      <div className="mt-5 grid gap-5 min-[1800px]:grid-cols-[minmax(0,1fr)_minmax(21rem,24rem)]">
        <div className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-5">
            <p className="text-xs font-bold uppercase text-muted">Pregunta</p>
            <h3 className="mt-2 text-2xl font-bold text-blue-deep">
              {question ? question.prompt : "Pulsa iniciar para comenzar"}
            </h3>
            {question && scale ? (
              <div className="mt-4 grid gap-3 text-sm font-semibold text-muted sm:grid-cols-3">
                <p>
                  <span className="block text-xs font-bold uppercase text-gold-soft">Escala</span>
                  {scale.displayName}
                </p>
                <p>
                  <span className="block text-xs font-bold uppercase text-gold-soft">Tónica</span>
                  {getDisplayPitchName(question.tonic)}
                </p>
                <p>
                  <span className="block text-xs font-bold uppercase text-gold-soft">Fórmula</span>
                  T - T - S - T - T - T - S
                </p>
              </div>
            ) : null}
          </div>

          <MajorScalePattern currentStepIndex={currentStepIndex} completedSteps={completedSteps} />

          {question?.answerOptions ? (
            <AnswerOptions
              question={question}
              selectedOption={engine.currentAnswer?.selectedOption}
              expectedAnswer={engine.currentAnswer?.expectedAnswer}
              isAnswered={Boolean(engine.currentAnswer)}
              disabled={engine.state !== "active" || Boolean(engine.currentAnswer)}
              onAnswer={engine.answerWithOption}
            />
          ) : null}

          {question?.missingNoteIndex !== undefined && scale ? (
            <MissingNotePreview question={question} />
          ) : null}

          {question?.expectedNotes ? (
            <MajorScaleKeyboard
              tonicMidi={scale?.midiNotes[0]}
              expectedMidi={expectedMidi}
              selectedNote={engine.currentAnswer?.selectedNote}
              completedMidiNotes={completedMidiNotes}
              routeMidiNotes={routeMidiNotes}
              showLabels={showLabels}
              disabled={engine.state !== "active" || engine.questionComplete}
              onNotePress={engine.answerWithNote}
            />
          ) : scale ? (
            <ScaleSummary scaleId={scale.id} />
          ) : null}
        </div>

        <aside className="grid min-w-0 gap-4 md:grid-cols-2 min-[1800px]:block min-[1800px]:space-y-4">
          <MajorScaleFeedback message={engine.message} answer={engine.currentAnswer} />

          <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
            <p className="text-xs font-bold uppercase text-muted">Controles</p>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={() => void engine.playQuestionAudio()}
                disabled={!question || !exercise.allowReplay}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-deep px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Volume2 aria-hidden="true" className="h-4 w-4" />
                Reproducir sonido
              </button>
              <button
                type="button"
                onClick={() => void engine.playExpectedScale()}
                disabled={!question || !exercise.allowReplay}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Volume2 aria-hidden="true" className="h-4 w-4" />
                Escala correcta
              </button>
              <button
                type="button"
                onClick={engine.revealHint}
                disabled={!question || !exercise.allowHints || Boolean(engine.currentAnswer)}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Eye aria-hidden="true" className="h-4 w-4" />
                Ver notas
              </button>
              <button
                type="button"
                onClick={engine.nextQuestion}
                disabled={!engine.questionComplete}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gold-soft px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-[#cda85d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SkipForward aria-hidden="true" className="h-4 w-4" />
                {engine.currentIndex >= engine.questions.length - 1 ? "Finalizar ejercicio" : "Siguiente pregunta"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
            <p className="text-xs font-bold uppercase text-muted">Idea clave</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-blue-deep">
              Una escala mayor no se memoriza como lista: se construye con T - T - S - T - T - T - S.
            </p>
          </div>

          {progress?.weakestScales.length || progress?.weakestSteps.length ? (
            <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
              <p className="text-xs font-bold uppercase text-muted">A reforzar</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {progress.weakestScales.map((scaleName) => (
                  <span key={scaleName} className="rounded-xl bg-cream px-3 py-2 text-xs font-bold text-blue-deep">
                    {scaleName}
                  </span>
                ))}
                {progress.weakestSteps.map((step) => (
                  <span key={step} className="rounded-xl bg-blue-soft/40 px-3 py-2 text-xs font-bold text-blue-deep">
                    Paso {step + 1}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
        </>
      )}
    </section>
  );
}

function MajorScaleExerciseGuide({ type }: { type: MajorScaleExercise["type"] }) {
  const copy: Record<MajorScaleExercise["type"], [string, string, string]> = {
    discover_pattern: [
      "Empieza en la tónica iluminada.",
      "Lee el bloque actual: tono o semitono.",
      "Avanza 2 teclas para tono y 1 tecla para semitono.",
    ],
    play_c_major: [
      "Toca DO mayor como una escalera ascendente.",
      "Sigue solo teclas blancas: DO RE MI FA SOL LA SI DO.",
      "No avances si una nota no corresponde.",
    ],
    ascending_descending: [
      "Sube hasta la octava sin saltarte notas.",
      "Luego vuelve por el mismo camino en sentido contrario.",
      "Mantén continuidad: cada nota prepara la siguiente.",
    ],
    missing_note: [
      "Mira la escala incompleta.",
      "Identifica qué posición quedó vacía.",
      "Responde con la nota que conserva el patrón mayor.",
    ],
    build_from_tonic: [
      "No memorices la lista de notas.",
      "Aplica T - T - S - T - T - T - S desde la tónica.",
      "Cada respuesta correcta construye la ruta de la escala.",
    ],
    audio_recognition: [
      "Escucha la escala completa.",
      "Decide si conserva el sonido estable de escala mayor.",
      "Si algo suena fuera, piensa en una nota interna alterada.",
    ],
    final_challenge: [
      "Identifica el tipo de tarea antes de responder.",
      "Usa tónica, patrón y octava como referencias.",
      "Construye o reconoce sin depender siempre de las etiquetas.",
    ],
  };

  return (
    <div className="mt-5 grid gap-3 rounded-2xl border border-blue-deep/10 bg-ivory p-3 md:grid-cols-3">
      {copy[type].map((step, index) => (
        <div key={step} className="rounded-xl border border-blue-deep/10 bg-white/75 p-3">
          <p className="text-xs font-black uppercase text-gold-soft">Paso {index + 1}</p>
          <p className="mt-1 text-sm font-bold leading-6 text-blue-deep">{step}</p>
        </div>
      ))}
    </div>
  );
}

function AnswerOptions({
  question,
  selectedOption,
  expectedAnswer,
  isAnswered,
  disabled,
  onAnswer,
}: {
  question: ScaleQuestion;
  selectedOption?: string;
  expectedAnswer?: string | string[];
  isAnswered: boolean;
  disabled: boolean;
  onAnswer: (option: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <p className="text-xs font-bold uppercase text-muted">
        {question.mode === "audio" ? "Respuesta auditiva" : "Elige la nota"}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {question.answerOptions?.map((option) => {
          const isSelected = selectedOption === option;
          const isExpected = isAnswered && expectedAnswer === option;

          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onAnswer(option)}
              className={`focus-ring min-h-14 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                isSelected && !isExpected
                  ? "border-red-400 bg-red-50 text-red-950"
                  : isSelected || isExpected
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                    : "border-blue-deep/10 bg-white text-blue-deep hover:bg-blue-soft/35 disabled:opacity-60"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MissingNotePreview({ question }: { question: ScaleQuestion }) {
  const scale = getScaleById(question.scaleId);

  if (!scale || typeof question.missingNoteIndex !== "number") {
    return null;
  }

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
      <p className="text-xs font-bold uppercase text-muted">Escala incompleta</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {scale.notes.map((note, index) => (
          <span
            key={`${note}-${index}`}
            className={`rounded-xl px-3 py-2 text-sm font-bold ${
              index === question.missingNoteIndex
                ? "border border-dashed border-gold-soft bg-cream text-blue-deep"
                : "bg-ivory text-muted"
            }`}
          >
            {index === question.missingNoteIndex ? "?" : getDisplayPitchName(note)}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScaleSummary({ scaleId }: { scaleId: string }) {
  const scale = getScaleById(scaleId);

  if (!scale) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <div className="flex items-start gap-3">
        <HelpCircle aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-gold-soft" />
        <div>
          <p className="text-xs font-bold uppercase text-muted">Referencia visual</p>
          <p className="mt-2 text-lg font-bold text-blue-deep">{scale.displayName}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            {getScaleDisplaySequence(scale)}
          </p>
        </div>
      </div>
    </div>
  );
}
