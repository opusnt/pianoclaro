"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ArcadeEngineResult, ArcadeNote } from "@/components/arcade/ArcadeEngine";
import { ArcadePlayer } from "@/components/arcade/ArcadePlayer";
import { sightReadingExercises } from "@/data/training/sightReadingExercises";
import { parseMusicXMLToArcadeNotes } from "@/lib/music/xmlParser";

export default function ArcadeDemoPage() {
  const [arcadeNotes, setArcadeNotes] = useState<ArcadeNote[]>([]);
  const [arcadeBarlines, setArcadeBarlines] = useState<number[]>([]);
  const [arcadeBeats, setArcadeBeats] = useState<number[]>([]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [finalResult, setFinalResult] = useState<ArcadeEngineResult | null>(null);
  const [isWaitMode, setIsWaitMode] = useState(false);
  const [speed, setSpeed] = useState(1.5);
  const [viewMode, setViewMode] = useState<"staff" | "waterfall">("staff");
  const [mutedStaffs, setMutedStaffs] = useState<number[]>([]);

  useEffect(() => {
    // Cargar y parsear el XML al montar el componente
    const xmlData = sightReadingExercises[exerciseIndex].xmlData;
    const parsed = parseMusicXMLToArcadeNotes(xmlData, 120);
    setArcadeNotes(parsed.notes);
    setArcadeBarlines(parsed.barlines);
    setArcadeBeats(parsed.beats || []);
    setGameState("idle");
  }, [exerciseIndex]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Piano Arcade <span className="text-blue-500">BETA</span>
          </h1>
          <p className="text-slate-500 mt-2">
            Leyendo XML dinámico: <strong>{sightReadingExercises[exerciseIndex].title}</strong>
          </p>
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
            value={exerciseIndex}
            onChange={(e) => setExerciseIndex(Number(e.target.value))}
          >
            {sightReadingExercises.map((ex, i) => (
              <option key={ex.id} value={i}>
                {ex.title}
              </option>
            ))}
          </select>
          <Link
            href="/"
            className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
          >
            Volver
          </Link>
        </div>
      </div>

      <div className="w-full max-w-5xl bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mx-auto flex flex-col items-center">
        <div className="w-full mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <h3 className="font-bold text-amber-800 mb-2">🎮 Controles:</h3>
            <ul className="text-amber-700 text-sm list-disc pl-5 space-y-1">
              <li>
                Si tienes un <strong>Piano MIDI USB</strong> conectado, úsalo directamente.
              </li>
              <li>
                Si no tienes piano, usa tu <strong>teclado de computadora</strong>.
              </li>
              <li>
                <strong>Teclas Mapeadas (C4 a C5):</strong> A=Do, S=Re, D=Mi, F=Fa, G=Sol, H=La,
                J=Si, K=Do (agudo).
              </li>
            </ul>
          </div>

          <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col justify-center">
            <h3 className="font-bold text-blue-800 mb-4">⚙️ Ajustes del Motor:</h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWaitMode}
                  onChange={(e) => setIsWaitMode(e.target.checked)}
                  className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-bold text-blue-900">Modo Paciencia (Wait Mode)</div>
                  <div className="text-xs text-blue-700">
                    El motor se detendrá y te esperará si no tocas la nota a tiempo.
                  </div>
                </div>
              </label>

              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-900 text-sm">Velocidad:</span>
                <select
                  className="px-3 py-1 bg-white border border-blue-200 rounded text-blue-800 font-medium text-sm"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                >
                  <option value={0.5}>50% (Lento)</option>
                  <option value={1.0}>100% (Normal)</option>
                  <option value={1.5}>150% (Rápido)</option>
                  <option value={2.0}>200% (Extremo)</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-900 text-sm">Vista:</span>
                <div className="flex bg-white border border-blue-200 rounded text-sm overflow-hidden font-medium">
                  <button
                    type="button"
                    onClick={() => setViewMode("staff")}
                    className={`px-3 py-1 ${viewMode === "staff" ? "bg-blue-600 text-white" : "text-blue-800 hover:bg-blue-50"}`}
                  >
                    Pentagrama
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("waterfall")}
                    className={`px-3 py-1 border-l border-blue-200 ${viewMode === "waterfall" ? "bg-blue-600 text-white" : "text-blue-800 hover:bg-blue-50"}`}
                  >
                    Cascada
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-900 text-sm">Silenciar Manos:</span>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-800">
                  <input
                    type="checkbox"
                    checked={mutedStaffs.includes(1)}
                    onChange={(e) => {
                      if (e.target.checked) setMutedStaffs((prev) => [...prev, 1]);
                      else setMutedStaffs((prev) => prev.filter((s) => s !== 1));
                    }}
                  />
                  Mano Derecha
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-800">
                  <input
                    type="checkbox"
                    checked={mutedStaffs.includes(2)}
                    onChange={(e) => {
                      if (e.target.checked) setMutedStaffs((prev) => [...prev, 2]);
                      else setMutedStaffs((prev) => prev.filter((s) => s !== 2));
                    }}
                  />
                  Mano Izquierda
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mt-4 flex flex-col items-center">
          {gameState === "finished" && finalResult ? (
            <div className="bg-white rounded-3xl border-4 border-emerald-500 p-12 flex flex-col items-center justify-center shadow-2xl animate-in fade-in zoom-in duration-500 max-w-lg w-full">
              <h2 className="text-4xl font-black text-emerald-600 mb-2">¡Completado!</h2>
              <p className="text-xl text-slate-500 mb-8 font-medium">
                Ejercicio de lectura a primera vista
              </p>

              {/* Sistema Estelar */}
              <div className="flex gap-4 mb-8">
                {[1, 2, 3].map((star) => (
                  <div
                    key={star}
                    className={`relative ${finalResult.stars >= star ? "animate-[bounce_0.5s_ease-in-out]" : ""}`}
                    style={{ animationDelay: `${star * 0.2}s` }}
                  >
                    <Star
                      className={`w-20 h-20 ${finalResult.stars >= star ? "fill-amber-400 text-amber-500" : "fill-slate-100 text-slate-300"}`}
                    />
                    {finalResult.stars >= star && (
                      <div className="absolute inset-0 bg-amber-400 blur-xl opacity-30 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="w-full bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-500 font-bold">Precisión:</span>
                  <span className="text-3xl font-black text-blue-600">{finalResult.accuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Puntuación:</span>
                  <span className="text-2xl font-black text-slate-800">{finalResult.score}</span>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button
                  type="button"
                  onClick={() => setGameState("idle")}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-2xl transition-colors"
                >
                  Reintentar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExerciseIndex((prev) => (prev + 1) % sightReadingExercises.length);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg shadow-blue-500/30"
                >
                  Siguiente
                </button>
              </div>
            </div>
          ) : (gameState === "playing" || gameState === "idle") && arcadeNotes.length > 0 ? (
            <ArcadePlayer
              notes={arcadeNotes}
              barlines={arcadeBarlines}
              beats={arcadeBeats}
              isWaitMode={isWaitMode}
              viewMode={viewMode}
              mutedStaffs={mutedStaffs}
              onFinish={(result) => {
                setFinalResult(result);
                setGameState("finished");
              }}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-2xl border-4 border-slate-800">
              <span className="text-slate-400 font-medium">Cargando Partitura XML...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
