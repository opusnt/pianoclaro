"use client";

import {
  Activity,
  ArrowRight,
  BookOpen,
  Box,
  Layers,
  Maximize,
  Music,
  Play,
  ShieldAlert,
  Star,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { getNoteById } from "@/lib/music/notesData";
import { TrebleClefVisualizer } from "@/components/shared/visualizers/TrebleClefVisualizer";
import { RhythmReadingExercise } from "../unit-7/components/RhythmReadingExercise";
import type { RhythmFigureId } from "@/lib/music/rhythmFigures";
import { MeasureBuilder } from "@/components/shared/interactive/MeasureBuilder";
import { MeasureVisualizer } from "@/components/shared/visualizers/MeasureVisualizer";
import { TimeSignatureCard } from "@/components/shared/cards/TimeSignatureCard";
import { measureExercises } from "./measureExercises";

export function Unit8Measures() {
  const [stage, setStage] = useState(1);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const engineRef = useRef<PianoAudioEngine | null>(null);

  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
    engineRef.current.prepare();

    const saved = localStorage.getItem("module1.unit8.completed");
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
    localStorage.setItem("module1.unit8.completed", "true");
    setHasCompleted(true);
    setStage(11);
  };

  // State para etapa 1
  const [stage1View, setStage1View] = useState<"chaotic" | "organized">("chaotic");

  // State para etapa 2
  const [stage2Playing, setStage2Playing] = useState(false);
  const [stage2ActiveBeat, setStage2ActiveBeat] = useState<number | null>(null);
  const [stage2BoxVisible, setStage2BoxVisible] = useState(false);

  // State para etapa 6
  const [stage6State, setStage6State] = useState<number>(0);
  const [stage6Feedback, setStage6Feedback] = useState<"correct" | "wrong" | null>(null);

  // Etapa 9
  const stage9Sequence = [
    { note: "sol", rhythm: "quarter" },
    { note: "sol", rhythm: "quarter" },
    { note: "la", rhythm: "half" },
  ];
  const [activeStage9Note, setActiveStage9Note] = useState<number | null>(null);

  // Etapa 10
  const stage10Row1 = [
    { note: "sol", rhythm: "quarter" },
    { note: "sol", rhythm: "quarter" },
    { note: "la", rhythm: "quarter" },
    { note: "si", rhythm: "quarter" },
    { note: "si", rhythm: "quarter" },
    { note: "la", rhythm: "quarter" },
    { note: "sol", rhythm: "half" },
  ];

  const stage10Row2 = [
    { note: "mi", rhythm: "quarter" },
    { note: "fa", rhythm: "quarter" },
    { note: "sol", rhythm: "half" },
    { note: "sol", rhythm: "whole" },
  ];

  const [activeStage10NoteR1, setActiveStage10NoteR1] = useState<number | null>(null);
  const [activeStage10NoteR2, setActiveStage10NoteR2] = useState<number | null>(null);

  const renderStage = () => {
    switch (stage) {
      case 1:
        return (
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Box className="w-16 h-16 text-sky-500 mb-6" />
            <h1 className="text-3xl font-black mb-6 text-slate-800">
              ¿Cómo se organiza la música?
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Imagina leer un libro donde no hay espacios entre las palabras, ni comas, ni puntos
              finales.
            </p>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 w-full mb-12 h-64 flex flex-col justify-center">
              {stage1View === "chaotic" ? (
                <div className="flex flex-wrap gap-2 justify-center text-slate-800 font-mono text-2xl tracking-tighter break-all">
                  taataatataataataaataaatatataaatatata
                </div>
              ) : (
                <div className="flex flex-wrap gap-6 justify-center text-slate-800 font-mono text-2xl">
                  <span>taa taa</span>
                  <span className="text-sky-300">|</span>
                  <span>ta taa ta</span>
                  <span className="text-sky-300">|</span>
                  <span>taa a ta</span>
                  <span className="text-sky-300">|</span>
                  <span>ta ta ta a</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {stage1View === "chaotic" ? (
                <button
                  onClick={() => setStage1View("organized")}
                  className="px-8 py-3 bg-sky-50 text-sky-600 font-bold rounded-xl hover:bg-sky-100 transition-colors"
                >
                  Ver con espacios
                </button>
              ) : (
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
                >
                  Tiene más sentido, Continuar
                </button>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Maximize className="w-12 h-12 text-emerald-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Las cajas del ritmo</h2>
            <p className="text-slate-500 mb-10">
              En música, agrupamos los pulsos en pequeñas cajas de tiempo. A estas cajas las
              llamamos <strong>Compases</strong>.
              <br />
              <br />
              Una caja típica tiene espacio exacto para 4 pulsos (4 negras).
            </p>

            <div className="w-full max-w-lg mx-auto mb-12 flex flex-col items-center justify-center">
              <MeasureVisualizer
                figures={["quarter", "quarter", "quarter", "quarter"]}
                targetDuration={4}
              />
            </div>

            <button
              onClick={handleNextStage}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Continuar
            </button>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Layers className="w-12 h-12 text-amber-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Construye tu primera caja</h2>
            <p className="text-slate-500 mb-10">
              Llena esta caja con figuras musicales. La suma de sus duraciones debe ser exactamente
              4.
            </p>

            <MeasureBuilder
              initialFigures={[]}
              targetDuration={4}
              onSuccess={() => {
                setScore((s) => s + 20);
                setTimeout(handleNextStage, 1500);
              }}
            />
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Activity className="w-12 h-12 text-fuchsia-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">La barra divisoria</h2>
            <p className="text-slate-500 mb-10">
              Para separar visualmente una caja de la siguiente, dibujamos una línea vertical
              llamada <strong>Barra Divisoria</strong>.
            </p>

            <div className="w-full max-w-4xl mx-auto mb-12 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <TrebleClefVisualizer
                notes={[
                  { id: "1", yPos: getNoteById("sol").yPos, xPos: 35, rhythm: "quarter" },
                  { id: "2", yPos: getNoteById("sol").yPos, xPos: 45, rhythm: "quarter" },
                  { id: "3", yPos: getNoteById("sol").yPos, xPos: 55, rhythm: "half" },
                  // Siguiente compás
                  { id: "4", yPos: getNoteById("la").yPos, xPos: 75, rhythm: "whole" },
                ]}
                barLines={[68, 98]} // Las barras divisorias
              />
            </div>

            <button
              onClick={handleNextStage}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Continuar
            </button>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <BookOpen className="w-12 h-12 text-teal-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Descubriendo el 4/4</h2>
            <p className="text-slate-500 mb-10">
              Al principio de la partitura siempre verás una fracción. Esto es lo que significa:
            </p>

            <div className="mb-12 w-full">
              <TimeSignatureCard />
            </div>

            <button
              onClick={handleNextStage}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              ¡Entendido!
            </button>
          </div>
        );

      case 6: {
        const isEx6Correct = stage6State === 1; // 0 = 3/4, 1 = 4/4, 2 = 5/4
        const figuresArray: RhythmFigureId[][] = [
          ["quarter", "half"], // 3
          ["quarter", "quarter", "half"], // 4
          ["half", "half", "quarter"], // 5
        ];

        return (
          <div className="flex flex-col items-center max-w-3xl mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <ShieldAlert className="w-12 h-12 text-rose-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">¿Es correcto el compás?</h2>
            <p className="text-slate-500 mb-10">
              En un compás de 4/4, la suma debe ser exactamente 4. Revisa este compás:
            </p>

            <div className="mb-12">
              <MeasureVisualizer
                figures={figuresArray[stage6State]}
                targetDuration={4}
                isValid={
                  stage6Feedback === "correct"
                    ? true
                    : stage6Feedback === "wrong"
                      ? false
                      : undefined
                }
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (isEx6Correct) {
                    setStage6Feedback("correct");
                    setScore((s) => s + 10);
                    setTimeout(() => {
                      setStage6Feedback(null);
                      if (stage6State < 2) setStage6State((s) => s + 1);
                      else handleNextStage();
                    }, 1000);
                  } else {
                    setStage6Feedback("wrong");
                    setTimeout(() => setStage6Feedback(null), 1000);
                  }
                }}
                className="px-8 py-4 bg-emerald-50 text-emerald-600 font-bold rounded-xl border-2 border-emerald-200 hover:bg-emerald-100 transition-colors w-32"
              >
                SÍ
              </button>
              <button
                onClick={() => {
                  if (!isEx6Correct) {
                    setStage6Feedback("correct");
                    setScore((s) => s + 10);
                    setTimeout(() => {
                      setStage6Feedback(null);
                      if (stage6State < 2) setStage6State((s) => s + 1);
                      else handleNextStage();
                    }, 1000);
                  } else {
                    setStage6Feedback("wrong");
                    setTimeout(() => setStage6Feedback(null), 1000);
                  }
                }}
                className="px-8 py-4 bg-rose-50 text-rose-600 font-bold rounded-xl border-2 border-rose-200 hover:bg-rose-100 transition-colors w-32"
              >
                NO
              </button>
            </div>
          </div>
        );
      }

      case 7: {
        const exercise = measureExercises[0]; // ex-1: half (needs 2 more)
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Layers className="w-12 h-12 text-indigo-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Repara el compás</h2>
            <p className="text-slate-500 mb-10">
              Este compás está a medio llenar. Agrega las figuras que faltan para llegar a 4.
            </p>

            <MeasureBuilder
              initialFigures={exercise.initialFigures}
              targetDuration={exercise.targetDuration}
              onSuccess={() => {
                setScore((s) => s + 20);
                setTimeout(handleNextStage, 1500);
              }}
            />
          </div>
        );
      }

      case 8:
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <BookOpen className="w-12 h-12 text-sky-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Lectura con compases</h2>
            <p className="text-slate-500 mb-10">
              Aquí tienes 2 compases. Observa cómo el tiempo avanza ordenadamente a través de las
              cajas.
            </p>

            <RhythmReadingExercise
              sequence={["quarter", "quarter", "half", "whole"]}
              mode="guided"
              timeSignature={4}
              onComplete={() => {
                setTimeout(handleNextStage, 1500);
              }}
            />
          </div>
        );

      case 9:
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Music className="w-12 h-12 text-amber-500 mb-6" />
            <h2 className="text-2xl font-black mb-4">Ritmo + Notas + Compás</h2>
            <p className="text-slate-500 mb-10">
              Ya lo tienes. Ahora integrémoslo con la Clave de Sol.
            </p>

            <div className="w-full max-w-4xl mx-auto mb-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <TrebleClefVisualizer
                notes={stage9Sequence.map((n, i) => ({
                  id: `n-${i}`,
                  yPos: getNoteById(n.note).yPos,
                  xPos: 35 + i * 20,
                  color: activeStage9Note === i ? "bg-amber-500 text-white" : undefined,
                  rhythm: n.rhythm as RhythmFigureId,
                }))}
                barLines={[95]}
              />
            </div>

            <button
              onClick={async () => {
                await Tone.start();
                await engineRef.current?.prepare();
                setActiveStage9Note(0);
                engineRef.current?.playPianoTone(getNoteById("sol").frequency, {
                  durationMs: 1000,
                });

                setTimeout(() => {
                  setActiveStage9Note(1);
                  engineRef.current?.playPianoTone(getNoteById("sol").frequency, {
                    durationMs: 1000,
                  });
                }, 1000);

                setTimeout(() => {
                  setActiveStage9Note(2);
                  engineRef.current?.playPianoTone(getNoteById("la").frequency, {
                    durationMs: 2000,
                  });
                }, 2000);

                setTimeout(() => {
                  setActiveStage9Note(null);
                }, 4000);
              }}
              className="mb-8 w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
            >
              <Play className="w-8 h-8 text-amber-500 ml-1" fill="currentColor" />
            </button>

            <button
              onClick={handleNextStage}
              className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Continuar
            </button>
          </div>
        );

      case 10:
        return (
          <div className="flex flex-col items-center w-full mx-auto text-center mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Trophy className="w-16 h-16 text-yellow-500 mb-6" />
            <h2 className="text-3xl font-black mb-4">Tu Primera Partitura Real</h2>
            <p className="text-slate-500 mb-10">
              4 compases completos de música. Síguelos mientras suena.
            </p>

            <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 mb-12">
              {/* Sistema 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="mb-2 font-bold text-left text-slate-500 pl-4 text-xl tracking-widest font-serif">
                  4/4
                </div>
                <TrebleClefVisualizer
                  notes={stage10Row1.map((n, i) => ({
                    id: `r1-${i}`,
                    yPos: getNoteById(n.note).yPos,
                    xPos: i < 4 ? 15 + i * 10 : 65 + (i - 4) * 10,
                    color: activeStage10NoteR1 === i ? "bg-fuchsia-500 text-white" : undefined,
                    rhythm: n.rhythm as RhythmFigureId,
                  }))}
                  barLines={[55, 95]}
                />
              </div>

              {/* Sistema 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <TrebleClefVisualizer
                  showTrebleClef={false}
                  notes={stage10Row2.map((n, i) => ({
                    id: `r2-${i}`,
                    yPos: getNoteById(n.note).yPos,
                    xPos: i < 3 ? 20 + i * 15 : 85,
                    color: activeStage10NoteR2 === i ? "bg-fuchsia-500 text-white" : undefined,
                    rhythm: n.rhythm as RhythmFigureId,
                  }))}
                  barLines={[70, 95, 98]} // Doble barra final
                />
              </div>
            </div>

            <button
              onClick={async () => {
                await Tone.start();
                await engineRef.current?.prepare();
                let timeOffset = 0;

                // Jugar Fila 1
                stage10Row1.forEach((n, i) => {
                  setTimeout(() => {
                    setActiveStage10NoteR1(i);
                    engineRef.current?.playPianoTone(getNoteById(n.note).frequency, {
                      durationMs: n.rhythm === "half" ? 2000 : 1000,
                    });
                  }, timeOffset);
                  timeOffset += n.rhythm === "half" ? 2000 : 1000;
                });

                // Apagar fila 1 al final
                setTimeout(() => setActiveStage10NoteR1(null), timeOffset);

                // Jugar Fila 2
                stage10Row2.forEach((n, i) => {
                  setTimeout(() => {
                    setActiveStage10NoteR2(i);
                    engineRef.current?.playPianoTone(getNoteById(n.note).frequency, {
                      durationMs: n.rhythm === "half" ? 2000 : n.rhythm === "whole" ? 4000 : 1000,
                    });
                  }, timeOffset);
                  timeOffset += n.rhythm === "half" ? 2000 : n.rhythm === "whole" ? 4000 : 1000;
                });

                // Apagar y mostrar completado
                setTimeout(() => {
                  setActiveStage10NoteR2(null);
                  setScore((s) => s + 50);
                }, timeOffset);
              }}
              className="mb-8 w-24 h-24 bg-fuchsia-50 rounded-full flex items-center justify-center hover:bg-fuchsia-100 transition-colors cursor-pointer border border-fuchsia-200"
            >
              <Play className="w-10 h-10 text-fuchsia-500 ml-1" fill="currentColor" />
            </button>

            <button
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
            <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-8 relative">
              <Trophy className="w-16 h-16 text-amber-500" />
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                +{score} XP
              </div>
            </div>

            <h1 className="text-4xl font-black mb-6 text-slate-800">¡Entendiste el compás!</h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed">
              La música no sólo tiene notas y ritmo. También necesita organización. Las barras y los
              compases permiten que puedas leer y entender el flujo del tiempo de forma limpia.
            </p>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center w-full max-w-sm mb-12">
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <Star className="w-6 h-6 fill-current" />
                <span className="font-bold">Arquitecto del Ritmo</span>
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Logro Desbloqueado
              </div>
            </div>

            <Link
              href="/modulos/1/unidad-9"
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
                className="h-full bg-amber-500 transition-all duration-500 ease-out"
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
