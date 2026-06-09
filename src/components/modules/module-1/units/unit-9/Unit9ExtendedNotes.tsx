"use client";

import { ArrowRight, BookOpen, Maximize, Play, Star, Trophy, Volume2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MeasureBuilder } from "@/components/shared/interactive/MeasureBuilder";
import { DottedNoteVisualizer } from "@/components/shared/visualizers/DottedNoteVisualizer";
import { TieVisualizer } from "@/components/shared/visualizers/TieVisualizer";
import { TrebleClefVisualizer } from "@/components/shared/visualizers/TrebleClefVisualizer";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { FinalReadingChallenge } from "./components/FinalReadingChallenge";
import { activeReadingExercises } from "./exercises";

export function Unit9ExtendedNotes() {
  const [stage, setStage] = useState(1);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const engineRef = useRef<PianoAudioEngine | null>(null);

  // States para interactividad en etapas
  const [isPlaying, setIsPlaying] = useState(false);
  const [stage4Answer, setStage4Answer] = useState<string | null>(null);
  const [stage6Answer, setStage6Answer] = useState<string | null>(null);
  const [stage9CurrentEx, setStage9CurrentEx] = useState(0);
  const [stage9Answer, setStage9Answer] = useState<number | null>(null);

  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
  }, []);

  const handleNextStage = () => {
    setStage((prev) => prev + 1);
    setIsPlaying(false);
    // Limpiar estados interactivos
    setStage4Answer(null);
    setStage6Answer(null);
  };

  const playNotes = async (notes: { pitch: string; durationMs: number }[]) => {
    if (isPlaying) return;
    setIsPlaying(true);
    const Tone = await import("tone");
    await Tone.start();
    await engineRef.current?.prepare();

    let accum = 0;
    notes.forEach((n) => {
      setTimeout(() => {
        engineRef.current?.playSustainedNote(n.pitch as any, n.durationMs);
      }, accum);
      accum += n.durationMs;
    });

    setTimeout(() => {
      setIsPlaying(false);
    }, accum + 500);
  };

  const completeUnit = (finalScore: number) => {
    setScore(finalScore);
    setHasCompleted(true);
    setStage(12);

    try {
      localStorage.setItem("module1.unit9.completed", "true");
      localStorage.setItem("module1.unit9.score", finalScore.toString());
      localStorage.setItem("module1.completed", "true");
      localStorage.setItem("module2.unlocked", "true");
    } catch (_e) {
      console.warn("No se pudo guardar el progreso");
    }
  };

  const renderStage = () => {
    switch (stage) {
      case 1:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Maximize className="w-12 h-12 text-fuchsia-500 mb-6" />
            <h2 className="text-3xl font-black mb-4">¿Cómo hacemos que una nota dure más?</h2>
            <p className="text-slate-500 mb-10 text-lg">
              Ya conoces las figuras musicales y sabes organizarlas en compases.
              <br />
              <br />
              Pero ¿qué ocurre cuando una nota necesita durar más tiempo del que permite su figura?
            </p>
            <button
              type="button"
              onClick={handleNextStage}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Descubrir
            </button>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black mb-8">Compara estos sonidos</h2>
            <div className="flex flex-col md:flex-row gap-8 mb-12 w-full justify-center">
              <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full md:w-1/2">
                <span className="font-bold text-slate-500 uppercase">Ejemplo A</span>
                <button
                  type="button"
                  onClick={() => playNotes([{ pitch: "G", durationMs: 1000 }])}
                  disabled={isPlaying}
                  className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <Volume2 className="w-8 h-8 text-slate-500" />
                </button>
              </div>
              <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full md:w-1/2">
                <span className="font-bold text-fuchsia-500 uppercase">Ejemplo B</span>
                <button
                  type="button"
                  onClick={() => playNotes([{ pitch: "G", durationMs: 2000 }])}
                  disabled={isPlaying}
                  className="w-16 h-16 bg-fuchsia-50 rounded-full flex items-center justify-center hover:bg-fuchsia-100 transition-colors disabled:opacity-50"
                >
                  <Volume2 className="w-8 h-8 text-fuchsia-600" />
                </button>
              </div>
            </div>
            <p className="text-slate-500 mb-8 font-medium">
              ¿Notaste que el Ejemplo B dura exactamente el doble?
            </p>
            <button
              type="button"
              onClick={handleNextStage}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Continuar
            </button>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black mb-4">Herramienta 1: La Ligadura</h2>
            <p className="text-slate-500 mb-10 max-w-lg">
              Cuando dos notas a la misma altura se unen mediante una línea curva llamada{" "}
              <strong>Ligadura</strong>, se tocan como una sola nota más larga que suma ambas
              duraciones.
            </p>

            <div className="w-full mb-8">
              <TieVisualizer isPlaying={isPlaying} />
            </div>

            <button
              type="button"
              onClick={async () => {
                const Tone = await import("tone");
                await Tone.start();
                await engineRef.current?.prepare();
                setIsPlaying(true);
                engineRef.current?.playSustainedNote("G" as any, 2000);
                setTimeout(() => setIsPlaying(false), 2000);
              }}
              disabled={isPlaying}
              className="flex items-center gap-2 mb-12 px-6 py-3 bg-fuchsia-50 text-fuchsia-600 font-bold rounded-full hover:bg-fuchsia-100 transition-colors"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              <span>Escuchar fusión</span>
            </button>

            <button
              type="button"
              onClick={handleNextStage}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Continuar
            </button>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black mb-8">¿Cómo se toca esto?</h2>

            <div className="bg-white p-8 rounded-3xl border-2 border-fuchsia-100 mb-8">
              <TrebleClefVisualizer
                notes={[
                  { id: "n1", yPos: 35, xPos: 30, rhythm: "quarter", tieNext: true },
                  { id: "n2", yPos: 35, xPos: 70, rhythm: "quarter" },
                ]}
                height={150}
              />
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md mb-8">
              <button
                type="button"
                onClick={() => setStage4Answer("separated")}
                className={`p-4 rounded-2xl border-2 font-bold transition-all ${stage4Answer === "separated" ? "border-rose-400 bg-rose-50 text-rose-600" : "border-slate-100 hover:border-slate-200"}`}
              >
                A) Como dos notas separadas (Ta - Ta)
              </button>
              <button
                type="button"
                onClick={() => setStage4Answer("long")}
                className={`p-4 rounded-2xl border-2 font-bold transition-all ${stage4Answer === "long" ? "border-emerald-400 bg-emerald-50 text-emerald-600" : "border-slate-100 hover:border-slate-200"}`}
              >
                B) Como una sola nota larga (Taa)
              </button>
            </div>

            {stage4Answer === "separated" && (
              <p className="text-rose-500 font-bold mb-6 animate-in fade-in">
                ¡Cuidado! La línea curva las une.
              </p>
            )}

            <button
              type="button"
              onClick={handleNextStage}
              disabled={stage4Answer !== "long"}
              className={`px-8 py-3 font-bold rounded-xl transition-all ${stage4Answer === "long" ? "bg-white hover:bg-slate-800 text-slate-900" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
            >
              Continuar
            </button>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black mb-4">Herramienta 2: El Puntillo</h2>
            <p className="text-slate-500 mb-10 max-w-xl">
              Otra forma de alargar una nota es agregando un pequeño punto a su derecha. <br />
              <br />
              Este puntillo hace que la nota conserve su duración original y agregue mágicamente{" "}
              <strong>la mitad</strong> de su valor.
            </p>

            <div className="w-full mb-12 bg-white p-8 rounded-3xl border border-slate-100">
              <DottedNoteVisualizer
                isPlaying={isPlaying}
                onPlay={async () => {
                  const Tone = await import("tone");
                  await Tone.start();
                  await engineRef.current?.prepare();
                  setIsPlaying(true);
                  engineRef.current?.playSustainedNote("G" as any, 2000);

                  setTimeout(() => {
                    engineRef.current?.playSustainedNote("G" as any, 3000);
                  }, 2500);

                  setTimeout(() => setIsPlaying(false), 5500);
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleNextStage}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Continuar
            </button>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black mb-8">¿Cuál suena más larga?</h2>

            <p className="text-slate-500 mb-8">
              Escucha los dos sonidos y determina cuál corresponde a una figura con puntillo.
            </p>

            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => playNotes([{ pitch: "G", durationMs: 2000 }])}
                disabled={isPlaying}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-600 font-bold rounded-2xl"
              >
                <Volume2 /> Sonido A
              </button>
              <button
                type="button"
                onClick={() => playNotes([{ pitch: "A", durationMs: 3000 }])}
                disabled={isPlaying}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-600 font-bold rounded-2xl"
              >
                <Volume2 /> Sonido B
              </button>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs mb-8">
              <button
                type="button"
                onClick={() => setStage6Answer("A")}
                className={`p-4 rounded-2xl border-2 font-bold transition-all ${stage6Answer === "A" ? "border-rose-400 bg-rose-50 text-rose-600" : "border-slate-100 hover:border-slate-200"}`}
              >
                El Sonido A es más largo
              </button>
              <button
                type="button"
                onClick={() => setStage6Answer("B")}
                className={`p-4 rounded-2xl border-2 font-bold transition-all ${stage6Answer === "B" ? "border-emerald-400 bg-emerald-50 text-emerald-600" : "border-slate-100 hover:border-slate-200"}`}
              >
                El Sonido B es más largo
              </button>
            </div>

            <button
              type="button"
              onClick={handleNextStage}
              disabled={stage6Answer !== "B"}
              className={`px-8 py-3 font-bold rounded-xl transition-all ${stage6Answer === "B" ? "bg-white hover:bg-slate-800 text-slate-900" : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"}`}
            >
              Continuar
            </button>
          </div>
        );

      case 7:
        return (
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black mb-4">Construye Duraciones</h2>
            <p className="text-slate-500 mb-8">
              Crea un compás que dure exactamente <strong>4 tiempos</strong>. Intenta usar la Blanca
              con Puntillo (que vale 3).
            </p>

            <MeasureBuilder
              targetDuration={4}
              availableOptions={["quarter", "half", "dotted-half"]}
              onSuccess={handleNextStage}
            />
          </div>
        );

      case 8:
        return (
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black mb-4">Lectura Guiada</h2>
            <p className="text-slate-500 mb-8">
              Mira cómo se ven en el pentagrama. Ambas estrategias permiten crear duraciones de 3
              tiempos.
            </p>

            <div className="w-full flex flex-col gap-6 mb-8">
              <div className="bg-white p-6 pb-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <span className="font-bold text-slate-500 text-sm text-left px-2">
                  Estrategia 1: Ligadura (2 + 1)
                </span>
                <TrebleClefVisualizer
                  notes={[
                    { id: "x1", yPos: 35, xPos: 20, rhythm: "half", tieNext: true },
                    { id: "x2", yPos: 35, xPos: 80, rhythm: "quarter" },
                  ]}
                  height={120}
                />
              </div>

              <div className="bg-white p-6 pb-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <span className="font-bold text-slate-500 text-sm text-left px-2">
                  Estrategia 2: Puntillo (3)
                </span>
                <TrebleClefVisualizer
                  notes={[{ id: "y1", yPos: 40, xPos: 50, rhythm: "half", isDotted: true }]}
                  height={120}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextStage}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              ¡Entendido!
            </button>
          </div>
        );

      case 9: {
        const currentExercise = activeReadingExercises[stage9CurrentEx];
        return (
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black mb-4">Lectura Activa</h2>
            <p className="text-slate-500 mb-8">Observa la siguiente secuencia y responde.</p>

            <div className="bg-white p-8 w-full rounded-3xl border-2 border-slate-100 mb-8 relative">
              <TrebleClefVisualizer
                notes={currentExercise.sequence.map((n, i) => ({
                  id: `n-${i}`,
                  yPos: n.pitch === "G4" ? 35 : n.pitch === "A4" ? 40 : n.pitch === "B4" ? 45 : 50,
                  xPos: 20 + i * 30,
                  rhythm: n.rhythm,
                  isDotted: n.isDotted,
                }))}
                height={160}
              />
            </div>

            <h3 className="font-bold text-xl mb-6">{currentExercise.question}</h3>

            <div className="flex flex-col gap-3 w-full max-w-md mb-8">
              {currentExercise.options.map((opt, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setStage9Answer(idx);
                    if (idx === currentExercise.correctIndex) {
                      setTimeout(() => {
                        if (stage9CurrentEx < activeReadingExercises.length - 1) {
                          setStage9CurrentEx((prev) => prev + 1);
                          setStage9Answer(null);
                        } else {
                          handleNextStage();
                        }
                      }, 1000);
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 font-bold transition-all text-left px-6 ${
                    stage9Answer === idx
                      ? idx === currentExercise.correctIndex
                        ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                        : "border-rose-400 bg-rose-50 text-rose-600"
                      : "border-slate-100 hover:border-slate-200 text-slate-500"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 10:
        return (
          <div className="flex flex-col items-center max-w-4xl mx-auto text-center mt-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-fuchsia-100 rounded-full flex items-center justify-center mb-6">
              <Star className="w-10 h-10 text-fuchsia-500" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-black mb-4">Proyecto Final del Módulo</h2>
            <p className="text-slate-500 mb-8 max-w-2xl text-lg">
              Has llegado a la meta final del Módulo 1. A continuación verás tu primera partitura
              real.
              <br />
              <br />
              Escúchala atentamente, sigue la lectura visual de las notas, compases, ligaduras y
              puntillos. Al finalizar, pondremos a prueba tu comprensión.
            </p>
            <button
              type="button"
              onClick={handleNextStage}
              className="px-10 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-lg rounded-full shadow-lg transition-all hover:scale-105"
            >
              Ir a la Partitura Final
            </button>
          </div>
        );

      case 11:
        return (
          <div className="w-full mt-4">
            <FinalReadingChallenge onComplete={completeUnit} />
          </div>
        );

      case 12:
        return (
          <div className="flex flex-col items-center max-w-xl mx-auto text-center mt-12 animate-in zoom-in duration-700">
            <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-8 relative">
              <Trophy className="w-16 h-16 text-amber-500" />
              <div className="absolute -inset-4 bg-amber-400/20 rounded-full animate-ping" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-4">¡Ya lees música!</h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed">
              Completaste el Módulo 1 con una puntuación de{" "}
              <strong className="text-emerald-500">{score}%</strong>.<br />
              Ahora puedes reconocer notas en el pentagrama, leer Clave de Sol, entender compases y
              manejar el tiempo musical.
            </p>

            <div className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-10 text-left">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-500" /> Habilidades Desbloqueadas
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" /> Altura y Ritmo
                </li>
                <li className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" /> Lectura de DO a SOL
                </li>
                <li className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" /> Compases de 4/4
                </li>
                <li className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" /> Ligaduras y Puntillos
                </li>
              </ul>
            </div>

            <Link href="/modulos/1/unidad-9">
              <button
                type="button"
                className="flex items-center justify-center gap-3 w-full px-10 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:scale-105"
              >
                <Star className="w-5 h-5" fill="currentColor" />
                <span>Ir al Centro de Entrenamiento</span>
              </button>
            </Link>

            <Link href="#">
              <button
                type="button"
                className="flex items-center justify-center gap-3 w-full px-10 py-4 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-2xl transition-all shadow-lg hover:scale-105"
              >
                <span>Comenzar Módulo 2</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Barra de progreso */}
      {!hasCompleted && (
        <div className="w-full max-w-md mx-auto mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Etapa {stage} de 11
            </span>
            <span className="text-xs font-bold text-fuchsia-500 uppercase tracking-wider">
              Módulo 1 • Final
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-fuchsia-500 transition-all duration-500 ease-out"
              style={{ width: `${(stage / 11) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Contenido de la Etapa */}
      <div className="min-h-[400px]">{renderStage()}</div>
    </div>
  );
}
