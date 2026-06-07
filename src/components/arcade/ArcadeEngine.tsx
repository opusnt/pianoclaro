"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useArcadeInput, ArcadeInputEvent } from "./hooks/useArcadeInput";
import { useMicrophonePitchDetection } from "@/components/lesson/hooks/useMicrophonePitchDetection";
import * as Tone from "tone";
import { InteractiveKeyboard } from "@/components/shared/interactive/InteractiveKeyboard";

export type ArcadeNote = {
  id: string;
  midiNote: number;
  timeMs: number;
  durationMs?: number;
  staff?: number;
  fingering?: number;
  lyric?: string;
  alter?: number;
  status: "pending" | "perfect" | "miss";
};

export interface ArcadeEngineResult {
  score: number;
  accuracy: number;
  stars: number;
}

export interface ArcadeEngineProps {
  notes: ArcadeNote[];
  onFinish?: (result: ArcadeEngineResult) => void;
  speedMultiplier?: number;
  isWaitMode?: boolean;
  viewMode?: "staff" | "waterfall";
  mutedStaffs?: number[];
}

const STAFF_LINES = 5;
const LINE_SPACING = 20;
const HIT_ZONE_X = 150;
const PIXELS_PER_MS = 0.2;
const HIT_WINDOW_MS_HARDWARE = 250; // +/- 250ms para acierto (MIDI/Teclado)
const HIT_WINDOW_MS_ACOUSTIC = 350; // +/- 350ms para acierto (Micrófono)

// Calcula el desplazamiento diatónico desde Do Central (C4)
// Retorna valores negativos para notas agudas (suben en la pantalla Y)
// y valores positivos para notas graves (bajan en la pantalla Y)
function getDiatonicOffsetFromC4(midiNote: number): number {
  const pitchClassToDiatonic: Record<number, number> = {
    0: 0, 1: 0, 2: 1, 3: 1, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6
  };
  const octave = Math.floor(midiNote / 12) - 1;
  const pitchClass = midiNote % 12;
  const diatonicClass = pitchClassToDiatonic[pitchClass];
  
  const absoluteDiatonic = (octave - 4) * 7 + diatonicClass;
  return -absoluteDiatonic; 
}

// Convierte un número MIDI a notación estándar (ej. 60 -> "C4", 61 -> "C#4")
function midiToNoteString(midiNote: number): string {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(midiNote / 12) - 1;
  const name = noteNames[midiNote % 12];
  return `${name}${octave}`;
}

export function ArcadeEngine({ 
  notes: initialNotes, 
  onFinish, 
  speedMultiplier = 1, 
  isWaitMode = false,
  viewMode = "staff",
  mutedStaffs = []
}: ArcadeEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [micEnabled, setMicEnabled] = useState(false);
  const [upcomingNoteStrings, setUpcomingNoteStrings] = useState<string[]>([]);
  
  // Referencias para el loop de animación
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const elapsedMsRef = useRef<number>(0);
  const notesRef = useRef<ArcadeNote[]>([...initialNotes]);
  const synthRef = useRef<Tone.PolySynth | null>(null);

  // Inicializar sintetizador
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    synthRef.current.volume.value = -8; // Bajar el volumen un poco
    return () => {
      synthRef.current?.dispose();
    };
  }, []);
  
  // Efectos visuales de colisión y Partículas
  const hitEffectsRef = useRef<{ x: number, y: number, text: string, alpha: number }[]>([]);
  const particlesRef = useRef<{ x: number, y: number, vx: number, vy: number, alpha: number, color: string }[]>([]);

  const handleInput = useCallback((e: ArcadeInputEvent) => {
    if (e.type !== "noteon") return;
    
    // 1. Siempre reproducir el sonido inmediatamente si no es acústico
    if (e.source !== "acoustic") {
      try {
        Tone.start(); // Por si no se ha inicializado el AudioContext
        if (synthRef.current) {
          const noteName = Tone.Frequency(e.midiNote, "midi").toNote();
          synthRef.current.triggerAttackRelease(noteName, "8n");
        }
      } catch (err) {
        console.warn("Tone JS playback failed", err);
      }
    }

    // 2. Comprobar colisiones
    const elapsedMs = elapsedMsRef.current;
    let hitFound = false;
    
    // Buscar la primera nota pendiente que coincida en Pitch y esté cerca de la zona de impacto
    const pendingNotes = notesRef.current.filter(n => n.status === "pending" && n.midiNote === e.midiNote);
    
    for (let i = 0; i < pendingNotes.length; i++) {
      const note = pendingNotes[i];
      const distanceMs = Math.abs(note.timeMs - elapsedMs);
      const windowMs = e.source === "acoustic" ? HIT_WINDOW_MS_ACOUSTIC : HIT_WINDOW_MS_HARDWARE;
      
      if (distanceMs <= windowMs) {
        // Acierto!
        note.status = "perfect";
        setScore(s => s + 10 * (1 + Math.floor(combo / 5)));
        setCombo(c => c + 1);
        
        // Registrar efecto visual
        const offset = getDiatonicOffsetFromC4(note.midiNote);
        const centerY = 150; // La mitad del canvas (height 300 / 2)
        const yOffset = centerY + offset * (LINE_SPACING / 2);
        
        hitEffectsRef.current.push({ x: HIT_ZONE_X, y: yOffset, text: "Perfect!", alpha: 1.0 });
        
        const isMuted = mutedStaffs.includes(note.staff || 1);
        
        // Partículas
        for (let p = 0; p < 12; p++) {
          particlesRef.current.push({
            x: HIT_ZONE_X,
            y: yOffset,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            alpha: 1.0,
            color: isMuted ? "#94a3b8" : "#22c55e" // Verde o Gris
          });
        }

        hitFound = true;
        break; // Solo "consumir" una nota por pulsación
      }
    }
    
    // Si llegamos aquí y pulsó una tecla cerca del Hit Zone que no era la correcta, se pierde el combo
    // Opcional: penalizar puntaje. Por ahora solo rompemos combo.
    if (!hitFound) {
      setCombo(0);
    }
  }, [combo, mutedStaffs]);

  const { midiError, activeNotes } = useArcadeInput({
    enabled: isPlaying,
    onEvent: handleInput
  });

  useMicrophonePitchDetection({
    enabled: isPlaying && micEnabled,
    onNaturalKeyPress: () => {}, // Ignoramos, usamos onMidiNote
    onSharpKeyPress: () => {},
    onMidiNote: (midiNote) => {
      // Inyectar como un evento acústico
      handleInput({ type: "noteon", midiNote, velocity: 100, source: "acoustic" as any });
    }
  });

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Lógica de Wait Mode
    let shouldWait = false;
    if (isWaitMode) {
      // No esperar por notas silenciadas (las que toca la IA)
      const firstPending = notesRef.current.find(n => n.status === "pending" && !mutedStaffs.includes(n.staff || 1));
      if (firstPending && elapsedMsRef.current >= firstPending.timeMs) {
        shouldWait = true;
        // Congelar exactamente en la posición de la nota
        elapsedMsRef.current = firstPending.timeMs;
      }
    }

    if (!shouldWait) {
      elapsedMsRef.current += deltaTime * speedMultiplier;
    }

    const elapsedMs = elapsedMsRef.current;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const HIT_ZONE_Y = canvas.height - 40; // Para Waterfall mode

    if (viewMode === "staff") {
      // Dibujar Grand Staff (Doble Pentagrama)
      ctx.strokeStyle = "#cbd5e1"; // slate-300
      ctx.lineWidth = 2;
      
      const trebleOffsets = [-10, -8, -6, -4, -2]; // F5 a E4
      const bassOffsets = [2, 4, 6, 8, 10];        // A3 a G2

      // Dibujar líneas del pentagrama
      [...trebleOffsets, ...bassOffsets].forEach(offset => {
        const y = centerY + offset * (LINE_SPACING / 2);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      });

      // Dibujar llave de conexión del Grand Staff a la izquierda
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, centerY - 10 * (LINE_SPACING / 2));
      ctx.lineTo(20, centerY + 10 * (LINE_SPACING / 2));
      ctx.stroke();

      // Dibujar Hit Zone (Staff)
      ctx.strokeStyle = activeNotes.length > 0 ? "#3b82f6" : "#94a3b8"; // blue-500 si presiona
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(HIT_ZONE_X, centerY - 12 * (LINE_SPACING / 2));
      ctx.lineTo(HIT_ZONE_X, centerY + 12 * (LINE_SPACING / 2));
      ctx.stroke();

      // Dibujar Claves (Clefs) Nativas en el Canvas usando Unicode
      ctx.fillStyle = "#1e293b"; // slate-800
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      
      // Clave de Sol (Treble Clef) - Aumentada 20%
      ctx.font = "115px serif";
      // Ajuste para que el caracol central quede sobre la línea de Sol (G4, que es centerY - 40)
      ctx.fillText("𝄞", 25, centerY - 25);
      
      // Clave de Fa (Bass Clef) - Disminuida 5% y anclada al Fa
      ctx.font = "90px serif"; 
      // Ajuste para que los puntos rodeen y el bulbo comience en la línea de Fa (F3, que es centerY + 40)
      ctx.fillText("𝄢", 25, centerY + 35);

    } else {
      // Dibujar Hit Zone (Waterfall)
      ctx.strokeStyle = activeNotes.length > 0 ? "#3b82f6" : "#94a3b8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, HIT_ZONE_Y);
      ctx.lineTo(canvas.width, HIT_ZONE_Y);
      ctx.stroke();
      
      // Dibujar separadores de octava leves
      ctx.strokeStyle = "#f1f5f9"; // slate-100
      ctx.lineWidth = 1;
      const totalKeys = 48; // C2 a B5
      const laneWidth = canvas.width / totalKeys;
      for (let i = 0; i <= totalKeys; i++) {
        if (i % 12 === 0) { // Cada Do
          ctx.beginPath();
          ctx.moveTo(i * laneWidth, 0);
          ctx.lineTo(i * laneWidth, canvas.height);
          ctx.stroke();
        }
      }
    }

    // Determinar qué notas resaltar en el teclado inferior
    // Resaltaremos las notas que estén pendientes y a menos de 1000ms de la zona de impacto
    const nextNotesToPlay = notesRef.current
      .filter(n => n.status === "pending" && (n.timeMs - elapsedMs) <= 1000 && (n.timeMs - elapsedMs) >= -200)
      .map(n => midiToNoteString(n.midiNote));

    // Solo actualizar el estado de React si cambió el arreglo (para evitar re-renders a 60fps)
    setUpcomingNoteStrings(prev => {
      if (prev.length !== nextNotesToPlay.length) return nextNotesToPlay;
      for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== nextNotesToPlay[i]) return nextNotesToPlay;
      }
      return prev;
    });

    // Dibujar Notas
    let allFinished = true;
    notesRef.current.forEach(note => {
      let x = 0, y = 0;
      
      if (viewMode === "staff") {
        const offset = getDiatonicOffsetFromC4(note.midiNote);
        x = HIT_ZONE_X + (note.timeMs - elapsedMs) * PIXELS_PER_MS;
        y = centerY + offset * (LINE_SPACING / 2);
      } else {
        const totalKeys = 48; // Rango de C2 (36) a B5 (83)
        const laneWidth = canvas.width / totalKeys;
        const noteIndex = Math.max(0, Math.min(totalKeys - 1, note.midiNote - 36));
        x = noteIndex * laneWidth + laneWidth / 2;
        y = HIT_ZONE_Y - (note.timeMs - elapsedMs) * PIXELS_PER_MS;
      }

      // Si la nota pertenece a una mano silenciada y llegó a su tiempo, auto-tocarla
      const isMuted = mutedStaffs.includes(note.staff || 1);
      if (isMuted && note.status === "pending" && elapsedMs >= note.timeMs) {
        note.status = "perfect";
        synthRef.current?.triggerAttackRelease(Tone.Frequency(note.midiNote, "midi").toNote(), "8n");
        // No suma combo ni score porque la toca la IA
      }

      // Marcar Miss si ya pasó la zona de impacto (solo en modo Arcade)
      if (!isWaitMode && !isMuted && note.status === "pending" && elapsedMs > note.timeMs + HIT_WINDOW_MS_ACOUSTIC) {
        note.status = "miss";
        setCombo(0);
        hitEffectsRef.current.push({ x: viewMode === "staff" ? HIT_ZONE_X - 50 : x, y: viewMode === "staff" ? y : HIT_ZONE_Y + 20, text: "Miss", alpha: 1.0 });
      }

      // Considerar que no ha terminado si la nota está pendiente O si no ha pasado suficiente tiempo para salir de la pantalla (1 segundo)
      if (note.status === "pending" || elapsedMs < note.timeMs + 1000) {
        allFinished = false;
      }

      // Solo dibujar si está en pantalla
      const inScreen = viewMode === "staff" 
        ? (x > -100 && x < canvas.width + 100)
        : (y > -100 && y < canvas.height + 100);

      if (inScreen) {
        // Dibujar Ledger Lines (Solo en Staff)
        if (viewMode === "staff") {
          const offset = getDiatonicOffsetFromC4(note.midiNote);
          const needsLedgerLines = offset === 0 || offset <= -12 || offset >= 12;
          if (needsLedgerLines) {
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 2;
            
            let ledgerOffsets: number[] = [];
            if (offset <= -12) {
              for (let o = -12; o >= offset; o -= 2) ledgerOffsets.push(o);
            } else if (offset >= 12) {
              for (let o = 12; o <= offset; o += 2) ledgerOffsets.push(o);
            } else if (offset === 0) {
              ledgerOffsets.push(0);
            }

            ledgerOffsets.forEach(lOffset => {
              const lY = centerY + lOffset * (LINE_SPACING / 2);
              ctx.beginPath();
              ctx.moveTo(x - 18, lY);
              ctx.lineTo(x + 18, lY);
              ctx.stroke();
            });
          }
        }
        // Dibujar Estela (Duration Tail)
        if (note.durationMs && note.durationMs > 100) {
          const tailSize = note.durationMs * PIXELS_PER_MS;
          let tailColor = "rgba(30, 41, 59, 0.2)"; // default slate
          
          if (note.status === "perfect") tailColor = isMuted ? "rgba(148, 163, 184, 0.3)" : "rgba(34, 197, 94, 0.3)";
          else if (note.status === "miss") tailColor = "rgba(239, 68, 68, 0.3)";
          else {
            // Color code por mano cuando está pending
            tailColor = note.staff === 2 ? "rgba(168, 85, 247, 0.3)" : "rgba(59, 130, 246, 0.3)"; // Purple LH, Blue RH
          }

          ctx.fillStyle = tailColor;
          ctx.beginPath();
          if (viewMode === "staff") {
            ctx.roundRect(x, y - 6, tailSize, 12, 6);
          } else {
            ctx.roundRect(x - 6, y - tailSize, 12, tailSize, 6);
          }
          ctx.fill();
        }

        let noteColor = "#1e293b";
        if (note.status === "perfect") noteColor = isMuted ? "#94a3b8" : "#22c55e";
        else if (note.status === "miss") noteColor = "#ef4444";
        else {
          // Color code por mano cuando está pending
          noteColor = note.staff === 2 ? "#a855f7" : "#3b82f6"; // Purple para Izquierda, Blue para Derecha
        }

        ctx.fillStyle = noteColor;
        
        // Transparencia para manos silenciadas
        if (isMuted) ctx.globalAlpha = 0.5;

        ctx.beginPath();
        if (viewMode === "staff") {
          ctx.ellipse(x, y, 10, 8, -Math.PI / 8, 0, Math.PI * 2);
        } else {
          // Bloques cuadrados en cascada
          ctx.roundRect(x - 8, y - 8, 16, 16, 4);
        }
        ctx.fill();

        // Alteraciones (Sostenidos y Bemoles)
        if (note.alter && viewMode === "staff" && note.status === "pending") {
          ctx.fillStyle = noteColor;
          ctx.font = "bold 16px serif"; // Fuente serif suele verse mejor para símbolos musicales
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          const symbol = note.alter > 0 ? "♯" : "♭";
          // Lo dibujamos un poco a la izquierda de la nota
          ctx.fillText(symbol, x - 15, y);
        }

        ctx.globalAlpha = 1.0;

        // Plica (tallo)
        if (note.status === "pending" && viewMode === "staff") {
          ctx.strokeStyle = isMuted ? "#94a3b8" : noteColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          // Hacia arriba o hacia abajo según posición
          if (note.midiNote >= 71) { // B4 o más alto, plica abajo
            ctx.moveTo(x - 8, y);
            ctx.lineTo(x - 8, y + 25);
          } else {
            ctx.moveTo(x + 8, y);
            ctx.lineTo(x + 8, y - 25);
          }
          ctx.stroke();
        }

        // Digitación (Fingering)
        if (note.fingering && viewMode === "staff") {
          ctx.fillStyle = "#64748b"; // slate-500
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          const fingerY = note.midiNote >= 71 ? y - 12 : y + 30;
          ctx.fillText(note.fingering.toString(), x, fingerY);
        }

        // Letra (Lyric)
        if (note.lyric) {
          ctx.fillStyle = "#334155"; // slate-700
          ctx.font = "italic 16px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          // Mostrar la letra en la parte inferior del pentagrama o carril
          const lyricY = viewMode === "staff" ? centerY + 6 * (LINE_SPACING / 2) : y + 20;
          ctx.fillText(note.lyric, x, lyricY);
        }
      }
    });

    // Dibujar Efectos Visuales (Texto)
    for (let i = hitEffectsRef.current.length - 1; i >= 0; i--) {
      const effect = hitEffectsRef.current[i];
      ctx.fillStyle = effect.text === "Perfect!" ? `rgba(34, 197, 94, ${effect.alpha})` : `rgba(239, 68, 68, ${effect.alpha})`;
      ctx.font = "bold 20px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(effect.text, effect.x, effect.y - (1 - effect.alpha) * 30);
      
      effect.alpha -= 0.02; // Fade out
      if (effect.alpha <= 0) hitEffectsRef.current.splice(i, 1);
    }

    // Dibujar Partículas
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 * p.alpha, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;

      if (p.alpha <= 0) particlesRef.current.splice(i, 1);
    }
    ctx.globalAlpha = 1.0;

    // Dibujar Countdown (Cuenta Regresiva)
    if (elapsedMs < 0) {
      const count = Math.ceil(-elapsedMs / 1000);
      ctx.fillStyle = "rgba(15, 23, 42, 0.4)"; // overlay oscuro
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "white";
      ctx.font = "black 80px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Animación de pulso basada en los ms restantes de ese segundo
      const fraction = (-elapsedMs % 1000) / 1000;
      const scale = 1 + fraction * 0.5;
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.globalAlpha = fraction;
      ctx.fillText(count.toString(), 0, 0);
      ctx.restore();
    }

      if (allFinished) {
        setIsPlaying(false);
        if (onFinish) {
          // Calcular precisión y estrellas
          const playableNotes = notesRef.current.filter(n => !mutedStaffs.includes(n.staff || 1));
          const totalPlayable = playableNotes.length;
          
          let accuracy = 100;
          let stars = 3;
          
          if (totalPlayable > 0) {
            const perfectHits = playableNotes.filter(n => n.status === "perfect").length;
            accuracy = Math.round((perfectHits / totalPlayable) * 100);
            
            if (accuracy >= 95) stars = 3;
            else if (accuracy >= 70) stars = 2;
            else if (accuracy >= 40) stars = 1;
            else stars = 0;
          }

          onFinish({
            score,
            accuracy,
            stars
          });
        }
      } else if (isPlaying) {
      requestRef.current = requestAnimationFrame(draw);
    }
  }, [isPlaying, activeNotes.length, score, speedMultiplier, isWaitMode, onFinish]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, draw]);

  const startGame = async () => {
    // Resetear estado
    notesRef.current = initialNotes.map(n => ({ ...n, status: "pending" }));
    setScore(0);
    setCombo(0);
    lastTimeRef.current = 0;
    elapsedMsRef.current = -3000; // Dar 3 segundos de preparación (Countdown) antes de la nota 0
    hitEffectsRef.current = [];
    particlesRef.current = [];
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex justify-between w-full px-8 max-w-4xl">
        <div className="text-xl font-bold text-slate-700">Puntos: <span className="text-blue-600">{score}</span></div>
        <div className="text-xl font-bold text-slate-700">Combo: <span className="text-orange-500">x{combo}</span></div>
      </div>
      
      <div className="relative w-full max-w-4xl rounded-2xl border-4 border-slate-800 overflow-hidden bg-slate-50 shadow-2xl">
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <button 
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
              Toca las teclas (A,S,D,F,G) en tu teclado cuando las notas crucen la línea azul. ¡Si tienes un cable MIDI, úsalo!
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
        <div className="text-center mt-2 text-sm text-slate-500">Las teclas se iluminan para guiarte en tu próxima nota</div>
      </div>

      {midiError && (
        <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm">{midiError}</div>
      )}
    </div>
  );
}
