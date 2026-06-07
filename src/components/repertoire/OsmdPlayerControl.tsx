"use client";

import { Play, Pause, Square, Minus, Plus } from "lucide-react";

type OsmdPlayerControlProps = {
  isPlaying: boolean;
  bpm: number;
  onTogglePlay: () => void;
  onStop: () => void;
  onChangeBpm: (newBpm: number) => void;
};

export function OsmdPlayerControl({
  isPlaying,
  bpm,
  onTogglePlay,
  onStop,
  onChangeBpm,
}: OsmdPlayerControlProps) {
  const handleIncrease = () => onChangeBpm(Math.min(240, bpm + 5));
  const handleDecrease = () => onChangeBpm(Math.max(30, bpm - 5));

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 rounded-2xl p-4 shadow-lg border border-slate-800 w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white hover:bg-sky-500 transition-colors shadow-md active:scale-95"
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
        </button>
        <button
          onClick={onStop}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shadow-inner active:scale-95"
          aria-label="Detener y volver al inicio"
        >
          <Square className="h-5 w-5 fill-current" />
        </button>
      </div>

      <div className="flex items-center gap-4 bg-slate-800/50 px-5 py-2 rounded-xl border border-slate-700/50">
        <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Tempo</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-white font-mono font-bold w-12 text-center text-lg">{bpm}</span>
          <button
            onClick={handleIncrease}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
