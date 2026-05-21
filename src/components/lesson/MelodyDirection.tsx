import type { LessonStep } from "@/types/lesson";

type MelodyDirectionProps = {
  melodyDirection?: LessonStep["melodyDirection"];
};

const directionCopy = {
  up: { arrow: "↑", label: "La melodía sube" },
  down: { arrow: "↓", label: "La melodía baja" },
  repeat: { arrow: "→", label: "La melodía se repite" },
  mixed: { arrow: "↕", label: "La melodía combina movimientos" },
};

export function MelodyDirection({ melodyDirection }: MelodyDirectionProps) {
  if (!melodyDirection) {
    return null;
  }

  const copy = directionCopy[melodyDirection];

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-blue-soft/45 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-deep text-xl font-bold text-white">
          {copy.arrow}
        </span>
        <p className="text-sm font-bold text-blue-deep">{copy.label}</p>
      </div>
    </div>
  );
}
