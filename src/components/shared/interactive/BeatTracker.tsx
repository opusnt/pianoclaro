"use client";

import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";

interface BeatTrackerProps {
  onAccuracyUpdate?: (accuracy: number) => void;
  targetBeats?: number;
}

export function BeatTracker({ onAccuracyUpdate, targetBeats = 8 }: BeatTrackerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("text-slate-500");
  const [pulseScale, setPulseScale] = useState(1);

  const engineRef = useRef<PianoAudioEngine | null>(null);
  const expectedBeatTimes = useRef<number[]>([]);
  const tapScores = useRef<number[]>([]);

  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
    engineRef.current.prepare();

    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      engineRef.current?.close();
    };
  }, []);

  const handleStart = async () => {
    if (!engineRef.current) return;

    await Tone.start();
    await engineRef.current.prepare();

    Tone.Transport.bpm.value = 60; // 1 beat per second

    let currentBeat = 0;
    expectedBeatTimes.current = [];
    tapScores.current = [];
    setBeatCount(0);
    setFeedback("Escucha el pulso...");
    setFeedbackColor("text-slate-500");

    Tone.Transport.scheduleRepeat((time) => {
      currentBeat++;

      // Schedule visual pulse slightly before the audio to account for screen refresh
      Tone.Draw.schedule(() => {
        setPulseScale(1.3);
        setTimeout(() => setPulseScale(1), 150);
      }, time);

      // Save expected time for accuracy calculation
      expectedBeatTimes.current.push(Tone.now());

      engineRef.current?.playHeartbeat();

      if (currentBeat >= targetBeats + 4) {
        // Give 4 lead-in beats
        Tone.Transport.stop();
        setIsPlaying(false);
        setFeedback("¡Terminado!");
        setFeedbackColor("text-fuchsia-500");

        if (onAccuracyUpdate && tapScores.current.length > 0) {
          const avgScore = tapScores.current.reduce((a, b) => a + b, 0) / tapScores.current.length;
          onAccuracyUpdate(avgScore);
        }
      }
    }, "4n");

    Tone.Transport.start();
    setIsPlaying(true);
  };

  const handleTap = () => {
    if (!isPlaying) return;

    setPulseScale(0.8);
    setTimeout(() => setPulseScale(1), 100);

    const now = Tone.now();
    // Find the closest expected beat
    if (expectedBeatTimes.current.length === 0) return;

    const closestBeatTime = expectedBeatTimes.current.reduce((prev, curr) => {
      return Math.abs(curr - now) < Math.abs(prev - now) ? curr : prev;
    });

    const diff = now - closestBeatTime; // positive means late, negative means early
    const absDiff = Math.abs(diff);

    let score = 0;
    if (absDiff < 0.1) {
      setFeedback("¡Perfecto!");
      setFeedbackColor("text-emerald-500");
      score = 100;
    } else if (absDiff < 0.25) {
      if (diff > 0) {
        setFeedback("Un poco lento");
        setFeedbackColor("text-amber-500");
      } else {
        setFeedback("Un poco rápido");
        setFeedbackColor("text-amber-500");
      }
      score = 50;
    } else {
      setFeedback("¡Escucha el pulso!");
      setFeedbackColor("text-rose-500");
      score = 0;
    }

    tapScores.current.push(score);
    setBeatCount((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border-2 border-slate-100">
      <div className="mb-12 h-8 text-center">
        <span className={`text-xl font-bold transition-colors ${feedbackColor}`}>
          {feedback ||
            (isPlaying ? "¡Toca siguiendo el latido!" : "Presiona Iniciar para comenzar")}
        </span>
      </div>

      <button
        onClick={isPlaying ? handleTap : handleStart}
        className={`relative flex items-center justify-center w-32 h-32 rounded-full transition-all duration-75 ${
          isPlaying
            ? "bg-rose-50 text-rose-500 border-4 border-rose-200 active:bg-rose-100"
            : "bg-sky-500 text-white hover:bg-sky-400 shadow-xl"
        }`}
        style={{ transform: `scale(${pulseScale})` }}
      >
        {isPlaying ? (
          <Heart className="w-16 h-16 fill-current" />
        ) : (
          <span className="font-bold text-xl uppercase tracking-wider">Iniciar</span>
        )}
      </button>

      {isPlaying && <div className="mt-8 text-slate-500 font-medium">Toques: {beatCount}</div>}
    </div>
  );
}
