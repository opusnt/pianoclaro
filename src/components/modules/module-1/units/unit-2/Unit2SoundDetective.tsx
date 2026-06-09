"use client";

import { ArrowRight, CheckCircle2, Ear, Play, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAudioSimulator } from "@/components/shared/audio/useAudioSimulator";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Heading, Text } from "@/components/ui/Typography";
import { soundDetectiveChallenges } from "./soundDetectiveChallenges";

export function Unit2SoundDetective() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [playedSounds, setPlayedSounds] = useState<Set<string>>(new Set());
  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const { playSimulatedSound } = useAudioSimulator();

  const challenge = soundDetectiveChallenges[currentIndex];
  const isIntro = challenge.mode === "info";
  const totalQuestions = soundDetectiveChallenges.filter((c) => c.mode !== "info").length;
  const questionIndex = soundDetectiveChallenges
    .slice(0, currentIndex)
    .filter((c) => c.mode !== "info").length;
  const isLast = currentIndex === soundDetectiveChallenges.length - 1;

  useEffect(() => {
    setPlayedSounds(new Set());
    setSelectedOption(null);
  }, [currentIndex]);

  const handlePlaySound = (soundId: string) => {
    const sound = challenge.sounds?.find((s) => s.id === soundId);
    if (sound) {
      playSimulatedSound(sound.synthesisParams);
      setPlayedSounds((prev) => {
        const newSet = new Set(prev);
        newSet.add(soundId);
        return newSet;
      });
    }
  };

  const hasHeardAllRequiredSounds = () => {
    if (!challenge.sounds) return true;
    return challenge.sounds.every((s) => playedSounds.has(s.id));
  };

  const handleSelect = (option: string) => {
    if (selectedOption || !hasHeardAllRequiredSounds()) return;
    setSelectedOption(option);

    if (option === challenge.correctAnswer) {
      setCorrectAnswers((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setIsFinished(true);
      localStorage.setItem("module1.unit2.completed", "true");
      localStorage.setItem(
        "module1.unit2.score",
        Math.round((correctAnswers / totalQuestions) * 100).toString(),
      );
    } else {
      setCurrentIndex((c) => c + 1);
    }
  };

  if (isFinished) {
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto mt-12">
        <Ear className="w-24 h-24 text-gold-soft mb-6" />
        <Heading level={2}>¡Oído más entrenado!</Heading>
        <Text className="mb-6">
          Ya reconoces las cuatro propiedades principales del sonido: altura, duración, intensidad y
          timbre.
        </Text>

        <div className="bg-slate-50 rounded-2xl p-6 w-full mb-8">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            Tu resultado
          </p>
          <div className="flex items-end justify-center gap-2">
            <span className="text-5xl font-black text-slate-900">{correctAnswers}</span>
            <span className="text-xl text-slate-500 font-bold mb-1">de {totalQuestions}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className="bg-gold-soft h-full rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <Link href="/modulos/1/unidad-3">
          <Button variant="secondary" size="lg">
            Continuar a la Unidad 3
          </Button>
        </Link>
      </Card>
    );
  }

  if (isIntro) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 mt-12">
        <Card className="text-center flex flex-col items-center">
          <PageHeader
            icon={Ear}
            iconColor="cyan"
            badge="Unidad 2"
            title={challenge.title}
            description={challenge.instruction}
            className="mb-10"
          />
          <Button onClick={handleNext} variant="secondary" size="lg">
            Comenzar investigación
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Card>
      </div>
    );
  }

  const isCorrect = selectedOption === challenge.correctAnswer;
  const canAnswer = hasHeardAllRequiredSounds();

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-bold tracking-wider text-sky-500 uppercase mb-2">Unidad 2</p>
        <Heading level={1}>{challenge.title}</Heading>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-500">
            Desafío {questionIndex + 1} de {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className="bg-sky-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <p className="text-xl font-bold text-slate-800 mb-8 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
          {challenge.instruction}
        </p>

        {/* Reproducción de Audio */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {challenge.sounds?.map((sound) => {
            const hasPlayed = playedSounds.has(sound.id);
            return (
              <div key={sound.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handlePlaySound(sound.id)}
                  className={`relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full transition-all duration-300 ${
                    hasPlayed
                      ? "bg-sky-50 text-sky-500 border-2 border-sky-100"
                      : "bg-sky-500 text-white shadow-[0_10px_20px_rgba(14,165,233,0.3)] hover:scale-105 hover:bg-sky-400 animate-pulse-soft"
                  }`}
                >
                  <Play className="w-10 h-10 ml-1" />
                  {!hasPlayed && !selectedOption && (
                    <div className="absolute inset-0 rounded-full border-4 border-sky-400 opacity-0 group-hover:animate-ping" />
                  )}
                </button>
                <p className={`mt-3 font-bold ${hasPlayed ? "text-slate-500" : "text-slate-600"}`}>
                  {sound.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Opciones de Respuesta */}
        <div
          className={`grid gap-4 ${challenge.options && challenge.options.length > 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"} transition-opacity duration-300 ${!canAnswer ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          {challenge.options?.map((option) => {
            const isSelected = selectedOption === option;
            const isWinner = isSelected && option === challenge.correctAnswer;

            return (
              <button
                type="button"
                key={option}
                onClick={() => handleSelect(option)}
                disabled={selectedOption !== null}
                className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? isWinner
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-md"
                      : "border-red-500/50 bg-red-500/10 text-red-400"
                    : "border-slate-300 hover:border-sky-500/50 hover:bg-sky-500/10 text-slate-700"
                } ${selectedOption && !isSelected ? "opacity-40 grayscale" : ""}`}
              >
                <span className="text-xl font-bold">{option}</span>
              </button>
            );
          })}
        </div>

        {!canAnswer && (
          <p className="text-center text-sm font-bold text-sky-500 mt-6 animate-pulse">
            👆 Toca ambos sonidos para compararlos y habilitar tu respuesta.
          </p>
        )}

        {/* Feedback Section */}
        {selectedOption && (
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
                    {isCorrect ? challenge.successFeedback : challenge.errorFeedback}
                  </h4>
                  <div className="mt-3 p-3 bg-slate-100/60 rounded-xl text-sm text-slate-600 border border-black/5 leading-relaxed">
                    <span className="font-bold block mb-1">💡 La explicación:</span>
                    {challenge.explanation}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} variant="outline">
                {isLast ? "Ver resultados" : "Siguiente desafío"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
