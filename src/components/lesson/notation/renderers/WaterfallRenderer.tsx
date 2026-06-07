"use client";

import { useEffect, useRef } from "react";
import type { NotationRendererProps } from "@/components/lesson/notation/types";

export function WaterfallRenderer({
  practiceSong,
  activeNotePosition,
  isPlaying,
  onNoteSelect,
  onNaturalKeyPress,
  onSharpKeyPress,
}: NotationRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentBeatRef = useRef<number>(1);
  const targetBeatRef = useRef<number>(1);
  const lastTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);

  // Guardar props en refs para que el bucle de animación no dependa de cierres (closures)
  const isPlayingRef = useRef(isPlaying);
  const practiceSongRef = useRef(practiceSong);
  const activeNotePositionRef = useRef(activeNotePosition);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    practiceSongRef.current = practiceSong;
    activeNotePositionRef.current = activeNotePosition;
  }, [isPlaying, practiceSong, activeNotePosition]);

  // Colores vibrantes (Aesthetics Premium)
  const laneColors = [
    "#FF3B30", // C
    "#FF9500", // C#
    "#FFCC00", // D
    "#4CD964", // D#
    "#5AC8FA", // E
    "#007AFF", // F
    "#5856D6", // F#
    "#FF2D55", // G
    "#AF52DE", // G#
    "#FF3B30", // A
    "#FF9500", // A#
    "#FFCC00", // B
  ];

  // Efecto para saltar la cascada a la posición actual cuando no se está reproduciendo
  useEffect(() => {
    if (!isPlaying && activeNotePosition && practiceSong) {
      const activeEvent = practiceSong.timelineEvents.find(
        (e) =>
          e.kind === "note" &&
          e.measureNumber === activeNotePosition.measureNumber &&
          e.noteIndex === activeNotePosition.noteIndex,
      );
      if (activeEvent) {
        targetBeatRef.current = activeEvent.startsAtBeat;
      }
    }
  }, [activeNotePosition, isPlaying, practiceSong]);

  // Bucle de animación (solo se monta una vez)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let resizeObserver: ResizeObserver | null = null;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(canvas);
    resizeCanvas();

    const render = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const song = practiceSongRef.current;
      const playing = isPlayingRef.current;

      if (!song) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      const tempoBpm = song.config.tempoBpm || 120;
      const beatsPerSecond = tempoBpm / 60;

      if (playing) {
        // En cada frame incrementamos el tiempo en "beats" (pulso)
        currentBeatRef.current += (deltaTime / 1000) * beatsPerSecond;
        targetBeatRef.current = currentBeatRef.current; // sincronizar
      } else {
        // Interpolar suavemente hacia el beat objetivo (cuando el usuario toca manualmente)
        const diff = targetBeatRef.current - currentBeatRef.current;
        if (Math.abs(diff) > 0.01) {
          currentBeatRef.current += diff * (deltaTime / 1000) * 10; // Velocidad de interpolación proporcional al tiempo
        } else {
          currentBeatRef.current = targetBeatRef.current;
        }
      }

      const currentBeat = currentBeatRef.current;

      // Limpiar canvas
      ctx.clearRect(0, 0, width, height);

      // Fondo oscuro glassmorphism style
      ctx.fillStyle = "#0F172A"; // Slate 900
      ctx.fillRect(0, 0, width, height);

      const laneCount = 12;
      const laneWidth = width / laneCount;
      const pixelsPerBeat = 120; // Velocidad de caída
      const hitLineY = height - 40; // Línea donde se "toca" la nota

      // Dibujar líneas de carril
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 1; i < laneCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, 0);
        ctx.lineTo(i * laneWidth, height);
        ctx.stroke();
      }

      // Dibujar Hit Line (teclado virtual inferior)
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, hitLineY, width, height - hitLineY);

      ctx.shadowColor = "#38BDF8";
      ctx.shadowBlur = playing ? 10 : 0;
      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, hitLineY);
      ctx.lineTo(width, hitLineY);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Letras de las teclas en el hit line
      const labels = [
        "Do",
        "Do#",
        "Re",
        "Re#",
        "Mi",
        "Fa",
        "Fa#",
        "Sol",
        "Sol#",
        "La",
        "La#",
        "Si",
      ];
      ctx.fillStyle = "#94A3B8";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      for (let i = 0; i < laneCount; i++) {
        ctx.fillText(labels[i], i * laneWidth + laneWidth / 2, hitLineY + 25);
      }

      // Dibujar notas (timelineEvents)
      song.timelineEvents.forEach((event) => {
        if (event.kind !== "note") return;

        const beatsAhead = event.startsAtBeat - currentBeat;
        const noteY = hitLineY - beatsAhead * pixelsPerBeat;

        const noteHeight = Math.max(event.durationBeats * pixelsPerBeat - 4, 10);

        if (noteY - noteHeight > height || noteY < -noteHeight - 50) return;

        const pitchClass = event.midiNote % 12;
        const laneX = pitchClass * laneWidth;
        const color = laneColors[pitchClass];

        const isActive = noteY >= hitLineY && noteY - noteHeight <= hitLineY;

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = isActive ? 15 : 0;

        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(laneX + 2, noteY - noteHeight, laneWidth - 4, noteHeight, 6);
          ctx.fill();
        } else {
          ctx.fillRect(laneX + 2, noteY - noteHeight, laneWidth - 4, noteHeight);
        }
        ctx.shadowBlur = 0;

        if (isActive) {
          ctx.fillStyle = "white";
          ctx.fillRect(laneX + 2, hitLineY - 2, laneWidth - 4, 4);
        }
      });

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-[0_12px_30px_rgba(18,52,91,0.15)] relative">
      <div className="absolute top-2 left-2 px-3 py-1 bg-slate-900/50 backdrop-blur text-xs font-bold text-sky-400 rounded-full border border-sky-400/30">
        WebGL / Canvas Engine
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-[400px] cursor-crosshair"
        style={{ touchAction: "none" }}
        onClick={(e) => {
          // Si el usuario toca un carril en la pantalla, cuenta como tocar el teclado
          if (!practiceSong) return;
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;

          const x = e.clientX - rect.left;
          const laneWidth = rect.width / 12;
          const laneIndex = Math.floor(x / laneWidth);

          // Buscar qué nota coincide
          const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
          const noteName = scale[laneIndex];

          if (noteName.includes("#")) {
            if (onSharpKeyPress) onSharpKeyPress(noteName as any);
          } else {
            if (onNaturalKeyPress) onNaturalKeyPress(noteName as any);
          }
        }}
      />
    </div>
  );
}
