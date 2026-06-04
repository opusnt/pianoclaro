"use client";

import { ArrowRight, CheckCircle2, Music, Play, Trophy, Volume2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Heading, Text } from "@/components/ui/Typography";
import { useAudioSimulator } from "@/components/shared/audio/useAudioSimulator";
import { type SoundType, soundExamples } from "./soundExamples";

export function Unit1SoundVsNoise() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<SoundType | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const { playSimulatedSound } = useAudioSimulator();

  const currentExample = soundExamples[currentIndex];
  const isLast = currentIndex === soundExamples.length - 1;

  useEffect(() => {
    const isCompleted = localStorage.getItem("module1.unit1.completed");
  }, []);

  const handlePlay = () => {
    setHasPlayed(true);
    if (currentExample.synthesisParams) {
      const filterFreq =
        currentExample.id === "engine-noise"
          ? 400
          : currentExample.type === "noise"
            ? 2000
            : undefined;
      playSimulatedSound(currentExample.synthesisParams as any, filterFreq);
    }
  };

  const handleSelect = (type: SoundType) => {
    if (selectedType) return;
    setSelectedType(type);

    if (type === currentExample.type) {
      setCorrectAnswers((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setIsFinished(true);
      localStorage.setItem("module1.unit1.completed", "true");
    } else {
      setCurrentIndex((c) => c + 1);
      setSelectedType(null);
      setHasPlayed(false);
    }
  };

  if (isFinished) {
    const percentage = Math.round((correctAnswers / soundExamples.length) * 100);

    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto mt-12">
        <Trophy className="w-24 h-24 text-gold-soft mb-6" />
        <Heading level={2}>¡Primer concepto desbloqueado!</Heading>
        <Text className="mb-6">
          Ya puedes distinguir entre sonido musical y ruido. Este es el primer paso para entender
          cómo se organiza la música.
        </Text>

        <div className="bg-slate-50 rounded-2xl p-6 w-full mb-8">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            Tu resultado
          </p>
          <div className="flex items-end justify-center gap-2">
            <span className="text-5xl font-black text-slate-900">{correctAnswers}</span>
            <span className="text-xl text-slate-500 font-bold mb-1">de {soundExamples.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className="bg-gold-soft h-full rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <Link href="/modulos/1/unidad-2">
          <Button variant="secondary" size="lg">
            Continuar a la Unidad 2
          </Button>
        </Link>
      </Card>
    );
  }

  const isCorrect = selectedType === currentExample.type;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        icon={Music}
        iconColor="cyan"
        badge="Unidad 1"
        title="¿Qué es la música?"
        description="Escucha cada ejemplo y decide si corresponde a un sonido musical o a un ruido."
      />

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-500">
            Ejemplo {currentIndex + 1} de {soundExamples.length}
          </span>
          <span className="text-sm font-bold text-sky-500">
            {Math.round((currentIndex / soundExamples.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className="bg-sky-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${(currentIndex / soundExamples.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        {/* Play Button Area */}
        <div className="flex flex-col items-center mb-10">
          <button
            onClick={handlePlay}
            className={`group relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full transition-all duration-300 ${
              hasPlayed
                ? "bg-sky-50 text-sky-500 border-2 border-sky-100"
                : "bg-sky-500 text-white shadow-[0_10px_20px_rgba(14,165,233,0.3)] hover:scale-105 hover:bg-sky-400"
            }`}
          >
            {hasPlayed ? <Volume2 className="w-12 h-12" /> : <Play className="w-12 h-12 ml-2" />}
            {!hasPlayed && (
              <div className="absolute inset-0 rounded-full border-4 border-sky-400 opacity-0 group-hover:animate-ping" />
            )}
          </button>
          <p className="mt-4 font-bold text-slate-500">
            {hasPlayed ? "Volver a escuchar" : "Reproducir sonido"}
          </p>
        </div>

        {/* Options */}
        <div
          className={`grid gap-4 sm:grid-cols-2 transition-opacity duration-300 ${!hasPlayed ? "opacity-30 pointer-events-none" : "opacity-100"}`}
        >
          <button
            onClick={() => handleSelect("musical")}
            disabled={selectedType !== null}
            className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
              selectedType === "musical"
                ? currentExample.type === "musical"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-red-500 bg-red-50 text-red-700"
                : "border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-600"
            } ${selectedType && selectedType !== "musical" ? "opacity-40 grayscale" : ""}`}
          >
            <span className="text-xl font-bold">Sonido musical</span>
          </button>

          <button
            onClick={() => handleSelect("noise")}
            disabled={selectedType !== null}
            className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
              selectedType === "noise"
                ? currentExample.type === "noise"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-red-500 bg-red-50 text-red-700"
                : "border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-600"
            } ${selectedType && selectedType !== "noise" ? "opacity-40 grayscale" : ""}`}
          >
            <span className="text-xl font-bold">Ruido</span>
          </button>
        </div>

        {/* Feedback Section */}
        {selectedType && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
              className={`p-5 rounded-2xl border ${isCorrect ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4
                    className={`font-bold text-lg mb-1 ${isCorrect ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {isCorrect ? "¡Muy bien!" : "Casi."}
                  </h4>
                  <p className="text-slate-600 font-medium">
                    {isCorrect &&
                      currentExample.type === "musical" &&
                      "Identificaste correctamente que este sonido tiene una altura definida y proviene de un instrumento."}
                    {isCorrect &&
                      currentExample.type === "noise" &&
                      "Exacto. Este es un sonido desordenado y no tiene una altura definida clara."}
                    {!isCorrect &&
                      currentExample.type === "musical" &&
                      "Este ejemplo corresponde mejor a Sonido Musical. Fíjate que tiene un tono claro que podrías llegar a cantar."}
                    {!isCorrect &&
                      currentExample.type === "noise" &&
                      "Este ejemplo corresponde mejor a Ruido, ya que es irregular y no podríamos asignarle una nota musical exacta."}
                  </p>
                  <div className="mt-3 p-3 bg-slate-100/60 rounded-xl text-sm text-slate-500 border border-black/5">
                    <span className="font-bold block mb-1">💡 El dato clave:</span>
                    {currentExample.explanation}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} variant="outline">
                {isLast ? "Ver resultados" : "Siguiente ejemplo"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
