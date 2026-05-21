import { Keyboard, Music2 } from "lucide-react";

type VirtualPianoInputProps = {
  disabled: boolean;
  onInput: (source: "touch" | "keyboard") => void;
};

export function VirtualPianoInput({ disabled, onInput }: VirtualPianoInputProps) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
      <p className="text-xs font-bold uppercase text-muted">Input</p>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onInput("touch")}
        className="focus-ring mt-3 flex min-h-24 w-full items-center justify-center gap-3 rounded-2xl bg-blue-deep px-5 py-4 text-lg font-bold text-white shadow-soft transition hover:bg-[#0d2949] disabled:cursor-not-allowed disabled:bg-muted/45"
      >
        <Music2 aria-hidden="true" className="h-6 w-6" />
        Tocar pulso
      </button>
      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-muted">
        <Keyboard aria-hidden="true" className="h-4 w-4 text-gold-soft" />
        También puedes usar barra espaciadora o Enter.
      </p>
    </div>
  );
}
