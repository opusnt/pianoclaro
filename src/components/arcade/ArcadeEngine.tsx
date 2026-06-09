"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { useMicrophonePitchDetection } from "@/components/lesson/hooks/useMicrophonePitchDetection";
import { InteractiveKeyboard } from "@/components/shared/interactive/InteractiveKeyboard";
import { type ArcadeInputEvent, useArcadeInput } from "./hooks/useArcadeInput";

export type ArcadeNote = {
  id: string;
  midiNote: number;
  timeMs: number;
  durationMs?: number;
  staff?: number;
  fingering?: number;
  lyric?: string;
  alter?: number;
  natural?: boolean;
  status: "pending" | "perfect" | "miss";
};

export interface ArcadeEngineResult {
  score: number;
  accuracy: number;
  stars: number;
  marvelous?: number;
  perfect?: number;
  good?: number;
  miss?: number;
  earlyRelease?: number;
  maxCombo?: number;
  rank?: "S" | "A" | "B" | "C" | "F";
}

export interface ArcadeEngineProps {
  notes: ArcadeNote[];
  barlines?: number[];
  onFinish?: (result: ArcadeEngineResult) => void;
  speedMultiplier?: number;
  isWaitMode?: boolean;
  viewMode?: "staff" | "waterfall";
  mutedStaffs?: number[];
  isPlayingExternal?: boolean;
  onPlayStateChange?: (playing: boolean) => void;
  metronomeEnabled?: boolean;
  loopRange?: [number, number];
  beats?: number[];
  minMidi?: number;
  maxMidi?: number;
  keySignature?: { fifths: number; mode?: string };
  scrollSpeedMultiplier?: number;
}

const _STAFF_LINES = 5;
const LINE_SPACING = 20;
const HIT_ZONE_X = 150;
const PIXELS_PER_MS = 0.2;
const HIT_WINDOW_MS_HARDWARE = 250; // +/- 250ms para acierto (MIDI/Teclado)
const HIT_WINDOW_MS_ACOUSTIC = 350; // +/- 350ms para acierto (Micrófono)

// Calcula la posición Y visual de una nota
function getVisualY(centerY: number, offset: number): number {
  return centerY + offset * (LINE_SPACING / 2);
}

// Calcula el desplazamiento diatónico desde Do Central (C4)
// Retorna valores negativos para notas agudas (suben en la pantalla Y)
// y valores positivos para notas graves (bajan en la pantalla Y)
function getDiatonicOffsetFromC4(midiNote: number): number {
  const pitchClassToDiatonic: Record<number, number> = {
    0: 0,
    1: 0,
    2: 1,
    3: 1,
    4: 2,
    5: 3,
    6: 3,
    7: 4,
    8: 4,
    9: 5,
    10: 5,
    11: 6,
  };
  const octave = Math.floor(midiNote / 12) - 1;
  const pitchClass = midiNote % 12;
  const diatonicClass = pitchClassToDiatonic[pitchClass];

  const absoluteDiatonic = (octave - 4) * 7 + diatonicClass;
  return -absoluteDiatonic;
}

// Convierte un número MIDI a notación estándar (ej. 60 -> "C4", 61 -> "C#4")
function _midiToNoteString(midiNote: number): string {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(midiNote / 12) - 1;
  const name = noteNames[midiNote % 12];
  return `${name}${octave}`;
}

export function ArcadeEngine({
  notes: initialNotes,
  barlines = [],
  onFinish,
  speedMultiplier = 1,
  isWaitMode = false,
  viewMode = "staff",
  mutedStaffs = [],
  isPlayingExternal,
  onPlayStateChange,
  metronomeEnabled = false,
  loopRange,
  beats = [],
  minMidi = 36,
  maxMidi = 83,
  keySignature,
  scrollSpeedMultiplier = 1.0,
}: ArcadeEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isPlaying = isPlayingExternal !== undefined ? isPlayingExternal : internalIsPlaying;

  const _pixelsPerMs = 0.2 * scrollSpeedMultiplier;

  // Calcular octavas dinámicamente según el rango de notas de la canción
  const dynamicStartOctave = Math.max(0, Math.floor(minMidi / 12) - 1);
  const dynamicEndOctave = Math.min(8, Math.floor(maxMidi / 12));
  const dynamicTotalOctaves = dynamicEndOctave - dynamicStartOctave + 1;
  const dynamicTotalWhiteKeys = dynamicTotalOctaves * 7;
  const _dynamicStartMidi = (dynamicStartOctave + 1) * 12;

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [_maxCombo, setMaxCombo] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const metricsRef = useRef({ marvelous: 0, perfect: 0, good: 0, miss: 0, earlyRelease: 0 });
  const [micEnabled, setMicEnabled] = useState(false);
  const [upcomingNoteStrings, _setUpcomingNoteStrings] = useState<string[]>([]);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Referencias para el loop de animación
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const elapsedMsRef = useRef<number>(0);
  const countdownMsRef = useRef<number>(3000); // 3 segundos de cuenta regresiva
  const lastTickRef = useRef<number>(3); // Para saber cuándo reproducir el sonido del metrónomo
  const notesRef = useRef<ArcadeNote[]>([...initialNotes]);
  const synthRef = useRef<Tone.Sampler | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const metronomeSynthRef = useRef<Tone.MembraneSynth | null>(null);

  // Inicializar sintetizador (Sampler)
  useEffect(() => {
    // 1. Inicializar Reverb
    reverbRef.current = new Tone.Reverb({
      decay: 1.5,
      preDelay: 0.01,
      wet: 0.3, // 30% de reverb en la mezcla
    }).toDestination();

    // 2. Inicializar Sampler con Salamander Grand Piano
    synthRef.current = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      release: 1,
      onload: () => {
        setAudioLoaded(true);
      },
    }).connect(reverbRef.current);

    synthRef.current.volume.value = -2; // Ajuste de volumen base

    metronomeSynthRef.current = new Tone.MembraneSynth().toDestination();
    metronomeSynthRef.current.volume.value = -4;

    return () => {
      synthRef.current?.dispose();
      reverbRef.current?.dispose();
      metronomeSynthRef.current?.dispose();
    };
  }, []);

  const hitEffectsRef = useRef<
    {
      x: number;
      y: number;
      text: string;
      alpha: number;
      vy?: number;
      accuracy?: string;
      scoreText?: string;
    }[]
  >([]);
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; alpha: number; color: string }[]
  >([]);

  const handleInput = useCallback(
    (e: ArcadeInputEvent) => {
      if (e.type === "noteon" && e.source !== "acoustic") {
        try {
          Tone.start();
          if (synthRef.current) {
            const noteName = Tone.Frequency(e.midiNote, "midi").toNote();
            const toneVelocity = Math.max(0.1, e.velocity / 127);
            synthRef.current.triggerAttackRelease(noteName, "8n", undefined, toneVelocity);
          }
        } catch (err) {
          console.warn("Tone JS playback failed", err);
        }
      }

      const elapsedMs = elapsedMsRef.current;
      let hitFound = false;
      const pendingNotes = notesRef.current.filter(
        (n) => n.status === "pending" && n.midiNote === e.midiNote,
      );

      for (let i = 0; i < pendingNotes.length; i++) {
        const note = pendingNotes[i];
        const distanceMs = Math.abs(note.timeMs - elapsedMs);
        const windowMs = e.source === "acoustic" ? HIT_WINDOW_MS_ACOUSTIC : HIT_WINDOW_MS_HARDWARE;

        if (distanceMs <= windowMs) {
          note.status = "perfect";
          setScore((s) => s + 10 * (1 + Math.floor(combo / 5)));
          setCombo((c) => c + 1);

          const offset = getDiatonicOffsetFromC4(note.midiNote);
          const yOffset = getVisualY(150, offset);

          hitEffectsRef.current.push({
            x: HIT_ZONE_X,
            y: yOffset,
            text: "Perfect!",
            alpha: 1.0,
            accuracy: "perfect",
          });
          const isMuted = mutedStaffs.includes(note.staff || 1);
          for (let p = 0; p < 12; p++) {
            particlesRef.current.push({
              x: HIT_ZONE_X,
              y: yOffset,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              alpha: 1.0,
              color: isMuted ? "#94a3b8" : "#22c55e",
            });
          }
          hitFound = true;
          break;
        }
      }

      if (!hitFound && e.type === "noteon") {
        setCombo(0);
        hitEffectsRef.current.push({
          x: HIT_ZONE_X - 50,
          y: getVisualY(150, 0),
          vy: 2.0,
          text: "Error!",
          alpha: 1.0,
        });
      }
    },
    [combo, mutedStaffs],
  );

  const { midiError, activeNotes } = useArcadeInput({
    enabled: isPlaying,
    onEvent: handleInput,
  });

  useMicrophonePitchDetection({
    enabled: isPlaying && micEnabled,
    onNaturalKeyPress: () => {},
    onSharpKeyPress: () => {},
    onMidiNote: (midiNote) => {
      handleInput({ type: "noteon", midiNote, velocity: 100, source: "acoustic" as any });
    },
  });

  const draw = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      let shouldWait = false;
      if (isWaitMode) {
        const firstPending = notesRef.current.find(
          (n) => n.status === "pending" && !mutedStaffs.includes(n.staff || 1),
        );
        if (firstPending && elapsedMsRef.current >= firstPending.timeMs) {
          shouldWait = true;
          elapsedMsRef.current = firstPending.timeMs;
        }
      }

      let isCountingDown = false;
      let currentCountdown = 0;

      if (isPlaying && elapsedMsRef.current === 0) {
        if (countdownMsRef.current > 0) {
          isCountingDown = true;
          countdownMsRef.current -= deltaTime;
          currentCountdown = Math.ceil(countdownMsRef.current / 1000);

          if (currentCountdown !== lastTickRef.current && currentCountdown >= 0) {
            lastTickRef.current = currentCountdown;
            try {
              Tone.start();
              if (currentCountdown === 0)
                metronomeSynthRef.current?.triggerAttackRelease("C5", "16n");
              else metronomeSynthRef.current?.triggerAttackRelease("C4", "16n");
            } catch (_e) {}
          }
        }
      } else if (elapsedMsRef.current > 0) {
        countdownMsRef.current = 0;
      }

      if (!shouldWait && audioLoaded && !isCountingDown && isPlaying) {
        elapsedMsRef.current += deltaTime * speedMultiplier;
      }

      let elapsedMs = elapsedMsRef.current;

      // Lógica de A/B Looping
      const totalTimeMs = Math.max(
        ...notesRef.current.map((n) => n.timeMs + (n.durationMs || 0)),
        1,
      );

      if (loopRange && barlines.length > 0) {
        const [startMeasure, endMeasure] = loopRange;
        const startTimeMs = barlines[Math.min(startMeasure - 1, barlines.length - 1)];
        const endTimeMs = endMeasure < barlines.length ? barlines[endMeasure] : totalTimeMs;

        if (elapsedMs < startTimeMs) {
          elapsedMs = startTimeMs;
          elapsedMsRef.current = startTimeMs;
        }

        if (elapsedMs >= endTimeMs) {
          elapsedMs = startTimeMs;
          elapsedMsRef.current = startTimeMs;
          notesRef.current.forEach((note) => {
            if (note.timeMs >= startTimeMs && note.timeMs <= endTimeMs) {
              note.status = "pending";
            }
          });
          setCombo(0);
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      const HIT_ZONE_Y = canvas.height - 40;

      if (viewMode === "staff") {
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        const trebleOffsets = [-10, -8, -6, -4, -2];
        const bassOffsets = [2, 4, 6, 8, 10];
        [...trebleOffsets, ...bassOffsets].forEach((offset) => {
          const y = getVisualY(centerY, offset);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        });
        // Dibujar Claves
        ctx.fillStyle = "#1e293b";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.font = "115px serif";
        ctx.fillText("𝄞", 25, centerY - 25);
        ctx.font = "90px serif";
        ctx.fillText("𝄢", 25, centerY + 35);

        // Dibujar Armadura de Clave (Key Signature)
        if (keySignature && keySignature.fifths !== 0) {
          const isSharp = keySignature.fifths > 0;
          const count = Math.abs(keySignature.fifths);
          const symbol = isSharp ? "♯" : "♭";
          ctx.font = "bold 24px serif";

          const sharpOffsetsTreble = [-4, -7, -3, -6, -2, -5, -1];
          const sharpOffsetsBass = [2, -1, 3, 0, 4, 1, 5];
          const flatOffsetsTreble = [0, -3, 1, -2, 2, -1, 3];
          const flatOffsetsBass = [6, 3, 7, 4, 8, 5, 9];

          const offsetsTreble = isSharp ? sharpOffsetsTreble : flatOffsetsTreble;
          const offsetsBass = isSharp ? sharpOffsetsBass : flatOffsetsBass;

          for (let i = 0; i < count && i < 7; i++) {
            const xPos = 85 + i * 12;
            ctx.fillText(symbol, xPos, getVisualY(centerY, offsetsTreble[i]));
            ctx.fillText(symbol, xPos, getVisualY(centerY, offsetsBass[i]));
          }
        }
      } else {
        ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
        ctx.lineWidth = 1;
        const whiteKeyWidth = canvas.width / dynamicTotalWhiteKeys;
        for (let i = 0; i <= dynamicTotalWhiteKeys; i++) {
          ctx.beginPath();
          ctx.moveTo(i * whiteKeyWidth, 0);
          ctx.lineTo(i * whiteKeyWidth, canvas.height);
          ctx.stroke();
          if (i % 7 === 0) {
            ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(i * whiteKeyWidth, 0);
            ctx.lineTo(i * whiteKeyWidth, canvas.height);
            ctx.stroke();
            ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
            ctx.lineWidth = 1;
          }
        }

        // --- Lane Glow (Iluminación de Carriles activos) ---
        activeNotes.forEach((midiNote) => {
          const noteIndex = Math.max(0, Math.min(dynamicTotalWhiteKeys - 1, midiNote - 36));
          const x = noteIndex * whiteKeyWidth;

          const glowGrad = ctx.createLinearGradient(0, HIT_ZONE_Y, 0, 0);
          // Color cian brillante
          glowGrad.addColorStop(0, "rgba(6, 182, 212, 0.5)");
          glowGrad.addColorStop(1, "rgba(6, 182, 212, 0.0)");

          ctx.fillStyle = glowGrad;
          ctx.fillRect(x, 0, whiteKeyWidth, HIT_ZONE_Y);

          // Brillo intenso justo en la zona de impacto
          ctx.fillStyle = "rgba(6, 182, 212, 0.8)";
          ctx.fillRect(x, HIT_ZONE_Y - 4, whiteKeyWidth, 8);
        });
      }

      ctx.lineWidth = 4;
      if (shouldWait) {
        const pulse = (Math.sin(time * 0.005) + 1) / 2;
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 + pulse * 0.6})`;
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 10 * pulse;
        ctx.fillStyle = `rgba(251, 191, 36, ${0.5 + pulse * 0.5})`;
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        if (viewMode === "staff") ctx.fillText("Esperando Input...", HIT_ZONE_X, centerY + 80);
        else ctx.fillText("Esperando Input...", canvas.width / 2, HIT_ZONE_Y + 30);
      } else {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      if (viewMode === "staff") {
        ctx.moveTo(HIT_ZONE_X, 0);
        ctx.lineTo(HIT_ZONE_X, canvas.height);
      } else {
        ctx.moveTo(0, HIT_ZONE_Y);
        ctx.lineTo(canvas.width, HIT_ZONE_Y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      let allFinished = true;
      notesRef.current.forEach((note) => {
        let x = 0,
          y = 0;
        if (viewMode === "staff") {
          x = HIT_ZONE_X + (note.timeMs - elapsedMs) * PIXELS_PER_MS * scrollSpeedMultiplier;
          y = getVisualY(centerY, getDiatonicOffsetFromC4(note.midiNote));
        } else {
          const laneWidth = canvas.width / dynamicTotalWhiteKeys;
          const noteIndex = Math.max(0, Math.min(dynamicTotalWhiteKeys - 1, note.midiNote - 36));
          x = noteIndex * laneWidth + laneWidth / 2;
          y = HIT_ZONE_Y - (note.timeMs - elapsedMs) * PIXELS_PER_MS * scrollSpeedMultiplier;
        }

        const isMuted = mutedStaffs.includes(note.staff || 1);
        if (isMuted && note.status === "pending" && elapsedMs >= note.timeMs) {
          note.status = "perfect";
          synthRef.current?.triggerAttackRelease(
            Tone.Frequency(note.midiNote, "midi").toNote(),
            note.durationMs ? note.durationMs / 1000 : "8n",
            undefined,
            0.7,
          );
        }

        if (
          !isWaitMode &&
          !isMuted &&
          note.status === "pending" &&
          elapsedMs > note.timeMs + HIT_WINDOW_MS_ACOUSTIC
        ) {
          note.status = "miss";
          setCombo(0);
          hitEffectsRef.current.push({
            x: viewMode === "staff" ? HIT_ZONE_X - 50 : x,
            y: viewMode === "staff" ? y : HIT_ZONE_Y + 20,
            text: "Miss",
            alpha: 1.0,
            accuracy: "miss",
          });
        }

        if (note.status === "pending" || elapsedMs < note.timeMs + 1000) allFinished = false;

        if (
          viewMode === "staff"
            ? x > -100 && x < canvas.width + 100
            : y > -100 && y < canvas.height + 100
        ) {
          ctx.fillStyle =
            note.status === "perfect"
              ? isMuted
                ? "#94a3b8"
                : "#22c55e"
              : note.status === "miss"
                ? "#ef4444"
                : note.staff === 2
                  ? "#a855f7"
                  : "#3b82f6";
          ctx.beginPath();
          if (viewMode === "staff") {
            const needsLedgerLines =
              getDiatonicOffsetFromC4(note.midiNote) <= -12 ||
              getDiatonicOffsetFromC4(note.midiNote) >= 12 ||
              getDiatonicOffsetFromC4(note.midiNote) === 0;
            if (needsLedgerLines) {
              ctx.strokeStyle = "#94a3b8";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(x - 18, y);
              ctx.lineTo(x + 18, y);
              ctx.stroke();
            }
            ctx.ellipse(x, y, 10, 8, -Math.PI / 8, 0, Math.PI * 2);
          } else ctx.roundRect(x - 8, y - 8, 16, 16, 4);
          ctx.fill();

          // Alteraciones
          if (viewMode === "staff" && note.status === "pending") {
            if (note.alter) {
              ctx.font = "bold 16px serif";
              ctx.textAlign = "right";
              ctx.textBaseline = "middle";
              ctx.fillText(note.alter > 0 ? "♯" : "♭", x - 15, y);
            } else if (note.natural) {
              ctx.font = "bold 16px serif";
              ctx.textAlign = "right";
              ctx.textBaseline = "middle";
              ctx.fillText("♮", x - 15, y);
            }
          }

          // Digitación (Fingering)
          if (note.fingering && note.status === "pending") {
            ctx.fillStyle = viewMode === "staff" ? "#ffffff" : "#0f172a";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(note.fingering.toString(), x, y);
          }
        }
      });

      hitEffectsRef.current.forEach((effect, i) => {
        // Física dinámica: Salto inicial negativo que se frena con gravedad
        effect.vy = effect.vy !== undefined ? effect.vy + 0.15 : -3;
        effect.y += effect.vy;
        effect.alpha -= 0.015;

        if (effect.alpha <= 0) hitEffectsRef.current.splice(i, 1);
        else {
          if (effect.accuracy === "perfect") {
            ctx.shadowColor = "#22c55e";
            ctx.shadowBlur = 10;
          } else if (effect.accuracy === "miss") {
            ctx.shadowColor = "#ef4444";
            ctx.shadowBlur = 10;
          }

          ctx.fillStyle =
            effect.accuracy === "perfect"
              ? `rgba(34, 197, 94, ${effect.alpha})`
              : `rgba(239, 68, 68, ${effect.alpha})`;
          // Escala dinámica según el alpha (empieza grande, se achica)
          const scale = 0.5 + effect.alpha * 0.5;
          ctx.font = `bold ${24 * scale}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(effect.text, effect.x, effect.y);
          ctx.shadowBlur = 0;
        }
      });

      // --- HUD: Combo Multiplier ---
      if (combo >= 5) {
        const pulseCombo = (Math.sin(time * 0.01) + 1) / 2;
        ctx.fillStyle = `rgba(251, 191, 36, ${0.8 + pulseCombo * 0.2})`;
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 10 + 10 * pulseCombo;
        ctx.font = "italic black 36px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          `${combo}x COMBO!`,
          canvas.width / 2,
          viewMode === "staff" ? 40 : canvas.height / 2,
        );
        ctx.shadowBlur = 0;
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.alpha -= 0.02;
        if (p.alpha <= 0) particlesRef.current.splice(i, 1);
        else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      if (isCountingDown) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const text = currentCountdown > 0 ? currentCountdown.toString() : "GO!";
        ctx.save();
        ctx.translate(canvas.width / 2, centerY);
        ctx.fillStyle = currentCountdown === 0 ? "#34d399" : "#fbbf24";
        ctx.font = "black 120px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }

      if (allFinished && elapsedMs > 0 && !showResult) {
        setShowResult(true);
        if (onFinish) onFinish({ score, accuracy: 1.0, stars: 3 });
      } else if (isPlaying) requestRef.current = requestAnimationFrame(draw);
    },
    [
      isPlaying,
      isWaitMode,
      viewMode,
      mutedStaffs,
      speedMultiplier,
      audioLoaded,
      combo,
      scrollSpeedMultiplier,
      onFinish,
      score,
    ],
  );

  useEffect(() => {
    if (isPlaying) requestRef.current = requestAnimationFrame(draw);
    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, draw]);

  const startGame = async () => {
    await Tone.start(); // Necesario para desbloquear Web Audio API
    setInternalIsPlaying(true);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setShowResult(false);
    metricsRef.current = { marvelous: 0, perfect: 0, good: 0, miss: 0, earlyRelease: 0 };
    if (onPlayStateChange) onPlayStateChange(true);
    lastTimeRef.current = 0;
    elapsedMsRef.current = -3000; // Dar 3 segundos de preparación (Countdown) antes de la nota 0
    hitEffectsRef.current = [];
    particlesRef.current = [];
    notesRef.current = initialNotes.map((n) => ({ ...n, status: "pending" }));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex justify-between w-full px-8 max-w-4xl">
        <div className="text-xl font-bold text-slate-700">
          Puntos: <span className="text-blue-600">{score}</span>
        </div>
        <div className="text-xl font-bold text-slate-700">
          Combo: <span className="text-orange-500">x{combo}</span>
        </div>
      </div>

      <div className="relative w-full max-w-4xl rounded-2xl border-4 border-slate-800 overflow-hidden bg-slate-50 shadow-2xl">
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <button
              type="button"
              onClick={startGame}
              className="bg-cyan-500 hover:bg-cyan-400 text-white text-2xl font-black py-4 px-12 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
            >
              INICIAR JUEGO
            </button>

            <div className="mt-8 flex items-center gap-4">
              <label className="flex items-center gap-2 text-white font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={micEnabled}
                  onChange={(e) => setMicEnabled(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Activar Micrófono (Acústico) 🎤
              </label>
            </div>

            <p className="text-slate-300 mt-4 text-sm max-w-md text-center">
              Toca las teclas (A,S,D,F,G) en tu teclado cuando las notas crucen la línea azul. ¡Si
              tienes un cable MIDI, úsalo!
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={900}
          height={300}
          className="w-full h-[300px] bg-gradient-to-r from-slate-100 to-white relative z-0"
        />
      </div>

      {/* Teclado Virtual Sincronizado */}
      <div className="w-full max-w-4xl mt-6 relative z-10">
        <InteractiveKeyboard
          startOctave={2}
          endOctave={5}
          interactive={false}
          highlightedNotes={upcomingNoteStrings}
          highlightColor="bg-blue-400"
          showLabels={true}
        />
        <div className="text-center mt-2 text-sm text-slate-500">
          Las teclas se iluminan para guiarte en tu próxima nota
        </div>
      </div>

      {midiError && (
        <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm">{midiError}</div>
      )}
    </div>
  );
}
