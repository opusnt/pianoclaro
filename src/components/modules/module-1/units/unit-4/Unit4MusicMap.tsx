"use client";

import {
  ArrowRight,
  CheckCircle2,
  Map,
  MoveVertical,
  Navigation,
  Play,
  Speaker,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAudioSimulator } from "@/components/shared/audio/useAudioSimulator";
import { type PitchNote, PitchVisualizer } from "@/components/shared/visualizers/PitchVisualizer";
import { linesAndSpacesExercises, soundHuntExercises } from "./pitchMappingExercises";

export function Unit4MusicMap() {
  const [stage, setStage] = useState(0);
  const { playSimulatedSound } = useAudioSimulator();

  // STAGE 1: Vertical Map
  const [interactiveY, setInteractiveY] = useState(50);

  // STAGE 3: Sound Hunting
  const [huntIndex, setHuntIndex] = useState(0);
  const [huntSelection, setHuntSelection] = useState<string | null>(null);

  // STAGE 4: Lines & Spaces
  const [lsIndex, setLsIndex] = useState(0);
  const [lsSelection, setLsSelection] = useState<string | null>(null);

  // STAGE 5: Build Map
  const [buildMapY, setBuildMapY] = useState<number[]>([]);

  // STAGE 7: Application
  const [appSelection, setAppSelection] = useState<string | null>(null);

  // Globals
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hasPlayedCurrentAudio, setHasPlayedCurrentAudio] = useState(false);

  const handleNextStage = () => {
    setStage((s) => s + 1);
    setHasPlayedCurrentAudio(false);
  };

  // --------------------------------------------------------
  // ETAPA 0: INTRO
  // --------------------------------------------------------
  if (stage === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 mt-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-500">
            <Map className="w-10 h-10" />
          </div>
          <p className="text-sm font-bold tracking-wider text-emerald-500 uppercase mb-2">
            Unidad 4
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-6">
            El mapa donde vive la música
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
            Hasta ahora escuchaste sonidos. Ahora descubrirás dónde viven y cómo se ubican en el
            espacio.
          </p>
          <button
            onClick={handleNextStage}
            className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-400 transition flex items-center gap-2"
          >
            Explorar el mapa
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 1: EL MAPA VERTICAL
  // --------------------------------------------------------
  if (stage === 1) {
    // Calcular frecuencia basada en Y (0 a 100)
    // 0 -> 130 Hz (C3), 100 -> 1046 Hz (C6)
    const handleYChange = (y: number) => {
      setInteractiveY(y);
      const minFreq = 130;
      const maxFreq = 1046;
      const freq = minFreq + (y / 100) * (maxFreq - minFreq);
      playSimulatedSound({ type: "sine", frequency: freq, duration: 0.5 });
      setHasPlayedCurrentAudio(true);
    };

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-2">1. El Mapa Vertical</h2>
          <p className="text-slate-500 mb-8">
            Toca distintas alturas en este lienzo vacío. ¿Qué pasa con el sonido?
          </p>

          <div className="w-full max-w-sm mx-auto mb-8 relative">
            <PitchVisualizer
              linesCount={0}
              interactive={true}
              onPositionClick={handleYChange}
              notes={[{ id: "n1", yPos: interactiveY, pulse: true }]}
            />
            <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 flex flex-col items-center text-slate-500">
              <span className="text-xs font-bold mb-2 uppercase">Agudo</span>
              <MoveVertical className="w-6 h-6" />
              <span className="text-xs font-bold mt-2 uppercase">Grave</span>
            </div>
          </div>

          <div className="p-6 bg-emerald-50 rounded-2xl mb-8 border border-emerald-100 text-emerald-900">
            <p className="font-bold text-lg mb-2">Descubrimiento</p>
            <p>
              Al mover la nota hacia <strong>arriba</strong> el sonido se vuelve más agudo.
              <br />
              Al moverla hacia <strong>abajo</strong> se vuelve más grave.
            </p>
          </div>

          <button
            onClick={handleNextStage}
            disabled={!hasPlayedCurrentAudio}
            className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 2: APARECE EL PENTAGRAMA
  // --------------------------------------------------------
  if (stage === 2) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-2">2. Las Líneas Guía</h2>
          <p className="text-slate-500 mb-8">
            Para no perdernos en el espacio vacío, usamos 5 líneas.
          </p>

          <div className="w-full max-w-sm mx-auto mb-8">
            {/* Simularemos una entrada animada en CSS cambiando linesCount */}
            <PitchVisualizer linesCount={5} interactive={false} notes={[{ id: "n1", yPos: 50 }]} />
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl mb-8">
            <p className="text-lg">
              Estas líneas forman un mapa que llamamos <strong>Pentagrama</strong>. Simplemente nos
              ayudan a ubicar qué tan aguda o grave es una nota de forma precisa.
            </p>
          </div>

          <button
            onClick={handleNextStage}
            className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl"
          >
            Comenzar la caza
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 3: CAZA DE SONIDOS (10 Ejercicios)
  // --------------------------------------------------------
  if (stage === 3) {
    const exercise = soundHuntExercises[huntIndex];
    const isLast = huntIndex === soundHuntExercises.length - 1;
    const isCorrect = huntSelection === exercise.correctZone;

    const playAudio = () => {
      playSimulatedSound({ type: "sine", frequency: exercise.targetFreq, duration: 1 });
      setHasPlayedCurrentAudio(true);
    };

    const handleNextQuiz = () => {
      if (isLast) {
        handleNextStage();
      } else {
        setHuntSelection(null);
        setHasPlayedCurrentAudio(false);
        setHuntIndex((i) => i + 1);
      }
    };

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="mb-6 flex justify-between items-center text-sm font-bold text-slate-500">
          <span>Caza de Sonidos</span>
          <span>
            {huntIndex + 1} de {soundHuntExercises.length}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-6">Escucha y ubica</h2>

          <button
            onClick={playAudio}
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all mb-8 bg-sky-500 text-white shadow-xl hover:scale-105"
          >
            <Speaker className="w-10 h-10" />
          </button>

          <p className="text-slate-500 mb-6">¿Dónde dibujarías este sonido en el pentagrama?</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            {exercise.options.map((opt) => {
              const isSelected = huntSelection === opt.zone;
              return (
                <button
                  key={opt.zone}
                  disabled={huntSelection !== null || !hasPlayedCurrentAudio}
                  onClick={() => {
                    setHuntSelection(opt.zone);
                    if (opt.zone === exercise.correctZone) setCorrectAnswers((c) => c + 1);
                  }}
                  className={`px-8 py-4 rounded-xl border-2 font-bold transition-all ${
                    isSelected
                      ? isCorrect
                        ? "bg-green-50 border-green-500 text-green-700"
                        : "bg-rose-50 border-rose-500 text-rose-700"
                      : "bg-white border-slate-200 hover:border-sky-300 text-slate-600"
                  } ${!hasPlayedCurrentAudio ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {huntSelection && (
            <div className="animate-in fade-in flex flex-col items-center">
              <p
                className={`font-bold text-lg mb-4 ${isCorrect ? "text-green-600" : "text-rose-600"}`}
              >
                {isCorrect ? "¡Correcto!" : "Ups, era " + exercise.correctZone + "."}
              </p>

              <div className="w-full max-w-[200px] mb-6">
                <PitchVisualizer
                  linesCount={5}
                  notes={[
                    {
                      id: "ans",
                      yPos:
                        exercise.correctZone === "arriba"
                          ? 85
                          : exercise.correctZone === "centro"
                            ? 50
                            : 15,
                      color: isCorrect ? "bg-green-500" : "bg-rose-500",
                    },
                  ]}
                />
              </div>

              <button
                onClick={handleNextQuiz}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl"
              >
                {isLast ? "Siguiente Etapa" : "Siguiente Sonido"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 4: LÍNEAS Y ESPACIOS
  // --------------------------------------------------------
  if (stage === 4) {
    const exercise = linesAndSpacesExercises[lsIndex];
    const isLast = lsIndex === linesAndSpacesExercises.length - 1;
    const isCorrect = lsSelection === (exercise.isLine ? "line" : "space");

    const handleNextQuiz = () => {
      if (isLast) handleNextStage();
      else {
        setLsSelection(null);
        setLsIndex((i) => i + 1);
      }
    };

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-2">Líneas y Espacios</h2>
          <p className="text-slate-500 mb-8">
            Una nota puede atravesar una línea, o puede vivir en el espacio blanco entre dos líneas.
          </p>

          <div className="w-full max-w-[200px] mx-auto mb-8">
            <PitchVisualizer
              linesCount={5}
              notes={[{ id: "n1", yPos: exercise.yPos, color: "bg-indigo-500" }]}
            />
          </div>

          <p className="text-xl font-bold mb-6">¿Esta nota está en una línea o en un espacio?</p>

          <div className="flex justify-center gap-4 mb-8">
            {[
              { id: "line", label: "En una Línea" },
              { id: "space", label: "En un Espacio" },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={lsSelection !== null}
                onClick={() => {
                  setLsSelection(opt.id);
                  if (opt.id === (exercise.isLine ? "line" : "space"))
                    setCorrectAnswers((c) => c + 1);
                }}
                className={`px-6 py-4 rounded-xl border-2 font-bold transition-all ${
                  lsSelection === opt.id
                    ? isCorrect
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "bg-rose-50 border-rose-500 text-rose-700"
                    : "bg-white border-slate-200 hover:border-indigo-300 text-slate-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {lsSelection && (
            <button
              onClick={handleNextQuiz}
              className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl animate-in fade-in"
            >
              {isLast ? "Siguiente Etapa" : "Siguiente Nota"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 5: CONSTRUYE EL MAPA
  // --------------------------------------------------------
  if (stage === 5) {
    const targetSteps = [20, 35, 50, 65, 80]; // Posiciones a completar (escalera)

    const handleYChange = (y: number) => {
      // Encontrar el paso más cercano (snap to grid)
      const closest = targetSteps.reduce((prev, curr) =>
        Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev,
      );

      if (!buildMapY.includes(closest)) {
        // Reproducir sonido al colocar
        const freq = 130 + (closest / 100) * 800;
        playSimulatedSound({ type: "sine", frequency: freq, duration: 0.5 });

        const newArr = [...buildMapY, closest].sort((a, b) => a - b);
        setBuildMapY(newArr);
        if (newArr.length === 5) setCorrectAnswers((c) => c + 1); // Premio por completar
      }
    };

    const isComplete = buildMapY.length === 5;

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-2">Construye una Escalera</h2>
          <p className="text-slate-500 mb-8">
            Toca 5 líneas diferentes, desde abajo hacia arriba, para construir una escalera de
            sonidos.
          </p>

          <div className="w-full max-w-sm mx-auto mb-8">
            <PitchVisualizer
              linesCount={5}
              interactive={!isComplete}
              onPositionClick={handleYChange}
              notes={buildMapY.map((y, i) => ({ id: `bn-${i}`, yPos: y, color: "bg-amber-500" }))}
            />
          </div>

          {!isComplete ? (
            <p className="font-bold text-amber-500 animate-pulse">
              Has colocado {buildMapY.length} de 5 notas.
            </p>
          ) : (
            <div className="animate-in fade-in">
              <p className="font-bold text-green-600 text-xl mb-6">
                ¡Perfecto! Has construido una escala ascendente.
              </p>
              <button
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

  // --------------------------------------------------------
  // ETAPA 6: LÍNEAS ADICIONALES
  // --------------------------------------------------------
  if (stage === 6) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-2">Fuera del Mapa</h2>
          <p className="text-slate-500 mb-8">
            Cuando los sonidos son muy agudos o muy graves y se salen del pentagrama, usamos líneas
            extra.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-8 mb-8">
            <div className="w-full max-w-[150px] mx-auto">
              <PitchVisualizer
                linesCount={5}
                showLedgers={true}
                notes={[{ id: "l1", yPos: 10, color: "bg-indigo-600" }]}
              />
              <p className="mt-4 font-bold text-slate-500 text-sm">
                Líneas Inferiores
                <br />
                (Sonidos Muy Graves)
              </p>
            </div>
            <div className="w-full max-w-[150px] mx-auto">
              <PitchVisualizer
                linesCount={5}
                showLedgers={true}
                notes={[{ id: "l2", yPos: 90, color: "bg-rose-500" }]}
              />
              <p className="mt-4 font-bold text-slate-500 text-sm">
                Líneas Superiores
                <br />
                (Sonidos Muy Agudos)
              </p>
            </div>
          </div>

          <button
            onClick={handleNextStage}
            className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl"
          >
            Prueba Final
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 7: APLICACIÓN
  // --------------------------------------------------------
  if (stage === 7) {
    const isCorrect = appSelection === "sube";

    const playSequence = () => {
      // Tocar grave, medio, agudo
      playSimulatedSound({ type: "sine", frequency: 220, duration: 0.5 });
      setTimeout(() => playSimulatedSound({ type: "sine", frequency: 440, duration: 0.5 }), 500);
      setTimeout(() => playSimulatedSound({ type: "sine", frequency: 880, duration: 0.5 }), 1000);
      setHasPlayedCurrentAudio(true);
    };

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-6">Elige la Trayectoria</h2>

          <button
            onClick={playSequence}
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all mb-8 bg-sky-500 text-white shadow-xl hover:scale-105"
          >
            <Speaker className="w-10 h-10" />
          </button>

          <p className="text-lg font-medium text-slate-600 mb-6">
            Escucha la secuencia. ¿Qué dibujo representa mejor lo que sonó?
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
            {[
              { id: "sube", label: "Sube ↗" },
              { id: "baja", label: "Baja ↘" },
              { id: "sube-baja", label: "Sube y Baja ↗↘" },
              { id: "baja-sube", label: "Baja y Sube ↘↗" },
            ].map((opt) => (
              <button
                key={opt.id}
                disabled={appSelection !== null || !hasPlayedCurrentAudio}
                onClick={() => {
                  setAppSelection(opt.id);
                  if (opt.id === "sube") setCorrectAnswers((c) => c + 1);
                }}
                className={`p-6 rounded-xl border-2 font-bold text-xl transition-all ${
                  appSelection === opt.id
                    ? opt.id === "sube"
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "bg-rose-50 border-rose-500 text-rose-700"
                    : "bg-white border-slate-200 hover:border-sky-300 text-slate-600"
                } ${!hasPlayedCurrentAudio ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {appSelection && (
            <div className="animate-in fade-in">
              <p className={`font-bold mb-6 ${isCorrect ? "text-green-600" : "text-rose-600"}`}>
                {isCorrect
                  ? "¡Excelente! Los tres sonidos fueron cada vez más agudos."
                  : "En realidad, cada sonido era más agudo que el anterior, por lo que la trayectoria visual debe SUBIR."}
              </p>
              <button
                onClick={() => {
                  const totalExercises =
                    soundHuntExercises.length + linesAndSpacesExercises.length + 2; // +1 build map, +1 app
                  localStorage.setItem("module1.unit4.completed", "true");
                  localStorage.setItem(
                    "module1.unit4.score",
                    Math.round((correctAnswers / totalExercises) * 100).toString(),
                  );
                  handleNextStage();
                }}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl"
              >
                Ver Resultados
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 8: PANTALLA FINAL
  // --------------------------------------------------------
  const totalExercises = soundHuntExercises.length + linesAndSpacesExercises.length + 2;
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl shadow-[0_20px_40px_rgba(18,52,91,0.08)] max-w-2xl mx-auto mt-12 border border-emerald-500/10">
      <Trophy className="w-24 h-24 text-gold-soft mb-6" />
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Ya sabes orientarte en el mapa</h2>
      <p className="text-lg text-slate-500 mb-6 max-w-lg">
        Ahora entiendes cómo los sonidos ocupan posiciones dentro del pentagrama. Pronto aprenderás
        quién es quién dentro de este mapa.
      </p>

      <div className="bg-slate-50 rounded-2xl p-6 w-full mb-8 flex justify-around">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">Respuestas Correctas</p>
          <p className="text-3xl font-black text-emerald-600">
            {correctAnswers} <span className="text-lg text-slate-500">/ {totalExercises}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">XP Obtenido</p>
          <p className="text-3xl font-black text-amber-500">+200</p>
        </div>
      </div>

      <Link
        href="/modulos/1/unidad-5"
        className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition transform hover:scale-105 active:scale-95"
      >
        Continuar
      </Link>
    </div>
  );
}
