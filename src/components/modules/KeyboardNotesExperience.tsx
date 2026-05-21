"use client";

import { Check, ChevronRight, Eye, Headphones, RotateCcw, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import type { PianoNoteName, SharpNoteName } from "@/lib/music/notes";
import { pianoLabelByNote, solfegeByNote } from "@/lib/music/notes";
import type { DetailedLearningModule } from "@/types/curriculum";
import type { NoteName } from "@/types/music";

type ModuleStage = "pattern" | "find-c" | "complete";
type FeedbackState = "idle" | "correct" | "error";
type WhiteKey = {
  id: string;
  note: NoteName;
  octave: number;
  label: string;
  frequency: number;
};
type BlackKey = {
  id: string;
  note: SharpNoteName;
  octave: number;
  label: string;
  groupType: 2 | 3;
  groupIndex: number;
  leftPercent: number;
  frequency: number;
};

const whiteNoteOrder: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
const blackKeyPattern: Array<{
  note: SharpNoteName;
  afterWhiteIndex: number;
  groupType: 2 | 3;
}> = [
  { note: "C#", afterWhiteIndex: 0, groupType: 2 },
  { note: "D#", afterWhiteIndex: 1, groupType: 2 },
  { note: "F#", afterWhiteIndex: 3, groupType: 3 },
  { note: "G#", afterWhiteIndex: 4, groupType: 3 },
  { note: "A#", afterWhiteIndex: 5, groupType: 3 },
];
const baseFrequencies: Record<PianoNoteName, number> = {
  C: 261.63,
  "C#": 277.18,
  D: 293.66,
  "D#": 311.13,
  E: 329.63,
  F: 349.23,
  "F#": 369.99,
  G: 392,
  "G#": 415.3,
  A: 440,
  "A#": 466.16,
  B: 493.88,
};

function frequencyFor(note: PianoNoteName, octave: number) {
  return baseFrequencies[note] * 2 ** (octave - 4);
}

function buildKeyboard(octaves: number[]) {
  const whiteKeys = octaves.flatMap((octave) =>
    whiteNoteOrder.map((note) => ({
      id: `${note}${octave}`,
      note,
      octave,
      label: solfegeByNote[note],
      frequency: frequencyFor(note, octave),
    })),
  );
  const blackKeys = octaves.flatMap((octave, octaveIndex) =>
    blackKeyPattern.map((key, index) => {
      const absoluteWhiteIndex = octaveIndex * 7 + key.afterWhiteIndex;

      return {
        id: `${key.note}${octave}`,
        note: key.note,
        octave,
        label: pianoLabelByNote[key.note],
        groupType: key.groupType,
        groupIndex: key.groupType === 2 ? octaveIndex * 2 : octaveIndex * 2 + 1,
        leftPercent: ((absoluteWhiteIndex + 0.68) / whiteKeys.length) * 100,
        frequency: frequencyFor(key.note, octave),
      };
    }),
  );

  return { whiteKeys, blackKeys };
}

function nextPatternTarget(previous?: 2 | 3): 2 | 3 {
  return previous === 2 ? 3 : 2;
}

function nextCOctave(previous: number) {
  return previous === 4 ? 5 : 4;
}

export function KeyboardNotesExperience({ module }: { module: DetailedLearningModule }) {
  const [stage, setStage] = useState<ModuleStage>("pattern");
  const [patternTarget, setPatternTarget] = useState<2 | 3>(2);
  const [targetCOctave, setTargetCOctave] = useState(4);
  const [xp, setXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [patternHits, setPatternHits] = useState(0);
  const [cHits, setCHits] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [message, setMessage] = useState("Busca el patrón de dos teclas negras.");
  const [showLabels, setShowLabels] = useState(true);
  const [hintLevel, setHintLevel] = useState(0);
  const audioRef = useRef<PianoAudioEngine | null>(null);

  const { whiteKeys, blackKeys } = useMemo(() => buildKeyboard([4, 5]), []);
  const targetCKey = whiteKeys.find((key) => key.note === "C" && key.octave === targetCOctave);
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 100;
  const stageProgress =
    stage === "pattern" ? Math.min(100, (patternHits / 4) * 100) : stage === "find-c" ? Math.min(100, (cHits / 5) * 100) : 100;

  useEffect(() => {
    return () => {
      audioRef.current?.close();
    };
  }, []);

  function getAudio() {
    if (!audioRef.current) {
      audioRef.current = new PianoAudioEngine();
    }

    return audioRef.current;
  }

  async function playFrequency(frequency: number, duration = 360) {
    await getAudio().playFrequency(frequency, duration);
  }

  function markCorrect(nextMessage: string, xpReward = 10) {
    setFeedback("correct");
    setAttempts((value) => value + 1);
    setCorrect((value) => value + 1);
    setCombo((value) => value + 1);
    setXp((value) => value + xpReward + (combo > 0 && (combo + 1) % 5 === 0 ? 15 : 0));
    setHintLevel(0);
    setMessage(nextMessage);
  }

  function markError(nextMessage: string) {
    setFeedback("error");
    setAttempts((value) => value + 1);
    setCombo(0);
    setHintLevel((value) => Math.min(2, value + 1));
    setMessage(nextMessage);
  }

  function handleBlackKeyPress(key: BlackKey) {
    void playFrequency(key.frequency, 260);

    if (stage !== "pattern") {
      markError("Ahora estamos buscando Do. Mira el grupo de dos negras y toca la blanca justo antes.");
      return;
    }

    if (key.groupType === patternTarget) {
      const nextHits = patternHits + 1;
      markCorrect(
        nextHits >= 4
          ? "Patrón desbloqueado. Ahora usa ese mapa para encontrar Do."
          : `Bien. Ese era un grupo de ${patternTarget}. Busca ahora un grupo de ${nextPatternTarget(patternTarget)}.`,
      );
      setPatternHits(nextHits);

      if (nextHits >= 4) {
        setStage("find-c");
        setPatternTarget(2);
        setTargetCOctave(4);
        setMessage("Do está justo antes del grupo de dos teclas negras. Encuentra Do.");
        return;
      }

      setPatternTarget(nextPatternTarget(patternTarget));
      return;
    }

    markError(`Ese grupo tiene ${key.groupType} teclas negras. Necesitamos un grupo de ${patternTarget}.`);
  }

  function handleWhiteKeyPress(key: WhiteKey) {
    void playFrequency(key.frequency, 320);

    if (stage === "pattern") {
      markError(`Buena exploración: tocaste ${key.label}. En esta ronda solo buscamos teclas negras.`);
      return;
    }

    if (stage === "complete") {
      setMessage(`Sonando ${key.label}. Ya puedes repetir el módulo o seguir al próximo poder.`);
      return;
    }

    const isCorrectC = key.note === "C" && key.octave === targetCOctave;

    if (isCorrectC) {
      const nextHits = cHits + 1;
      markCorrect(
        nextHits >= 5
          ? "Mapa del teclado completado. Ya puedes reconocer Do en varias octavas."
          : `Exacto: ${key.label}. Ahora encuentra el Do de la octava ${nextCOctave(targetCOctave)}.`,
        14,
      );
      setCHits(nextHits);

      if (nextHits >= 5) {
        setStage("complete");
        setMessage("Módulo inicial completado: el teclado ya tiene mapa.");
        setXp((value) => value + 60);
        return;
      }

      setTargetCOctave(nextCOctave(targetCOctave));
      return;
    }

    if (key.note === "D" || key.note === "E") {
      markError(`Casi. Tocaste ${key.label}. Do está más a la izquierda, justo antes del grupo de dos negras.`);
      return;
    }

    markError(`Tocaste ${key.label}. Busca las dos negras juntas y toca la blanca justo antes.`);
  }

  function resetModule() {
    setStage("pattern");
    setPatternTarget(2);
    setTargetCOctave(4);
    setXp(0);
    setCombo(0);
    setAttempts(0);
    setCorrect(0);
    setPatternHits(0);
    setCHits(0);
    setFeedback("idle");
    setHintLevel(0);
    setShowLabels(true);
    setMessage("Busca el patrón de dos teclas negras.");
  }

  const currentTitle =
    stage === "pattern"
      ? "Detecta el patrón"
      : stage === "find-c"
        ? "Encuentra Do"
        : "Mapa desbloqueado";
  const currentInstruction =
    stage === "pattern"
      ? `Toca cualquier tecla negra dentro de un grupo de ${patternTarget}.`
      : stage === "find-c"
        ? `Toca Do en la octava ${targetCOctave}. Está justo antes de dos negras.`
        : "Explora el teclado o repite el reto para mejorar tu marca.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr]">
        <aside className="rounded-2xl border border-blue-deep/10 bg-white/85 p-6 shadow-soft">
          <p className="text-xs font-bold uppercase text-gold-soft">Módulo 1</p>
          <h1 className="mt-2 text-3xl font-bold text-blue-deep sm:text-4xl">{module.name}</h1>
          <p className="mt-2 text-base font-semibold text-muted">{module.subtitle}</p>
          <p className="mt-4 text-sm leading-6 text-muted">{module.shortDescription}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Metric label="XP" value={xp.toString()} />
            <Metric label="Combo" value={`${combo}x`} />
            <Metric label="Precisión" value={`${accuracy}%`} />
          </div>

          <div className="mt-6 rounded-2xl bg-cream/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-blue-deep">{currentTitle}</p>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-muted">
                {stage === "pattern" ? `${patternHits}/4` : stage === "find-c" ? `${cHits}/5` : "Listo"}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-deep/10">
              <div className="h-full rounded-full bg-gold-soft transition-all" style={{ width: `${stageProgress}%` }} />
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-blue-deep">
              {currentInstruction}
            </p>
          </div>

          <div
            className={`mt-4 rounded-2xl border p-4 text-sm font-semibold leading-6 transition ${
              feedback === "correct"
                ? "border-teal-soft/40 bg-teal-soft/10 text-blue-deep"
                : feedback === "error"
                  ? "border-rose-muted/35 bg-rose-muted/10 text-blue-deep"
                  : "border-blue-deep/10 bg-blue-soft/30 text-blue-deep"
            }`}
          >
            {message}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowLabels((value) => !value)}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
            >
              <Eye aria-hidden="true" className="h-4 w-4" />
              {showLabels ? "Ocultar nombres" : "Mostrar nombres"}
            </button>
            <button
              type="button"
              onClick={resetModule}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Repetir
            </button>
          </div>
        </aside>

        <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-4 shadow-soft sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-muted">Laboratorio interactivo</p>
              <h2 className="mt-1 text-2xl font-bold text-blue-deep">Primero toca. Luego entiendes.</h2>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-blue-soft/55 px-3 py-2 text-sm font-bold text-blue-deep">
              <Headphones aria-hidden="true" className="h-4 w-4 text-gold-soft" />
              Sonido activo al tocar
            </div>
          </div>

          <InteractiveKeyboard
            whiteKeys={whiteKeys}
            blackKeys={blackKeys}
            showLabels={showLabels}
            hintLevel={hintLevel}
            stage={stage}
            patternTarget={patternTarget}
            targetCKeyId={targetCKey?.id}
            onWhiteKeyPress={handleWhiteKeyPress}
            onBlackKeyPress={handleBlackKeyPress}
          />

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <StatusCard
              icon={<Zap aria-hidden="true" className="h-4 w-4" />}
              title="Patrón"
              text="Las teclas negras vienen en grupos de 2 y 3."
              active={stage === "pattern"}
            />
            <StatusCard
              icon={<Check aria-hidden="true" className="h-4 w-4" />}
              title="Do"
              text="Do está justo antes del grupo de dos negras."
              active={stage === "find-c"}
            />
            <StatusCard
              icon={<Sparkles aria-hidden="true" className="h-4 w-4" />}
              title="Desbloqueo"
              text="Al completar este mapa, sigue Ritmo básico."
              active={stage === "complete"}
            />
          </div>
        </section>
      </section>

      <section className="mt-6 rounded-2xl border border-blue-deep/10 bg-blue-deep p-6 text-white shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-gold-soft">Siguiente microlección</p>
            <h2 className="mt-2 text-2xl font-bold">
              {stage === "complete" ? "Ritmo básico" : "Tu primera firma sonora"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
              {stage === "complete"
                ? "Ahora que sabes dónde están las notas, aprenderás cuándo tocarlas."
                : "Cuando completes el mapa, crearás una mini idea musical con las notas que ya conoces."}
            </p>
          </div>
          <a
            href={stage === "complete" ? "/rutas" : "#keyboard"}
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
          >
            {stage === "complete" ? "Ver rutas" : "Seguir practicando"}
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

function InteractiveKeyboard({
  whiteKeys,
  blackKeys,
  showLabels,
  hintLevel,
  stage,
  patternTarget,
  targetCKeyId,
  onWhiteKeyPress,
  onBlackKeyPress,
}: {
  whiteKeys: WhiteKey[];
  blackKeys: BlackKey[];
  showLabels: boolean;
  hintLevel: number;
  stage: ModuleStage;
  patternTarget: 2 | 3;
  targetCKeyId?: string;
  onWhiteKeyPress: (key: WhiteKey) => void;
  onBlackKeyPress: (key: BlackKey) => void;
}) {
  return (
    <div id="keyboard" className="responsive-scroll mt-6 pb-3">
      <div className="relative min-w-[780px] rounded-2xl border border-blue-deep/15 bg-blue-deep/10 p-3">
        <div className="relative h-72 overflow-hidden rounded-xl bg-blue-deep/15">
          <div className="flex h-full">
            {whiteKeys.map((key) => {
              const isTarget = stage === "find-c" && key.id === targetCKeyId && hintLevel > 0;
              const showCGuide = stage === "find-c" && key.note === "C" && hintLevel > 1;

              return (
                <button
                  key={key.id}
                  type="button"
                  onClick={() => onWhiteKeyPress(key)}
                  className={`focus-ring relative flex flex-1 items-end justify-center border-r border-blue-deep/15 pb-5 text-sm font-bold transition last:border-r-0 ${
                    isTarget || showCGuide
                      ? "bg-gold-soft text-[#543b12] shadow-[inset_0_-10px_0_rgba(18,52,91,0.16)]"
                      : "bg-[#fffdf7] text-blue-deep hover:bg-blue-soft/45"
                  }`}
                  aria-label={`Tocar ${key.label} octava ${key.octave}`}
                >
                  {showLabels || showCGuide || isTarget ? (
                    <span className="rounded-lg bg-white/70 px-2 py-1">
                      {key.label}
                      <span className="ml-1 text-[10px] opacity-70">{key.octave}</span>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {blackKeys.map((key) => {
            const showGroupHint = stage === "pattern" && (hintLevel > 0 || key.groupType === patternTarget);

            return (
              <button
                key={key.id}
                type="button"
                onClick={() => onBlackKeyPress(key)}
                style={{ left: `${key.leftPercent}%` }}
                className={`focus-ring absolute top-0 z-10 flex h-[58%] w-[5.7%] -translate-x-1/2 items-end justify-center rounded-b-lg pb-3 text-[10px] font-bold shadow-lg transition ${
                  showGroupHint && key.groupType === patternTarget
                    ? "bg-gold-soft text-[#543b12] shadow-[0_16px_26px_rgba(215,180,106,0.34)]"
                    : "bg-ink text-white/70 hover:bg-[#22324a]"
                }`}
                aria-label={`Tocar ${key.label} octava ${key.octave}`}
              >
                {showLabels ? (
                  <span>
                    {key.label}
                    <span className="ml-0.5 opacity-70">{key.octave}</span>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-blue-deep/10 bg-ivory p-3">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-xl font-bold text-blue-deep">{value}</p>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  text,
  active,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  active: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-4 transition ${
        active
          ? "border-gold-soft/50 bg-gold-soft/20 text-blue-deep"
          : "border-blue-deep/10 bg-ivory text-muted"
      }`}
    >
      <span className={active ? "text-gold-soft" : "text-muted"}>{icon}</span>
      <h3 className="mt-2 text-sm font-bold text-blue-deep">{title}</h3>
      <p className="mt-1 text-sm leading-5">{text}</p>
    </article>
  );
}
