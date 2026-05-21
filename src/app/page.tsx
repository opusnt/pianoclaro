import { ArrowRight, BookOpen, CheckCircle2, Lightbulb, Music, Play } from "lucide-react";

import { ButtonLink } from "@/components/ButtonLink";
import { HeroMusicScene } from "@/components/HeroMusicScene";
import { PricingCard } from "@/components/PricingCard";
import { RouteCard } from "@/components/RouteCard";
import { contentRepository } from "@/lib/content";

const pillars = [
  {
    title: "Toca",
    text: "Practica con una partitura pequeña, un teclado visual y pasos que se sienten alcanzables.",
    icon: Music,
  },
  {
    title: "Lee",
    text: "Conecta notas, pentagrama y ritmo desde el primer día, sin separar teoría y práctica.",
    icon: BookOpen,
  },
  {
    title: "Entiende",
    text: "Cada canción introduce el concepto musical justo cuando lo necesitas para tocar mejor.",
    icon: Lightbulb,
  },
];

const differentiators = [
  "Español nativo",
  "Partitura guiada",
  "Teoría dentro de canciones",
  "Repertorio latino y popular",
  "Feedback futuro con MIDI/audio",
];

export default function HomePage() {
  const learningRoutes = contentRepository.getRoutes();
  const pricingPlans = contentRepository.getPricingPlans();

  return (
    <main>
      <section className="relative isolate flex min-h-[82svh] items-center overflow-hidden border-b border-blue-deep/10 px-4 py-20 sm:px-6 lg:px-8">
        <HeroMusicScene />
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase text-blue-deep">Piano Claro</p>
            <h1 className="mt-5 text-5xl font-bold leading-[1.02] text-blue-deep sm:text-6xl lg:text-7xl">
              Aprende piano leyendo música desde el primer día
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/78">
              Una plataforma en español para tocar, leer partituras y entender la música paso a
              paso.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/rutas" icon={Play}>
                Comenzar gratis
              </ButtonLink>
              <ButtonLink href="#como-funciona" variant="secondary" icon={ArrowRight}>
                Ver cómo funciona
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-gold-soft">Método</p>
            <h2 className="mt-3 text-3xl font-bold text-blue-deep sm:text-4xl">
              No memorices teclas, entiende música
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Piano Claro organiza la lectura musical como una experiencia práctica: ves la nota,
              encuentras la tecla, escuchas el pulso y entiendes por qué esa decisión musical
              importa.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-lg border border-blue-deep/10 bg-white/78 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-soft text-blue-deep">
                  <pillar.icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-blue-deep">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/42 px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gold-soft">Rutas</p>
              <h2 className="mt-3 text-3xl font-bold text-blue-deep sm:text-4xl">
                Elige una forma clara de avanzar
              </h2>
            </div>
            <ButtonLink href="/rutas" variant="ghost" icon={ArrowRight}>
              Ver todas las rutas
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {learningRoutes.slice(0, 4).map((route) => (
              <RouteCard key={route.slug} route={route} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase text-gold-soft">Diferenciación</p>
            <h2 className="mt-3 text-3xl font-bold text-blue-deep sm:text-4xl">
              Diseñado para aprender con contexto
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              El MVP ya deja preparada la arquitectura para convertir partituras mock en lectura
              real, práctica con audio y feedback desde teclado digital.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {differentiators.map((item) => (
              <div
                key={item}
                className="flex min-h-16 items-center gap-3 rounded-lg border border-blue-deep/10 bg-white/78 px-4 py-3"
              >
                <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-teal-soft" />
                <span className="font-semibold text-blue-deep">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-deep px-4 py-18 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase text-gold-soft">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Comienza simple, crece después</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
