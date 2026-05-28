"use client";

import { Check, ChevronRight, Eye, Headphones, RotateCcw, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { LessonNarrativePanel } from "@/components/modules/shared/LessonNarrativePanel";
import { NextLessonCard } from "@/components/modules/shared/NextLessonCard";
import {
  buildKeyboard,
  getKeyboardNotesAccuracy,
  getKeyboardNotesStageProgress,
  isCorrectBlackKeyGroup,
  isCorrectCKey,
  nextCOctave,
  nextPatternTarget,
} from "@/lib/keyboard-notes/theory";
import {
  buildKeyboardNotesProgressSnapshot,
  createInitialKeyboardNotesProgress,
  readKeyboardNotesProgress,
  writeKeyboardNotesProgress,
} from "@/lib/keyboard-notes/progress";
import type { DetailedLearningModule } from "@/types/curriculum";
import type {
  KeyboardNotesBlackKey,
  KeyboardNotesFeedbackState,
  KeyboardNotesStage,
  KeyboardNotesWhiteKey,
} from "@/types/keyboard-notes";

export function KeyboardNotesExperience({ module }: { module: DetailedLearningModule }) {
  const [stage, setStage] = useState<KeyboardNotesStage>("pattern");
  const [patternTarget, setPatternTarget] = useState<2 | 3>(2);
  const [targetCOctave, setTargetCOctave] = useState(4);
  const [xp, setXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboMax, setComboMax] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [patternHits, setPatternHits] = useState(0);
  const [cHits, setCHits] = useState(0);
  const [feedback, setFeedback] = useState<KeyboardNotesFeedbackState>("idle");
  const [message, setMessage] = useState("Busca el patrón de dos teclas negras.");
  const [showLabels, setShowLabels] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const audioRef = useRef<PianoAudioEngine | null>(null);

  const { whiteKeys, blackKeys } = useMemo(() => buildKeyboard([4, 5]), []);
  const targetCKey = whiteKeys.find((key) => key.note === "C" && key.octave === targetCOctave);
  const accuracy = getKeyboardNotesAccuracy(correct, attempts);
  const stageProgress = getKeyboardNotesStageProgress({ stage, patternHits, cHits });

  useEffect(() => {
    const storedProgress = readKeyboardNotesProgress();
    setStage(storedProgress.stage);
    setXp(storedProgress.xp);
    setComboMax(storedProgress.comboMax);
    setAttempts(storedProgress.attempts);
    setCorrect(storedProgress.correct);
    setPatternHits(storedProgress.patternHits);
    setCHits(storedProgress.cHits);

    if (storedProgress.stage === "find-c") {
      setMessage("Continúa encontrando Do antes del grupo de dos teclas negras.");
    }

    if (storedProgress.stage === "complete") {
      setMessage("Módulo inicial completado: el teclado ya tiene mapa.");
    }

    return () => {
      audioRef.current?.close();
    };
  }, []);

  useEffect(() => {
    writeKeyboardNotesProgress(
      buildKeyboardNotesProgressSnapshot({
        stage,
        xp,
        combo,
        comboMax,
        attempts,
        correct,
        patternHits,
        cHits,
        accuracy,
      }),
    );
  }, [accuracy, attempts, cHits, combo, comboMax, correct, patternHits, stage, xp]);

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
    setCombo((value) => {
      const nextCombo = value + 1;
      setComboMax((currentMax) => Math.max(currentMax, nextCombo));
      return nextCombo;
    });
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

  function handleBlackKeyPress(key: KeyboardNotesBlackKey) {
    void playFrequency(key.frequency, 260);

    if (stage !== "pattern") {
      markError("Ahora estamos buscando Do. Mira el grupo de dos negras y toca la blanca justo antes.");
      return;
    }

    if (isCorrectBlackKeyGroup(key, patternTarget)) {
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

  function handleWhiteKeyPress(key: KeyboardNotesWhiteKey) {
    void playFrequency(key.frequency, 320);

    if (stage === "pattern") {
      markError(`Buena exploración: tocaste ${key.label}. En esta ronda solo buscamos teclas negras.`);
      return;
    }

    if (stage === "complete") {
      setMessage(`Sonando ${key.label}. Ya puedes repetir el módulo o seguir al próximo poder.`);
      return;
    }

    const isCorrectC = isCorrectCKey(key, targetCOctave);

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
    setComboMax(0);
    setAttempts(0);
    setCorrect(0);
    setPatternHits(0);
    setCHits(0);
    setFeedback("idle");
    setHintLevel(0);
    setShowLabels(true);
    setMessage("Busca el patrón de dos teclas negras.");
    writeKeyboardNotesProgress(createInitialKeyboardNotesProgress());
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
              {showLabels ? "Ocultar notas" : "Ver notas"}
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

      <div className="mt-6">
        <LessonNarrativePanel moduleId={module.id} />
      </div>

      {stage === "complete" ? (
        <NextLessonCard currentModuleId={module.id} isCompleted={stage === "complete"} />
      ) : (
        <section className="mt-6 rounded-2xl border border-blue-deep/10 bg-blue-deep p-6 text-white shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gold-soft">Antes de la siguiente lección</p>
              <h2 className="mt-2 text-2xl font-bold">Termina el mapa del teclado</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Cuando completes el mapa, el botón de siguiente lección te llevará directo a Ritmo básico.
              </p>
            </div>
            <a
              href="#keyboard"
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-deep transition hover:bg-cream"
            >
              Seguir practicando
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      )}
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
  whiteKeys: KeyboardNotesWhiteKey[];
  blackKeys: KeyboardNotesBlackKey[];
  showLabels: boolean;
  hintLevel: number;
  stage: KeyboardNotesStage;
  patternTarget: 2 | 3;
  targetCKeyId?: string;
  onWhiteKeyPress: (key: KeyboardNotesWhiteKey) => void;
  onBlackKeyPress: (key: KeyboardNotesBlackKey) => void;
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
                  {showLabels ? (
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
