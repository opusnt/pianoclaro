import { ArrowRight } from "lucide-react";
import React from "react";
import { AccidentalBadge } from "@/components/shared/badges/AccidentalBadge";

interface AccidentalMovementVisualizerProps {
  baseNoteName: string; // Ej. "DO"
  targetNoteName: string; // Ej. "DO#"
  type: "sharp" | "flat" | "natural";
}

export function AccidentalMovementVisualizer({
  baseNoteName,
  targetNoteName,
  type,
}: AccidentalMovementVisualizerProps) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm w-max mx-auto my-8">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl shadow-sm flex items-center justify-center text-2xl font-bold text-slate-700">
          {baseNoteName}
        </div>
        <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">
          Natural
        </span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <AccidentalBadge type={type} size="sm" />
        <ArrowRight
          className={`w-6 h-6 ${type === "sharp" ? "text-fuchsia-400" : type === "flat" ? "text-sky-400" : "text-emerald-400"}`}
        />
      </div>

      <div className="flex flex-col items-center">
        <div
          className={`w-16 h-16 border-2 rounded-2xl shadow-md flex items-center justify-center text-xl font-bold ${
            type === "sharp"
              ? "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700"
              : type === "flat"
                ? "bg-sky-50 border-sky-200 text-sky-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          {targetNoteName}
        </div>
        <span
          className={`text-xs font-bold mt-2 uppercase tracking-wider ${
            type === "sharp"
              ? "text-fuchsia-500"
              : type === "flat"
                ? "text-sky-500"
                : "text-emerald-500"
          }`}
        >
          {type === "sharp" ? "Sostenido" : type === "flat" ? "Bemol" : "Becuadro"}
        </span>
      </div>
    </div>
  );
}
