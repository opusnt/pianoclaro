import { Keyboard } from "lucide-react";

type ComputerKeyboardToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function ComputerKeyboardToggle({ enabled, onChange }: ComputerKeyboardToggleProps) {
  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-muted">Entrada</p>
          <h2 className="mt-1 text-base font-bold text-blue-deep">Teclado del computador</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Usa Z X C V B N M para las teclas blancas y S D G H J para las negras.
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-blue-deep">
          <Keyboard aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
        className={`focus-ring mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition ${
          enabled
            ? "bg-gold-soft text-[#543b12]"
            : "border border-blue-deep/15 bg-white text-blue-deep hover:bg-blue-soft/45"
        }`}
      >
        {enabled ? "Entrada activa" : "Activar entrada"}
      </button>
    </section>
  );
}
