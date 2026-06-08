"use client";

import { ArrowLeft, FileText, PlayCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ArcadeEngineResult } from "@/components/arcade/ArcadeEngine";
import { ArcadePlayer } from "@/components/arcade/ArcadePlayer";
import { ArcadeResultModal } from "@/components/arcade/components/ArcadeResultModal";
import { OsmdRenderer } from "@/components/lesson/notation/renderers/OsmdRenderer";
import { OsmdPlayerControl } from "@/components/repertoire/OsmdPlayerControl";
import { builtInRepertoire, type RepertoireSong } from "@/data/repertoire/songs";
import { useOsmdPlayer } from "@/hooks/useOsmdPlayer";
import { parseMusicXMLToArcadeNotes } from "@/lib/music/xmlParser";
import { getUserScore } from "@/lib/storage/userScores";

export default function RepertoireViewerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [song, setSong] = useState<RepertoireSong | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [osmdInstance, setOsmdInstance] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"arcade" | "classic">("arcade");
  const [arcadeNotes, setArcadeNotes] = useState<any[]>([]);
  const [arcadeBarlines, setArcadeBarlines] = useState<number[]>([]);
  const [arcadeBeats, setArcadeBeats] = useState<number[]>([]);
  const [result, setResult] = useState<ArcadeEngineResult | null>(null);

  const { isPlaying, bpm, togglePlay, stop, setBpm } = useOsmdPlayer({ osmd: osmdInstance });

  useEffect(() => {
    async function loadSong() {
      // First check built-in
      const builtIn = builtInRepertoire.find((s) => s.id === id);
      if (builtIn) {
        setSong(builtIn);
        const parsed = parseMusicXMLToArcadeNotes(builtIn.xmlData, 100);
        setArcadeNotes(parsed.notes);
        setArcadeBarlines(parsed.barlines);
        setArcadeBeats(parsed.beats || []);
        setIsLoading(false);
        return;
      }

      // Then check user scores
      try {
        const userScore = await getUserScore(id);
        if (userScore) {
          setSong(userScore);
          const parsed = parseMusicXMLToArcadeNotes(userScore.xmlData, 100);
          setArcadeNotes(parsed.notes);
          setArcadeBarlines(parsed.barlines);
          setArcadeBeats(parsed.beats || []);
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
        <button
          onClick={() => router.push("/repertorio")}
          className="mt-4 text-blue-deep font-bold hover:underline"
        >
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
        <div className="bg-[#070b14] rounded-3xl p-6 shadow-sm border border-slate-800">
          {arcadeNotes.length > 0 ? (
            <ArcadePlayer
              notes={arcadeNotes}
              barlines={arcadeBarlines}
              beats={arcadeBeats}
              onFinish={setResult}
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-2xl border-4 border-slate-800">
              <span className="text-slate-400 font-medium">Parseando XML...</span>
            </div>
          )}
        </div>
      )}

      {result && (
        <ArcadeResultModal
          result={result}
          onRetry={() => setResult(null)}
          onClose={() => router.push("/repertorio")}
        />
      )}
    </div>
  );
}
