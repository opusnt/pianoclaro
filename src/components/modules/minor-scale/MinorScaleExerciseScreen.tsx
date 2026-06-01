"use client";

import { Eye, HelpCircle, Play, RotateCcw, SkipForward, Volume2 } from "lucide-react";
import { useMinorScaleEngine } from "@/components/modules/minor-scale/hooks/useMinorScaleEngine";
import { MinorScaleFeedback } from "@/components/modules/minor-scale/MinorScaleFeedback";
import { MinorScaleKeyboard } from "@/components/modules/minor-scale/MinorScaleKeyboard";
import { MinorScalePattern } from "@/components/modules/minor-scale/MinorScalePattern";
import { MinorScaleScorePanel } from "@/components/modules/minor-scale/MinorScaleScorePanel";
import { ExerciseStartPanel } from "@/components/modules/shared/ExerciseStartPanel";
import {
  getDisplayPitchName,
  getMinorScaleById,
  getMinorScaleDisplaySequence,
  getScaleTypeLabel,
  noteToMidi,
} from "@/lib/minor-scale/theory";
import {
  getCompletedScaleStepCount,
  getCompletedUnits,
  getCurrentScaleStepIndex,
} from "@/lib/scale-practice/progress-units";
import type {
  MinorScaleAttempt,
  MinorScaleExercise,
  MinorScaleExerciseProgress,
  MinorScaleQuestion,
} from "@/types/minor-scale";

type MinorScaleExerciseScreenProps = {
  exercise: MinorScaleExercise;
  progress?: MinorScaleExerciseProgress;
  onAttemptComplete: (attempt: MinorScaleAttempt) => void;
};

export function MinorScaleExerciseScreen({
  exercise,
  progress,
  onAttemptComplete,
}: MinorScaleExerciseScreenProps) {
  const engine = useMinorScaleEngine({ exercise, progress, onAttemptComplete });
  const isIntro = engine.state === "intro";
  const question = isIntro ? undefined : engine.currentQuestion;
  const scale = question ? getMinorScaleById(question.scaleId) : undefined;
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
  const expectedMidi =
    question?.selectedNoteTargetMidi ??
    question?.expectedMidiNotes?.[engine.currentPlayedNotes.length];
  const completedMidiNotes = engine.currentPlayedNotes.map(noteToMidi);
  const routeMidiNotes = question?.expectedMidiNotes ?? scale?.midiNotes ?? [];
  const differenceMidiNotes = getDifferenceMidiNotes(question);
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
  const showLabels = exercise.showNoteLabels || engine.helpUsed || engine.assistedMode;

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
          moduleKind="minor-scale"
          title={exercise.title}
          description={exercise.description}
          rounds={exercise.totalRounds}
          assistedMode={engine.assistedMode}
          onStart={engine.startExercise}
        />
      ) : (
        <>
          <div className="mt-5">
            <MinorScaleScorePanel
              score={engine.scoring.score}
              accuracy={engine.scoring.accuracy}
              combo={engine.scoring.combo}
              comboMax={engine.scoring.comboMax}
              progressLabel={progressLabel}
            />
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-blue-deep/10">
            <div
              className="h-full rounded-full bg-gold-soft transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <MinorScaleExerciseGuide type={exercise.type} />

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
                      <span className="block text-xs font-bold uppercase text-gold-soft">
                        Escala
                      </span>
                      {scale.displayName}
                    </p>
                    <p>
                      <span className="block text-xs font-bold uppercase text-gold-soft">
                        Tónica
                      </span>
                      {getDisplayPitchName(question.tonic)}
                    </p>
                    <p>
                      <span className="block text-xs font-bold uppercase text-gold-soft">Tipo</span>
                      {getScaleTypeLabel(question.scaleType)}
                    </p>
                  </div>
                ) : null}
              </div>

              <MinorScalePattern
                scaleType={question?.scaleType ?? "natural"}
                currentStepIndex={currentStepIndex}
                completedSteps={completedSteps}
              />

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

              {question?.expectedNotes || question?.selectedNoteTargetMidi ? (
                <MinorScaleKeyboard
                  tonicMidi={scale?.midiNotes[0]}
                  expectedMidi={expectedMidi}
                  selectedNote={engine.currentAnswer?.selectedNote}
                  completedMidiNotes={completedMidiNotes}
                  routeMidiNotes={routeMidiNotes}
                  differenceMidiNotes={differenceMidiNotes}
                  showLabels={showLabels}
                  disabled={engine.state !== "active" || engine.questionComplete}
                  onNotePress={engine.answerWithNote}
                />
              ) : scale ? (
                <ScaleSummary scaleId={scale.id} differenceMidiNotes={differenceMidiNotes} />
              ) : null}
            </div>

            <aside className="grid min-w-0 gap-4 md:grid-cols-2 min-[1800px]:block min-[1800px]:space-y-4">
              <MinorScaleFeedback message={engine.message} answer={engine.currentAnswer} />

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
                    Escala menor
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
                    {engine.currentIndex >= engine.questions.length - 1
                      ? "Finalizar ejercicio"
                      : "Siguiente pregunta"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
                <p className="text-xs font-bold uppercase text-muted">Idea clave</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-blue-deep">
                  En menor natural la tercera nota baja un semitono respecto de la escala mayor.
                </p>
              </div>

              {progress?.weakestScales.length ||
              progress?.weakestSteps.length ||
              progress?.weakestScaleTypes.length ? (
                <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
                  <p className="text-xs font-bold uppercase text-muted">A reforzar</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {progress.weakestScales.map((scaleName) => (
                      <span
                        key={scaleName}
                        className="rounded-xl bg-cream px-3 py-2 text-xs font-bold text-blue-deep"
                      >
                        {scaleName}
                      </span>
                    ))}
                    {progress.weakestSteps.map((step) => (
                      <span
                        key={step}
                        className="rounded-xl bg-blue-soft/40 px-3 py-2 text-xs font-bold text-blue-deep"
                      >
                        Paso {step + 1}
                      </span>
                    ))}
                    {progress.weakestScaleTypes.map((scaleType) => (
                      <span
                        key={scaleType}
                        className="rounded-xl bg-purple-50 px-3 py-2 text-xs font-bold text-purple-900"
                      >
                        {getScaleTypeLabel(scaleType)}
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

function MinorScaleExerciseGuide({ type }: { type: MinorScaleExercise["type"] }) {
  const copy: Record<MinorScaleExercise["type"], [string, string, string]> = {
    major_vs_minor: [
      "Escucha primero la escala mayor.",
      "Luego escucha la menor y compara la tercera nota.",
      "Responde por diferencia sonora y visual, no por memoria aislada.",
    ],
    discover_natural_pattern: [
      "Parte desde LA como tónica.",
      "Sigue T - S - T - T - S - T - T.",
      "Avanza 2 teclas en tono y 1 tecla en semitono.",
    ],
    play_a_minor_natural: [
      "Toca LA menor natural como una ruta completa.",
      "La secuencia usa LA SI DO RE MI FA SOL LA.",
      "Completa la octava antes de pasar de ronda.",
    ],
    build_natural_from_tonic: [
      "Identifica la tónica de la ronda.",
      "Aplica el patrón menor natural desde esa nota.",
      "Fíjate especialmente en los semitonos.",
    ],
    missing_note: [
      "Mira la escala menor incompleta.",
      "Ubica qué grado falta.",
      "Elige la nota que mantiene el tipo menor correcto.",
    ],
    natural_vs_harmonic: [
      "Compara menor natural con menor armónica.",
      "Observa el séptimo grado: ahí aparece el cambio.",
      "Toca o elige la nota elevada cuando corresponda.",
    ],
    natural_vs_melodic: [
      "Compara menor natural con melódica ascendente.",
      "Observa sexto y séptimo grado.",
      "Recuerda que en este módulo la melódica se usa solo al subir.",
    ],
    final_challenge: [
      "Identifica si la ronda compara, construye o completa.",
      "Usa el tipo de escala para decidir qué patrón aplica.",
      "Responde con atención a las notas que cambian.",
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
  question: MinorScaleQuestion;
  selectedOption?: string;
  expectedAnswer?: string | string[];
  isAnswered: boolean;
  disabled: boolean;
  onAnswer: (option: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <p className="text-xs font-bold uppercase text-muted">
        {question.mode === "audio" ? "Respuesta auditiva" : "Elige la respuesta"}
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

function MissingNotePreview({ question }: { question: MinorScaleQuestion }) {
  const scale = getMinorScaleById(question.scaleId);

  if (!scale || typeof question.missingNoteIndex !== "number") return null;

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

function ScaleSummary({
  scaleId,
  differenceMidiNotes,
}: {
  scaleId: string;
  differenceMidiNotes: number[];
}) {
  const scale = getMinorScaleById(scaleId);

  if (!scale) return null;

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <div className="flex items-start gap-3">
        <HelpCircle aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-gold-soft" />
        <div>
          <p className="text-xs font-bold uppercase text-muted">Referencia visual</p>
          <p className="mt-2 text-lg font-bold text-blue-deep">{scale.displayName}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            {getMinorScaleDisplaySequence(scale)}
          </p>
          {differenceMidiNotes.length ? (
            <p className="mt-2 text-xs font-bold text-purple-900">
              Las notas marcadas muestran dónde cambia respecto de la comparación.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function getDifferenceMidiNotes(question?: MinorScaleQuestion) {
  const scale = question ? getMinorScaleById(question.scaleId) : undefined;

  if (!scale || !question?.highlightedDifferenceIndexes?.length) return [];

  return question.highlightedDifferenceIndexes
    .map((index) => scale.midiNotes[index])
    .filter((midi): midi is number => typeof midi === "number");
}
