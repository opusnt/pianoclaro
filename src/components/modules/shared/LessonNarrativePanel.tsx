import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Ear,
  Eye,
  Hand,
  ListChecks,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { pedagogicalMoments } from "@/data/learning-path";
import { firstFiveNotesModuleId } from "@/data/learning-slugs";
import { contentRepository } from "@/lib/content";

type LessonNarrativePanelProps = {
  moduleId: string;
};

type PanelSectionProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  eyebrow: string;
  icon: ReactNode;
  title: string;
};

function PanelSection({ children, defaultOpen = false, eyebrow, icon, title }: PanelSectionProps) {
  return (
    <details
      open={defaultOpen}
      className="group mt-4 overflow-hidden rounded-2xl border border-blue-deep/10 bg-white/80"
    >
      <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 p-4 marker:hidden">
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-soft/55 text-blue-deep">
            {icon}
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-black uppercase text-muted">{eyebrow}</span>
            <span className="mt-1 block text-base font-black leading-6 text-blue-deep">
              {title}
            </span>
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-muted transition group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-blue-deep/10 p-4">{children}</div>
    </details>
  );
}

const narratives: Record<
  string,
  {
    eyebrow: string;
    title: string;
    steps: [string, string, string];
    principle: string;
  }
> = {
  [firstFiveNotesModuleId]: {
    eyebrow: "Cómo se aprende esta lección",
    title: "Primero ubicas patrones, después nombras notas.",
    steps: [
      "Mira los grupos de teclas negras: son el mapa del piano.",
      "Usa ese mapa para encontrar DO sin memorizar todo de golpe.",
      "Toca y escucha: cada acierto crea memoria visual y auditiva.",
    ],
    principle:
      "No busques todas las notas a la vez. Encuentra una referencia clara y construye desde ahí.",
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
    principle:
      "Derecha significa más agudo; izquierda significa más grave. La distancia es el concepto central.",
  },
  "major-scale": {
    eyebrow: "Cómo se construye una escala",
    title: "La escala mayor no es una lista: es un patrón.",
    steps: [
      "Parte desde la tónica, que funciona como casa.",
      "Sigue T - T - S - T - T - T - S paso a paso.",
      "Completa la octava y escucha el sonido estable de la escala.",
    ],
    principle:
      "Si recuerdas el patrón de tonos y semitonos, puedes construir la escala desde distintas notas.",
  },
  "minor-scales": {
    eyebrow: "Cómo se comparan escalas menores",
    title: "La menor cambia el color de la escala.",
    steps: [
      "Compara mayor y menor escuchando la tercera nota.",
      "Construye menor natural con T - S - T - T - S - T - T.",
      "Observa qué grados cambian en armónica y melódica ascendente.",
    ],
    principle:
      "No memorices variantes aisladas: identifica qué nota cambia y por qué suena distinto.",
  },
};

export function LessonNarrativePanel({ moduleId }: LessonNarrativePanelProps) {
  const narrative = narratives[moduleId];
  const unit = contentRepository.getLearningUnitByPlayableModuleId(moduleId);
  const prerequisiteUnits =
    unit?.prerequisiteUnitIds
      .map((unitId) => contentRepository.getLearningUnitById(unitId))
      .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate)) ?? [];
  const nextUnit = unit?.nextUnitId
    ? contentRepository.getLearningUnitById(unit.nextUnitId)
    : undefined;
  const stage = unit
    ? contentRepository.getCurriculumStages().find((candidate) => candidate.id === unit.stageId)
    : undefined;
  const skillBranches =
    unit?.primarySkillIds
      .map((skillId) => contentRepository.getSkillBranches().find((skill) => skill.id === skillId))
      .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate)) ?? [];

  if (!narrative && !unit) {
    return null;
  }

  const icons = [Eye, Ear, Hand];
  const steps = narrative?.steps ?? [
    unit?.shortGoal ?? "Observa el patrón musical antes de responder.",
    unit?.masteryCriteria[0] ?? "Practica hasta que la respuesta sea estable.",
    unit?.remediation[0] ?? "Si falla, reduce la dificultad y vuelve al patrón base.",
  ];

  return (
    <section className="mt-6 rounded-2xl border border-blue-deep/10 bg-ivory p-4 sm:p-5">
      <p className="text-xs font-bold uppercase text-gold-soft">
        {narrative?.eyebrow ?? `Unidad ${unit?.order}: ${unit?.title}`}
      </p>
      <h2 className="mt-2 text-xl font-black text-blue-deep">
        {narrative?.title ?? unit?.shortGoal}
      </h2>
      {unit ? (
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted">
          {unit.userOutcome}
        </p>
      ) : null}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => {
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
        {narrative?.principle ??
          "La unidad se domina cuando puedes explicar el patrón, tocarlo y corregirlo con feedback."}
      </p>
      {unit ? (
        <>
          <div className="mt-4 rounded-2xl border border-gold-soft/35 bg-cream/70 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
              <Sparkles aria-hidden="true" className="h-4 w-4 text-gold-soft" />
              Pregunta guía
            </p>
            <p className="mt-2 text-lg font-black leading-7 text-blue-deep">
              {unit.practiceContract.essentialQuestion}
            </p>
          </div>
          <PanelSection
            defaultOpen
            eyebrow="Tu mapa de aprendizaje"
            icon={<BookOpen aria-hidden="true" className="h-5 w-5" />}
            title="Qué estás entrenando y cómo usarlo"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
              <article>
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  <BookOpen aria-hidden="true" className="h-4 w-4 text-blue-deep" />
                  Nivel de la ruta
                </p>
                <h3 className="mt-2 text-base font-black text-blue-deep">
                  {stage?.name ?? "Ruta de aprendizaje"}
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                  {stage?.expectedOutcome ?? unit.userOutcome}
                </p>
              </article>
              <article>
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  <Target aria-hidden="true" className="h-4 w-4 text-teal-soft" />
                  Habilidades que estás entrenando
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skillBranches.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-full bg-blue-soft/45 px-3 py-2 text-xs font-black text-blue-deep"
                      title={skill.productRole}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </article>
              <article>
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  <ListChecks aria-hidden="true" className="h-4 w-4 text-gold-soft" />
                  Ciclo dentro de la app
                </p>
                <ol className="mt-3 grid gap-2 sm:grid-cols-5 lg:grid-cols-1 xl:grid-cols-5">
                  {pedagogicalMoments.map((moment, index) => (
                    <li
                      key={moment.id}
                      className="rounded-xl border border-blue-deep/10 bg-cream/55 px-3 py-2 text-xs font-black text-blue-deep"
                      title={moment.productRule}
                    >
                      {index + 1}. {moment.label}
                    </li>
                  ))}
                </ol>
              </article>
            </div>
            {stage?.commonErrorsToDetect.length ? (
              <div className="mt-4 rounded-2xl bg-cream/70 p-4">
                <p className="text-xs font-black uppercase text-muted">Si algo se complica</p>
                <p className="mt-2 text-sm font-bold leading-6 text-blue-deep">
                  {stage.commonErrorsToDetect.slice(0, 2).join(" · ")}
                </p>
              </div>
            ) : null}
          </PanelSection>
          <PanelSection
            defaultOpen
            eyebrow="Plan recomendado"
            icon={<ListChecks aria-hidden="true" className="h-5 w-5" />}
            title="Cómo practicar esta unidad por tu cuenta"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  <ListChecks aria-hidden="true" className="h-4 w-4 text-gold-soft" />
                  Plan de práctica autónoma
                </p>
                <h3 className="mt-2 text-lg font-black text-blue-deep">
                  Una sesión corta que termina en una habilidad usable.
                </h3>
              </div>
              <p className="max-w-md text-sm font-semibold leading-6 text-muted">
                No avances solo por completar rondas: avanza cuando puedas explicar qué cambió y
                repetirlo.
              </p>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {unit.practiceContract.practicePlan.map((step, index) => (
                <article key={step.label} className="rounded-2xl bg-ivory p-4">
                  <p className="text-xs font-black uppercase text-gold-soft">
                    {index + 1}. {step.label}
                  </p>
                  <p className="mt-2 text-sm font-bold leading-6 text-blue-deep">{step.action}</p>
                  <p className="mt-3 rounded-xl bg-white/75 p-3 text-xs font-bold leading-5 text-muted">
                    Señal de logro: {step.successSignal}
                  </p>
                </article>
              ))}
            </div>
          </PanelSection>
          <PanelSection
            eyebrow="Diagnóstico"
            icon={<Wrench aria-hidden="true" className="h-5 w-5" />}
            title="Qué hacer cuando te atascas"
          >
            <div className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
              <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  <Wrench aria-hidden="true" className="h-4 w-4 text-gold-soft" />
                  Reparación automática sugerida
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {unit.practiceContract.diagnosticRules.map((rule) => (
                    <div key={rule.symptom} className="rounded-2xl bg-ivory p-4">
                      <p className="text-xs font-black uppercase text-muted">Si te pasa esto</p>
                      <p className="mt-2 text-sm font-bold leading-6 text-blue-deep">
                        {rule.symptom}
                      </p>
                      <p className="mt-3 text-xs font-black uppercase text-muted">
                        Lo más probable
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                        {rule.likelyCause}
                      </p>
                      <p className="mt-3 rounded-xl bg-white/75 p-3 text-xs font-bold leading-5 text-blue-deep">
                        Vuelve con esto: {rule.intervention}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  <Target aria-hidden="true" className="h-4 w-4 text-blue-deep" />
                  Señales para avanzar
                </p>
                <div className="mt-4 space-y-3">
                  {unit.practiceContract.masteryRubric.map((level) => (
                    <div key={level.id} className="rounded-2xl bg-cream/60 p-4">
                      <p className="text-sm font-black text-blue-deep">{level.label}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                        {level.observableBehavior}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </PanelSection>
          <PanelSection
            eyebrow="Continuidad"
            icon={<ArrowRight aria-hidden="true" className="h-5 w-5" />}
            title="Qué viene antes y después"
          >
            <div className="grid gap-3 lg:grid-cols-3">
              <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
                <p className="text-xs font-black uppercase text-muted">Viene de</p>
                <p className="mt-2 text-sm font-bold leading-6 text-blue-deep">
                  {prerequisiteUnits.length > 0
                    ? prerequisiteUnits.map((item) => item.title).join(" · ")
                    : "Primer punto de entrada"}
                </p>
              </article>
              <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
                <p className="text-xs font-black uppercase text-muted">Ahora</p>
                <p className="mt-2 text-sm font-bold leading-6 text-blue-deep">{unit.shortGoal}</p>
              </article>
              <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  Después
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-gold-soft" />
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-blue-deep">
                  {nextUnit?.shortGoal ?? "Aplicar esta habilidad en repertorio real."}
                </p>
              </article>
            </div>
          </PanelSection>
          <PanelSection
            eyebrow="Evaluación"
            icon={<CheckCircle2 aria-hidden="true" className="h-5 w-5" />}
            title="Dominio, evidencia, reparación y transferencia"
          >
            <div className="grid gap-3 lg:grid-cols-3">
              <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  <Target aria-hidden="true" className="h-4 w-4 text-blue-deep" />
                  Dominio
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-5 text-blue-deep">
                  {unit.masteryCriteria.slice(0, 3).map((criteria) => (
                    <li key={criteria}>{criteria}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-teal-soft" />
                  Evidencia
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-5 text-blue-deep">
                  {unit.evidence.slice(0, 3).map((evidence) => (
                    <li key={evidence}>{evidence}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  <Wrench aria-hidden="true" className="h-4 w-4 text-gold-soft" />
                  Reparación
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-5 text-blue-deep">
                  {unit.remediation.slice(0, 3).map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </article>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
              <article className="rounded-2xl border border-blue-deep/10 bg-white/80 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-teal-soft" />
                  Autoevaluación antes de avanzar
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-5 text-blue-deep">
                  {unit.practiceContract.selfCheck.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl border border-gold-soft/35 bg-blue-deep p-4 text-white">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-gold-soft">
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                  Reto de transferencia
                </p>
                <p className="mt-3 text-sm font-bold leading-6 text-white/85">
                  {unit.practiceContract.transferChallenge}
                </p>
              </article>
            </div>
          </PanelSection>
        </>
      ) : null}
    </section>
  );
}
