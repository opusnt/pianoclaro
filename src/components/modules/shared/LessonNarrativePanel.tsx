import { ArrowRight, Ear, Eye, Hand } from "lucide-react";

type LessonNarrativePanelProps = {
  moduleId: string;
};

const narratives: Record<
  string,
  {
    eyebrow: string;
    title: string;
    steps: [string, string, string];
    principle: string;
  }
> = {
  "keyboard-notes": {
    eyebrow: "Cómo se aprende esta lección",
    title: "Primero ubicas patrones, después nombras notas.",
    steps: [
      "Mira los grupos de teclas negras: son el mapa del piano.",
      "Usa ese mapa para encontrar DO sin memorizar todo de golpe.",
      "Toca y escucha: cada acierto crea memoria visual y auditiva.",
    ],
    principle: "No busques todas las notas a la vez. Encuentra una referencia clara y construye desde ahí.",
  },
  "basic-rhythm": {
    eyebrow: "Cómo se practica ritmo",
    title: "Escucha el pulso antes de intentar tocarlo.",
    steps: [
      "Escucha el ritmo completo para sentir la distancia entre beats.",
      "Mira el anillo: anticipa el momento exacto de tocar.",
      "Replica tocando el centro del pulso, barra espaciadora o Enter.",
    ],
    principle: "El ritmo se entiende como acción temporal: escuchar, anticipar y tocar.",
  },
  intervals: {
    eyebrow: "Cómo se entienden intervalos",
    title: "Un intervalo es una distancia que puedes ver, oír y tocar.",
    steps: [
      "Ubica la nota base: es tu punto de partida.",
      "Observa la dirección y la cantidad de semitonos.",
      "Responde tocando la segunda nota o eligiendo lo que escuchaste.",
    ],
    principle: "Derecha significa más agudo; izquierda significa más grave. La distancia es el concepto central.",
  },
  "major-scale": {
    eyebrow: "Cómo se construye una escala",
    title: "La escala mayor no es una lista: es un patrón.",
    steps: [
      "Parte desde la tónica, que funciona como casa.",
      "Sigue T - T - S - T - T - T - S paso a paso.",
      "Completa la octava y escucha el sonido estable de la escala.",
    ],
    principle: "Si recuerdas el patrón de tonos y semitonos, puedes construir la escala desde distintas notas.",
  },
  "minor-scales": {
    eyebrow: "Cómo se comparan escalas menores",
    title: "La menor cambia el color de la escala.",
    steps: [
      "Compara mayor y menor escuchando la tercera nota.",
      "Construye menor natural con T - S - T - T - S - T - T.",
      "Observa qué grados cambian en armónica y melódica ascendente.",
    ],
    principle: "No memorices variantes aisladas: identifica qué nota cambia y por qué suena distinto.",
  },
};

export function LessonNarrativePanel({ moduleId }: LessonNarrativePanelProps) {
  const narrative = narratives[moduleId];

  if (!narrative) {
    return null;
  }

  const icons = [Eye, Ear, Hand];

  return (
    <section className="mt-6 rounded-2xl border border-blue-deep/10 bg-ivory p-4 sm:p-5">
      <p className="text-xs font-bold uppercase text-gold-soft">{narrative.eyebrow}</p>
      <h2 className="mt-2 text-xl font-black text-blue-deep">{narrative.title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {narrative.steps.map((step, index) => {
          const Icon = icons[index] ?? ArrowRight;

          return (
            <article key={step} className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
              <div className="flex items-center gap-2 text-sm font-black text-blue-deep">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-soft/55 text-blue-deep">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                Paso {index + 1}
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-muted">{step}</p>
            </article>
          );
        })}
      </div>
      <p className="mt-4 rounded-2xl bg-blue-soft/35 p-4 text-sm font-bold leading-6 text-blue-deep">
        {narrative.principle}
      </p>
    </section>
  );
}
