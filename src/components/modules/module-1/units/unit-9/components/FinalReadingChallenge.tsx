"use client";

import React, { useState, useEffect } from "react";
import type { ArcadeNote, ArcadeEngineResult } from "@/components/arcade/ArcadeEngine";
import dynamic from "next/dynamic";
import { parseMusicXMLToArcadeNotes } from "@/lib/music/xmlParser";
import { Play, Star, CheckCircle2, RotateCcw } from "lucide-react";
import { odeToJoyXml } from "./odeToJoyXml";

const ArcadeEngine = dynamic(() => import("@/components/arcade/ArcadeEngine").then(mod => mod.ArcadeEngine), { ssr: false });

interface FinalReadingChallengeProps {
  onComplete: (score: number) => void;
}

export function FinalReadingChallenge({ onComplete }: FinalReadingChallengeProps) {
  const [arcadeNotes, setArcadeNotes] = useState<ArcadeNote[]>([]);
  const [gameState, setGameState] = useState<"intro" | "playing" | "finished">("intro");
  const [finalResult, setFinalResult] = useState<ArcadeEngineResult | null>(null);

  useEffect(() => {
    if (gameState === "playing" && arcadeNotes.length === 0) {
      const notes = parseMusicXMLToArcadeNotes(odeToJoyXml, 100);
      setArcadeNotes(notes);
    }
  }, [gameState, arcadeNotes.length]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {gameState === "intro" && (
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-fuchsia-100 text-fuchsia-600 rounded-full flex items-center justify-center mb-6">
            <MusicIcon />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4 text-center">Examen Final: Himno a la Alegría</h2>
          <p className="text-slate-500 text-center mb-8 max-w-md">
            Es hora de poner a prueba todo lo que has aprendido. Tocarás tu primera canción real con ambas manos (bueno, por ahora solo la melodía). 
            El motor avanzará a tu propio ritmo (Wait Mode activado). ¡No hay prisa!
          </p>
          <button 
            onClick={() => setGameState("playing")}
            className="flex items-center gap-3 px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-full shadow-xl shadow-fuchsia-200 transition-all hover:scale-105"
          >
            <Play className="w-6 h-6" fill="currentColor" />
            <span>Comenzar Examen</span>
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="w-full relative">
          <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Modo Examen</span>
            <span className="text-slate-400 text-sm font-medium">Toca a tu propio ritmo</span>
          </div>
          {arcadeNotes.length > 0 ? (
            <ArcadeEngine 
              notes={arcadeNotes}
              onFinish={(result) => {
                setFinalResult(result);
                setGameState("finished");
              }}
              speedMultiplier={1.0}
              isWaitMode={true} // Obligatorio para alumnos en su primera vez
              viewMode="staff"
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-3xl border border-slate-200">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
            </div>
          )}
        </div>
      )}

      {gameState === "finished" && finalResult && (
        <div className="bg-white rounded-3xl border-4 border-fuchsia-500 p-8 md:p-12 flex flex-col items-center justify-center shadow-2xl animate-in fade-in zoom-in duration-500 w-full max-w-lg">
          <h2 className="text-4xl font-black text-fuchsia-600 mb-2">¡Completado!</h2>
          <p className="text-xl text-slate-500 mb-8 font-medium">Himno a la Alegría</p>
          
          <div className="flex gap-4 mb-8">
            {[1, 2, 3].map((star) => (
              <div key={star} className={`relative ${finalResult.stars >= star ? "animate-[bounce_0.5s_ease-in-out]" : ""}`} style={{ animationDelay: `${star * 0.2}s` }}>
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
              <span className="text-3xl font-black text-fuchsia-600">{finalResult.accuracy}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Puntuación:</span>
              <span className="text-2xl font-black text-slate-800">{finalResult.score}</span>
            </div>
          </div>
          
          <div className="flex gap-4 w-full">
            <button 
              onClick={() => {
                setArcadeNotes([]);
                setGameState("playing");
              }}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reintentar
            </button>
            <button 
              onClick={() => onComplete(finalResult.accuracy)}
              className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg shadow-fuchsia-500/30 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MusicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  );
}
