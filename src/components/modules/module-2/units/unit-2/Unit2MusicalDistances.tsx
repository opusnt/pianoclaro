"use client";

import { ArrowRight, CheckCircle2, Ear, Eye, Layers, Navigation, Play, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { InteractiveKeyboard } from "@/components/shared/interactive/InteractiveKeyboard";
import { IntervalStepper } from "@/components/shared/interactive/IntervalStepper";
import { DistanceVisualizer } from "@/components/shared/visualizers/DistanceVisualizer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading, Text } from "@/components/ui/Typography";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import {
  type DistanceExercise,
  isSemitone,
  isTone,
  semitoneExercises,
  toneExercises,
} from "./distanceExercises";

// Helpers
const getSpanishName = (note: string) => {
  const map: Record<string, string> = {
    C: "DO",
    "C#": "DO#",
    D: "RE",
    "D#": "RE#",
    E: "MI",
    F: "FA",
    "F#": "FA#",
    G: "SOL",
    "G#": "SOL#",
    A: "LA",
    "A#": "LA#",
    B: "SI",
  };
  const base = note.replace(/[0-9]/g, "");
  return map[base] || base;
};

const getRandomExercises = (arr: DistanceExercise[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export function Unit2MusicalDistances() {
  const [stage, setStage] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // States compartidos
  const engineRef = useRef<PianoAudioEngine | null>(null);

  // Estados específicos
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [activeExercises, setActiveExercises] = useState<DistanceExercise[]>([]);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "error" | null>(null);

  // Para comparación auditiva/visual
  const [isPlaying, setIsPlaying] = useState(false);

  // Stats finales
  const [totalExercises, setTotalExercises] = useState(0);
  const [stage9Initialized, setStage9Initialized] = useState(false);

  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
    return () => {
      engineRef.current?.close();
    };
  }, []);

  // Inicializar ejercicios en ciertas etapas
  useEffect(() => {
    if (stage === 4 && activeExercises.length === 0) {
      setActiveExercises(getRandomExercises(semitoneExercises, 5));
      setTotalExercises((t) => t + 5);
    }
    if (stage === 6 && activeExercises.length === 0) {
      setActiveExercises(getRandomExercises(toneExercises, 5));
      setTotalExercises((t) => t + 5);
    }
    if (stage === 7 && activeExercises.length === 0) {
      const mixed = [
        ...getRandomExercises(semitoneExercises, 3),
        ...getRandomExercises(toneExercises, 3),
      ].sort(() => 0.5 - Math.random());
      setActiveExercises(mixed);
      setTotalExercises((t) => t + 6);
    }
    if (stage === 8 && activeExercises.length === 0) {
      const mixed = [
        ...getRandomExercises(semitoneExercises, 3),
        ...getRandomExercises(toneExercises, 3),
      ].sort(() => 0.5 - Math.random());
      setActiveExercises(mixed);
      setTotalExercises((t) => t + 6);
    }
    if (stage === 9 && !stage9Initialized) {
      setTotalExercises((t) => t + 2); // Stage 9 has 2 hardcoded challenges
      setStage9Initialized(true);
    }
    if (stage === 10) {
      localStorage.setItem("module2.unit2.completed", "true");
      localStorage.setItem(
        "module2.unit2.score",
        Math.round((correctAnswers / totalExercises) * 100).toString(),
      );
    }
  }, [stage, activeExercises.length, correctAnswers, totalExercises, stage9Initialized]);

  // Auto-play para Etapa 8
  useEffect(() => {
    if (stage === 8 && feedback === null && activeExercises.length > 0) {
      const currentEx = activeExercises[currentExerciseIndex];
      if (currentEx) {
        const playAuto = async () => {
          setIsPlaying(true);
          if (engineRef.current) {
            await engineRef.current.playNote(currentEx.start);
            await new Promise((r) => setTimeout(r, 600));
            await engineRef.current.playNote(currentEx.end);
          }
          setIsPlaying(false);
        };
        setTimeout(playAuto, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, currentExerciseIndex, feedback, activeExercises]);

  const playSystemSound = async (note: string) => {
    if (engineRef.current) {
      await engineRef.current.playNote(note);
    }
  };

  const nextStage = () => {
    setPlayedNotes([]);
    setFeedback(null);
    setCurrentExerciseIndex(0);
    setActiveExercises([]);
    setStage((s) => s + 1);
  };

  // --------------------------------------------------------
  // ETAPA 0: INTRO
  // --------------------------------------------------------
  if (stage === 0) {
    return (
      <Card className="max-w-2xl mx-auto mt-12 flex flex-col items-center text-center p-12">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-500 shadow-sm">
          <Navigation className="w-10 h-10" />
        </div>
        <Text variant="label" className="mb-2">
          Unidad 2
        </Text>
        <Heading level={1}>Las distancias musicales</Heading>
        <Text className="max-w-md mx-auto mb-10">
          La música mide distancias, igual que un mapa. Aprenderás a medir el espacio entre las
          notas de forma visual y auditiva.
        </Text>
        <Button onClick={nextStage} size="lg">
          Comenzar
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 1: DESCUBRIMIENTO
  // --------------------------------------------------------
  if (stage === 1) {
    const playExample1 = async () => {
      setIsPlaying(true);
      await playSystemSound("C4");
      await new Promise((r) => setTimeout(r, 600));
      await playSystemSound("D4");
      setIsPlaying(false);
    };

    const playExample2 = async () => {
      setIsPlaying(true);
      await playSystemSound("E4");
      await new Promise((r) => setTimeout(r, 600));
      await playSystemSound("F4");
      setIsPlaying(false);
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>¿Todas las notas están igual de lejos?</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Escucha atentamente estos dos pares de notas vecinas. ¿Suenan igual de separadas?
        </Text>

        <div className="flex justify-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              onClick={playExample1}
              disabled={isPlaying}
              className="mb-4 h-24 w-24 rounded-full"
            >
              <Play className="w-8 h-8 text-sky-500" />
            </Button>
            <span className="font-bold text-slate-500">DO → RE</span>
          </div>

          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              onClick={playExample2}
              disabled={isPlaying}
              className="mb-4 h-24 w-24 rounded-full"
            >
              <Play className="w-8 h-8 text-amber-500" />
            </Button>
            <span className="font-bold text-slate-500">MI → FA</span>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
          <p className="font-bold text-slate-700 italic">
            "Una pareja suena más junta que la otra..."
          </p>
        </div>

        <Button onClick={nextStage}>Continuar</Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 2: EL PASO MÁS PEQUEÑO
  // --------------------------------------------------------
  if (stage === 2) {
    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>El paso más pequeño</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Observa el teclado. Entre MI y FA, o entre SI y DO,{" "}
          <strong>no hay ninguna tecla negra en el medio</strong>. Están pegadas.
        </Text>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <IntervalStepper
            steps={["E4", "F4"]}
            autoPlay={true}
            intervalMs={1000}
            highlightColor="bg-fuchsia-400"
          />
        </div>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <IntervalStepper
            steps={["B3", "C4"]}
            autoPlay={true}
            intervalMs={1000}
            highlightColor="bg-fuchsia-400"
          />
        </div>

        <Button onClick={nextStage}>Entendido</Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 3: APARECE EL SEMITONO
  // --------------------------------------------------------
  if (stage === 3) {
    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8 border-fuchsia-200 shadow-[0_0_40px_rgba(217,70,239,0.1)]">
        <Heading level={2} className="text-fuchsia-600">
          SEMITONO
        </Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Cuando avanzamos a la tecla vecina más cercana (sin saltarnos ninguna), decimos que hemos
          avanzado un <strong>SEMITONO</strong>.
        </Text>

        <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
          <DistanceVisualizer
            startNote="E"
            endNote="F"
            semitones={1}
            label="Semitono"
            highlightColor="bg-fuchsia-500"
          />
          <DistanceVisualizer
            startNote="B"
            endNote="C"
            semitones={1}
            label="Semitono"
            highlightColor="bg-fuchsia-500"
          />
        </div>

        <Button onClick={nextStage}>¡Vamos a cazar semitonos!</Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 4: CAZA DE SEMITONOS
  // --------------------------------------------------------
  if (stage === 4) {
    if (activeExercises.length === 0) return null;
    const currentEx = activeExercises[currentExerciseIndex];

    const handleKey = (note: string) => {
      if (feedback !== null) return;

      const startBase = currentEx.start.replace(/[0-9]/g, "");
      const noteBase = note.replace(/[0-9]/g, "");

      if (playedNotes.length === 0) {
        if (noteBase === startBase) {
          setPlayedNotes([note]);
        } else {
          setFeedback("error");
          setTimeout(() => setFeedback(null), 1000);
        }
      } else if (playedNotes.length === 1) {
        if (isSemitone(playedNotes[0], note)) {
          setPlayedNotes([...playedNotes, note]);
          setFeedback("correct");
          setCorrectAnswers((c) => c + 1);
          setTimeout(() => {
            if (currentExerciseIndex < activeExercises.length - 1) {
              setCurrentExerciseIndex((i) => i + 1);
              setPlayedNotes([]);
              setFeedback(null);
            } else {
              nextStage();
            }
          }, 1000);
        } else {
          setFeedback("error");
          setTimeout(() => {
            setFeedback(null);
            setPlayedNotes([]);
          }, 1000);
        }
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>Caza de Semitonos</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Encuentra el semitono. Toca la nota inicial y luego la nota que está a un semitono de
          distancia.
        </Text>

        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="text-sm font-bold text-slate-400">
            Progreso: {currentExerciseIndex + 1}/{activeExercises.length}
          </span>
        </div>

        <div className="mb-8 flex justify-center gap-4 items-center font-bold text-2xl">
          <span className="text-slate-500">{getSpanishName(currentEx.start)}</span>
          <ArrowRight className="text-fuchsia-500" />
          <span className="text-slate-900 border-b-2 border-fuchsia-500 border-dashed pb-1">?</span>
        </div>

        {feedback === "error" && (
          <p className="text-red-500 font-bold mb-4 animate-bounce">
            ¡Esa no es! Recuerda: es la tecla vecina más cercana.
          </p>
        )}
        {feedback === "correct" && <p className="text-emerald-500 font-bold mb-4">¡Excelente!</p>}

        <div className="mb-8 border p-4 rounded-xl bg-slate-50 transition-all">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
            highlightedNotes={playedNotes}
            highlightColor="bg-fuchsia-500"
            showLabels={true}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 5: DESCUBRIENDO EL TONO
  // --------------------------------------------------------
  if (stage === 5) {
    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8 border-sky-200 shadow-[0_0_40px_rgba(14,165,233,0.1)]">
        <Heading level={2} className="text-sky-600">
          TONO
        </Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Si juntamos <strong>DOS semitonos</strong> consecutivos, formamos un <strong>TONO</strong>
          . Es como saltarse una tecla.
        </Text>

        <div className="flex justify-center mb-8">
          <DistanceVisualizer
            startNote="C"
            endNote="D"
            semitones={2}
            label="Tono"
            highlightColor="bg-sky-500"
            showKeysCount
          />
        </div>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <IntervalStepper
            steps={["C4", "C#4", "D4"]}
            autoPlay={true}
            intervalMs={800}
            highlightColor="bg-sky-400"
          />
        </div>

        <Button onClick={nextStage}>¡Vamos a cazar tonos!</Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 6: CAZA DE TONOS
  // --------------------------------------------------------
  if (stage === 6) {
    if (activeExercises.length === 0) return null;
    const currentEx = activeExercises[currentExerciseIndex];

    const handleKey = (note: string) => {
      if (feedback !== null) return;

      const startBase = currentEx.start.replace(/[0-9]/g, "");
      const noteBase = note.replace(/[0-9]/g, "");

      if (playedNotes.length === 0) {
        if (noteBase === startBase) {
          setPlayedNotes([note]);
        } else {
          setFeedback("error");
          setTimeout(() => setFeedback(null), 1000);
        }
      } else if (playedNotes.length === 1) {
        if (isTone(playedNotes[0], note)) {
          setPlayedNotes([...playedNotes, note]);
          setFeedback("correct");
          setCorrectAnswers((c) => c + 1);
          setTimeout(() => {
            if (currentExerciseIndex < activeExercises.length - 1) {
              setCurrentExerciseIndex((i) => i + 1);
              setPlayedNotes([]);
              setFeedback(null);
            } else {
              nextStage();
            }
          }, 1000);
        } else {
          setFeedback("error");
          setTimeout(() => {
            setFeedback(null);
            setPlayedNotes([]);
          }, 1000);
        }
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>Caza de Tonos</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Encuentra el tono. Toca la nota inicial y luego la nota que está a un TONO entero (2
          semitonos) de distancia.
        </Text>

        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="text-sm font-bold text-slate-400">
            Progreso: {currentExerciseIndex + 1}/{activeExercises.length}
          </span>
        </div>

        <div className="mb-8 flex justify-center gap-4 items-center font-bold text-2xl">
          <span className="text-slate-500">{getSpanishName(currentEx.start)}</span>
          <ArrowRight className="text-sky-500" />
          <span className="text-slate-900 border-b-2 border-sky-500 border-dashed pb-1">?</span>
        </div>

        {feedback === "error" && (
          <p className="text-red-500 font-bold mb-4 animate-bounce">
            ¡Ese no es un tono completo! Recuerda saltarte exactamente una tecla.
          </p>
        )}
        {feedback === "correct" && <p className="text-emerald-500 font-bold mb-4">¡Excelente!</p>}

        <div className="mb-8 border p-4 rounded-xl bg-slate-50 transition-all">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
            highlightedNotes={playedNotes}
            highlightColor="bg-sky-500"
            showLabels={true}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 7: COMPARACIÓN VISUAL
  // --------------------------------------------------------
  if (stage === 7) {
    if (activeExercises.length === 0) return null;
    const currentEx = activeExercises[currentExerciseIndex];

    const answer = (type: "tone" | "semitone") => {
      if (currentEx.type === type) {
        setFeedback("correct");
        setCorrectAnswers((c) => c + 1);
      } else {
        setFeedback("error");
      }

      setTimeout(() => {
        if (currentExerciseIndex < activeExercises.length - 1) {
          setCurrentExerciseIndex((i) => i + 1);
          setFeedback(null);
        } else {
          nextStage();
        }
      }, 1000);
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2} className="flex justify-center items-center gap-3">
          <Eye className="w-8 h-8 text-indigo-500" /> Comparación Visual
        </Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          ¿Qué distancia hay entre estas dos notas mostradas en el teclado?
        </Text>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50 pointer-events-none">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={false}
            highlightedNotes={[currentEx.start, currentEx.end]}
            highlightColor="bg-indigo-500"
            showLabels={true}
          />
        </div>

        <div className="flex justify-center gap-6">
          <Button
            size="lg"
            onClick={() => answer("semitone")}
            disabled={feedback !== null}
            className="w-40 bg-fuchsia-500 hover:bg-fuchsia-600"
          >
            Semitono
          </Button>
          <Button
            size="lg"
            onClick={() => answer("tone")}
            disabled={feedback !== null}
            className="w-40 bg-sky-500 hover:bg-sky-600"
          >
            Tono
          </Button>
        </div>

        {feedback === "error" && (
          <p className="text-red-500 font-bold mt-4 animate-bounce">Incorrecto.</p>
        )}
        {feedback === "correct" && <p className="text-emerald-500 font-bold mt-4">¡Correcto!</p>}
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 8: COMPARACIÓN AUDITIVA
  // --------------------------------------------------------
  if (stage === 8) {
    if (activeExercises.length === 0) return null;
    const currentEx = activeExercises[currentExerciseIndex];

    const playNotes = async () => {
      setIsPlaying(true);
      await playSystemSound(currentEx.start);
      await new Promise((r) => setTimeout(r, 600));
      await playSystemSound(currentEx.end);
      setIsPlaying(false);
    };

    const answer = (type: "tone" | "semitone") => {
      if (currentEx.type === type) {
        setFeedback("correct");
        setCorrectAnswers((c) => c + 1);
      } else {
        setFeedback("error");
      }

      setTimeout(() => {
        if (currentExerciseIndex < activeExercises.length - 1) {
          setCurrentExerciseIndex((i) => i + 1);
          setFeedback(null);
        } else {
          nextStage();
        }
      }, 1000);
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2} className="flex justify-center items-center gap-3">
          <Ear className="w-8 h-8 text-orange-500" /> Comparación Auditiva
        </Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Cierra los ojos y escucha. ¿Es un semitono (suena apretado/tenso) o un tono (suena más
          abierto)?
        </Text>

        <Button
          variant="outline"
          size="lg"
          onClick={playNotes}
          disabled={isPlaying}
          className="mb-10 h-24 w-24 rounded-full shadow-lg"
        >
          <Play className="w-10 h-10 text-orange-500" />
        </Button>

        <div className="flex justify-center gap-6">
          <Button
            size="lg"
            onClick={() => answer("semitone")}
            disabled={feedback !== null || isPlaying}
            className="w-40 bg-fuchsia-500 hover:bg-fuchsia-600"
          >
            Semitono
          </Button>
          <Button
            size="lg"
            onClick={() => answer("tone")}
            disabled={feedback !== null || isPlaying}
            className="w-40 bg-sky-500 hover:bg-sky-600"
          >
            Tono
          </Button>
        </div>

        {feedback === "error" && (
          <p className="text-red-500 font-bold mt-4 animate-bounce">Incorrecto.</p>
        )}
        {feedback === "correct" && <p className="text-emerald-500 font-bold mt-4">¡Correcto!</p>}
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 9: PIANO DETECTIVE
  // --------------------------------------------------------
  if (stage === 9) {
    // Retos hardcore sin guía visual (solo el texto)
    const challenges = [
      {
        start: "C4",
        type: "tone",
        expected: "D4",
        prompt: "Encuentra una nota que esté a un TONO de DO",
      },
      {
        start: "F4",
        type: "semitone",
        expected: "F#4",
        prompt: "Encuentra una nota que esté a un SEMITONO de FA (hacia la derecha)",
      },
    ];
    const currentEx = challenges[currentExerciseIndex];

    const handleKey = (note: string) => {
      if (feedback !== null) return;

      // Ignorar si el usuario vuelve a tocar la nota base
      if (note.replace(/[0-9]/g, "") === currentEx.start.replace(/[0-9]/g, "")) return;

      const expectedBase = currentEx.expected.replace(/[0-9]/g, "");
      const noteBase = note.replace(/[0-9]/g, "");

      if (noteBase === expectedBase) {
        // En lugar de registrar note, registramos currentEx.expected para la validación interna o simplemente verificamos que la distancia sea correcta.
        // Espera, para piano detective, piden explícitamente "una nota a X distancia".
        // La validación actual era "noteBase === expectedBase". Ya está bien, pero asegurémonos.
        setPlayedNotes([note]);
        setFeedback("correct");
        setCorrectAnswers((c) => c + 1);
        setTimeout(() => {
          if (currentExerciseIndex < challenges.length - 1) {
            setCurrentExerciseIndex((i) => i + 1);
            setPlayedNotes([]);
            setFeedback(null);
          } else {
            nextStage();
          }
        }, 1500);
      } else {
        setPlayedNotes([note]);
        setFeedback("error");
        setTimeout(() => {
          setFeedback(null);
          setPlayedNotes([]);
        }, 1000);
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8 border-slate-300">
        <Heading level={2} className="flex justify-center items-center gap-3">
          <Layers className="w-8 h-8 text-slate-800" /> Piano Detective
        </Heading>
        <Text className="mb-8 max-w-xl mx-auto">Aplica lo que has aprendido.</Text>

        <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 max-w-lg mx-auto shadow-xl">
          <p className="font-bold text-xl">{currentEx.prompt}</p>
        </div>

        {feedback === "error" && (
          <p className="text-red-500 font-bold mb-4 animate-bounce">
            Pista: un tono = 2 pasos, un semitono = 1 paso.
          </p>
        )}
        {feedback === "correct" && (
          <p className="text-emerald-500 font-bold mb-4">¡Eres un verdadero detective!</p>
        )}

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
            highlightedNotes={[currentEx.start, ...playedNotes]}
            highlightColor={
              feedback === "correct"
                ? "bg-emerald-500"
                : feedback === "error"
                  ? "bg-red-500"
                  : "bg-slate-800"
            }
            showLabels={true}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 10: RESULTADO FINAL
  // --------------------------------------------------------
  if (stage === 10) {
    const accuracy = Math.min(
      100,
      Math.round((correctAnswers / Math.max(1, totalExercises)) * 100),
    );

    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto mt-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-100 to-transparent" />

        <div className="relative z-10">
          <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-6 mx-auto" />
          <Heading level={2}>Ahora entiendes las distancias</Heading>
          <Text className="mb-6">
            Las notas no están colocadas al azar. Entre ellas existen distancias que se repiten
            constantemente.
          </Text>

          <div className="bg-slate-50 rounded-3xl p-8 w-full mb-8 shadow-sm border border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
              Precisión
            </p>
            <p className="text-5xl font-black text-emerald-600 mb-6">{accuracy}%</p>

            <div className="flex items-center justify-center gap-3 text-amber-600 bg-amber-50 py-3 px-6 rounded-full w-max mx-auto border border-amber-200">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">Explorador de Distancias</span>
            </div>
          </div>

          <Link href="/modulos">
            <Button size="lg" className="px-10">
              Continuar a Módulos
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return null;
}
