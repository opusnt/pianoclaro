import { Play } from "lucide-react";

type ExerciseStartPanelProps = {
  moduleKind:
    | "major-scale"
    | "minor-scale"
    | "key-signature"
    | "pentatonic"
    | "chords"
    | "chord-inversions"
    | "harmonic-field";
  title: string;
  description: string;
  rounds: number;
  assistedMode?: boolean;
  onStart: () => void;
};

const moduleSteps: Record<
  ExerciseStartPanelProps["moduleKind"],
  {
    concept: string;
    tip: string;
    steps: Array<{ title: string; text: string }>;
  }
> = {
  "major-scale": {
    concept: "Una escala se construye con una tónica y un patrón de tonos y semitonos.",
    tip: "Objetivo: aplicar T - T - S - T - T - T - S sin memorizar una lista aislada.",
    steps: [
      { title: "Ubica tónica", text: "La primera nota funciona como casa." },
      { title: "Lee el patrón", text: "Tono = 2 teclas; semitono = 1 tecla." },
      { title: "Construye ruta", text: "Cada nota correcta completa la escala." },
    ],
  },
  "minor-scale": {
    concept: "Las escalas menores cambian el color sonoro al mover notas específicas.",
    tip: "Objetivo: comparar qué grados cambian y tocar la variante correcta.",
    steps: [
      { title: "Identifica tipo", text: "Natural, armónica o melódica ascendente." },
      { title: "Observa cambios", text: "Mira tercera, sexta o séptima según el caso." },
      { title: "Toca con intención", text: "Construye la escala desde la tónica." },
    ],
  },
  "key-signature": {
    concept: "Una tonalidad es una familia de notas; la armadura define alteraciones fijas.",
    tip: "Objetivo: aplicar la regla global de sostenidos o bemoles al tocar.",
    steps: [
      { title: "Lee tonalidad", text: "Identifica tónica y modo." },
      { title: "Aplica armadura", text: "Las alteraciones fijas valen en toda la escala." },
      { title: "Conecta relativa", text: "Mayor y menor pueden compartir notas." },
    ],
  },
  pentatonic: {
    concept: "La pentatónica usa cinco notas principales para crear frases simples.",
    tip: "Objetivo: tocar dentro de la escala y usar pocas notas con intención musical.",
    steps: [
      { title: "Mira notas permitidas", text: "Son el territorio seguro para tocar." },
      { title: "Toca o completa", text: "Construye la escala o encuentra la nota faltante." },
      { title: "Crea frase", text: "En improvisación importa variedad y continuidad." },
    ],
  },
  chords: {
    concept: "Un acorde combina notas simultáneas: tónica, tercera y quinta.",
    tip: "Objetivo: reconocer y construir tríadas por sus notas, no por posición visual aislada.",
    steps: [
      { title: "Lee la tónica", text: "Es la nota que da nombre al acorde." },
      { title: "Busca fórmula", text: "Mayor, menor, disminuido o aumentado." },
      { title: "Confirma conjunto", text: "Selecciona las notas y confirma el acorde." },
    ],
  },
  "chord-inversions": {
    concept: "Una inversión conserva las mismas notas del acorde, pero cambia la nota más grave.",
    tip: "Objetivo: escuchar y ver qué nota queda en el bajo.",
    steps: [
      { title: "Compara notas", text: "El acorde mantiene su identidad." },
      { title: "Mira el bajo", text: "La nota más grave define la inversión." },
      { title: "Toca posición", text: "Selecciona el conjunto con el bajo correcto." },
    ],
  },
  "harmonic-field": {
    concept: "El campo armónico nace al construir acordes desde cada grado de una escala.",
    tip: "Objetivo: traducir grados a acordes y progresiones.",
    steps: [
      { title: "Ubica grado", text: "I, ii, iii, IV, V, vi o vii°." },
      { title: "Reconoce cualidad", text: "Mayor, menor o disminuido." },
      { title: "Toca acorde", text: "Las inversiones son válidas si las notas pertenecen." },
    ],
  },
};

export function ExerciseStartPanel({
  moduleKind,
  title,
  description,
  rounds,
  assistedMode = false,
  onStart,
}: ExerciseStartPanelProps) {
  const copy = moduleSteps[moduleKind];

  return (
    <div className="mt-6 rounded-3xl border border-blue-deep/10 bg-ivory p-5 sm:p-6">
      <div className="grid gap-5 min-[1200px]:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <p className="text-xs font-black uppercase text-gold-soft">Antes de practicar</p>
          <h3 className="mt-2 text-3xl font-black leading-tight text-blue-deep">{title}</h3>
          <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-muted">
            {description}
          </p>
          <p className="mt-4 max-w-3xl rounded-2xl bg-blue-soft/35 p-4 text-sm font-bold leading-6 text-blue-deep">
            {copy.concept}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4"
              >
                <p className="text-xs font-black uppercase text-gold-soft">Paso {index + 1}</p>
                <h4 className="mt-2 text-sm font-black text-blue-deep">{step.title}</h4>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4">
          <p className="text-xs font-black uppercase text-muted">Práctica</p>
          <p className="mt-2 text-3xl font-black text-blue-deep">{rounds}</p>
          <p className="text-sm font-bold text-muted">rondas</p>
          <div className="mt-4 rounded-2xl bg-cream p-3 text-sm font-bold leading-6 text-blue-deep">
            {assistedMode ? "Modo ayuda activo: verás más pistas al comenzar." : copy.tip}
          </div>
          <button
            type="button"
            onClick={onStart}
            className="focus-ring mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-deep px-5 py-3 text-sm font-black text-white transition hover:bg-[#0d2949]"
          >
            <Play aria-hidden="true" className="h-4 w-4" />
            Iniciar lección
          </button>
        </aside>
      </div>
    </div>
  );
}
