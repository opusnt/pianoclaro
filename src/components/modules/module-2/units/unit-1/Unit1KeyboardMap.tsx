"use client";

import { ArrowRight, CheckCircle2, Map, Play, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading, Text } from "@/components/ui/Typography";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { InteractiveKeyboard } from "@/components/shared/interactive/InteractiveKeyboard";

// Constantes para las etapas
const STAGE_4_NOTES = ["C", "D", "E", "F", "G", "A", "B"];
const STAGE_5_TARGETS = ["G", "F", "A", "C", "B", "E", "D"];
const STAGE_6_TARGETS = ["C", "E", "A", "F", "B"];
const STAGE_7_TARGETS = ["C4", "E4", "G4"];
const STAGE_7_Y_MAP: Record<string, number> = { C4: 90, E4: 75, G4: 60 };
const STAGE_8_MELODY = ["C4", "D4", "E4"];

export function Unit1KeyboardMap() {
  const [stage, setStage] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // States compartidos
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [targetNote, setTargetNote] = useState<string | null>(null);
  const [flashScore, setFlashScore] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);

  const engineRef = useRef<PianoAudioEngine | null>(null);

  // Inicializar audio
  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
    return () => {
      engineRef.current?.close();
    };
  }, []);

  // Efectos condicionales basados en el 'stage' (Reglas de Hooks respetadas)

  // Etapa 5
  useEffect(() => {
    if (stage === 5 && !targetNote && playedNotes.length === 0) {
      setTargetNote(STAGE_5_TARGETS[0]);
    }
  }, [stage, targetNote, playedNotes.length]);

  // Etapa 6
  useEffect(() => {
    if (stage === 6 && !isFlashing) {
      setIsFlashing(true);
      setTargetNote(STAGE_6_TARGETS[0]);
    }
  }, [stage, isFlashing]);

  // Etapa 7
  useEffect(() => {
    if (stage === 7 && !targetNote && playedNotes.length === 0) {
      setTargetNote(STAGE_7_TARGETS[0]);
    }
  }, [stage, targetNote, playedNotes.length]);

  // Etapa 9
  useEffect(() => {
    if (stage === 9) {
      localStorage.setItem("module2.unit1.completed", "true");
      localStorage.setItem("module2.unit1.score", "100");
    }
  }, [stage]);

  const playSystemSound = async (note: string) => {
    if (engineRef.current) {
      await engineRef.current.playNote(note);
    }
  };

  const nextStage = () => {
    setPlayedNotes([]);
    setTargetNote(null);
    setStage((s) => s + 1);
  };

  // --------------------------------------------------------
  // ETAPA 0: INTRO
  // --------------------------------------------------------
  if (stage === 0) {
    return (
      <Card className="max-w-2xl mx-auto mt-12 flex flex-col items-center text-center p-12">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-500 shadow-sm">
          <Map className="w-10 h-10" />
        </div>
        <Text variant="label" className="mb-2">
          Unidad 1
        </Text>
        <Heading level={1}>El mapa del teclado</Heading>
        <Text className="max-w-md mx-auto mb-10">
          Descubre cómo está organizado el piano. Aprenderemos a encontrar cualquier nota usando
          solo nuestros ojos.
        </Text>
        <Button onClick={nextStage} size="lg">
          Comenzar exploración
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 1: DESCUBRIMIENTO LIBRE
  // --------------------------------------------------------
  if (stage === 1) {
    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>1. Exploración Libre</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Toca libremente el teclado. ¿Notas algún patrón en la forma en que están acomodadas las
          teclas negras?
        </Text>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={5}
            interactive={true}
            onKeyPress={(note) => {
              if (!playedNotes.includes(note)) setPlayedNotes([...playedNotes, note]);
            }}
          />
        </div>

        <Button onClick={nextStage} disabled={playedNotes.length < 5}>
          {playedNotes.length < 5 ? "Toca al menos 5 notas para continuar" : "Sí, veo un patrón"}
        </Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 2: GRUPOS DE 2 Y 3
  // --------------------------------------------------------
  if (stage === 2) {
    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>2. Grupos de 2 y 3</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          El teclado no es aleatorio. Las teclas negras siempre se agrupan en pares (2) y tríos (3).
        </Text>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            highlightedNotes={["C#", "D#", "F#", "G#", "A#"]}
            highlightColor="bg-amber-400"
          />
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 flex-1 max-w-xs">
            <h3 className="font-bold text-sky-800 mb-2">Grupo de 2</h3>
            <p className="text-sm text-sky-700">Dos teclas negras juntas.</p>
          </div>
          <div className="p-4 bg-fuchsia-50 rounded-xl border border-fuchsia-100 flex-1 max-w-xs">
            <h3 className="font-bold text-fuchsia-800 mb-2">Grupo de 3</h3>
            <p className="text-sm text-fuchsia-700">Tres teclas negras juntas.</p>
          </div>
        </div>

        <Button onClick={nextStage}>Entendido</Button>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 3: ENCONTRAR EL DO
  // --------------------------------------------------------
  if (stage === 3) {
    const handleDoKey = (note: string) => {
      if (note.startsWith("C") && !note.includes("#")) {
        setCorrectAnswers((c) => c + 1);
        nextStage();
      } else {
        setTargetNote("error");
        setTimeout(() => setTargetNote(null), 1000);
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>3. Encontrar el DO</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          El <strong>DO</strong> es la nota más famosa y siempre vive en el mismo lugar: justo a la{" "}
          <strong>izquierda del grupo de 2 teclas negras</strong>.
        </Text>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            highlightedNotes={["C#", "D#"]}
            highlightColor="bg-slate-800"
            onKeyPress={handleDoKey}
          />
        </div>

        {targetNote === "error" ? (
          <p className="font-bold text-red-500 animate-pulse">
            Ese no es un DO. Busca la tecla blanca a la izquierda de las DOS negras.
          </p>
        ) : (
          <p className="font-bold text-sky-500 animate-pulse">
            Toca cualquier DO en el teclado para avanzar.
          </p>
        )}
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 4: LOS DEMÁS HABITANTES
  // --------------------------------------------------------
  if (stage === 4) {
    const handleKey = (note: string) => {
      if (note.startsWith(STAGE_4_NOTES[noteIndex]) && !note.includes("#")) {
        if (noteIndex === STAGE_4_NOTES.length - 1) {
          nextStage();
        } else {
          setNoteIndex((i) => i + 1);
        }
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>4. Construyendo el vecindario</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Si ya sabes dónde está DO, puedes encontrar todas las demás. Toca la nota indicada:{" "}
          <strong>
            {
              { C: "DO", D: "RE", E: "MI", F: "FA", G: "SOL", A: "LA", B: "SI" }[
                STAGE_4_NOTES[noteIndex] as "C" | "D" | "E" | "F" | "G" | "A" | "B"
              ]
            }
          </strong>
        </Text>

        <div className="flex justify-center gap-2 mb-6 text-xl font-bold">
          {STAGE_4_NOTES.map((n, i) => (
            <span
              key={n}
              className={
                i === noteIndex
                  ? "text-sky-500 scale-125 transition-transform"
                  : i < noteIndex
                    ? "text-emerald-500"
                    : "text-slate-300"
              }
            >
              {
                { C: "DO", D: "RE", E: "MI", F: "FA", G: "SOL", A: "LA", B: "SI" }[
                  n as "C" | "D" | "E" | "F" | "G" | "A" | "B"
                ]
              }
            </span>
          ))}
        </div>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
            showLabels={true}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 5: CAZA DE NOTAS
  // --------------------------------------------------------
  if (stage === 5) {
    const handleKey = (note: string) => {
      if (note.startsWith(targetNote!) && !note.includes("#")) {
        const nextIndex = playedNotes.length + 1;
        setPlayedNotes([...playedNotes, note]);

        if (nextIndex < STAGE_5_TARGETS.length) {
          setTargetNote(STAGE_5_TARGETS[nextIndex]);
        } else {
          setCorrectAnswers((c) => c + 1);
          nextStage();
        }
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>5. Caza de Notas</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          ¡Sin etiquetas! Encuentra las notas usando los grupos de negras como referencia.
        </Text>

        <div className="mb-8">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Encuentra el
          </span>
          <span className="text-5xl font-black text-sky-500">
            {targetNote
              ? { C: "DO", D: "RE", E: "MI", F: "FA", G: "SOL", A: "LA", B: "SI" }[
                  targetNote as "C" | "D" | "E" | "F" | "G" | "A" | "B"
                ]
              : ""}
          </span>
        </div>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
            showLabels={false}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 6: MODO FLASH
  // --------------------------------------------------------
  if (stage === 6) {
    const handleKey = (note: string) => {
      if (note.startsWith(targetNote!) && !note.includes("#")) {
        const nextIndex = playedNotes.length + 1;
        setPlayedNotes([...playedNotes, note]);
        setFlashScore((s) => s + 1);

        if (nextIndex < STAGE_6_TARGETS.length) {
          setTargetNote(STAGE_6_TARGETS[nextIndex]);
        } else {
          setCorrectAnswers((c) => c + 1);
          nextStage();
        }
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8 border-amber-200 shadow-[0_0_40px_rgba(251,191,36,0.15)]">
        <Heading level={2} className="text-amber-500 flex justify-center items-center gap-3">
          <Trophy className="w-8 h-8" />
          6. Modo Flash
        </Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Responde lo más rápido posible. ¿Qué tan bien conoces el teclado?
        </Text>

        <div className="mb-8 p-6 bg-slate-900 rounded-3xl inline-block min-w-[200px]">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Toca
          </span>
          <span className="text-6xl font-black text-white">
            {targetNote
              ? { C: "DO", D: "RE", E: "MI", F: "FA", G: "SOL", A: "LA", B: "SI" }[
                  targetNote as "C" | "D" | "E" | "F" | "G" | "A" | "B"
                ]
              : ""}
          </span>
        </div>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 7: PARTITURA -> TECLADO
  // --------------------------------------------------------
  if (stage === 7) {
    const handleKey = (note: string) => {
      const targetBase = targetNote!.replace(/[0-9]/g, ""); // "C4" -> "C"
      const noteBase = note.replace(/[0-9]/g, "");

      if (noteBase === targetBase) {
        const nextIndex = playedNotes.length + 1;
        setPlayedNotes([...playedNotes, targetNote!]);

        if (nextIndex < STAGE_7_TARGETS.length) {
          setTargetNote(STAGE_7_TARGETS[nextIndex]);
        } else {
          setCorrectAnswers((c) => c + 1);
          nextStage();
        }
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>7. Del Papel al Teclado</Heading>
        <Text className="mb-8 max-w-xl mx-auto">
          Conecta lo que lees en el pentagrama con la tecla física correcta.
        </Text>

        <div className="mb-10 w-full max-w-[200px] mx-auto h-32 relative flex flex-col justify-center">
          {/* Líneas del pentagrama simuladas */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-full h-[2px] bg-slate-300 absolute"
              style={{ top: `${i * 15}%` }}
            />
          ))}
          {/* Nota */}
          {targetNote && (
            <div
              className="absolute w-8 h-8 bg-sky-500 rounded-full left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${STAGE_7_Y_MAP[targetNote]}%` }}
            />
          )}
          {targetNote === "C4" && (
            <div
              className="w-12 h-[2px] bg-slate-600 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ top: "90%" }}
            />
          )}
        </div>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // ETAPA 8 Y 9: MINI MELODÍA Y DESAFÍO FINAL
  // --------------------------------------------------------
  if (stage === 8) {
    const playTargetMelody = async () => {
      for (const note of STAGE_8_MELODY) {
        await playSystemSound(note);
        await new Promise((r) => setTimeout(r, 600));
      }
    };

    const handleKey = (note: string) => {
      const expected = STAGE_8_MELODY[playedNotes.length];
      const expectedBase = expected.replace(/[0-9]/g, "");
      const noteBase = note.replace(/[0-9]/g, "");

      if (noteBase === expectedBase) {
        const next = [...playedNotes, expected];
        setPlayedNotes(next);
        if (next.length === STAGE_8_MELODY.length) {
          setCorrectAnswers((c) => c + 1);
          setTimeout(nextStage, 1000);
        }
      } else {
        setPlayedNotes([]); // Reset on mistake
      }
    };

    return (
      <Card className="max-w-4xl mx-auto mt-8 text-center p-8">
        <Heading level={2}>8. Desafío Final</Heading>
        <Text className="mb-6 max-w-xl mx-auto">
          Toca la siguiente secuencia de memoria: <strong>DO - RE - MI</strong>
        </Text>

        <Button variant="outline" onClick={playTargetMelody} className="mb-8">
          <Play className="w-4 h-4 mr-2" /> Escuchar
        </Button>

        <div className="flex justify-center gap-2 mb-6">
          {STAGE_8_MELODY.map((n, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                i < playedNotes.length ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
              }`}
            >
              {i < playedNotes.length ? "✓" : i + 1}
            </div>
          ))}
        </div>

        <div className="mb-8 border p-4 rounded-xl bg-slate-50">
          <InteractiveKeyboard
            startOctave={3}
            endOctave={4}
            interactive={true}
            onKeyPress={handleKey}
          />
        </div>
      </Card>
    );
  }

  // --------------------------------------------------------
  // RESULTADO FINAL
  // --------------------------------------------------------
  if (stage === 9) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto mt-12">
        <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-6" />
        <Heading level={2}>¡Mapa desbloqueado!</Heading>
        <Text className="mb-6">
          Ya conoces la distribución del teclado. Puedes encontrar cualquier nota usando los grupos
          de teclas negras.
        </Text>

        <div className="bg-slate-50 rounded-2xl p-6 w-full mb-8 flex justify-around">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Puntuación</p>
            <p className="text-3xl font-black text-emerald-600">100%</p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Modo Flash</p>
            <p className="text-3xl font-black text-amber-500">{flashScore} notas</p>
          </div>
        </div>

        <Link href="/modulos">
          <Button size="lg">Volver a Módulos</Button>
        </Link>
      </Card>
    );
  }

  return null;
}
