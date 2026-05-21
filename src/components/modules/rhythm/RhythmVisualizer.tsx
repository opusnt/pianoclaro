import type { BeatEvent, TimingResult } from "@/types/rhythm";

type RhythmVisualizerProps = {
  beatEvents: BeatEvent[];
  currentBeatIndex: number;
  pulseProgress: number;
  lastResult: TimingResult | null;
};

export function RhythmVisualizer({
  beatEvents,
  currentBeatIndex,
  pulseProgress,
  lastResult,
}: RhythmVisualizerProps) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-5">
      <BeatPulse pulseProgress={pulseProgress} lastResult={lastResult} />
      {beatEvents.length > 0 ? (
        <RhythmTimeline beatEvents={beatEvents} currentBeatIndex={currentBeatIndex} />
      ) : (
        <div className="mt-5 grid grid-cols-8 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-12 rounded-xl border border-blue-deep/10 bg-white/75" />
          ))}
        </div>
      )}
    </div>
  );
}

function BeatPulse({
  pulseProgress,
  lastResult,
}: {
  pulseProgress: number;
  lastResult: TimingResult | null;
}) {
  const ringScale = 1.35 - Math.min(1, pulseProgress) * 0.35;
  const resultLabel = lastResult
    ? {
        perfect: "Perfect",
        good: "Good",
        early: "Muy pronto",
        late: "Muy tarde",
        miss: "Miss",
      }[lastResult.grade]
    : "Escucha el pulso";
  const resultClass =
    lastResult?.grade === "perfect"
      ? "bg-teal-soft text-blue-deep"
      : lastResult?.grade === "good"
        ? "bg-blue-soft text-blue-deep"
        : lastResult?.grade === "early" || lastResult?.grade === "late"
          ? "bg-gold-soft text-[#543b12]"
          : lastResult?.grade === "miss"
            ? "bg-rose-muted text-white"
            : "bg-blue-deep text-white";

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <div
          className="absolute h-48 w-48 rounded-full border-4 border-gold-soft/55 transition-transform duration-75"
          style={{ transform: `scale(${ringScale})`, opacity: 0.35 + pulseProgress * 0.45 }}
        />
        <div className="absolute h-32 w-32 rounded-full bg-blue-soft shadow-[0_20px_60px_rgba(18,52,91,0.16)]" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-deep text-center text-sm font-bold text-white">
          toca
        </div>
      </div>
      <span className={`rounded-full px-4 py-2 text-sm font-bold ${resultClass}`}>
        {resultLabel}
      </span>
    </div>
  );
}

export function RhythmTimeline({
  beatEvents,
  currentBeatIndex,
}: {
  beatEvents: BeatEvent[];
  currentBeatIndex: number;
}) {
  const activeRound = beatEvents[currentBeatIndex]?.roundIndex ?? 0;
  const roundEvents = beatEvents.filter((beat) => beat.roundIndex === activeRound);
  const eventsToShow = roundEvents.length > 0 ? roundEvents : beatEvents.slice(0, 8);

  return (
    <div className="mt-5">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {eventsToShow.map((beat) => {
          const isCurrent = beat.beatIndex === currentBeatIndex;
          const isPast = beat.beatIndex < currentBeatIndex;

          return (
            <div
              key={beat.beatIndex}
              className={`min-h-14 rounded-xl border p-2 text-center text-xs font-bold transition ${
                isCurrent
                  ? "border-gold-soft bg-gold-soft text-[#543b12] shadow-[0_10px_26px_rgba(215,180,106,0.24)]"
                  : beat.shouldTap
                    ? "border-blue-deep/10 bg-white text-blue-deep"
                    : "border-blue-deep/10 bg-blue-soft/35 text-muted"
              } ${isPast ? "opacity-60" : ""}`}
            >
              <span className="block text-base">{beat.shouldTap ? "TOCA" : "espera"}</span>
              <span className="mt-1 block opacity-70">{beat.beatIndex + 1}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs font-semibold text-muted">
        Las celdas dicen “TOCA” o “espera”; no dependas solo del color.
      </p>
    </div>
  );
}
