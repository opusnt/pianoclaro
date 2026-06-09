import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";
import type { ArcadeEngineResult } from "../ArcadeEngine";

interface Props {
  result: ArcadeEngineResult;
  onRetry: () => void;
  onClose: () => void;
}

export function ArcadeResultModal({ result, onRetry, onClose }: Props) {
  const pathname = usePathname();
  const { markLessonCompleted } = useProgress();

  useEffect(() => {
    // Si la precisión es mayor al 50%, marcamos la lección como completada
    if (result.accuracy > 50) {
      markLessonCompleted(pathname);
    }
  }, [result.accuracy, pathname]);

  const getRankColor = (rank: string = "F") => {
    switch (rank) {
      case "S":
        return "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]";
      case "A":
        return "text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]";
      case "B":
        return "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]";
      case "C":
        return "text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]";
      default:
        return "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]";
    }
  };

  const getRankMessage = (rank: string = "F") => {
    switch (rank) {
      case "S":
        return "¡PERFECCIÓN ABSOLUTA!";
      case "A":
        return "¡EXCELENTE TRABAJO!";
      case "B":
        return "¡MUY BIEN HECHO!";
      case "C":
        return "¡PUEDES MEJORAR!";
      default:
        return "¡SIGUE PRACTICANDO!";
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-slate-800 border-4 border-slate-700 rounded-2xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-slate-300 mb-2">RESULTADOS</h2>

        <div className={`text-8xl font-black italic mb-2 ${getRankColor(result.rank)}`}>
          {result.rank}
        </div>

        <p className="text-xl font-bold text-white mb-6 tracking-wider">
          {getRankMessage(result.rank)}
        </p>

        <div className="w-full grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-center">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
              Precisión
            </div>
            <div className="text-2xl font-black text-white">{result.accuracy.toFixed(1)}%</div>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-center">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
              Puntos
            </div>
            <div className="text-2xl font-black text-blue-400">{result.score}</div>
          </div>
        </div>

        <div className="w-full bg-slate-900 rounded-xl border border-slate-700 p-4 mb-8">
          <h3 className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3 text-center border-b border-slate-800 pb-2">
            Desglose
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-yellow-400">Marvelous</span>
              <span className="text-white bg-slate-800 px-3 py-0.5 rounded-full">
                {result.marvelous}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-green-400">Perfect</span>
              <span className="text-white bg-slate-800 px-3 py-0.5 rounded-full">
                {result.perfect}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-blue-400">Good</span>
              <span className="text-white bg-slate-800 px-3 py-0.5 rounded-full">
                {result.good}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-orange-400">Early Release</span>
              <span className="text-white bg-slate-800 px-3 py-0.5 rounded-full">
                {result.earlyRelease}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-red-400">Miss</span>
              <span className="text-white bg-slate-800 px-3 py-0.5 rounded-full">
                {result.miss}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
            <span className="text-slate-300">Max Combo</span>
            <span className="text-white bg-orange-500/20 text-orange-400 border border-orange-500/50 px-3 py-0.5 rounded-full">
              x{result.maxCombo}
            </span>
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-900/50"
          >
            Reintentar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
