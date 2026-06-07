"use client";

import {
  ArrowRight,
  CheckCircle2,
  CheckSquare,
  Layers,
  Play,
  Speaker,
  Square,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAudioSequencer } from "@/components/shared/audio/useAudioSequencer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Heading, Text } from "@/components/ui/Typography";
import { musicPillarsLayers } from "./musicLayers";
import { recognitionExercises } from "./recognitionExercises";

export function Unit3MusicPillars() {
  const [stage, setStage] = useState<number>(0);

  // States para el Mixer
  const [hasInteractedWithMixer, setHasInteractedWithMixer] = useState(false);

  // States para el Quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOption, setQuizOption] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // States para Aplicación Final
  const [appChecks, setAppChecks] = useState({ melody: false, harmony: false, rhythm: false });
  const [appAnswered, setAppAnswered] = useState(false);

  const { playSequence, stopAll, isPlaying, toggleLayer, activeLayers } = useAudioSequencer();

  useEffect(() => {
    stopAll();
  }, [stage, stopAll]);

  const handleNextStage = () => setStage((s) => s + 1);

  const handlePlayAll = () => playSequence(musicPillarsLayers, ["melody", "harmony", "rhythm"]);
  const handlePlayMelody = () => playSequence(musicPillarsLayers, ["melody"]);
  const handlePlayHarmony = () => playSequence(musicPillarsLayers, ["harmony"]);
  const handlePlayRhythm = () => playSequence(musicPillarsLayers, ["rhythm"]);

  if (stage === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 mt-12">
        <Card className="text-center flex flex-col items-center">
          <PageHeader
            icon={Layers}
            iconColor="emerald"
            badge="Unidad 3"
            title="Los tres pilares de la música"
            description="Los detectives musicales han descubierto que toda canción está construida con tres piezas fundamentales. Escucha con atención para descubrir de qué está hecha la música."
            className="mb-10"
          />
          <Button onClick={handleNextStage} variant="secondary" size="lg">
            Escuchar
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Card>
      </div>
    );
  }

  if (stage === 1) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <Card className="text-center">
          <Heading level={2} className="mb-6">
            Etapa 1: La Canción Completa
          </Heading>
          <button
            onClick={isPlaying ? stopAll : handlePlayAll}
            className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                : "bg-emerald-500 text-white hover:scale-105 shadow-xl shadow-emerald-500/30"
            }`}
          >
            {isPlaying ? <Square className="w-12 h-12" /> : <Play className="w-12 h-12 ml-2" />}
          </button>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl">
            <p className="text-xl font-bold text-slate-600">¿Qué crees que estás escuchando?</p>
            <p className="text-slate-500 mt-2">
              Esta pequeña canción parece un solo sonido, pero en realidad está dividida en tres
              partes distintas.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Button onClick={handleNextStage}>Investigar las partes</Button>
          </div>
        </Card>
      </div>
    );
  }

  const isolatedStages = [
    {
      s: 2,
      title: "1. La Melodía",
      play: handlePlayMelody,
      question: "¿Qué parte de la canción sigue siendo fácil de recordar?",
      explanation: "La melodía es la parte que solemos cantar o tararear.",
      icon: "🎵",
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      s: 3,
      title: "2. La Armonía",
      play: handlePlayHarmony,
      question: "¿Escuchas una base que sostiene la música?",
      explanation: "La armonía crea el ambiente y acompaña a la melodía. Son los acordes.",
      icon: "🎹",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      s: 4,
      title: "3. El Ritmo",
      play: handlePlayRhythm,
      question: "¿Qué te hace mover el pie o marcar el tiempo?",
      explanation: "Eso es el ritmo. El pulso y organización temporal de la música.",
      icon: "🥁",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
  ];

  const iso = isolatedStages.find((i) => i.s === stage);
  if (iso) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <Card className="text-center">
          <h2 className={`text-2xl font-black tracking-tight mb-6 ${iso.color}`}>{iso.title}</h2>

          <div className="flex justify-center mb-8">
            <button
              onClick={isPlaying ? stopAll : iso.play}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${iso.bg} ${iso.color} border-2 border-transparent hover:border-current`}
            >
              {isPlaying ? <Square className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
            </button>
          </div>

          <div className="text-8xl mb-8 animate-bounce">{iso.icon}</div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl">
            <p className="text-xl font-bold text-slate-800 mb-2">{iso.question}</p>
            <p className="text-slate-500 font-medium text-lg">{iso.explanation}</p>
          </div>

          <div className="mt-8 flex justify-center">
            <Button onClick={handleNextStage} variant="outline" className="gap-2">
              Siguiente <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (stage === 5) {
    const isReadyToAdvance = hasInteractedWithMixer;
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <Card className="text-center text-white border-sky-500/20">
          <h2 className="text-3xl font-black mb-2 flex items-center justify-center gap-3">
            <Speaker className="w-8 h-8 text-sky-400" />
            El Mixer Musical
          </h2>
          <p className="text-slate-500 mb-10">
            Dale play a la canción y enciende o apaga las capas para ver cómo cambia la música en
            tiempo real.
          </p>

          <div className="mb-12">
            <button
              onClick={() => {
                if (isPlaying) stopAll();
                else playSequence(musicPillarsLayers, ["melody", "harmony", "rhythm"]);
              }}
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all ${
                isPlaying
                  ? "bg-rose-500 hover:bg-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                  : "bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              }`}
            >
              {isPlaying ? <Square className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                id: "melody",
                name: "Melodía",
                icon: "🎵",
                color: "text-sky-400",
                border: "border-sky-500",
              },
              {
                id: "harmony",
                name: "Armonía",
                icon: "🎹",
                color: "text-purple-400",
                border: "border-purple-500",
              },
              {
                id: "rhythm",
                name: "Ritmo",
                icon: "🥁",
                color: "text-orange-400",
                border: "border-orange-500",
              },
            ].map((layer) => {
              const isActive = activeLayers.has(layer.id);
              return (
                <button
                  key={layer.id}
                  onClick={() => {
                    setHasInteractedWithMixer(true);
                    toggleLayer(layer.id, !isActive);
                  }}
                  className={`relative p-6 rounded-2xl flex flex-col items-center gap-3 transition-all ${
                    isActive
                      ? `bg-slate-800 border-2 ${layer.border}`
                      : "bg-slate-800/50 border-2 border-slate-200 opacity-50 grayscale"
                  }`}
                >
                  <span className="text-4xl">{layer.icon}</span>
                  <span className={`font-bold ${isActive ? layer.color : "text-slate-500"}`}>
                    {layer.name}
                  </span>

                  <div
                    className={`mt-2 w-12 h-6 rounded-full p-1 flex items-center transition-colors ${isActive ? "bg-sky-500 justify-end" : "bg-slate-600 justify-start"}`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center h-16 items-center">
            {isReadyToAdvance ? (
              <Button
                onClick={handleNextStage}
                variant="secondary"
                className="animate-in fade-in zoom-in"
              >
                Pasar al Quiz Auditivo
              </Button>
            ) : (
              <p className="text-slate-500 text-sm">
                Prueba apagar y encender algunas capas mientras reproduces...
              </p>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (stage === 6) {
    const exercise = recognitionExercises[quizIndex];
    const isLastQuiz = quizIndex === recognitionExercises.length - 1;
    const isCorrect = quizOption === exercise.type;

    const playQuizSound = () => {
      const tempLayer = { id: exercise.type, name: "Quiz", events: exercise.events };
      playSequence([tempLayer], [exercise.type]);
    };

    const handleQuizNext = () => {
      if (isLastQuiz) {
        handleNextStage();
      } else {
        setQuizOption(null);
        setQuizIndex((q) => q + 1);
      }
    };

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="mb-6 flex justify-between items-center text-sm font-bold text-slate-500">
          <span>Quiz Auditivo</span>
          <span>
            {quizIndex + 1} de {recognitionExercises.length}
          </span>
        </div>

        <Card className="text-center">
          <Heading level={2} className="mb-6 text-slate-800">
            {exercise.instruction}
          </Heading>

          <button
            onClick={isPlaying ? stopAll : playQuizSound}
            className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all mb-10 ${
              isPlaying
                ? "bg-sky-500/10 text-sky-500"
                : "bg-sky-500 text-white shadow-xl shadow-sky-500/30 hover:scale-105"
            }`}
          >
            {isPlaying ? <Square className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: "melody", label: "Melodía", icon: "🎵" },
              { id: "harmony", label: "Armonía", icon: "🎹" },
              { id: "rhythm", label: "Ritmo", icon: "🥁" },
            ].map((opt) => {
              const isSelected = quizOption === opt.id;
              const isWinner = isSelected && opt.id === exercise.type;

              return (
                <button
                  key={opt.id}
                  disabled={quizOption !== null}
                  onClick={() => {
                    setQuizOption(opt.id);
                    if (opt.id === exercise.type) setCorrectAnswers((c) => c + 1);
                  }}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? isWinner
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                        : "bg-red-500/10 border-red-500/50 text-red-400"
                      : "border-slate-200 hover:border-sky-500/30 hover:bg-sky-500/10 text-slate-600"
                  } ${quizOption && !isSelected ? "opacity-40 grayscale" : ""}`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <span className="font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {quizOption && (
            <div
              className={`mt-8 p-5 rounded-xl text-left animate-in fade-in border ${isCorrect ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-bold ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                    {isCorrect ? "¡Correcto!" : "Ups, casi."}
                  </h4>
                  <p className="text-slate-600 mt-1">{exercise.explanation}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleQuizNext} variant="outline">
                  {isLastQuiz ? "Siguiente etapa" : "Siguiente"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (stage === 7) {
    const checkCount = Object.values(appChecks).filter(Boolean).length;
    const isCorrect = appChecks.melody && appChecks.harmony && appChecks.rhythm;

    const handleAppSubmit = () => {
      setAppAnswered(true);
      if (isCorrect) setCorrectAnswers((c) => c + 1);
    };

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <Card className="text-center">
          <Heading level={2} className="mb-6">
            Aplicación Final
          </Heading>

          <button
            onClick={isPlaying ? stopAll : handlePlayAll}
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all mb-8 bg-emerald-500 text-white hover:scale-105 shadow-xl shadow-emerald-500/20"
          >
            {isPlaying ? <Square className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          <div className="p-6 bg-slate-50 rounded-2xl mb-8">
            <p className="text-lg font-bold text-slate-600 mb-4">
              Selecciona todo lo que escuchas en esta canción:
            </p>

            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              {[
                { id: "melody", label: "Melodía (una línea principal)" },
                { id: "harmony", label: "Armonía (una base de acompañamiento)" },
                { id: "rhythm", label: "Ritmo (pulsos percusivos)" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${appChecks[opt.id as keyof typeof appChecks] ? "bg-sky-500 border-sky-500 text-white" : "border-slate-600"}`}
                  >
                    {appChecks[opt.id as keyof typeof appChecks] && (
                      <CheckSquare className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-medium text-slate-600">{opt.label}</span>
                  <input
                    type="checkbox"
                    className="hidden"
                    disabled={appAnswered}
                    checked={appChecks[opt.id as keyof typeof appChecks]}
                    onChange={(e) => setAppChecks((p) => ({ ...p, [opt.id]: e.target.checked }))}
                  />
                </label>
              ))}
            </div>
          </div>

          {!appAnswered ? (
            <Button
              onClick={handleAppSubmit}
              disabled={checkCount === 0}
              variant="secondary"
              size="lg"
            >
              Verificar
            </Button>
          ) : (
            <div
              className={`p-5 rounded-xl text-left border animate-in fade-in ${isCorrect ? "bg-emerald-500/10 border-emerald-500/20" : "bg-sky-500/10 border-sky-500/20"}`}
            >
              <h4 className={`font-bold mb-2 ${isCorrect ? "text-emerald-400" : "text-sky-400"}`}>
                {isCorrect ? "¡Excelente!" : "En realidad estaban todas."}
              </h4>
              <p className="text-slate-600">
                La mayoría de las canciones utilizan estos tres pilares simultáneamente. Cuando
                escuchas música en la radio, tu cerebro procesa melodía, armonía y ritmo al mismo
                tiempo.
              </p>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => {
                    localStorage.setItem("module1.unit3.completed", "true");
                    localStorage.setItem(
                      "module1.unit3.score",
                      Math.round(
                        (correctAnswers / (recognitionExercises.length + 1)) * 100,
                      ).toString(),
                    );
                    handleNextStage();
                  }}
                  variant="secondary"
                >
                  Finalizar Unidad
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  const totalExercises = recognitionExercises.length + 1;
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto mt-12 border-emerald-500/20">
      <Trophy className="w-24 h-24 text-gold-soft mb-6" />
      <Heading level={2} className="text-white">
        Ahora escuchas como músico
      </Heading>
      <Text className="mb-6">
        Acabas de descubrir los tres pilares fundamentales de la música. Todo lo que aprenderás a
        partir de ahora se construirá sobre melodía, armonía y ritmo.
      </Text>

      <div className="bg-slate-50 rounded-2xl p-6 w-full mb-8 flex justify-around">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">Respuestas Correctas</p>
          <p className="text-3xl font-black text-emerald-400">
            {correctAnswers} <span className="text-lg text-slate-500">/ {totalExercises}</span>
          </p>
        </div>
      </div>

      <Link href="/modulos">
        <Button variant="secondary" size="lg">
          Continuar
        </Button>
      </Link>
    </Card>
  );
}
