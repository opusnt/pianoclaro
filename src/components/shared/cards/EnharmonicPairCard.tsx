"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface EnharmonicPairCardProps {
  note1: string; // Ej. "DO#"
  note2: string; // Ej. "REb"
  physicalNote: string; // Ej. "C#4"
  onPlay: (note: string) => Promise<void>;
}

export function EnharmonicPairCard({
  note1,
  note2,
  physicalNote,
  onPlay,
}: EnharmonicPairCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    setIsPlaying(true);
    await onPlay(physicalNote);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-3xl shadow-xl w-full max-w-sm mx-auto my-8 border-b-8 border-slate-950 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-white/60 font-bold uppercase tracking-widest text-xs mb-6">
        Misma Tecla Física
      </h3>

      <div className="flex items-center justify-center gap-6 w-full mb-8">
        <div className="flex-1 flex justify-end">
          <div className="text-3xl font-black text-fuchsia-400 drop-shadow-md">{note1}</div>
        </div>

        <div className="w-px h-12 bg-white/20" />

        <div className="flex-1 flex justify-start">
          <div className="text-3xl font-black text-sky-400 drop-shadow-md">{note2}</div>
        </div>
      </div>

      <Button
        onClick={handlePlay}
        disabled={isPlaying}
        variant="outline"
        className="rounded-full w-16 h-16 bg-white/10 hover:bg-white/20 border-white/20 text-white"
      >
        <Play className="w-8 h-8 ml-1" />
      </Button>
    </div>
  );
}
