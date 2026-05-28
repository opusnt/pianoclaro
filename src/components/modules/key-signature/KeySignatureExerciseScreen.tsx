"use client";

import { HelpCircle, Play, RotateCcw, SkipForward, Volume2 } from "lucide-react";

import { KeySignatureBadge } from "@/components/modules/key-signature/KeySignatureBadge";
import { KeySignatureFeedback } from "@/components/modules/key-signature/KeySignatureFeedback";
import { KeySignatureKeyboard } from "@/components/modules/key-signature/KeySignatureKeyboard";
import { KeySignatureScorePanel } from "@/components/modules/key-signature/KeySignatureScorePanel";
import { useKeySignatureEngine } from "@/components/modules/key-signature/hooks/useKeySignatureEngine";
import { ExerciseStartPanel } from "@/components/modules/shared/ExerciseStartPanel";
import {
  getCompletedUnits,
} from "@/lib/scale-practice/progress-units";
import {
  getDisplayPitchName,
  getKeyDisplaySequence,
  getKeySignatureById,
  noteToMidi,
} from "@/lib/key-signature/theory";
import type {
  KeySignatureAttempt,
  KeySignatureExercise,
  KeySignatureExerciseProgress,
  KeySignatureQuestion,
} from "@/types/key-signature";

type KeySignatureExerciseScreenProps = {
  exercise: KeySignatureExercise;
  progress?: KeySignatureExerciseProgress;
  onAttemptComplete: (attempt: KeySignatureAttempt) => void;
};

export function KeySignatureExerciseScreen({
  exercise,
  progress,
  onAttemptComplete,
}: KeySignatureExerciseScreenProps) {
  const engine = useKeySignatureEngine({ exercise, progress, onAttemptComplete });
  const isIntro = engine.state === "intro";
  const question = isIntro ? undefined : engine.currentQuestion;
  const key = question ? getKeySignatureById(question.keyId) : undefined;
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
    question?.selectedNoteTargetMidi ?? question?.expectedMidiNotes?.[engine.currentPlayedNotes.length];
  const completedMidiNotes = engine.currentPlayedNotes.map(noteToMidi);
  const routeMidiNotes = question?.expectedMidiNotes ?? key?.midiNotes ?? [];
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
          moduleKind="key-signature"
          title={exercise.title}
          description={exercise.description}
          rounds={exercise.totalRounds}
          assistedMode={engine.assistedMode}
          onStart={engine.startExercise}
        />
      ) : (
        <>
      <div className="mt-5">
        <KeySignatureScorePanel
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

      <div className="mt-5 grid gap-5 min-[1800px]:grid-cols-[minmax(0,1fr)_minmax(21rem,24rem)]">
        <div className="min-w-0 space-y-4">
          <QuestionPanel question={question} />

          <KeySignatureKeyboard
            keyId={question?.keyId}
            tonicMidi={key?.midiNotes[0]}
            expectedMidi={expectedMidi}
            selectedNote={engine.currentAnswer?.selectedNote}
            completedMidiNotes={completedMidiNotes}
            routeMidiNotes={routeMidiNotes}
            showLabels={showLabels}
            disabled={engine.state !== "active" || Boolean(question?.answerOptions) || engine.questionComplete}
            onNotePress={engine.answerWithNote}
          />

          {question?.answerOptions ? (
            <OptionGrid
              question={question}
              selectedOption={engine.currentAnswer?.selectedOption}
              disabled={engine.state !== "active" || Boolean(engine.currentAnswer)}
              onAnswer={engine.answerWithOption}
            />
          ) : null}

          <KeySignatureFeedback message={engine.message} answer={engine.currentAnswer} />
        </div>

        <aside className="grid min-w-0 gap-4 md:grid-cols-3 min-[1800px]:block min-[1800px]:space-y-4">
          {question ? <KeySignatureBadge keyId={question.keyId} /> : null}

          <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
            <p className="text-xs font-bold uppercase text-muted">Controles</p>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={() => void engine.playQuestionAudio()}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
              >
                <Volume2 aria-hidden="true" className="h-4 w-4" />
                <span className="whitespace-nowrap">Repetir sonido</span>
              </button>
              <button
                type="button"
                onClick={() => void engine.playExpectedScale()}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
              >
                <Volume2 aria-hidden="true" className="h-4 w-4" />
                <span className="whitespace-nowrap">Tocar escala</span>
              </button>
              <button
                type="button"
                onClick={engine.revealHint}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
              >
                <HelpCircle aria-hidden="true" className="h-4 w-4" />
                <span className="whitespace-nowrap">Ver notas</span>
              </button>
              <button
                type="button"
                disabled={!engine.questionComplete}
                onClick={engine.nextQuestion}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gold-soft px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-[#caa759] disabled:cursor-not-allowed disabled:opacity-55"
              >
                <SkipForward aria-hidden="true" className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {engine.currentIndex >= engine.questions.length - 1 ? "Finalizar ejercicio" : "Siguiente pregunta"}
                </span>
              </button>
            </div>
          </div>

          {key ? <KeySummary keyId={key.id} /> : null}
        </aside>
      </div>
        </>
      )}
    </section>
  );
}

function QuestionPanel({ question }: { question?: KeySignatureQuestion }) {
  const key = question ? getKeySignatureById(question.keyId) : undefined;

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-5">
      <p className="text-xs font-bold uppercase text-muted">Pregunta</p>
      <h3 className="mt-2 text-2xl font-bold text-blue-deep">
        {question ? question.prompt : "Pulsa iniciar para comenzar"}
      </h3>
      {question && key ? (
        <div className="mt-4 grid gap-3 text-sm font-semibold text-muted sm:grid-cols-3">
          <p><span className="font-bold text-blue-deep">Tonalidad:</span> {key.displayName}</p>
          <p><span className="font-bold text-blue-deep">Tónica:</span> {getDisplayPitchName(key.tonic)}</p>
          <p>
            <span className="font-bold text-blue-deep">Armadura:</span>{" "}
            {key.accidentals.length ? key.accidentals.map(getDisplayPitchName).join(", ") : "ninguna"}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function OptionGrid({
  question,
  selectedOption,
  disabled,
  onAnswer,
}: {
  question: KeySignatureQuestion;
  selectedOption?: string;
  disabled: boolean;
  onAnswer: (option: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
      <p className="text-xs font-bold uppercase text-muted">Respuesta</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {question.answerOptions?.map((option) => {
          const expected = Array.isArray(question.expectedAnswer)
            ? question.expectedAnswer.join(" y ")
            : question.expectedAnswer;
          const isSelected = option === selectedOption;
          const isExpected = Boolean(selectedOption) && option === expected;

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

function KeySummary({ keyId }: { keyId: string }) {
  const key = getKeySignatureById(keyId);
  if (!key) return null;

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <p className="text-xs font-bold uppercase text-muted">Familia de notas</p>
      <p className="mt-2 text-lg font-bold text-blue-deep">{key.displayName}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-muted">{getKeyDisplaySequence(key)}</p>
      <p className="mt-3 text-xs font-bold text-blue-deep">
        Una armadura afecta todas las notas con ese nombre durante la pieza.
      </p>
    </div>
  );
}
