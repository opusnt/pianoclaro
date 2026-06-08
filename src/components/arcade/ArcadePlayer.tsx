"use client";

import {
  ArrowDownToLine,
  Bot,
  Clock,
  Hand,
  ListMusic,
  Pause,
  Play,
  Repeat,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import type { ArcadeEngineProps } from "./ArcadeEngine";

const ArcadeEngine = dynamic(() => import("./ArcadeEngine").then((mod) => mod.ArcadeEngine), {
  ssr: false,
});

export function ArcadePlayer(props: ArcadeEngineProps) {
  const [speed, setSpeed] = useState(1);
  const [mutedStaffs, setMutedStaffs] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [waitModeEnabled, setWaitModeEnabled] = useState(false);
  const [viewMode, setViewMode] = useState<"staff" | "waterfall">("staff");
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loopStartMeasure, setLoopStartMeasure] = useState(1);
  const [loopEndMeasure, setLoopEndMeasure] = useState(2);
  const [scrollSpeed, setScrollSpeed] = useState(1.0);

  // Calcular cantidad de compases disponibles (barlines)
  const totalMeasures = props.barlines ? props.barlines.length : 1;

  const hasLeftHand = useMemo(() => props.notes.some((n) => n.staff === 2), [props.notes]);
  const hasRightHand = useMemo(
    () => props.notes.some((n) => n.staff === 1 || !n.staff),
    [props.notes],
  );

  const toggleMute = (staff: number) => {
    setMutedStaffs((prev) =>
      prev.includes(staff) ? prev.filter((s) => s !== staff) : [...prev, staff],
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-5xl mx-auto">
      {/* Practice Toolbar */}
      <div className="flex flex-wrap items-center justify-between bg-slate-800 text-white p-3 rounded-t-xl shadow-lg border-b-4 border-slate-900">
        {/* Playback Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {isPlaying ? "Pausar" : "Reproducir"}
            </button>
            <button
              onClick={() => setMetronomeEnabled(!metronomeEnabled)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition ${metronomeEnabled ? "bg-amber-500 text-slate-900" : "bg-slate-700 hover:bg-slate-600 text-slate-300"}`}
              title="Activar/Desactivar Metrónomo"
            >
              <Clock size={18} />
            </button>
            <button
              onClick={() => setWaitModeEnabled(!waitModeEnabled)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition ${waitModeEnabled ? "bg-fuchsia-500 text-white" : "bg-slate-700 hover:bg-slate-600 text-slate-300"}`}
              title="Modo Espera Inteligente (El juego se pausa hasta que toques la nota correcta)"
            >
              <Hand size={18} />
              <span className="hidden sm:inline">Espera</span>
            </button>
          </div>
          <div className="flex items-center gap-1 bg-slate-700 p-1 rounded-lg border border-slate-600">
            <button
              onClick={() => setViewMode("waterfall")}
              className={`px-3 py-1.5 rounded-md text-sm font-bold transition flex items-center gap-1 ${viewMode === "waterfall" ? "bg-slate-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              title="Vista Cascada (Notas cayendo)"
            >
              <ArrowDownToLine size={14} />
              <span className="hidden md:inline">Cascada</span>
            </button>
            <button
              onClick={() => setViewMode("staff")}
              className={`px-3 py-1.5 rounded-md text-sm font-bold transition flex items-center gap-1 ${viewMode === "staff" ? "bg-slate-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              title="Vista Partitura (Pentagrama horizontal)"
            >
              <ListMusic size={14} />
              <span className="hidden md:inline">Partitura</span>
            </button>
          </div>
        </div>

        {/* Practice Tools */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-3 sm:mt-2">
          {/* Looping A/B */}
          {totalMeasures > 1 && (
            <div className="flex items-center gap-2 bg-slate-700/50 p-1.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setLoopEnabled(!loopEnabled)}
                className={`p-1.5 rounded-md transition ${loopEnabled ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-slate-200"}`}
                title="Repetir sección en bucle"
              >
                <Repeat size={16} />
              </button>
              {loopEnabled && (
                <div className="flex items-center gap-1 text-sm">
                  <select
                    value={loopStartMeasure}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLoopStartMeasure(val);
                      if (val > loopEndMeasure) setLoopEndMeasure(val);
                    }}
                    className="bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-xs text-center"
                  >
                    {Array.from({ length: totalMeasures }).map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-400">a</span>
                  <select
                    value={loopEndMeasure}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLoopEndMeasure(val);
                      if (val < loopStartMeasure) setLoopStartMeasure(val);
                    }}
                    className="bg-slate-800 border border-slate-600 rounded px-1 py-0.5 text-xs text-center"
                  >
                    {Array.from({ length: totalMeasures }).map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Speed Selector */}
          <div className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600">
            <span className="text-xs font-semibold text-slate-300">Tempo:</span>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-20 accent-blue-500"
            />
            <span className="text-xs font-mono w-8 text-right text-blue-300">
              {speed.toFixed(1)}x
            </span>
          </div>

          {/* Velocidad de Caída (Scroll Speed) */}
          <div
            className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-600"
            title="Velocidad visual a la que caen las notas (Scroll Speed)"
          >
            <span className="text-xs font-semibold text-slate-300">Scroll:</span>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400"
            />
            <span className="text-xs font-mono w-8 text-right text-cyan-300">
              {scrollSpeed.toFixed(1)}x
            </span>
          </div>

          {/* Hand Isolation Toggles */}
          {(hasLeftHand || hasRightHand) && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-300">Tú tocas:</span>
              {hasLeftHand && (
                <button
                  onClick={() => toggleMute(2)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-bold transition ${mutedStaffs.includes(2) ? "bg-slate-700 text-slate-400 border border-slate-600" : "bg-purple-600 text-white"}`}
                  title={
                    mutedStaffs.includes(2)
                      ? "La computadora toca la Izquierda (Auto-play)"
                      : "Tú tocas la Mano Izquierda"
                  }
                >
                  {mutedStaffs.includes(2) ? <Bot size={14} /> : <User size={14} />}
                  Izq
                </button>
              )}
              {hasRightHand && (
                <button
                  onClick={() => toggleMute(1)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-bold transition ${mutedStaffs.includes(1) ? "bg-slate-700 text-slate-400 border border-slate-600" : "bg-blue-600 text-white"}`}
                  title={
                    mutedStaffs.includes(1)
                      ? "La computadora toca la Derecha (Auto-play)"
                      : "Tú tocas la Mano Derecha"
                  }
                >
                  {mutedStaffs.includes(1) ? <Bot size={14} /> : <User size={14} />}
                  Der
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Arcade Engine Wrapper */}
      <div className="bg-slate-50 p-4 rounded-b-xl shadow-xl border-x-4 border-b-4 border-slate-800">
        <ArcadeEngine
          {...props}
          speedMultiplier={speed}
          scrollSpeedMultiplier={scrollSpeed}
          mutedStaffs={mutedStaffs}
          isPlayingExternal={isPlaying}
          onPlayStateChange={setIsPlaying}
          metronomeEnabled={metronomeEnabled}
          isWaitMode={waitModeEnabled}
          viewMode={viewMode}
          loopRange={loopEnabled ? [loopStartMeasure, loopEndMeasure] : undefined}
        />
      </div>
    </div>
  );
}
