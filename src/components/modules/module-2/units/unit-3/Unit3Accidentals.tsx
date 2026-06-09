"use client";

import { ArrowDown, ArrowRight, ArrowUp, CheckCircle2, Navigation, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AccidentalBadge } from "@/components/shared/badges/AccidentalBadge";
import { EnharmonicPairCard } from "@/components/shared/cards/EnharmonicPairCard";
// Components
import { InteractiveKeyboard } from "@/components/shared/interactive/InteractiveKeyboard";
import { AccidentalMovementVisualizer } from "@/components/shared/visualizers/AccidentalMovementVisualizer";
import { TrebleClefVisualizer } from "@/components/shared/visualizers/TrebleClefVisualizer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading, Text } from "@/components/ui/Typography";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";

// Data
import {
  type AccidentalExercise,
  flatExercises,
  getRandomExercises,
  sharpExercises,
} from "./accidentalsExercises";

// Helpers para Stage 9
const getStaffPosition = (baseNote: string): number => {
  const noteMapping: Record<string, number> = {
    C4: 5,
    D4: 12.5,
    E4: 20,
    F4: 27.5,
    G4: 35,
    A4: 42.5,
    B4: 50,
    C5: 57.5,
    D5: 65,
    E5: 72.5,
    F5: 80,
    G5: 87.5,
  };
  return noteMapping[baseNote] || 35;
};

export function Unit3Accidentals() {
  const [stage, setStage] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const engineRef = useRef<PianoAudioEngine | null>(null);

  // States compartidos
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [activeExercises, setActiveExercises] = useState<AccidentalExercise[]>([]);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "error" | null>(null);

  // Stats finales
  const [totalExercises, setTotalExercises] = useState(0);

  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
    return () => {
      engineRef.current?.close();
    };
  }, []);

  // Inicializar ejercicios para las etapas interactivas
  useEffect(() => {
    if (stage === 3 && activeExercises.length === 0) {
      setActiveExercises(getRandomExercises(sharpExercises, 5)); // 5 ejercicios para no hacerlo eterno en demo
      setTotalExercises((t) => t + 5);
    }
    if (stage === 6 && activeExercises.length === 0) {
      setActiveExercises(getRandomExercises(flatExercises, 5));
      setTotalExercises((t) => t + 5);
    }
    if (stage === 7 && activeExercises.length === 0) {
      // Sostenido o Bemol (Dirección)
      setActiveExercises(
        [...sharpExercises.slice(0, 2), ...flatExercises.slice(0, 2)].sort(
          () => 0.5 - Math.random(),
        ),
      );
      setTotalExercises((t) => t + 4);
    }
    if (stage === 9 && activeExercises.length === 0) {
      // Lectura en pentagrama
      setActiveExercises(
        [...sharpExercises.slice(0, 2), ...flatExercises.slice(0, 2)].sort(
          () => 0.5 - Math.random(),
        ),
      );
      setTotalExercises((t) => t + 4);
    }
    if (stage === 10 && activeExercises.length === 0) {
      // Mini Desafío Final (Secuencias)
      setTotalExercises((t) => t + 2);
    }
    if (stage === 11) {
      localStorage.setItem("module2.unit3.completed", "true");
      localStorage.setItem(
        "module2.unit3.score",
        Math.min(100, Math.round((correctAnswers / Math.max(1, totalExercises)) * 100)).toString(),
      );
    }
  }, [stage, activeExercises.length, correctAnswers, totalExercises]);

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
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-500 shadow-sm">
          <Navigation className="w-10 h-10" />
        </div>
        <Text variant="label" className="mb-2">
          Unidad 3
        </Text>
        <Heading level={1}>Notas que se mueven</Heading>
        <Text className="max-w-md mx-auto mb-10">
          Ya conoces las distancias. Ahora aprenderás a modificar la altura de las notas y
          descubrirás el secreto de las teclas negras.
        </Text>
        <Button onClick={nextStage} size="lg">
          Comenzar
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 1: MISTERIO EN EL TECLADO
  // --------------------------------------------------------
  if (stage === 1) {
    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>Misterio en el teclado</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Toca DO. Luego, toca la tecla negra que está inmediatamente a su derecha. ¿Qué crees que
          pasa si DO sube un paso pequeño?
        </Text>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            highlightedNotes={["C4", "C#4"]}
            highlightColor="bg-amber-400"
            showLabels={true}
          />
        </div>

        <Button onClick={nextStage}>Ya probé cómo suena</Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 2: APARECE EL SOSTENIDO
  // --------------------------------------------------------
  if (stage === 2) {
    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8 border-fuchsia-200 shadow-[0_0_40px_rgba(217,70,239,0.1)]">
        <Heading level={2} className="text-fuchsia-600">
          El Sostenido
        </Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          El sostenido <strong>sube la nota un semitono</strong>. Es como dar un paso hacia la
          derecha en el teclado.
        </Text>

        <AccidentalMovementVisualizer baseNoteName="DO" targetNoteName="DO#" type="sharp" />

        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 max-w-lg mx-auto">
          <p className="font-bold text-slate-700">
            A esta nueva nota la llamamos <strong className="text-fuchsia-600">DO sostenido</strong>
            .
          </p>
        </div>

        <Button onClick={nextStage}>¡Vamos a practicarlos!</Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 3: CAZA DE SOSTENIDOS
  // --------------------------------------------------------
  if (stage === 3) {
    if (activeExercises.length === 0) return null;
    const currentEx = activeExercises[currentExerciseIndex];

    const handleKey = (note: string) => {
      if (feedback !== null) return;

      // El motor reporta la nota física, e.g. "C#4"
      const noteBase = note.replace(/[0-9]/g, "");
      const expectedBase = currentEx.note.replace(/[0-9]/g, "");

      if (noteBase === expectedBase) {
        setFeedback("correct");
        setCorrectAnswers((c) => c + 1);
        setTimeout(() => {
          if (currentExerciseIndex < activeExercises.length - 1) {
            setCurrentExerciseIndex((i) => i + 1);
            setFeedback(null);
          } else {
            nextStage();
          }
        }, 1000);
      } else {
        setFeedback("error");
        setTimeout(() => setFeedback(null), 1000);
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>Caza de Sostenidos</Heading>
        <Text className="mb-8 max-w-xl mx-auto">Encuentra la tecla correcta.</Text>

        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="text-sm font-bold text-slate-400">
            Progreso: {currentExerciseIndex + 1}/{activeExercises.length}
          </span>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 max-w-lg mx-auto shadow-xl flex justify-center items-center gap-4">
          <p className="font-bold text-2xl">{currentEx.prompt}</p>
          <AccidentalBadge type="sharp" size="sm" />
        </div>

        {feedback === "error" && (
          <p className="text-red-500 font-bold mb-4">
            ¡Intenta de nuevo! Da un paso a la derecha desde{" "}
            {currentEx.baseNote.replace(/[0-9]/g, "")}.
          </p>
        )}
        {feedback === "correct" && <p className="text-emerald-500 font-bold mb-4">¡Excelente!</p>}

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
            highlightColor={feedback === "correct" ? "bg-emerald-500" : "bg-fuchsia-500"}
            showLabels={true}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 4: APARECE EL BEMOL
  // --------------------------------------------------------
  if (stage === 4) {
    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8 border-sky-200 shadow-[0_0_40px_rgba(14,165,233,0.1)]">
        <Heading level={2} className="text-sky-600">
          El Bemol
        </Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          El bemol hace lo contrario: <strong>baja la nota un semitono</strong>. Es dar un paso
          hacia la izquierda.
        </Text>

        <AccidentalMovementVisualizer baseNoteName="RE" targetNoteName="REb" type="flat" />

        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 max-w-lg mx-auto">
          <p className="font-bold text-slate-700">
            A esta nota la llamamos <strong className="text-sky-600">RE bemol</strong>.
          </p>
        </div>

        <Button onClick={nextStage}>Entendido</Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 5: ENARMONÍA
  // --------------------------------------------------------
  if (stage === 5) {
    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8 border-slate-300">
        <Heading level={2}>El mismo sonido, dos nombres</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Si subimos DO un semitono llegamos a la misma tecla que si bajamos RE un semitono. ¡Suenan
          igual! A veces una misma tecla puede tener dos nombres distintos.
        </Text>

        <EnharmonicPairCard note1="DO#" note2="REb" physicalNote="C#4" onPlay={playSystemSound} />

        <Button onClick={nextStage}>¡Vamos a cazar bemoles!</Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 6: CAZA DE BEMOLES
  // --------------------------------------------------------
  if (stage === 6) {
    if (activeExercises.length === 0) return null;
    const currentEx = activeExercises[currentExerciseIndex];

    const handleKey = (note: string) => {
      if (feedback !== null) return;
      const noteBase = note.replace(/[0-9]/g, "");
      const expectedBase = currentEx.note.replace(/[0-9]/g, "");

      if (noteBase === expectedBase) {
        setFeedback("correct");
        setCorrectAnswers((c) => c + 1);
        setTimeout(() => {
          if (currentExerciseIndex < activeExercises.length - 1) {
            setCurrentExerciseIndex((i) => i + 1);
            setFeedback(null);
          } else {
            nextStage();
          }
        }, 1000);
      } else {
        setFeedback("error");
        setTimeout(() => setFeedback(null), 1000);
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>Caza de Bemoles</Heading>
        <Text className="mb-8 max-w-xl mx-auto">Encuentra la tecla correcta.</Text>

        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="text-sm font-bold text-slate-400">
            Progreso: {currentExerciseIndex + 1}/{activeExercises.length}
          </span>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 max-w-lg mx-auto shadow-xl flex justify-center items-center gap-4">
          <p className="font-bold text-2xl">{currentEx.prompt}</p>
          <AccidentalBadge type="flat" size="sm" />
        </div>

        {feedback === "error" && (
          <p className="text-red-500 font-bold mb-4">
            ¡Da un paso a la izquierda desde {currentEx.baseNote.replace(/[0-9]/g, "")}!
          </p>
        )}
        {feedback === "correct" && <p className="text-emerald-500 font-bold mb-4">¡Excelente!</p>}

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
            highlightColor={feedback === "correct" ? "bg-emerald-500" : "bg-sky-500"}
            showLabels={true}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 7: DIRECCIÓN DE LA ALTERACIÓN
  // --------------------------------------------------------
  if (stage === 7) {
    if (activeExercises.length === 0) return null;
    const currentEx = activeExercises[currentExerciseIndex];

    const answer = (dir: "up" | "down") => {
      if (feedback !== null) return;
      if (currentEx.direction === dir) {
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
      }, 1500);
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>¿Arriba o abajo?</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Escucha y observa. La nota {currentEx.baseNote.replace(/[0-9]/g, "")} se altera. ¿Sube o
          baja?
        </Text>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50 pointer-events-none">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={false}
            highlightedNotes={[currentEx.baseNote, currentEx.note]}
            highlightColor={currentEx.direction === "up" ? "bg-fuchsia-500" : "bg-sky-500"}
            showLabels={true}
          />
        </div>

        <div className="flex justify-center gap-6">
          <Button
            size="lg"
            onClick={() => answer("up")}
            disabled={feedback !== null}
            className="w-48 gap-2 bg-fuchsia-500 hover:bg-fuchsia-600"
          >
            <ArrowUp className="w-5 h-5" /> Subió (Sostenido)
          </Button>
          <Button
            size="lg"
            onClick={() => answer("down")}
            disabled={feedback !== null}
            className="w-48 gap-2 bg-sky-500 hover:bg-sky-600"
          >
            <ArrowDown className="w-5 h-5" /> Bajó (Bemol)
          </Button>
        </div>

        {feedback === "error" && (
          <p className="text-red-500 font-bold mt-4 animate-bounce">
            Incorrecto. Fíjate hacia dónde se movió.
          </p>
        )}
        {feedback === "correct" && <p className="text-emerald-500 font-bold mt-4">¡Correcto!</p>}
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 8: APARECE EL BECUADRO
  // --------------------------------------------------------
  if (stage === 8) {
    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8 border-emerald-200 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
        <Heading level={2} className="text-emerald-600">
          El Becuadro
        </Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          ¿Qué pasa si queremos volver a la normalidad? El becuadro{" "}
          <strong>anula la alteración</strong> y devuelve la nota a su estado natural (blanca).
        </Text>

        <AccidentalMovementVisualizer baseNoteName="FA#" targetNoteName="FA" type="natural" />

        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 max-w-lg mx-auto">
          <p className="font-bold text-slate-700">
            A esta nota vuelve a llamarse simplemente{" "}
            <strong className="text-emerald-600">FA</strong>.
          </p>
        </div>

        <Button onClick={nextStage}>Vamos a leer</Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 9: LECTURA EN PENTAGRAMA
  // --------------------------------------------------------
  if (stage === 9) {
    if (activeExercises.length === 0) return null;
    const currentEx = activeExercises[currentExerciseIndex];

    const handleKey = (note: string) => {
      if (feedback !== null) return;
      const noteBase = note.replace(/[0-9]/g, "");
      const expectedBase = currentEx.note.replace(/[0-9]/g, "");

      if (noteBase === expectedBase) {
        setFeedback("correct");
        setCorrectAnswers((c) => c + 1);
        setTimeout(() => {
          if (currentExerciseIndex < activeExercises.length - 1) {
            setCurrentExerciseIndex((i) => i + 1);
            setFeedback(null);
          } else {
            nextStage();
          }
        }, 1500);
      } else {
        setFeedback("error");
        setTimeout(() => setFeedback(null), 1000);
      }
    };

    const yPos = getStaffPosition(currentEx.baseNote);
    const accidentalSymbol = currentEx.accidental === "sharp" ? "♯" : "♭";
    const label = `${currentEx.baseNote.replace(/[0-9]/g, "")}${accidentalSymbol}`;

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>Del papel al teclado</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Mira la alteración en el pentagrama y toca la tecla correspondiente en el piano.
        </Text>

        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="text-sm font-bold text-slate-400">
            Progreso: {currentExerciseIndex + 1}/{activeExercises.length}
          </span>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <TrebleClefVisualizer
            notes={[
              {
                id: "1",
                yPos,
                xPos: 50,
                label,
                rhythm: "whole",
                color:
                  currentEx.accidental === "sharp"
                    ? "bg-fuchsia-500 text-white"
                    : "bg-sky-500 text-white",
              },
            ]}
          />
        </div>

        {feedback === "error" && (
          <p className="text-red-500 font-bold mb-4">Incorrecto. Revisa bien la alteración.</p>
        )}
        {feedback === "correct" && <p className="text-emerald-500 font-bold mb-4">¡Muy bien!</p>}

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
            highlightColor={feedback === "correct" ? "bg-emerald-500" : "bg-amber-500"}
            showLabels={true}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 10: MINI DESAFÍO FINAL
  // --------------------------------------------------------
  if (stage === 10) {
    // Reto de secuencias
    const challenges = [
      { sequence: ["C4", "C#4", "D4", "Db4", "C4"], names: ["DO", "DO#", "RE", "REb", "DO"] },
      { sequence: ["F4", "F#4", "G4", "Gb4", "F4"], names: ["FA", "FA#", "SOL", "SOLb", "FA"] },
    ];
    const currentEx = challenges[currentExerciseIndex];

    const handleKey = (note: string) => {
      if (feedback !== null) return;
      const expectedNote = currentEx.sequence[playedNotes.length].replace(/[0-9]/g, "");
      const noteBase = note.replace(/[0-9]/g, "");

      if (noteBase === expectedNote) {
        const newPlayed = [...playedNotes, note];
        setPlayedNotes(newPlayed);
        if (newPlayed.length === currentEx.sequence.length) {
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
        }
      } else {
        setPlayedNotes([]);
        setFeedback("error");
        setTimeout(() => setFeedback(null), 1000);
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8 border-slate-300 shadow-lg">
        <Heading level={2} className="text-slate-800">
          Mini Desafío Final
        </Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Toca esta secuencia cromática completa sin equivocarte.
        </Text>

        <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 max-w-xl mx-auto shadow-xl flex justify-center items-center gap-4 flex-wrap">
          {currentEx.names.map((name, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-xl font-bold border-2 transition-all ${
                i < playedNotes.length
                  ? "bg-emerald-500 border-emerald-400"
                  : i === playedNotes.length
                    ? "bg-amber-500/20 border-amber-400 text-amber-300"
                    : "bg-slate-800 border-slate-700 text-slate-500"
              }`}
            >
              {name}
            </div>
          ))}
        </div>

        {feedback === "error" && (
          <p className="text-red-500 font-bold mb-4">Ups, te equivocaste. ¡Vuelve a empezar!</p>
        )}
        {feedback === "correct" && (
          <p className="text-emerald-500 font-bold mb-4">¡Excelente, qué ritmo!</p>
        )}

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
            highlightColor={feedback === "correct" ? "bg-emerald-500" : "bg-indigo-500"}
            showLabels={true}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 11: RESULTADO FINAL
  // --------------------------------------------------------
  if (stage === 11) {
    const accuracy = Math.min(
      100,
      Math.round((correctAnswers / Math.max(1, totalExercises)) * 100),
    );

    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto mt-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-100 to-transparent" />

        <div className="relative z-10">
          <CheckCircle2 className="w-24 h-24 text-indigo-500 mb-6 mx-auto" />
          <Heading level={2}>Ahora entiendes las alteraciones</Heading>
          <Text className="mb-6">
            Un sostenido sube una nota. Un bemol la baja. Y a veces una misma tecla puede tener más
            de un nombre.
          </Text>

          <div className="bg-slate-50 rounded-3xl p-8 w-full mb-8 shadow-sm border border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
              Precisión
            </p>
            <p className="text-5xl font-black text-indigo-600 mb-6">{accuracy}%</p>

            <div className="flex items-center justify-center gap-3 text-amber-600 bg-amber-50 py-3 px-6 rounded-full w-max mx-auto border border-amber-200">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">Explorador Cromático</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Link href="/teoria/2">
              <Button size="lg" variant="outline" className="px-10">
                Volver al Módulo 2
              </Button>
            </Link>
            <Link href="/teoria/2/unidad-4">
              <Button size="lg" className="px-10">
                Siguiente Lección <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
