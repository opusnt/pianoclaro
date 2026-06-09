"use client";

import { Eye, Headphones, Play, RotateCcw, SkipForward, Volume2 } from "lucide-react";
import { useIntervalEngine } from "@/components/modules/intervals/hooks/useIntervalEngine";
import { IntervalFeedback } from "@/components/modules/intervals/IntervalFeedback";
import { IntervalKeyboard } from "@/components/modules/intervals/IntervalKeyboard";
import { IntervalScorePanel } from "@/components/modules/intervals/IntervalScorePanel";
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
  const isIntro = engine.state === "intro";
  const question = isIntro ? undefined : engine.currentQuestion;
  const progressLabel = question
    ? `${Math.min(engine.currentIndex + 1, engine.questions.length)}/${engine.questions.length}`
    : `0/${exercise.totalRounds}`;
  const answeredNote = engine.currentAnswer?.selectedNote;
  const showKeyboard = question && !question.answerOptions;
  const showLabels = engine.assistedMode || engine.showHint;

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
        <IntervalStartPanel
          type={exercise.type}
          rounds={exercise.totalRounds}
          assistedMode={engine.assistedMode}
          onStart={engine.startExercise}
        />
      ) : (
        <>
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
              style={{
                width: `${engine.questions.length > 0 ? ((engine.currentIndex + (engine.currentAnswer ? 1 : 0)) / engine.questions.length) * 100 : 0}%`,
              }}
            />
          </div>

          <IntervalExerciseGuide type={exercise.type} />

          <div className="mt-5 grid gap-5 min-[1800px]:grid-cols-[minmax(0,1fr)_minmax(21rem,24rem)]">
            <div className="min-w-0 space-y-4">
              <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-5">
                <p className="text-xs font-bold uppercase text-muted">Pregunta</p>
                {question ? (
                  <>
                    <h3 className="mt-2 text-2xl font-bold text-blue-deep">{question.prompt}</h3>
                    <div className="mt-4 grid gap-3 text-sm font-semibold text-muted sm:grid-cols-3">
                      <p>
                        <span className="block text-xs font-bold uppercase text-gold-soft">
                          Nota base
                        </span>
                        {getNoteLabel(question.baseNote)}
                      </p>
                      <p>
                        <span className="block text-xs font-bold uppercase text-gold-soft">
                          Intervalo
                        </span>
                        {getIntervalName(question.intervalSemitones)}
                      </p>
                      <p>
                        <span className="block text-xs font-bold uppercase text-gold-soft">
                          Modo
                        </span>
                        {question.mode === "visual"
                          ? "visual"
                          : question.mode === "audio"
                            ? "audio"
                            : "mixto"}
                      </p>
                    </div>
                  </>
                ) : (
                  <h3 className="mt-2 text-2xl font-bold text-blue-deep">Ejercicio terminado.</h3>
                )}
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
                          type="button"
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
                    Ver notas
                  </button>
                  <button
                    type="button"
                    onClick={engine.nextQuestion}
                    disabled={!engine.currentAnswer}
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
        </>
      )}
    </section>
  );
}

function IntervalStartPanel({
  type,
  rounds,
  assistedMode,
  onStart,
}: {
  type: IntervalExercise["type"];
  rounds: number;
  assistedMode: boolean;
  onStart: () => void;
}) {
  const copy = getIntervalStartCopy(type);

  return (
    <div className="mt-6 rounded-3xl border border-blue-deep/10 bg-ivory p-5 sm:p-6">
      <div className="grid gap-5 min-[1200px]:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <p className="text-xs font-black uppercase text-gold-soft">Antes de practicar</p>
          <h3 className="mt-2 text-3xl font-black leading-tight text-blue-deep">{copy.title}</h3>
          <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-muted">{copy.body}</p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4"
              >
                <p className="text-xs font-black uppercase text-gold-soft">Paso {index + 1}</p>
                <h4 className="mt-2 text-sm font-black text-blue-deep">{step.title}</h4>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
          <p className="text-xs font-black uppercase text-muted">Práctica</p>
          <p className="mt-2 text-3xl font-black text-blue-deep">{rounds}</p>
          <p className="text-sm font-bold text-muted">rondas cortas</p>
          <div className="mt-4 rounded-2xl bg-blue-soft/35 p-3 text-sm font-bold leading-6 text-blue-deep">
            {assistedMode
              ? "Modo ayuda activo: verás más pistas porque tu último intento fue difícil."
              : copy.tip}
          </div>
          <button
            type="button"
            onClick={onStart}
            className="focus-ring mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-black text-white transition hover:bg-[#0d2949]"
          >
            <Play aria-hidden="true" className="h-4 w-4" />
            Iniciar lección
          </button>
        </aside>
      </div>
    </div>
  );
}

function getIntervalStartCopy(type: IntervalExercise["type"]) {
  const copy: Record<
    IntervalExercise["type"],
    {
      title: string;
      body: string;
      tip: string;
      steps: Array<{ title: string; text: string }>;
    }
  > = {
    semitone_distance: {
      title: "Un intervalo empieza como una distancia entre teclas.",
      body: "En esta lección no necesitas leer partituras ni memorizar nombres complejos. Solo vas a comprobar que cada tecla vecina, blanca o negra, está a 1 semitono.",
      tip: "Objetivo: sentir la distancia mínima del piano.",
      steps: [
        { title: "Ubica la base", text: "La nota azul es tu punto de partida." },
        { title: "Mira el vecino", text: "La tecla inmediata al lado es el siguiente semitono." },
        { title: "Toca destino", text: "Responde solo cuando la pregunta aparezca." },
      ],
    },
    find_interval: {
      title: "Ahora vas a construir una distancia exacta.",
      body: "La pregunta te dirá cuántos semitonos avanzar desde una nota base. Cuenta cada tecla consecutiva hasta llegar a la nota destino.",
      tip: "Objetivo: contar semitonos sin perder la nota base.",
      steps: [
        { title: "Lee la distancia", text: "1, 2, 3 o más semitonos." },
        { title: "Cuenta teclas", text: "Cada tecla vecina suma un paso." },
        { title: "Toca la llegada", text: "No toques las notas intermedias." },
      ],
    },
    direction_recognition: {
      title: "Vas a escuchar si la música sube o baja.",
      body: "Escucharás dos notas. No importa cómo se llaman: importa si la segunda queda más aguda, más grave o igual.",
      tip: "Objetivo: conectar oído con dirección en el teclado.",
      steps: [
        { title: "Escucha la primera", text: "Es la referencia." },
        { title: "Compara la segunda", text: "Decide si sube, baja o se mantiene." },
        { title: "Elige dirección", text: "Responde antes de pensar en nombres." },
      ],
    },
    melodic_vs_harmonic: {
      title: "Un intervalo puede sonar separado o junto.",
      body: "Si las dos notas suenan una después de otra, es melódico. Si suenan al mismo tiempo, es armónico.",
      tip: "Objetivo: distinguir secuencia versus simultaneidad.",
      steps: [
        { title: "Escucha el ataque", text: "Fíjate si hay uno o dos momentos." },
        { title: "Detecta el orden", text: "Separadas = melódico." },
        { title: "Detecta el bloque", text: "Juntas = armónico." },
      ],
    },
    audio_distance: {
      title: "Vas a reconocer distancias sin mirar primero.",
      body: "La idea no es acertar un nombre técnico perfecto: es notar si el sonido casi no se mueve, se mueve poco o salta más lejos.",
      tip: "Objetivo: clasificar la sensación de distancia.",
      steps: [
        { title: "Escucha completo", text: "No respondas con la primera nota." },
        { title: "Siente apertura", text: "Cerca, medio o grande." },
        { title: "Clasifica", text: "Elige la categoría más cercana." },
      ],
    },
    final_challenge: {
      title: "Vas a combinar vista, oído y teclado.",
      body: "El desafío mezcla los tipos anteriores. Antes de responder, identifica si debes tocar una nota, reconocer dirección o clasificar lo que escuchas.",
      tip: "Objetivo: elegir estrategia antes de responder.",
      steps: [
        { title: "Lee la tarea", text: "Visual, auditiva o mixta." },
        { title: "Encuentra referencia", text: "Nota base o primer sonido." },
        { title: "Responde", text: "Aplica distancia, dirección o categoría." },
      ],
    },
  };

  return copy[type];
}

function IntervalExerciseGuide({ type }: { type: IntervalExercise["type"] }) {
  const copy: Record<IntervalExercise["type"], [string, string, string]> = {
    semitone_distance: [
      "Parte desde la nota iluminada.",
      "Busca la tecla inmediatamente vecina.",
      "Toca derecha para subir o izquierda para bajar.",
    ],
    find_interval: [
      "Lee cuántos semitonos pide la consigna.",
      "Cuenta teclas consecutivas desde la nota base.",
      "Toca la nota destino, no una nota intermedia.",
    ],
    direction_recognition: [
      "Escucha dos notas en orden.",
      "Compara si la segunda quedó más aguda, más grave o igual.",
      "Responde dirección antes de pensar en el nombre de la nota.",
    ],
    melodic_vs_harmonic: [
      "Escucha si las notas suenan una después de otra.",
      "Si suenan juntas, es armónico.",
      "Si suenan separadas, es melódico.",
    ],
    audio_distance: [
      "Escucha la separación entre las dos notas.",
      "Clasifica si es misma nota, paso corto, salto medio o salto grande.",
      "Usa el teclado como referencia visual solo si necesitas ayuda.",
    ],
    final_challenge: [
      "Primero identifica si la pregunta es visual o auditiva.",
      "Ubica nota base, dirección y distancia.",
      "Responde sin depender siempre de las etiquetas.",
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
