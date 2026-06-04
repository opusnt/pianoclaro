"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

type MeasureAccidentalTrackerProps = {
  activeNotes: { note: string; accidental: "sharp" | "flat" }[];
  measureNumber: number;
};

export function MeasureAccidentalTracker({
  activeNotes,
  measureNumber,
}: MeasureAccidentalTrackerProps) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4 shadow-sm transition-all duration-500">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase text-muted">Compás actual</p>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-deep text-xs font-bold text-white">
          {measureNumber}
        </span>
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-bold text-blue-deep mb-3">Alteraciones activas:</p>
        
        {activeNotes.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-500 border border-slate-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <p className="font-medium">Ninguna instrucción especial</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeNotes.map((an, i) => (
              <div 
                key={i}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold shadow-sm ${
                  an.accidental === "sharp" 
                    ? "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200" 
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                <span>
                  {an.note}
                  <span className="ml-1 font-serif text-lg leading-none">
                    {an.accidental === "sharp" ? "♯" : "♭"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
