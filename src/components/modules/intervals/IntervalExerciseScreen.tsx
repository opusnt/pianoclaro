"use client";

import { Eye, Headphones, Play, RotateCcw, SkipForward, Volume2 } from "lucide-react";

import { IntervalFeedback } from "@/components/modules/intervals/IntervalFeedback";
import { IntervalKeyboard } from "@/components/modules/intervals/IntervalKeyboard";
import { IntervalScorePanel } from "@/components/modules/intervals/IntervalScorePanel";
import { useIntervalEngine } from "@/components/modules/intervals/hooks/useIntervalEngine";
import { getIntervalName, getNoteLabel } from "@/lib/intervals/theory";
import type {
  IntervalAttempt,
  IntervalExercise,
  IntervalExerciseProgress,
} from "@/types/intervals";

type IntervalExerciseScreenProps = {
  exercise: IntervalExercise;
  progress?: IntervalExerciseProgress;
  onAttemptComplete: (attempt: IntervalAttempt) => void;
};

export function IntervalExerciseScreen({
  exercise,
  progress,
  onAttemptComplete,
}: IntervalExerciseScreenProps) {
  const engine = useIntervalEngine({
    exercise,
    progress,
    onAttemptComplete,
  });
  const question = engine.currentQuestion;
  const progressLabel = question
    ? `${Math.min(engine.currentIndex + 1, engine.questions.length)}/${engine.questions.length}`
    : `0/${exercise.totalRounds}`;
  const answeredNote = engine.currentAnswer?.selectedNote;
  const showKeyboard = question && !question.answerOptions;
  const showLabels = engine.assistedMode || engine.showHint || Boolean(engine.currentAnswer);

  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-gold-soft">Ejercicio activo</p>
          <h2 className="mt-1 text-3xl font-bold text-blue-deep">{exercise.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{exercise.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {engine.state === "intro" || engine.isComplete ? (
            <button
              type="button"
              onClick={engine.startExercise}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949]"
            >
              <Play aria-hidden="true" className="h-4 w-4" />
              {engine.isComplete ? "Reintentar" : "Iniciar"}
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

      <div className="mt-5">
        <IntervalScorePanel
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
          style={{ width: `${engine.questions.length > 0 ? ((engine.currentIndex + (engine.currentAnswer ? 1 : 0)) / engine.questions.length) * 100 : 0}%` }}
        />
      </div>

      <div className="mt-5 grid gap-5 min-[1800px]:grid-cols-[minmax(0,1fr)_minmax(21rem,24rem)]">
        <div className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-5">
            <p className="text-xs font-bold uppercase text-muted">Pregunta</p>
            <h3 className="mt-2 text-2xl font-bold text-blue-deep">
              {question ? question.prompt : "Pulsa iniciar para comenzar"}
            </h3>
            {question ? (
              <div className="mt-4 grid gap-3 text-sm font-semibold text-muted sm:grid-cols-3">
                <p>
                  <span className="block text-xs font-bold uppercase text-gold-soft">Nota base</span>
                  {getNoteLabel(question.baseNote)}
                </p>
                <p>
                  <span className="block text-xs font-bold uppercase text-gold-soft">Intervalo</span>
                  {getIntervalName(question.intervalSemitones)}
                </p>
                <p>
                  <span className="block text-xs font-bold uppercase text-gold-soft">Modo</span>
                  {question.mode === "visual" ? "visual" : question.mode === "audio" ? "audio" : "mixto"}
                </p>
              </div>
            ) : null}
          </div>

          {showKeyboard ? (
            <IntervalKeyboard
              baseNote={question.baseNote}
              targetNote={question.targetNote}
              selectedNote={answeredNote}
              isCorrect={engine.currentAnswer?.isCorrect}
              showLabels={showLabels}
              disabled={engine.state !== "active" || Boolean(engine.currentAnswer)}
              onNotePress={engine.answerWithNote}
            />
          ) : null}

          {question?.answerOptions ? (
            <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
              <p className="text-xs font-bold uppercase text-muted">Respuesta</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {question.answerOptions.map((option) => {
                  const isSelected = engine.currentAnswer?.selectedOption === option;
                  const isExpected = engine.currentAnswer?.expectedAnswer === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={engine.state !== "active" || Boolean(engine.currentAnswer)}
                      onClick={() => engine.answerWithOption(option)}
                      className={`focus-ring min-h-14 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                        isSelected && engine.currentAnswer?.isCorrect === false
                          ? "border-red-400 bg-red-50 text-red-950"
                          : (isSelected && engine.currentAnswer?.isCorrect) || isExpected
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
          ) : null}
        </div>

        <aside className="grid min-w-0 gap-4 md:grid-cols-2 min-[1800px]:block min-[1800px]:space-y-4">
          <IntervalFeedback message={engine.message} answer={engine.currentAnswer} />

          <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
            <p className="text-xs font-bold uppercase text-muted">Controles</p>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={engine.playQuestion}
                disabled={!question?.targetNote}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-deep px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0d2949] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Volume2 aria-hidden="true" className="h-4 w-4" />
                Reproducir ejemplo
              </button>
              <button
                type="button"
                onClick={engine.playBaseNote}
                disabled={!question}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Headphones aria-hidden="true" className="h-4 w-4" />
                Escuchar base
              </button>
              <button
                type="button"
                onClick={engine.revealHint}
                disabled={!question || Boolean(engine.currentAnswer)}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Eye aria-hidden="true" className="h-4 w-4" />
                Mostrar pista
              </button>
              <button
                type="button"
                onClick={engine.nextQuestion}
                disabled={!engine.currentAnswer}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gold-soft px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-[#cda85d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SkipForward aria-hidden="true" className="h-4 w-4" />
                {engine.currentIndex >= engine.questions.length - 1 ? "Finalizar" : "Siguiente"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-4">
            <p className="text-xs font-bold uppercase text-muted">Idea clave</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-blue-deep">
              La música se mueve por distancias. Derecha = más agudo; izquierda = más grave.
            </p>
          </div>

          {progress?.weakestIntervals.length ? (
            <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
              <p className="text-xs font-bold uppercase text-muted">A reforzar</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {progress.weakestIntervals.map((interval) => (
                  <span
                    key={interval}
                    className="rounded-xl bg-cream px-3 py-2 text-xs font-bold text-blue-deep"
                  >
                    {interval}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
