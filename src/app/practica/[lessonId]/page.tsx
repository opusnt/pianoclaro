"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ArcadeEngineResult } from "@/components/arcade/ArcadeEngine";
import { ArcadePlayer } from "@/components/arcade/ArcadePlayer";
import { ArcadeResultModal } from "@/components/arcade/components/ArcadeResultModal";
import { builtInRepertoire } from "@/data/repertoire/songs";
import { parseMusicXMLToArcadeNotes } from "@/lib/music/xmlParser";

export default function PracticeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<ArcadeEngineResult | null>(null);

  // Por ahora, cargamos la primera partitura disponible (Ode To Joy) como prototipo
  // En un sistema real, mapearíamos el lessonId (ej. intro-2) a un XML específico.
  const song = builtInRepertoire[0];

  const { notes, barlines, beats } = useMemo(() => {
    return parseMusicXMLToArcadeNotes(song.xmlData, 100);
  }, [song.xmlData]);

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-200 flex flex-col">
      {/* Header Minimalista */}
      <div className="bg-[#070b14]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between z-30">
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-400 hover:text-white font-bold gap-1 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Volver al Curso</span>
        </button>
        <div className="text-sm font-bold text-fuchsia-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
          Sesión de Práctica
        </div>
      </div>

      {/* Área del Arcade */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-6 text-center">
            {/* Si quisieramos el nombre de la lección real, lo leeríamos de COURSES_MOCK */}
            Práctica Interactiva: {song.title}
          </h1>
          <ArcadePlayer notes={notes} barlines={barlines} beats={beats} onFinish={setResult} />
        </div>
      </div>

      {result && (
        <ArcadeResultModal
          result={result}
          onRetry={() => setResult(null)}
          onClose={() => router.back()}
        />
      )}
    </main>
  );
}
