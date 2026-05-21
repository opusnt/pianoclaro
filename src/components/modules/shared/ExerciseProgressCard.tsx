import { CheckCircle2, Lock, Play } from "lucide-react";

type ExerciseProgressCardProps = {
  index: number;
  title: string;
  description: string;
  selected: boolean;
  unlocked: boolean;
  completed: boolean;
  meta: string[];
  onSelect: () => void;
};

export function ExerciseProgressCard({
  index,
  title,
  description,
  selected,
  unlocked,
  completed,
  meta,
  onSelect,
}: ExerciseProgressCardProps) {
  return (
    <button
      type="button"
      disabled={!unlocked}
      onClick={onSelect}
      className={`focus-ring w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-gold-soft bg-cream shadow-soft"
          : completed
            ? "border-emerald-500/20 bg-emerald-50/45 hover:bg-emerald-50"
            : "border-blue-deep/10 bg-white/80 hover:bg-blue-soft/30"
      } ${!unlocked ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-gold-soft">Ejercicio {index + 1}</p>
          <h3 className="mt-2 text-lg font-bold text-blue-deep">{title}</h3>
        </div>
        <span className="text-blue-deep">
          {completed ? (
            <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-700" />
          ) : !unlocked ? (
            <Lock aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Play aria-hidden="true" className="h-5 w-5 text-gold-soft" />
          )}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-muted">
        {meta.map((item) => (
          <span key={item} className="rounded-lg bg-white/80 px-2 py-1">
            {item}
          </span>
        ))}
      </div>
    </button>
  );
}
