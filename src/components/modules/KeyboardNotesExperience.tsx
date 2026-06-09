"use client";

import { Check, ChevronRight, Eye, Headphones, RotateCcw, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NextLessonCard } from "@/components/modules/shared/NextLessonCard";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { contentRepository } from "@/lib/content";
import {
  buildKeyboardNotesProgressSnapshot,
  createInitialKeyboardNotesProgress,
  readKeyboardNotesProgress,
  writeKeyboardNotesProgress,
} from "@/lib/keyboard-notes/progress";
import {
  buildKeyboard,
  getKeyboardNotesAccuracy,
  getKeyboardNotesStageProgress,
  isCorrectBlackKeyGroup,
  isCorrectCKey,
  nextCOctave,
  nextPatternTarget,
} from "@/lib/keyboard-notes/theory";
import type { DetailedLearningModule } from "@/types/curriculum";
import type {
  KeyboardNotesBlackKey,
  KeyboardNotesFeedbackState,
  KeyboardNotesStage,
  KeyboardNotesWhiteKey,
} from "@/types/keyboard-notes";
import type { LearningUnit } from "@/types/learning-path";

type KeyboardLearningPageId = "observe" | "find-c" | "challenge" | "create";

type KeyboardLearningPage = {
  id: KeyboardLearningPageId;
  eyebrow: string;
  title: string;
  goal: string;
  actionLabel: string;
  unlockLabel: string;
};

const keyboardLearningPages: KeyboardLearningPage[] = [
  {
    id: "observe",
    eyebrow: "Página 1",
    title: "Observa el patrón",
    goal: "Antes de memorizar nombres, mira cómo las teclas negras se agrupan en 2 y 3.",
    actionLabel: "Iluminar grupos",
    unlockLabel: "Disponible",
  },
  {
    id: "find-c",
    eyebrow: "Página 2",
    title: "Encuentra DO",
    goal: "Usa el grupo de dos negras como referencia: DO está justo a la izquierda.",
    actionLabel: "Mostrar DO",
    unlockLabel: "Completa 4 patrones",
  },
  {
    id: "challenge",
    eyebrow: "Página 3",
    title: "Reto sin etiquetas",
    goal: "Retira ayudas y comprueba si puedes orientarte por forma, no por texto.",
    actionLabel: "Ocultar ayudas",
    unlockLabel: "Encuentra DO 3 veces",
  },
  {
    id: "create",
    eyebrow: "Página 4",
    title: "Crea una mini frase",
    goal: "Usa notas que ya ubicaste para crear una frase corta y cerrar en DO.",
    actionLabel: "Empezar frase",
    unlockLabel: "Completa el mapa",
  },
];

export function KeyboardNotesExperience({
  module,
  experienceLabel = "Módulo",
}: {
  module: DetailedLearningModule;
  experienceLabel?: "Módulo" | "Lección";
}) {
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
  const [selfCheckCompleted, setSelfCheckCompleted] = useState<string[]>([]);
  const [learningPageId, setLearningPageId] = useState<KeyboardLearningPageId>("observe");
  const [phraseNotes, setPhraseNotes] = useState<string[]>([]);
  const audioRef = useRef<PianoAudioEngine | null>(null);

  const { whiteKeys, blackKeys } = useMemo(() => buildKeyboard([4, 5]), []);
  const learningUnit = useMemo(
    () => contentRepository.getLearningUnitByPlayableModuleId(module.id),
    [module.id],
  );
  const targetCKey = whiteKeys.find((key) => key.note === "C" && key.octave === targetCOctave);
  const accuracy = getKeyboardNotesAccuracy(correct, attempts);
  const stageProgress = getKeyboardNotesStageProgress({ stage, patternHits, cHits });
  const learningPage =
    keyboardLearningPages.find((page) => page.id === learningPageId) ?? keyboardLearningPages[0];

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
      setLearningPageId("find-c");
      setMessage("Continúa encontrando Do antes del grupo de dos teclas negras.");
    }

    if (storedProgress.stage === "complete") {
      setLearningPageId("create");
      setMessage("Mapa inicial completado: el teclado ya tiene referencia.");
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
      markError(
        "Ahora estamos buscando Do. Mira el grupo de dos negras y toca la blanca justo antes.",
      );
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
        setLearningPageId("find-c");
        setPatternTarget(2);
        setTargetCOctave(4);
        setMessage("Do está justo antes del grupo de dos teclas negras. Encuentra Do.");
        return;
      }

      setPatternTarget(nextPatternTarget(patternTarget));
      return;
    }

    markError(
      `Ese grupo tiene ${key.groupType} teclas negras. Necesitamos un grupo de ${patternTarget}.`,
    );
  }

  function handleWhiteKeyPress(key: KeyboardNotesWhiteKey) {
    void playFrequency(key.frequency, 320);

    if (stage === "pattern") {
      markError(
        `Buena exploración: tocaste ${key.label}. En esta ronda solo buscamos teclas negras.`,
      );
      return;
    }

    if (stage === "complete") {
      const nextPhrase = [...phraseNotes, key.label].slice(-6);
      setPhraseNotes(nextPhrase);
      setMessage(
        nextPhrase.length >= 4
          ? `Frase creada: ${nextPhrase.join(" - ")}. Prueba terminar en Do para que suene estable.`
          : `Sonando ${key.label}. Construye una frase de 4 notas y termina en Do.`,
      );
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
        setLearningPageId("create");
        setMessage("Mapa inicial completado: el teclado ya tiene referencia.");
        setXp((value) => value + 60);
        return;
      }

      setTargetCOctave(nextCOctave(targetCOctave));
      return;
    }

    if (key.note === "D" || key.note === "E") {
      markError(
        `Casi. Tocaste ${key.label}. Do está más a la izquierda, justo antes del grupo de dos negras.`,
      );
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
    setSelfCheckCompleted([]);
    setLearningPageId("observe");
    setPhraseNotes([]);
    setMessage("Busca el patrón de dos teclas negras.");
    writeKeyboardNotesProgress(createInitialKeyboardNotesProgress());
  }

  function activateGuidedMode() {
    setShowLabels(true);
    setHintLevel(2);
    setMessage(
      stage === "pattern"
        ? `Modo guiado activo: busca grupos de ${patternTarget} teclas negras iluminadas.`
        : "Modo guiado activo: mira las etiquetas y toca Do justo antes de las dos negras.",
    );
  }

  function activateChallengeMode() {
    setShowLabels(false);
    setHintLevel(0);
    setMessage(
      stage === "complete"
        ? "Modo reto activo: explora sin etiquetas y confirma que puedes orientarte solo."
        : "Modo reto activo: intenta resolver mirando solo el patrón del teclado.",
    );
  }

  function toggleSelfCheck(question: string) {
    setSelfCheckCompleted((current) =>
      current.includes(question)
        ? current.filter((item) => item !== question)
        : [...current, question],
    );
  }

  async function playCurrentTarget() {
    if (stage === "pattern") {
      const targetBlackKey = blackKeys.find((key) => key.groupType === patternTarget);
      if (targetBlackKey) await playFrequency(targetBlackKey.frequency, 260);
      setMessage(`Escucha una tecla negra del grupo de ${patternTarget}. Ahora busca otra igual.`);
      return;
    }

    if (targetCKey) {
      await playFrequency(targetCKey.frequency, 360);
      setMessage(`Ese es Do${targetCOctave}. Ahora ubícalo mirando el grupo de dos negras.`);
      return;
    }

    const middleC = whiteKeys.find((key) => key.note === "C" && key.octave === 4);
    if (middleC) await playFrequency(middleC.frequency, 360);
    setMessage("Escucha Do y luego explora otras octavas con el mismo nombre.");
  }

  function isLearningPageUnlocked(pageId: KeyboardLearningPageId) {
    if (pageId === "observe") return true;
    if (pageId === "find-c") return patternHits >= 4 || stage !== "pattern";
    if (pageId === "challenge") return cHits >= 3 || stage === "complete";
    return stage === "complete";
  }

  function selectLearningPage(pageId: KeyboardLearningPageId) {
    if (!isLearningPageUnlocked(pageId)) {
      const page = keyboardLearningPages.find((item) => item.id === pageId);
      setMessage(`Primero completa el paso anterior: ${page?.unlockLabel ?? "sigue practicando"}.`);
      return;
    }

    setLearningPageId(pageId);

    if (pageId === "observe") {
      setMessage(`Observa el patrón: toca un grupo de ${patternTarget} teclas negras.`);
    }

    if (pageId === "find-c") {
      setMessage("Ahora busca DO usando el grupo de dos teclas negras como referencia.");
    }

    if (pageId === "challenge") {
      activateChallengeMode();
    }

    if (pageId === "create") {
      setMessage("Explora el teclado y crea una frase corta. Intenta cerrar en DO.");
    }
  }

  function runLearningPageAction(pageId = learningPageId) {
    if (pageId === "observe" || pageId === "find-c") {
      activateGuidedMode();
      return;
    }

    if (pageId === "challenge") {
      activateChallengeMode();
      return;
    }

    setPhraseNotes([]);
    setShowLabels(true);
    setHintLevel(1);
    setMessage("Nueva frase: toca 4 notas usando DO-RE-MI-FA-SOL y termina en DO.");
  }

  function goToNextLearningPage() {
    const currentIndex = keyboardLearningPages.findIndex((page) => page.id === learningPageId);
    const nextPage = keyboardLearningPages[currentIndex + 1];
    if (nextPage) {
      selectLearningPage(nextPage.id);
    }
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
      <ImmersivePageNavigator
        currentPageId={learningPageId}
        pages={keyboardLearningPages}
        isUnlocked={isLearningPageUnlocked}
        onSelect={selectLearningPage}
      />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr]">
        <aside className="rounded-2xl border border-blue-deep/10 bg-white/85 p-6 shadow-soft">
          <p className="text-xs font-bold uppercase text-gold-soft">
            {experienceLabel} {module.order}
          </p>
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
                {stage === "pattern"
                  ? `${patternHits}/4`
                  : stage === "find-c"
                    ? `${cHits}/5`
                    : "Listo"}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-deep/10">
              <div
                className="h-full rounded-full bg-gold-soft transition-all"
                style={{ width: `${stageProgress}%` }}
              />
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
              <h2 className="mt-1 text-2xl font-bold text-blue-deep">
                Primero toca. Luego entiendes.
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-blue-soft/55 px-3 py-2 text-sm font-bold text-blue-deep">
              <Headphones aria-hidden="true" className="h-4 w-4 text-gold-soft" />
              Sonido activo al tocar
            </div>
          </div>

          <LearningPageCoach
            accuracy={accuracy}
            learningPage={learningPage}
            phraseNotes={phraseNotes}
            stage={stage}
            stageProgress={stageProgress}
            onAction={() => runLearningPageAction()}
            onNext={goToNextLearningPage}
            onPlayCurrentTarget={() => {
              void playCurrentTarget();
            }}
          />

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

      <AppliedLearningPath
        accuracy={accuracy}
        cHits={cHits}
        learningUnit={learningUnit}
        patternHits={patternHits}
        selfCheckCompleted={selfCheckCompleted}
        stage={stage}
        onActivateGuidedMode={activateGuidedMode}
        onToggleSelfCheck={toggleSelfCheck}
      />

      {stage === "complete" ? (
        <NextLessonCard currentModuleId={module.id} isCompleted={stage === "complete"} />
      ) : (
        <section className="mt-6 rounded-2xl border border-blue-deep/10 bg-blue-deep p-6 text-white shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gold-soft">
                Antes de la siguiente lección
              </p>
              <h2 className="mt-2 text-2xl font-bold">Termina el mapa del teclado</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Cuando completes el mapa, el botón de siguiente lección te llevará directo a Ritmo
                básico.
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

function ImmersivePageNavigator({
  currentPageId,
  pages,
  isUnlocked,
  onSelect,
}: {
  currentPageId: KeyboardLearningPageId;
  pages: KeyboardLearningPage[];
  isUnlocked: (pageId: KeyboardLearningPageId) => boolean;
  onSelect: (pageId: KeyboardLearningPageId) => void;
}) {
  return (
    <section className="mb-6 rounded-2xl border border-blue-deep/10 bg-blue-deep p-4 text-white shadow-soft sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-gold-soft">Motor inmersivo del módulo</p>
          <h2 className="mt-2 text-2xl font-black">
            Cuatro páginas: observar, ubicar, retar y crear.
          </h2>
        </div>
        <p className="max-w-md text-sm font-bold leading-6 text-white/75">
          Cada página cambia las ayudas, el objetivo y la forma de practicar. No es solo texto:
          altera cómo interactúas con el teclado.
        </p>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-4">
        {pages.map((page, index) => {
          const unlocked = isUnlocked(page.id);
          const active = page.id === currentPageId;

          return (
            <button
              type="button"
              key={page.id}
              type="button"
              onClick={() => onSelect(page.id)}
              className={`focus-ring min-h-24 rounded-2xl border p-3 text-left transition ${
                active
                  ? "border-gold-soft bg-gold-soft text-[#4b3510]"
                  : unlocked
                    ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
                    : "border-white/10 bg-white/5 text-white/45"
              }`}
            >
              <span className="text-xs font-black uppercase">
                {index + 1}. {unlocked ? page.eyebrow : "Bloqueada"}
              </span>
              <span className="mt-2 block text-sm font-black leading-5">{page.title}</span>
              <span className="mt-1 block text-xs font-bold leading-4 opacity-80">
                {unlocked ? page.actionLabel : page.unlockLabel}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LearningPageCoach({
  accuracy,
  learningPage,
  phraseNotes,
  stage,
  stageProgress,
  onAction,
  onNext,
  onPlayCurrentTarget,
}: {
  accuracy: number;
  learningPage: KeyboardLearningPage;
  phraseNotes: string[];
  stage: KeyboardNotesStage;
  stageProgress: number;
  onAction: () => void;
  onNext: () => void;
  onPlayCurrentTarget: () => void;
}) {
  const shouldRepair = accuracy < 70 && stage !== "complete";
  const phraseReady = phraseNotes.length >= 4;

  return (
    <section className="mt-5 rounded-2xl border border-blue-deep/10 bg-ivory p-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="text-xs font-black uppercase text-gold-soft">{learningPage.eyebrow}</p>
          <h3 className="mt-2 text-2xl font-black text-blue-deep">{learningPage.title}</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-muted">{learningPage.goal}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onAction}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-2xl bg-blue-deep px-4 py-3 text-sm font-black text-white transition hover:bg-[#0d2949]"
            >
              {learningPage.actionLabel}
            </button>
            <button
              type="button"
              onClick={onPlayCurrentTarget}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-black text-blue-deep transition hover:bg-blue-soft/40"
            >
              Escuchar ejemplo
            </button>
            <button
              type="button"
              onClick={onNext}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-black text-blue-deep transition hover:bg-cream"
            >
              Siguiente página
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/75 p-4">
          <p className="text-xs font-black uppercase text-muted">
            {shouldRepair ? "Reparación activa" : "Estado de aprendizaje"}
          </p>
          <p className="mt-2 text-sm font-black leading-6 text-blue-deep">
            {shouldRepair
              ? "Usa pista visual y escucha el ejemplo antes de tocar. La meta es mirar primero y responder después."
              : `Fase ${stageProgress}% completada con ${accuracy}% de precisión.`}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-deep/10">
            <div
              className="h-full rounded-full bg-gold-soft transition-all"
              style={{ width: `${stageProgress}%` }}
            />
          </div>
          <div className="mt-4 rounded-xl bg-cream/80 p-3">
            <p className="text-xs font-black uppercase text-muted">Mini frase</p>
            <p className="mt-1 text-sm font-black leading-6 text-blue-deep">
              {phraseNotes.length > 0 ? phraseNotes.join(" - ") : "Completa el mapa para crear."}
            </p>
            {phraseReady ? (
              <p className="mt-1 text-xs font-bold text-muted">
                Ya tienes una frase. Ahora intenta terminar en Do.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function AppliedLearningPath({
  accuracy,
  cHits,
  learningUnit,
  patternHits,
  selfCheckCompleted,
  stage,
  onActivateGuidedMode,
  onToggleSelfCheck,
}: {
  accuracy: number;
  cHits: number;
  learningUnit?: LearningUnit;
  patternHits: number;
  selfCheckCompleted: string[];
  stage: KeyboardNotesStage;
  onActivateGuidedMode: () => void;
  onToggleSelfCheck: (question: string) => void;
}) {
  const selfCheck = learningUnit?.practiceContract.selfCheck ?? [];
  const canSelfEvaluate = stage === "complete";
  const completedCount = selfCheckCompleted.length;
  const milestones = [
    {
      label: "Patrones",
      value: `${Math.min(patternHits, 4)}/4`,
      done: patternHits >= 4,
    },
    {
      label: "Do en octavas",
      value: `${Math.min(cHits, 5)}/5`,
      done: cHits >= 5,
    },
    {
      label: "Aplicación",
      value: stage === "complete" ? "Lista" : "Pendiente",
      done: stage === "complete",
    },
  ];

  return (
    <section className="mt-6 rounded-2xl border border-blue-deep/10 bg-white/85 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_1fr]">
        <article>
          <p className="text-xs font-black uppercase text-gold-soft">Mapa de dominio</p>
          <h2 className="mt-2 text-xl font-black text-blue-deep">
            Progreso por habilidades, no por lectura.
          </h2>
          <div className="mt-4 grid gap-2">
            {milestones.map((milestone) => (
              <div
                key={milestone.label}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-black ${
                  milestone.done
                    ? "border-teal-soft/40 bg-teal-soft/10 text-blue-deep"
                    : "border-blue-deep/10 bg-ivory text-muted"
                }`}
              >
                <span>{milestone.label}</span>
                <span>{milestone.value}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-blue-deep/10 bg-blue-soft/25 p-4">
          <p className="text-xs font-black uppercase text-muted">Reparación inmediata</p>
          <p className="mt-2 text-sm font-bold leading-6 text-blue-deep">
            Si te equivocas seguido, vuelve a resolver con pista. La app muestra etiquetas, ilumina
            el patrón y vuelve al punto visual que necesitas mirar.
          </p>
          <button
            type="button"
            onClick={onActivateGuidedMode}
            className="focus-ring mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl bg-blue-deep px-4 py-3 text-sm font-black text-white transition hover:bg-[#0d2949]"
          >
            Resolver con pista
          </button>
        </article>

        <article className="rounded-2xl bg-blue-deep p-4 text-white">
          <p className="text-xs font-black uppercase text-gold-soft">Cierre del módulo</p>
          <p className="mt-2 text-sm font-bold leading-6 text-white/85">
            {learningUnit?.practiceContract.transferChallenge ??
              "Crea una frase breve usando las notas que ya puedes ubicar."}
          </p>
          <div className="mt-3 space-y-2">
            {selfCheck.map((question) => {
              const isChecked = selfCheckCompleted.includes(question);

              return (
                <button
                  type="button"
                  key={question}
                  type="button"
                  disabled={!canSelfEvaluate}
                  onClick={() => onToggleSelfCheck(question)}
                  className={`focus-ring flex w-full items-start gap-2 rounded-xl border p-2 text-left text-xs font-bold leading-5 transition ${
                    isChecked
                      ? "border-teal-soft/40 bg-teal-soft/20 text-white"
                      : "border-white/15 bg-white/10 text-white/70"
                  } ${canSelfEvaluate ? "hover:bg-white/15" : "cursor-not-allowed opacity-60"}`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isChecked ? "border-teal-soft bg-teal-soft text-white" : "border-white/30"
                    }`}
                  >
                    {isChecked ? <Check aria-hidden="true" className="h-3 w-3" /> : null}
                  </span>
                  {question}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs font-black text-white/70">
            Autoevaluación: {completedCount}/{selfCheck.length} · Precisión: {accuracy}%
          </p>
        </article>
      </div>
    </section>
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
                  type="button"
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
            const showGroupHint =
              stage === "pattern" && (hintLevel > 0 || key.groupType === patternTarget);

            return (
              <button
                type="button"
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
