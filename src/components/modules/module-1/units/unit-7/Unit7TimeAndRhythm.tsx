"use client";

import {
  Activity,
  ArrowRight,
  BookOpen,
  Clock,
  Heart,
  Layers,
  LayoutGrid,
  Music,
  Play,
  Star,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { useAudioSimulator } from "@/components/shared/audio/useAudioSimulator";
import { BeatTracker } from "@/components/shared/interactive/BeatTracker";
import { RhythmVisualizer } from "@/components/shared/visualizers/RhythmVisualizer";
import { TrebleClefVisualizer } from "@/components/shared/visualizers/TrebleClefVisualizer";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { getNoteById } from "@/lib/music/notesData";
import type { RhythmFigureId } from "@/lib/music/rhythmFigures";
import { RhythmReadingExercise } from "./components/RhythmReadingExercise";

export function Unit7TimeAndRhythm() {
  const [stage, setStage] = useState(1);
  const [_hasCompleted, setHasCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [pulseAccuracy, setPulseAccuracy] = useState<number | null>(null);

  const { playSimulatedSound } = useAudioSimulator();
  const engineRef = useRef<PianoAudioEngine | null>(null);

  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
    engineRef.current.prepare();

    const saved = localStorage.getItem("module1.unit7.completed");
    if (saved) setHasCompleted(true);

    return () => {
      engineRef.current?.close();
    };
  }, []);

  const handleNextStage = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStage((s) => s + 1);
  };

  const completeUnit = () => {
    localStorage.setItem("module1.unit7.completed", "true");
    setHasCompleted(true);
    setStage(11); // Pantalla final
  };

  // Etapa 3: A/B Testing
  const [stage3Selection, setStage3Selection] = useState<string | null>(null);
  const [stage3State, setStage3State] = useState<"long" | "short">("long");

  // Etapa 5: Drag / Orden (Simplificado a selección múltiple)
  const [stage5State, setStage5State] = useState<number>(0);

  // Etapa 6: Construye el ritmo
  const [stage6State, setStage6State] = useState<number>(0);

  // Etapa 9: Ritmo + Notas
  const stage9Sequence = [
    { note: "sol", rhythm: "quarter" },
    { note: "la", rhythm: "quarter" },
    { note: "si", rhythm: "half" },
  ];
  const [activeStage9Note, setActiveStage9Note] = useState<number | null>(null);

  // Etapa 10: Micro Melodía
  const stage10Sequence = [
    { note: "sol", rhythm: "quarter" },
    { note: "la", rhythm: "quarter" },
    { note: "si", rhythm: "half" },
    { note: "sol", rhythm: "whole" },
  ];
  const [activeStage10Note, setActiveStage10Note] = useState<number | null>(null);

  const renderStage = () => {
    switch (stage) {
      case 1:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center mt-8">
            <Heart className="w-16 h-16 text-rose-500 mb-6 animate-pulse" />
            <h1 className="text-3xl font-black mb-6 text-slate-800">El corazón de la música</h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Toda música tiene un pulso. Es como los latidos de un corazón: constante, vivo y
              predecible.
            </p>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 w-full mb-8">
              <p className="text-slate-500 mb-6">
                Escucha el pulso de 60 BPM (Latidos por minuto).
              </p>
              <button
                type="button"
                onClick={async () => {
                  await Tone.start();
                  await engineRef.current?.prepare();
                  let beats = 0;
                  const interval = setInterval(() => {
                    engineRef.current?.playHeartbeat();
                    beats++;
                    if (beats >= 4) clearInterval(interval);
                  }, 1000);
                }}
                className="mx-auto w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
              >
                <Play className="w-8 h-8 text-rose-500 ml-1" fill="currentColor" />
              </button>
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

      case 2:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center mt-8">
            <Activity className="w-12 h-12 text-sky-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Toca con el pulso</h2>
            <p className="text-slate-500 mb-10">
              La app va a marcar un ritmo. Intenta tocar el botón exactamente al mismo tiempo que
              escuchas el latido.
            </p>
            <div className="w-full mb-10">
              <BeatTracker
                targetBeats={8}
                onAccuracyUpdate={(acc) => {
                  setPulseAccuracy(acc);
                  setScore((s) => s + (acc > 80 ? 20 : 10));
                }}
              />
            </div>
            {pulseAccuracy !== null && (
              <button
                type="button"
                onClick={handleNextStage}
                className="animate-in fade-in slide-in-from-bottom-4 px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
              >
                Continuar
              </button>
            )}
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center mt-8">
            <Clock className="w-12 h-12 text-fuchsia-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Sonidos cortos y largos</h2>
            <p className="text-slate-500 mb-10">Escucha con atención y responde la pregunta.</p>

            <div className="flex gap-8 mb-12">
              <button
                type="button"
                onClick={() => playSimulatedSound({ type: "sine", duration: 4, frequency: 440 })}
                className="w-32 h-32 bg-white rounded-3xl shadow-sm border-2 border-slate-200 flex flex-col items-center justify-center hover:border-fuchsia-300 transition-colors"
              >
                <Play className="w-8 h-8 text-slate-500 mb-2" />
                <span className="font-bold">Sonido A</span>
              </button>
              <button
                type="button"
                onClick={() => playSimulatedSound({ type: "sine", duration: 1, frequency: 523.25 })}
                className="w-32 h-32 bg-white rounded-3xl shadow-sm border-2 border-slate-200 flex flex-col items-center justify-center hover:border-fuchsia-300 transition-colors"
              >
                <Play className="w-8 h-8 text-slate-500 mb-2" />
                <span className="font-bold">Sonido B</span>
              </button>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl w-full">
              <h3 className="font-bold text-xl mb-6">
                {stage3State === "long"
                  ? "¿Cuál sonido dura más tiempo?"
                  : "¿Cuál sonido es más corto?"}
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (stage3State === "long") {
                      setStage3State("short");
                      setScore((s) => s + 10);
                    } else {
                      setStage3Selection("wrong");
                    }
                  }}
                  className={`px-8 py-3 font-bold rounded-xl border-2 transition-colors ${stage3State === "short" && stage3Selection === "wrong" ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-white border-slate-200 hover:border-slate-600"}`}
                >
                  Sonido A
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (stage3State === "short") {
                      setStage3Selection("correct");
                      setScore((s) => s + 10);
                      setTimeout(handleNextStage, 1000);
                    } else {
                      setStage3Selection("wrong");
                    }
                  }}
                  className={`px-8 py-3 font-bold rounded-xl border-2 transition-colors ${stage3State === "long" && stage3Selection === "wrong" ? "bg-rose-50 border-rose-200 text-rose-500" : stage3Selection === "correct" ? "bg-emerald-500 border-emerald-500 text-slate-900" : "bg-white border-slate-200 hover:border-slate-600"}`}
                >
                  Sonido B
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center max-w-4xl mx-auto text-center mt-8">
            <Layers className="w-12 h-12 text-emerald-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Conoce a las figuras</h2>
            <p className="text-slate-500 mb-10">
              La música usa símbolos especiales para decirnos exactamente cuánto debe durar un
              sonido.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                <h3 className="font-bold text-lg mb-2">Redonda</h3>
                <p className="text-sm text-slate-500 mb-6">4 pulsos (Taaaa)</p>
                <RhythmVisualizer
                  figureId="whole"
                  durationSeconds={4}
                  showPlayButton={true}
                  onPlay={() => {
                    playSimulatedSound({ type: "sine", duration: 4, frequency: 440 });
                  }}
                />
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                <h3 className="font-bold text-lg mb-2">Blanca</h3>
                <p className="text-sm text-slate-500 mb-6">2 pulsos (Taa)</p>
                <RhythmVisualizer
                  figureId="half"
                  durationSeconds={2}
                  showPlayButton={true}
                  onPlay={() => {
                    playSimulatedSound({ type: "sine", duration: 2, frequency: 440 });
                  }}
                />
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                <h3 className="font-bold text-lg mb-2">Negra</h3>
                <p className="text-sm text-slate-500 mb-6">1 pulso (Ta)</p>
                <RhythmVisualizer
                  figureId="quarter"
                  durationSeconds={1}
                  showPlayButton={true}
                  onPlay={() => {
                    playSimulatedSound({ type: "sine", duration: 1, frequency: 440 });
                  }}
                />
              </div>
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

      case 5:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center mt-8">
            <LayoutGrid className="w-12 h-12 text-amber-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">¿Cuál dura menos?</h2>
            <p className="text-slate-500 mb-10">
              Toca la figura que representa el sonido más corto.
            </p>

            <div className="flex justify-center gap-6 mb-12 bg-slate-50 p-8 rounded-3xl">
              <button
                type="button"
                onClick={() => setStage5State(1)}
                className={`p-6 rounded-2xl bg-white border-2 transition-all ${stage5State === 1 ? "border-rose-300 bg-rose-50" : "border-slate-200 hover:border-slate-600"}`}
              >
                <RhythmVisualizer figureId="whole" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setScore((s) => s + 10);
                  handleNextStage();
                }}
                className="p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-600 transition-all hover:scale-105"
              >
                <RhythmVisualizer figureId="quarter" />
              </button>
              <button
                type="button"
                onClick={() => setStage5State(2)}
                className={`p-6 rounded-2xl bg-white border-2 transition-all ${stage5State === 2 ? "border-rose-300 bg-rose-50" : "border-slate-200 hover:border-slate-600"}`}
              >
                <RhythmVisualizer figureId="half" />
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center mt-8">
            <Music className="w-12 h-12 text-indigo-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Construye el ritmo</h2>
            <p className="text-slate-500 mb-10">
              Escucha el patrón y selecciona las figuras correctas.
            </p>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 w-full mb-8 flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  if (stage6State === 0) {
                    playSimulatedSound({ type: "sine", duration: 4, frequency: 440 });
                  } else {
                    playSimulatedSound({ type: "sine", duration: 1, frequency: 440 });
                    setTimeout(
                      () => playSimulatedSound({ type: "sine", duration: 1, frequency: 440 }),
                      1000,
                    );
                  }
                }}
                className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-200 mb-8"
              >
                <Play className="w-8 h-8 text-indigo-500 ml-1" fill="currentColor" />
              </button>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (stage6State === 0) {
                      setStage6State(1);
                      setScore((s) => s + 10);
                    }
                  }}
                  className={`px-8 py-3 font-bold rounded-xl border-2 transition-colors ${stage6State === 1 ? "bg-slate-800 border-slate-200 opacity-50" : "bg-white border-slate-200 hover:border-slate-600"}`}
                >
                  1 Redonda
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (stage6State === 1) {
                      setScore((s) => s + 10);
                      handleNextStage();
                    }
                  }}
                  className={`px-8 py-3 font-bold rounded-xl border-2 transition-colors ${stage6State === 0 ? "bg-slate-800 border-slate-200 opacity-50" : "bg-white border-slate-200 hover:border-slate-600"}`}
                >
                  2 Negras
                </button>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8">
            <BookOpen className="w-12 h-12 text-teal-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Lectura Rítmica Guiada</h2>
            <p className="text-slate-500 mb-10">
              La app leerá esta secuencia por ti. Observa cómo el tiempo avanza.
            </p>

            <RhythmReadingExercise
              sequence={["quarter", "quarter", "half"]}
              mode="guided"
              onComplete={() => {}}
            />

            <button
              type="button"
              onClick={handleNextStage}
              className="mt-12 px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Continuar
            </button>
          </div>
        );

      case 8:
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8">
            <Star className="w-12 h-12 text-yellow-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Lectura Rítmica Activa</h2>
            <p className="text-slate-500 mb-10">
              ¡Tu turno! Toca la pantalla (en la caja blanca) para seguir el ritmo dictado por las
              figuras.
            </p>

            <RhythmReadingExercise
              sequence={["quarter", "quarter", "quarter", "quarter"]}
              mode="active"
              onComplete={() => {
                setScore((s) => s + 20);
                setTimeout(handleNextStage, 1500);
              }}
            />
          </div>
        );

      case 9:
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8">
            <Layers className="w-12 h-12 text-sky-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Ritmo + Notas</h2>
            <p className="text-slate-500 mb-10">
              Aquí es donde ocurre la magia. Las figuras se ubican en el pentagrama: ahora sabes QUÉ
              tocar y CUÁNTO tiempo.
            </p>

            <div className="w-full max-w-4xl mx-auto mb-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <TrebleClefVisualizer
                notes={stage9Sequence.map((n, i) => ({
                  id: `n-${i}`,
                  yPos: getNoteById(n.note).yPos,
                  xPos: 35 + i * 20,
                  color: activeStage9Note === i ? "bg-sky-500 text-white" : undefined,
                  rhythm: n.rhythm as RhythmFigureId,
                }))}
              />
            </div>

            <button
              type="button"
              onClick={async () => {
                await Tone.start();
                await engineRef.current?.prepare();
                const _current = 0;
                setActiveStage9Note(0);
                engineRef.current?.playPianoTone(getNoteById("sol").frequency, {
                  durationMs: 1000,
                });

                setTimeout(() => {
                  setActiveStage9Note(1);
                  engineRef.current?.playPianoTone(getNoteById("la").frequency, {
                    durationMs: 1000,
                  });
                }, 1000);

                setTimeout(() => {
                  setActiveStage9Note(2);
                  engineRef.current?.playPianoTone(getNoteById("si").frequency, {
                    durationMs: 2000,
                  });
                }, 2000);

                setTimeout(() => {
                  setActiveStage9Note(null);
                }, 4000);
              }}
              className="mb-8 w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center hover:bg-sky-100 transition-colors cursor-pointer border border-sky-200"
            >
              <Play className="w-8 h-8 text-sky-500 ml-1" fill="currentColor" />
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

      case 10:
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8">
            <Trophy className="w-16 h-16 text-yellow-500 mb-6" />
            <h2 className="text-3xl font-black mb-4">Micro Melodía</h2>
            <p className="text-slate-500 mb-10">Acabas de aprender a leer una partitura real.</p>

            <div className="w-full max-w-4xl mx-auto mb-8 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
              <TrebleClefVisualizer
                notes={stage10Sequence.map((n, i) => ({
                  id: `n-${i}`,
                  yPos: getNoteById(n.note).yPos,
                  xPos: 30 + i * 18,
                  color: activeStage10Note === i ? "bg-fuchsia-500 text-white" : undefined,
                  rhythm: n.rhythm as RhythmFigureId,
                }))}
              />
            </div>

            <button
              type="button"
              onClick={async () => {
                await Tone.start();
                await engineRef.current?.prepare();
                setActiveStage10Note(0);
                engineRef.current?.playPianoTone(getNoteById("sol").frequency, {
                  durationMs: 1000,
                });

                setTimeout(() => {
                  setActiveStage10Note(1);
                  engineRef.current?.playPianoTone(getNoteById("la").frequency, {
                    durationMs: 1000,
                  });
                }, 1000);

                setTimeout(() => {
                  setActiveStage10Note(2);
                  engineRef.current?.playPianoTone(getNoteById("si").frequency, {
                    durationMs: 2000,
                  });
                }, 2000);

                setTimeout(() => {
                  setActiveStage10Note(3);
                  engineRef.current?.playPianoTone(getNoteById("sol").frequency, {
                    durationMs: 4000,
                  });
                }, 4000);

                setTimeout(() => {
                  setActiveStage10Note(null);
                  setScore((s) => s + 30);
                }, 8000);
              }}
              className="mb-8 w-24 h-24 bg-fuchsia-50 rounded-full flex items-center justify-center hover:bg-fuchsia-100 transition-colors cursor-pointer border border-fuchsia-200"
            >
              <Play className="w-10 h-10 text-fuchsia-500 ml-1" fill="currentColor" />
            </button>

            <button
              type="button"
              onClick={completeUnit}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Finalizar Unidad
            </button>
          </div>
        );

      case 11:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center mt-12 animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-8 relative">
              <Trophy className="w-16 h-16 text-yellow-500" />
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                +{score} XP
              </div>
            </div>

            <h1 className="text-4xl font-black mb-6 text-slate-800">Ahora lees tiempo</h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed">
              Las notas no sólo tienen altura. También tienen duración. Acabas de aprender a leer
              ambas dimensiones: el eje vertical (altura) y el horizontal (tiempo).
            </p>

            <div className="grid grid-cols-2 gap-6 w-full mb-12">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-4xl font-black text-sky-500 mb-2">
                  {pulseAccuracy ? Math.round(pulseAccuracy) : 85}%
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Precisión Rítmica
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <Star className="w-6 h-6 fill-current" />
                  <span className="font-bold">Guardián del Pulso</span>
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Logro Desbloqueado
                </div>
              </div>
            </div>

            <Link
              href="/modulos/1/unidad-8"
              className="flex items-center gap-3 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-lg"
            >
              <span>Siguiente Unidad</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Barra de progreso */}
      <div className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Link
              href="/modulos/1"
              className="text-slate-500 hover:text-slate-500 transition-colors"
            >
              <ArrowRight className="w-6 h-6 rotate-180" />
            </Link>
            <div className="h-3 bg-slate-800 rounded-full w-full overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-500 ease-out"
                style={{ width: `${(stage / 11) * 100}%` }}
              />
            </div>
          </div>
          <div className="ml-8 font-bold text-slate-500 tabular-nums">{stage}/11</div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">{renderStage()}</div>
    </div>
  );
}
