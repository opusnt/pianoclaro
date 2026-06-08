"use client";

import { Mic, MicOff, Music2, Play, RefreshCw, Trophy } from "lucide-react";
import { useCallback, useState } from "react";
import { OsmdRenderer } from "@/components/lesson/notation/renderers/OsmdRenderer";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  type SightReadingExercise,
  sightReadingExercises,
} from "@/data/training/sightReadingExercises";
import { useSightReadingGame } from "@/hooks/useSightReadingGame";

export default function EntrenamientoPage() {
  const [selectedExercise, setSelectedExercise] = useState<SightReadingExercise | null>(null);
  const [osmdInstance, setOsmdInstance] = useState<any | null>(null);
  const [gameEnabled, setGameEnabled] = useState(false);

  const { score, isFinished, micError, lastDetectedNote, expectedNote, debugInfo, resetGame } =
    useSightReadingGame({
      osmd: osmdInstance,
      enabled: gameEnabled,
      onFinish: (finalScore) => {
        console.log("Juego Terminado. Puntos:", finalScore);
        setGameEnabled(false);
      },
    });

  const handleReady = useCallback((osmd: any) => {
    setOsmdInstance(osmd);
  }, []);

  const startGame = (exercise: SightReadingExercise) => {
    setSelectedExercise(exercise);
    setGameEnabled(true);
    setOsmdInstance(null); // Reset OSMD to force reload
  };

  const stopGame = () => {
    setGameEnabled(false);
    setSelectedExercise(null);
  };

  if (selectedExercise) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 pb-20 pt-8 px-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{selectedExercise.title}</h1>
            <p className="text-slate-500 text-sm mt-1">{selectedExercise.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-900 text-white px-6 py-2 rounded-xl flex items-center gap-3 shadow-md">
              <span className="text-slate-400 font-bold text-sm uppercase">Puntos</span>
              <span className="text-2xl font-black text-cyan-400">{score}</span>
            </div>

            <button
              onClick={resetGame}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Reiniciar
            </button>

            <button
              onClick={stopGame}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Microphone Status */}
        <div
          className={`p-3 rounded-xl flex justify-center items-center gap-2 text-sm font-bold transition-colors ${
            micError
              ? "bg-red-50 text-red-700 border border-red-200"
              : gameEnabled && !isFinished
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          {micError ? (
            <>
              <MicOff className="w-4 h-4" /> Error: {micError}
            </>
          ) : gameEnabled && !isFinished ? (
            <div className="flex justify-between items-center w-full px-4 text-xs">
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-blue-500 animate-pulse" />
                <span className="font-medium">
                  Esperando:{" "}
                  <span className="text-blue-600 font-black text-sm">{expectedNote || "?"}</span>
                </span>
              </span>
              <span className="flex items-center gap-4 text-slate-400 font-normal">
                <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded">
                  VOL: {debugInfo?.rms ? Number(debugInfo.rms).toFixed(4) : "0.0000"} | HZ:{" "}
                  {debugInfo?.pitch ? String(Math.round(Number(debugInfo.pitch))) : "---"}
                </span>
                <span>
                  Nota detectada:{" "}
                  <span className="font-bold text-slate-700 text-sm">
                    {lastDetectedNote || "--"}
                  </span>
                </span>
              </span>
            </div>
          ) : isFinished ? (
            <div className="flex items-center gap-2 text-green-600 font-bold justify-center w-full">
              <span>🎉 ¡Excelente trabajo! Has completado el fragmento perfectamente.</span>
              <Button size="sm" onClick={resetGame} variant="primary" className="ml-4">
                Volver a intentar
              </Button>
            </div>
          ) : (
            <>
              <MicOff className="w-4 h-4" /> Juego pausado
            </>
          )}
        </div>

        {/* Notación Visual */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 min-h-[300px] overflow-hidden overflow-x-auto">
          <div className="transform scale-[1.3] origin-top-left mt-4 mb-4 min-w-[800px]">
            <OsmdRenderer
              xmlData={selectedExercise.xmlData}
              onReady={handleReady}
              disableCursorSync={true}
            />
          </div>
        </div>

        {/* Pantalla de Victoria */}
        {isFinished && (
          <div className="bg-blue-deep rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-black mb-2">¡Completado!</h2>
              <p className="text-blue-100 mb-6">Lograste {score} puntos de precisión visual.</p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    resetGame();
                    setGameEnabled(true);
                  }}
                  className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-md"
                >
                  <RefreshCw className="w-5 h-5" /> Repetir
                </button>
                <button
                  onClick={stopGame}
                  className="bg-blue-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Cambiar Ejercicio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20 pt-12 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-black text-slate-800 mb-4">Gimnasio de Lectura</h1>
        <p className="text-lg text-slate-500">
          Activa tu micrófono y toca las notas en tu piano real. El cursor avanzará sólo cuando
          toques la nota correcta.
        </p>

        <button
          onClick={async () => {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                  echoCancellation: false,
                  autoGainControl: false,
                  noiseSuppression: false,
                },
              });
              alert("¡Éxito! El navegador te ha dado permiso.");
              stream.getTracks().forEach((t) => t.stop());
            } catch (err: any) {
              alert("Falló: " + err.message + " (" + err.name + ")");
            }
          }}
          className="mt-4 bg-slate-800 text-white px-4 py-2 rounded-lg font-bold"
        >
          Diagnóstico: Probar Micrófono Manualmente
        </button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sightReadingExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col hover:border-blue-deep/30 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => startGame(exercise)}
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-deep rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Music2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{exercise.title}</h3>
            <p className="text-slate-500 text-sm flex-1">{exercise.description}</p>

            <div className="mt-6 flex items-center text-blue-deep font-bold text-sm gap-1 group-hover:gap-2 transition-all">
              <Play className="w-4 h-4 fill-current" /> Jugar ahora
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
