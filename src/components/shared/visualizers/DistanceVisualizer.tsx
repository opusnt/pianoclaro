import { ArrowRight } from "lucide-react";

export interface DistanceVisualizerProps {
  startNote: string;
  endNote: string;
  semitones: number;
  label?: string; // "Semitono" o "Tono"
  highlightColor?: string;
  showKeysCount?: boolean;
}

export function DistanceVisualizer({
  startNote,
  endNote,
  semitones,
  label,
  highlightColor = "bg-sky-500",
  showKeysCount = false,
}: DistanceVisualizerProps) {
  // Traducir nombre de nota al español para visualización
  const getSpanishName = (note: string) => {
    const map: Record<string, string> = {
      C: "DO",
      "C#": "DO#",
      D: "RE",
      "D#": "RE#",
      E: "MI",
      F: "FA",
      "F#": "FA#",
      G: "SOL",
      "G#": "SOL#",
      A: "LA",
      "A#": "LA#",
      B: "SI",
    };
    const base = note.replace(/[0-9]/g, "");
    return map[base] || base;
  };

  const name1 = getSpanishName(startNote);
  const name2 = getSpanishName(endNote);

  return (
    <div className="flex flex-col items-center justify-center p-6 border rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-6 mb-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center font-black text-2xl text-slate-700">
            {name1}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-w-[100px]">
          {label && (
            <span
              className={`text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full text-white ${highlightColor}`}
            >
              {label}
            </span>
          )}
          <div className="relative w-full h-1 bg-slate-200 rounded-full flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-slate-400 absolute bg-white px-1" />
          </div>
          {showKeysCount && (
            <span className="text-sm font-bold text-slate-500 mt-2">
              {semitones} {semitones === 1 ? "paso" : "pasos"}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center font-black text-2xl text-slate-700">
            {name2}
          </div>
        </div>
      </div>
    </div>
  );
}
