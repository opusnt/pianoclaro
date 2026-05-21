type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex items-center justify-between gap-4 text-sm font-bold text-blue-deep">
        <span>
          Paso {currentStep} / {totalSteps}
        </span>
        <span>{percentage}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-deep/10">
        <div className="h-full rounded-full bg-gold-soft" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
