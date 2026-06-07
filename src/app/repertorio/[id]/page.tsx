"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { builtInRepertoire, type RepertoireSong } from "@/data/repertoire/songs";
import { getUserScore } from "@/lib/storage/userScores";
import { OsmdRenderer } from "@/components/lesson/notation/renderers/OsmdRenderer";
import { ArrowLeft, PlayCircle, FileText } from "lucide-react";
import { OsmdPlayerControl } from "@/components/repertoire/OsmdPlayerControl";
import { useOsmdPlayer } from "@/hooks/useOsmdPlayer";
import dynamic from "next/dynamic";
import { parseMusicXMLToArcadeNotes } from "@/lib/music/xmlParser";

const ArcadeEngine = dynamic(() => import("@/components/arcade/ArcadeEngine").then(mod => mod.ArcadeEngine), { ssr: false });

export default function RepertoireViewerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [song, setSong] = useState<RepertoireSong | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [osmdInstance, setOsmdInstance] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"arcade" | "classic">("arcade");
  const [arcadeNotes, setArcadeNotes] = useState<any[]>([]);
  const [isWaitMode, setIsWaitMode] = useState(true);
  const [viewMode, setViewMode] = useState<"staff" | "waterfall">("staff");

  const { isPlaying, bpm, togglePlay, stop, setBpm } = useOsmdPlayer({ osmd: osmdInstance });

  useEffect(() => {
    async function loadSong() {
      // First check built-in
      const builtIn = builtInRepertoire.find(s => s.id === id);
      if (builtIn) {
        setSong(builtIn);
        setArcadeNotes(parseMusicXMLToArcadeNotes(builtIn.xmlData, 100));
        setIsLoading(false);
        return;
      }

      // Then check user scores
      try {
        const userScore = await getUserScore(id);
        if (userScore) {
          setSong(userScore);
          setArcadeNotes(parseMusicXMLToArcadeNotes(userScore.xmlData, 100));
        } else {
          // No song found
          console.error("Song not found");
        }
      } catch (error) {
        console.error("Error loading user score:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSong();
  }, [id]);

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500">Cargando partitura...</div>;
  }

  if (!song) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Partitura no encontrada</h2>
        <button onClick={() => router.push("/repertorio")} className="mt-4 text-blue-deep font-bold hover:underline">
          Volver al repertorio
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20 pt-4 px-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push("/repertorio")}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{song.title}</h1>
          <p className="text-slate-500">{song.composer}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button 
          onClick={() => setActiveTab("arcade")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === "arcade" ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
        >
          <PlayCircle className="w-5 h-5" />
          Modo Interactivo
        </button>
        <button 
          onClick={() => setActiveTab("classic")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === "classic" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
        >
          <FileText className="w-5 h-5" />
          Partitura Clásica
        </button>
      </div>

      {activeTab === "classic" && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 min-h-[60vh]">
            <OsmdRenderer xmlData={song.xmlData} onReady={(osmd) => setOsmdInstance(osmd)} />
          </div>

          <div className="pt-2">
            <OsmdPlayerControl 
              isPlaying={isPlaying} 
              bpm={bpm} 
              onTogglePlay={togglePlay} 
              onStop={stop} 
              onChangeBpm={setBpm} 
            />
          </div>
        </>
      )}

      {activeTab === "arcade" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isWaitMode} 
                  onChange={(e) => setIsWaitMode(e.target.checked)}
                  className="w-5 h-5 rounded border-fuchsia-300 text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span className="font-bold text-slate-700">Wait Mode</span>
              </label>
              
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode("staff")}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold ${viewMode === "staff" ? "bg-white text-slate-800 shadow" : "text-slate-500"}`}
                >
                  Pentagrama
                </button>
                <button 
                  onClick={() => setViewMode("waterfall")}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold ${viewMode === "waterfall" ? "bg-white text-slate-800 shadow" : "text-slate-500"}`}
                >
                  Cascada
                </button>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 italic">Conecta un teclado MIDI, o usa el micrófono.</p>
          </div>
          
          {arcadeNotes.length > 0 ? (
            <ArcadeEngine 
              key={`${activeTab}-${isWaitMode}-${viewMode}`}
              notes={arcadeNotes}
              isWaitMode={isWaitMode}
              viewMode={viewMode}
              onFinish={(result) => {
                alert(`¡Finalizado! Precisión: ${result.accuracy}% - Estrellas: ${result.stars}`);
              }}
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-2xl border-4 border-slate-800">
              <span className="text-slate-400 font-medium">Parseando XML...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
