"use client";

import { Music } from "lucide-react";
import type { NoteData } from "@/lib/music/notesData";

type NoteCardProps = {
  note: NoteData;
  isHidden?: boolean;
  isActive?: boolean;
  isCorrect?: boolean | null; // null = sin evaluar, true = green, false = red
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
};

export function NoteCard({
  note,
  isHidden = false,
  isActive = false,
  isCorrect = null,
  onClick,
  size = "md",
}: NoteCardProps) {
  const sizeClasses = {
    sm: "w-16 h-20 text-xl",
    md: "w-24 h-32 text-3xl",
    lg: "w-32 h-44 text-4xl",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`
        relative rounded-2xl flex flex-col items-center justify-center font-black transition-all duration-300 transform
        ${sizeClasses[size]}
        ${onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl active:translate-y-0" : "cursor-default"}
        ${isActive ? "scale-110 shadow-[0_0_30px_rgba(0,0,0,0.2)] z-10" : "scale-100 shadow-md hover:shadow-lg"}
        ${
          isHidden
            ? "bg-slate-700 text-slate-500 border-4 border-slate-600"
            : `${note.color} ${note.textColor} border-4 ${isActive ? "border-white" : "border-black/10"}`
        }
        ${isCorrect === true ? "ring-4 ring-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]" : ""}
        ${isCorrect === false ? "ring-4 ring-rose-500 opacity-50 grayscale" : ""}
      `}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <div
        className={`absolute inset-0 bg-white/20 rounded-xl rounded-t-[40%] transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
      />

      {isHidden ? (
        <Music className={`${iconSizes[size]} opacity-50`} />
      ) : (
        <>
          <span className="z-10 tracking-tighter drop-shadow-md">{note.name}</span>
          <div className="absolute -bottom-2 -right-2 opacity-10 blur-sm pointer-events-none">
            <Music className="w-16 h-16" />
          </div>
        </>
      )}
    </button>
  );
}
