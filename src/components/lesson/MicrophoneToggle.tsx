import { Mic, MicOff } from "lucide-react";

type MicrophoneToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function MicrophoneToggle({ enabled, onChange }: MicrophoneToggleProps) {
  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-muted">Entrada Acústica</p>
          <h2 className="mt-1 text-base font-bold text-blue-deep">Piano vía Micrófono</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Toca en tu piano acústico real. Usaremos el micrófono para detectar tus notas.
          </p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${enabled ? 'bg-gold-soft text-white' : 'bg-blue-soft text-blue-deep'}`}>
          {enabled ? <Mic aria-hidden="true" className="h-5 w-5" /> : <MicOff aria-hidden="true" className="h-5 w-5" />}
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
        {enabled ? "Micrófono escuchando..." : "Activar micrófono"}
      </button>
    </section>
  );
}
