"use client";

import {
  ArrowRight,
  BookOpen,
  Compass,
  Eye,
  Music,
  Play,
  Search,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAudioSimulator } from "@/components/shared/audio/useAudioSimulator";
import { TrebleClefVisualizer } from "@/components/shared/visualizers/TrebleClefVisualizer";
import { getNoteById, notesData } from "@/lib/music/notesData";
import { ReadingExercise } from "./components/ReadingExercise";
import {
  activeReadingSequence,
  guidedReadingSequences,
  microMelodySequence,
  trebleClefExercises,
} from "./trebleClefExercises";

export function Unit6TrebleClef() {
  const [stage, setStage] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const { playSimulatedSound } = useAudioSimulator();

  // Custom states
  const [spiralRevealed, setSpiralRevealed] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<string[]>([]);
  const [userSeq, setUserSeq] = useState<string[]>([]);
  const [activeSongNote, setActiveSongNote] = useState<string | null>(null);

  const handleNextStage = () => {
    setStage((s) => s + 1);
    setSubIndex(0);
    setHasPlayedAudio(false);
    setUserSeq([]);
    setExpandedNotes([]);
    setSpiralRevealed(false);
  };

  const playNote = (id: string, duration = 0.5) => {
    const n = getNoteById(id);
    playSimulatedSound({ type: "sine", frequency: n.frequency, duration });
  };

  // 0. Intro
  if (stage === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-12 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-fuchsia-100 rounded-full flex items-center justify-center mb-6 text-fuchsia-500">
            <Compass className="w-10 h-10" />
          </div>
          <p className="text-sm font-bold tracking-wider text-fuchsia-500 uppercase mb-2">
            Unidad 6
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-6">
            La brújula del pentagrama
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
            Ya conoces a los habitantes del pentagrama. Ahora descubrirás la herramienta mágica que
            usan los músicos para saber dónde vive cada uno de ellos sin memorizar a ciegas.
          </p>
          <button
            type="button"
            onClick={handleNextStage}
            className="px-8 py-4 bg-fuchsia-500 text-white font-bold rounded-xl shadow-lg hover:bg-fuchsia-400 transition flex items-center gap-2"
          >
            Comenzar <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 1. Misterio
  if (stage === 1) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <Eye className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Misterio</h2>
          </div>
          <h3 className="text-2xl font-bold mb-4">¿Qué crees que significa este símbolo?</h3>
          <p className="text-slate-500 mb-10">
            Probablemente lo has visto en todas partes, pero ¿sabes para qué sirve exactamente?
          </p>
          <div className="mb-12 w-full max-w-3xl mx-auto">
            <TrebleClefVisualizer />
          </div>
          <button
            type="button"
            onClick={handleNextStage}
            className="px-8 py-3 bg-white hover:bg-slate-800 text-slate-900 font-bold rounded-xl transition-colors"
          >
            Descubrirlo
          </button>
        </div>
      </div>
    );
  }

  // 2. La Espiral
  if (stage === 2) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-4">La espiral mágica</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Observa atentamente el centro del símbolo. La espiral gira y envuelve exactamente a la{" "}
            <strong>segunda línea</strong>.
          </p>

          <div className="mb-8 relative w-full max-w-3xl mx-auto">
            <TrebleClefVisualizer
              highlightSecondLine={true}
              animateClef={!spiralRevealed}
              notes={
                spiralRevealed
                  ? [
                      {
                        id: "sol",
                        yPos: getNoteById("sol").yPos,
                        color: "bg-sky-500 text-white shadow-lg",
                        label: "SOL",
                      },
                    ]
                  : []
              }
            />
          </div>

          {!spiralRevealed ? (
            <button
              type="button"
              onClick={() => {
                setSpiralRevealed(true);
                playNote("sol", 0.8);
              }}
              className="px-8 py-3 bg-fuchsia-500 text-white font-bold rounded-xl hover:bg-fuchsia-400 transition-colors animate-pulse"
            >
              ¿Quién vive en esa línea?
            </button>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <p className="text-xl font-bold text-sky-600 mb-6">
                ¡Exacto! Es simplemente un cartel que dice:
                <br />
                <br />
                "Aquí vive SOL"
              </p>
              <button
                type="button"
                onClick={handleNextStage}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Encuentra el SOL
  if (stage === 3) {
    const TOTAL_SOL_EXERCISES = 5;
    const isLast = subIndex >= TOTAL_SOL_EXERCISES - 1;

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <Target className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Encuentra el SOL</h2>
          </div>
          <p className="text-slate-500 mb-8 font-medium">
            Toca la línea de SOL en el pentagrama para confirmar. ({subIndex}/5)
          </p>

          <div
            className="mb-8 animate-in slide-in-from-right-4 w-full max-w-3xl mx-auto"
            key={`sol-ex-${subIndex}`}
          >
            <TrebleClefVisualizer
              interactive={true}
              onPositionClick={(y) => {
                const solPos = getNoteById("sol").yPos;
                if (Math.abs(y - solPos) < 5) {
                  playNote("sol", 0.3);
                  if (isLast) handleNextStage();
                  else setSubIndex((i) => i + 1);
                } else {
                  playSimulatedSound({ type: "noise", duration: 0.2 }, 300);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 4. Expande desde SOL
  if (stage === 4) {
    const steps = [
      { id: "sol", desc: "Todo empieza desde SOL." },
      { id: "la", desc: "Justo encima, en el espacio, está LA." },
      { id: "fa", desc: "Justo debajo, en el espacio, está FA." },
      { id: "si", desc: "Arriba de LA, en la tercera línea, está SI." },
      { id: "mi", desc: "Debajo de FA, en la primera línea, está MI." },
      { id: "do", desc: "Debajo del pentagrama (con una línea extra) está DO." },
      { id: "re", desc: "Flotando bajo la primera línea está RE." },
    ];

    const isComplete = expandedNotes.length === steps.length;
    const currentStep = expandedNotes.length;

    const handleRevealNext = () => {
      const nextId = steps[currentStep].id;
      setExpandedNotes([...expandedNotes, nextId]);
      playNote(nextId, 0.5);
    };

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <Search className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Vecinos de SOL</h2>
          </div>

          <div className="mb-8 min-h-[4rem] flex flex-col justify-center">
            {currentStep > 0 ? (
              <p className="text-xl font-bold text-slate-800 animate-in fade-in slide-in-from-bottom-2">
                {steps[currentStep - 1].desc}
              </p>
            ) : (
              <p className="text-xl font-medium text-slate-500">
                Usa SOL como referencia para encontrar a sus vecinos, sin memorizar a ciegas.
              </p>
            )}
          </div>

          <div className="mb-10 w-full max-w-3xl mx-auto">
            <TrebleClefVisualizer
              notes={expandedNotes.map((id) => {
                const n = getNoteById(id);
                return { id, yPos: n.yPos, color: `${n.color} text-slate-900`, label: n.name };
              })}
            />
          </div>

          {!isComplete ? (
            <button
              type="button"
              onClick={handleRevealNext}
              className="px-8 py-3 bg-fuchsia-500 text-white font-bold rounded-xl transition-all hover:scale-105"
            >
              {currentStep === 0 ? "Empezar con SOL" : "Revelar vecino"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStage}
              className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl animate-in fade-in"
            >
              ¡Entiendo la lógica! Siguiente
            </button>
          )}
        </div>
      </div>
    );
  }

  // 5. Lectura por vecindad
  if (stage === 5) {
    const subset = trebleClefExercises.filter((e) => e.difficulty <= 2).slice(0, 5);
    const exercise = subset[subIndex];
    const isLast = subIndex >= subset.length - 1;

    let pista = "Deduce la nota contando líneas y espacios.";
    if (exercise.targetNoteId === "la") pista = "Justo encima de SOL";
    if (exercise.targetNoteId === "fa") pista = "Justo debajo de SOL";
    if (exercise.targetNoteId === "sol") pista = "En la línea de la espiral";
    if (exercise.targetNoteId === "si") pista = "Dos pasos arriba de SOL";
    if (exercise.targetNoteId === "mi") pista = "Dos pasos debajo de SOL";

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100">
          <p className="text-center text-sm font-bold text-fuchsia-500 tracking-widest uppercase mb-2">
            Lectura relacional ({subIndex + 1}/5)
          </p>
          <p className="text-center font-medium text-slate-500 mb-6">Pista: {pista}</p>
          <ReadingExercise
            targetNoteId={exercise.targetNoteId}
            question="¿Qué nota es?"
            options={["mi", "fa", "sol", "la", "si"]}
            onAnswer={(correct) => {
              if (correct) setCorrectAnswers((c) => c + 1);
            }}
            onNext={() => {
              if (isLast) handleNextStage();
              else setSubIndex((i) => i + 1);
            }}
          />
        </div>
      </div>
    );
  }

  // 6. ¿Qué nota es? (Toda la escala)
  if (stage === 6) {
    const exercise = trebleClefExercises[subIndex];
    const isLast = subIndex >= trebleClefExercises.length - 1;

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100">
          <p className="text-center text-sm font-bold text-fuchsia-500 tracking-widest uppercase mb-6">
            Identificación ({subIndex + 1}/{trebleClefExercises.length})
          </p>
          <ReadingExercise
            key={`ident-${subIndex}`}
            targetNoteId={exercise.targetNoteId}
            question="¿Qué nota es?"
            options={notesData.map((n) => n.id)}
            onAnswer={(correct) => {
              if (correct) setCorrectAnswers((c) => c + 1);
            }}
            onNext={() => {
              if (isLast) handleNextStage();
              else setSubIndex((i) => i + 1);
            }}
          />
        </div>
      </div>
    );
  }

  // 7. Velocidad (Flash Mode)
  if (stage === 7) {
    // Tomamos 8 ejercicios al azar
    const TOTAL_FLASH = 8;
    const exercise = trebleClefExercises[subIndex % trebleClefExercises.length];
    const isLast = subIndex >= TOTAL_FLASH - 1;

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100">
          <div className="flex items-center justify-center gap-2 mb-2 text-fuchsia-500">
            <Zap className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">
              Flash Mode ({subIndex + 1}/{TOTAL_FLASH})
            </h2>
          </div>
          <p className="text-center text-slate-500 mb-6">
            La nota desaparecerá rápido. Confía en tu memoria.
          </p>
          <ReadingExercise
            key={`flash-${subIndex}`}
            targetNoteId={exercise.targetNoteId}
            question="¿Qué nota viste?"
            options={notesData.map((n) => n.id)}
            flashMode={true}
            onAnswer={(correct) => {
              if (correct) setCorrectAnswers((c) => c + 1);
            }}
            onNext={() => {
              if (isLast) handleNextStage();
              else setSubIndex((i) => i + 1);
            }}
          />
        </div>
      </div>
    );
  }

  // 8. Lectura Guiada (Karaoke)
  if (stage === 8) {
    const sequence = guidedReadingSequences[subIndex];
    const isLast = subIndex >= guidedReadingSequences.length - 1;

    const playSequence = () => {
      setHasPlayedAudio(true);
      sequence.forEach((id, index) => {
        setTimeout(() => {
          setActiveSongNote(index.toString());
          playNote(id, 0.4);
        }, index * 600);
      });
      setTimeout(() => {
        setActiveSongNote(null);
        setTimeout(() => {
          if (isLast) handleNextStage();
          else {
            setSubIndex((i) => i + 1);
            setHasPlayedAudio(false);
          }
        }, 1000);
      }, sequence.length * 600);
    };

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Lectura Guiada</h2>
          </div>
          <p className="text-slate-500 mb-10">
            Sigue visualmente las notas. Deja que tus ojos escuchen.
          </p>

          <div className="w-full max-w-3xl mx-auto mb-10">
            <TrebleClefVisualizer
              notes={sequence.map((id, i) => {
                const isActive = activeSongNote === i.toString();
                const n = getNoteById(id);
                return {
                  id: `seq-${i}`,
                  yPos: n.yPos,
                  xPos: 30 + i * 20,
                  color: isActive
                    ? `${n.color} ring-4 ring-${n.color}/30 scale-125`
                    : "bg-slate-800",
                };
              })}
            />
          </div>

          <button
            type="button"
            disabled={hasPlayedAudio}
            onClick={playSequence}
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-fuchsia-500 hover:bg-fuchsia-400 text-white shadow-lg disabled:opacity-50"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  // 9. Lectura Activa
  if (stage === 9) {
    const sequence = activeReadingSequence;
    const isComplete = userSeq.length === sequence.length;
    const isCorrect = isComplete && userSeq.every((id, i) => id === sequence[i]);

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <Target className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Tu turno</h2>
          </div>

          <div className="w-full max-w-3xl mx-auto mb-10">
            <TrebleClefVisualizer
              notes={sequence.map((id, i) => ({
                id: `act-${i}`,
                yPos: getNoteById(id).yPos,
                xPos: 28 + i * 15,
                color: "bg-slate-800",
              }))}
            />
          </div>

          <p className="text-slate-500 mb-6 font-bold">¿Qué notas estás leyendo?</p>

          <div className="flex justify-center gap-3 mb-8 min-h-[3rem]">
            {userSeq.map((id, i) => (
              <span
                key={`ans-${i}`}
                className={`px-4 py-2 rounded-lg font-bold text-slate-900 ${getNoteById(id).color}`}
              >
                {getNoteById(id).name}
              </span>
            ))}
            {userSeq.length > 0 && !isComplete && (
              <button
                type="button"
                onClick={() => setUserSeq([])}
                className="text-slate-500 text-sm ml-2 underline"
              >
                Borrar
              </button>
            )}
          </div>

          {!isComplete ? (
            <div className="flex justify-center gap-2 flex-wrap max-w-md mx-auto">
              {notesData.map((n) => (
                <button
                  type="button"
                  key={`kbd-${n.id}`}
                  onClick={() => {
                    setUserSeq([...userSeq, n.id]);
                    playNote(n.id, 0.3);
                  }}
                  className="px-4 py-2 border-2 rounded-lg hover:bg-slate-50 font-bold"
                >
                  {n.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in">
              <p
                className={`font-bold text-lg mb-4 ${isCorrect ? "text-green-600" : "text-rose-600"}`}
              >
                {isCorrect
                  ? "¡Excelente lectura a primera vista!"
                  : "Revisa las posiciones y usa SOL como guía."}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (isCorrect) setCorrectAnswers((c) => c + 1);
                  if (isCorrect) handleNextStage();
                  else setUserSeq([]);
                }}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl"
              >
                {isCorrect ? "Siguiente" : "Intentar de nuevo"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 10. Micro Melodía
  if (stage === 10) {
    const song = microMelodySequence;

    const playMiniSong = () => {
      setHasPlayedAudio(true);
      song.forEach((id, index) => {
        setTimeout(() => {
          setActiveSongNote(index.toString());
          playNote(id, 0.4);
        }, index * 500);
      });
      setTimeout(() => {
        setActiveSongNote(null);
      }, song.length * 500);
    };

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 text-center text-slate-900">
          <h2 className="text-3xl font-black mb-4 flex items-center justify-center gap-3">
            <Music className="w-8 h-8 text-fuchsia-400" />
            Lectura fluida
          </h2>
          <p className="text-slate-500 mb-12">
            Intenta leer esta melodía en tu cabeza, luego escucha si suena como la imaginaste.
          </p>

          <div className="w-full max-w-4xl mx-auto mb-16 relative">
            <TrebleClefVisualizer
              notes={song.map((id, index) => {
                const n = getNoteById(id);
                const isActive = activeSongNote === index.toString();
                return {
                  id: `song-${index}`,
                  yPos: n.yPos,
                  xPos: 28 + index * 15,
                  color: isActive
                    ? `${n.color} text-slate-900 scale-125 shadow-[0_0_30px_currentColor]`
                    : "bg-slate-800 border-2 border-slate-200 text-transparent",
                  label: isActive ? n.name : undefined,
                };
              })}
            />
          </div>

          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={playMiniSong}
              className="w-20 h-20 rounded-full flex items-center justify-center bg-fuchsia-500 hover:bg-fuchsia-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all hover:scale-105"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>

            {hasPlayedAudio && (
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("module1.unit6.completed", "true");
                  localStorage.setItem(
                    "module1.unit6.score",
                    Math.round((correctAnswers / 38) * 100).toString(),
                  );
                  handleNextStage();
                }}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl animate-in fade-in zoom-in mt-6"
              >
                Terminar Unidad
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 11. Final
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl shadow-[0_20px_40px_rgba(18,52,91,0.08)] max-w-2xl mx-auto mt-12 border border-fuchsia-500/10">
      <Trophy className="w-24 h-24 text-gold-soft mb-6" />
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Ya sabes leer en Clave de Sol</h2>
      <p className="text-lg text-slate-500 mb-6 max-w-lg">
        Ahora puedes usar la referencia de SOL para identificar todas las notas cercanas y comenzar
        a leer música real fluidamente sin adivinar.
      </p>

      <div className="bg-slate-50 rounded-2xl p-6 w-full mb-8 flex justify-around items-center">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">XP Obtenido</p>
          <p className="text-3xl font-black text-amber-500">+350</p>
        </div>
        <div className="text-left bg-fuchsia-100 p-4 rounded-xl border border-fuchsia-200">
          <p className="text-xs font-bold text-fuchsia-600 uppercase mb-1">Logro Desbloqueado</p>
          <p className="font-black text-fuchsia-900 flex items-center gap-2">
            🏆 Explorador de la Clave
          </p>
        </div>
      </div>

      <Link
        href="/modulos/1/unidad-7"
        className="px-8 py-4 bg-fuchsia-600 text-white font-bold rounded-xl shadow-lg hover:bg-fuchsia-700 transition transform hover:scale-105 active:scale-95"
      >
        Continuar al Menú
      </Link>
    </div>
  );
}
