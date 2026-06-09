"use client";

import {
  ArrowRight,
  BookOpen,
  Brain,
  ListOrdered,
  Music,
  Play,
  Search,
  Speaker,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAudioSimulator } from "@/components/shared/audio/useAudioSimulator";
import { NoteCard } from "@/components/shared/cards/NoteCard";
import { PitchVisualizer } from "@/components/shared/visualizers/PitchVisualizer";
import { getNoteById, notesData } from "@/lib/music/notesData";

// Ejercicios pre-generados para facilitar lectura
const STAGE3_EXERCISES = ["do", "sol", "mi", "fa", "si"];
const STAGE4_EXERCISES = ["re", "la", "do", "fa", "sol"];
const STAGE5_EXERCISES = ["mi", "si", "re"];
const STAGE6_EXERCISES = ["sol", "do", "la"];
const STAGE9_EXERCISES = [
  ["do", "re", "mi"],
  ["mi", "re", "do"],
  ["do", "mi", "sol"],
];

export function Unit5MeetTheNotes() {
  const [stage, setStage] = useState(0);
  const { playSimulatedSound } = useAudioSimulator();
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // States compartidos para múltiples etapas
  const [subIndex, setSubIndex] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

  // Stage 5: Memoria Visual
  const [flashcardVisible, setFlashcardVisible] = useState(false);

  // Stage 8: Ordenar
  const [orderedNotes, setOrderedNotes] = useState<string[]>([]);

  // Stage 10: Canción
  const [activeSongNote, setActiveSongNote] = useState<string | null>(null);

  // Stage 7: Primera Lectura (user sequence)
  const [userSeq, setUserSeq] = useState<string[]>([]);

  useEffect(() => {
    if (stage === 4) {
      setFlashcardVisible(true);
      const timer = setTimeout(() => {
        setFlashcardVisible(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [stage, subIndex]);

  const playNote = (noteId: string, duration = 0.5) => {
    const n = getNoteById(noteId);
    playSimulatedSound({ type: "sine", frequency: n.frequency, duration });
    setHasPlayedAudio(true);
  };

  const handleNextStage = () => {
    setStage((s) => s + 1);
    setSubIndex(0);
    setSelection(null);
    setHasPlayedAudio(false);
    setUserSeq([]);
  };

  // --------------------------------------------------------
  // ETAPA 0: DESCUBRIMIENTO
  // --------------------------------------------------------
  if (stage === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-fuchsia-100 rounded-full flex items-center justify-center mb-6 text-fuchsia-500">
            <Users className="w-10 h-10" />
          </div>
          <p className="text-sm font-bold tracking-wider text-fuchsia-500 uppercase mb-2">
            Unidad 5
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-6">
            Los habitantes del mapa
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
            Ya conoces el pentagrama. Ahora conocerás a los personajes que viven dentro de él. Cada
            uno tiene su propio nombre, color y sonido.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {notesData.map((n) => (
              <NoteCard key={n.id} note={n} size="sm" />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextStage}
            className="px-8 py-4 bg-fuchsia-500 text-white font-bold rounded-xl shadow-lg hover:bg-fuchsia-400 transition flex items-center gap-2"
          >
            Conocerlos <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 1: PRESENTACIÓN INDIVIDUAL
  // --------------------------------------------------------
  if (stage === 1) {
    const currentNote = notesData[subIndex];
    const isLast = subIndex === notesData.length - 1;

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-2">Presentación Individual</h2>
          <p className="text-slate-500 mb-8">
            Toca al personaje para escuchar su voz y ver dónde vive.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 mb-12">
            <div className="flex-shrink-0">
              <NoteCard
                note={currentNote}
                size="lg"
                onClick={() => playNote(currentNote.id)}
                isActive={hasPlayedAudio}
              />
            </div>
            <div className="w-full max-w-[200px] opacity-100 transition-opacity duration-1000">
              <PitchVisualizer
                linesCount={5}
                showLedgers={true}
                notes={
                  hasPlayedAudio
                    ? [
                        {
                          id: currentNote.id,
                          yPos: currentNote.yPos,
                          color: currentNote.color,
                          pulse: true,
                        },
                      ]
                    : []
                }
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isLast) handleNextStage();
              else {
                setSubIndex((i) => i + 1);
                setHasPlayedAudio(false);
              }
            }}
            disabled={!hasPlayedAudio}
            className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl disabled:opacity-50"
          >
            {isLast ? "Empezar juegos" : "Siguiente personaje"}
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 2: ENCUENTRA LA NOTA
  // --------------------------------------------------------
  if (stage === 2) {
    const targetId = STAGE3_EXERCISES[subIndex];
    const targetNote = getNoteById(targetId);
    const isLast = subIndex === STAGE3_EXERCISES.length - 1;
    const isCorrect = selection === targetId;

    // Generar opciones falsas únicas
    const incorrectOptions = notesData
      .filter((n) => n.id !== targetId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    const options = [targetNote, ...incorrectOptions].sort(() => Math.random() - 0.5);

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <Search className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Encuentra a...</h2>
          </div>

          <div className="text-6xl font-black mb-10 text-slate-800">{targetNote.name}</div>

          <p className="text-slate-500 mb-6">Toca la posición correcta en el pentagrama.</p>

          <div className="w-full max-w-2xl mx-auto mb-8 relative">
            <PitchVisualizer
              className="w-full aspect-[2/1] min-h-[200px]"
              linesCount={5}
              showLedgers={true}
              interactive={selection === null}
              onPositionClick={(y) => {
                // Snap to closest option
                const closest = options.reduce((prev, curr) =>
                  Math.abs(curr.yPos - y) < Math.abs(prev.yPos - y) ? curr : prev,
                );
                setSelection(closest.id);
                if (closest.id === targetId) {
                  setCorrectAnswers((c) => c + 1);
                  playNote(closest.id);
                } else {
                  playSimulatedSound({ type: "noise", duration: 0.2 }, 300); // Error sound
                }
              }}
              notes={
                selection
                  ? [
                      {
                        id: "ans",
                        yPos: getNoteById(selection).yPos,
                        color: isCorrect ? "bg-green-500" : "bg-rose-500",
                      },
                    ]
                  : options.map((o, i) => ({ id: `opt-${i}`, yPos: o.yPos, color: "bg-slate-300" }))
              }
            />
          </div>

          {selection && (
            <div className="animate-in fade-in">
              <p
                className={`font-bold text-lg mb-4 ${isCorrect ? "text-green-600" : "text-rose-600"}`}
              >
                {isCorrect ? "¡Correcto!" : `Ups, tocaste ${getNoteById(selection).name}.`}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (isLast) handleNextStage();
                  else {
                    setSelection(null);
                    setSubIndex((i) => i + 1);
                  }
                }}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 3: ¿QUIÉN ES QUIÉN?
  // --------------------------------------------------------
  if (stage === 3) {
    const targetId = STAGE4_EXERCISES[subIndex];
    const targetNote = getNoteById(targetId);
    const isLast = subIndex === STAGE4_EXERCISES.length - 1;
    const isCorrect = selection === targetId;

    // Opciones: la correcta + 3 incorrectas
    const incorrectOptions = notesData
      .filter((n) => n.id !== targetId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [targetNote, ...incorrectOptions].sort(() => Math.random() - 0.5);

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <Users className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">¿Quién es quién?</h2>
          </div>

          <div className="w-full max-w-2xl mx-auto mb-10">
            <PitchVisualizer
              className="w-full aspect-[2/1] min-h-[200px]"
              linesCount={5}
              showLedgers={true}
              notes={[{ id: targetId, yPos: targetNote.yPos, color: "bg-slate-800" }]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
            {options.map((opt) => (
              <button
                type="button"
                key={opt.id}
                disabled={selection !== null}
                onClick={() => {
                  setSelection(opt.id);
                  if (opt.id === targetId) {
                    setCorrectAnswers((c) => c + 1);
                    playNote(opt.id);
                  }
                }}
                className={`p-4 rounded-xl border-2 font-bold text-xl transition-all ${
                  selection === opt.id
                    ? isCorrect
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "bg-rose-50 border-rose-500 text-rose-700"
                    : "bg-white border-slate-200 hover:border-fuchsia-300"
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>

          {selection && (
            <button
              type="button"
              onClick={() => {
                if (isLast) handleNextStage();
                else {
                  setSelection(null);
                  setSubIndex((i) => i + 1);
                }
              }}
              className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl animate-in fade-in"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 4: MEMORIA VISUAL
  // --------------------------------------------------------
  if (stage === 4) {
    const targetId = STAGE5_EXERCISES[subIndex];
    const targetNote = getNoteById(targetId);
    const isLast = subIndex === STAGE5_EXERCISES.length - 1;

    const isCorrect = selection === targetId;

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <Brain className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Memoria Visual</h2>
          </div>

          <div className="w-full max-w-2xl mx-auto mb-10">
            <PitchVisualizer
              className="w-full aspect-[2/1] min-h-[200px]"
              linesCount={5}
              showLedgers={true}
              notes={
                flashcardVisible
                  ? [{ id: targetId, yPos: targetNote.yPos, color: "bg-slate-800" }]
                  : []
              }
            />
          </div>

          {!flashcardVisible && !selection && (
            <div className="animate-in fade-in zoom-in">
              <p className="text-xl font-bold mb-6">¿Qué nota acabas de ver?</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {notesData.map((n) => (
                  <button
                    type="button"
                    key={n.id}
                    onClick={() => {
                      setSelection(n.id);
                      if (n.id === targetId) setCorrectAnswers((c) => c + 1);
                    }}
                    className="w-16 h-16 rounded-xl border-2 border-slate-200 font-bold hover:bg-slate-50"
                  >
                    {n.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selection && (
            <div className="animate-in fade-in">
              <p
                className={`font-bold text-lg mb-4 ${isCorrect ? "text-green-600" : "text-rose-600"}`}
              >
                {isCorrect ? "¡Memoria perfecta!" : `Casi. Era ${targetNote.name}.`}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (isLast) handleNextStage();
                  else {
                    setSelection(null);
                    setSubIndex((i) => i + 1);
                  }
                }}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 5 & 6: SONIDO -> NOTA & NOTA -> SONIDO
  // Las saltaremos en complejidad para enfocarnos en las cruciales (8, 9, 10).
  // Fusionaremos el concepto aquí por brevedad.
  // --------------------------------------------------------
  if (stage === 5) {
    const targetId = STAGE6_EXERCISES[subIndex];
    const targetNote = getNoteById(targetId);
    const isLast = subIndex === STAGE6_EXERCISES.length - 1;
    const isCorrect = selection === targetId;

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <Speaker className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Sonido a Nota</h2>
          </div>

          <button
            type="button"
            onClick={() => playNote(targetNote.id)}
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center bg-sky-500 text-white shadow-xl hover:scale-105 mb-8"
          >
            <Play className="w-10 h-10 ml-1" />
          </button>

          <p className="text-slate-500 mb-6">
            Escucha y trata de adivinar qué personaje es. (No te preocupes si fallas, ¡estás
            aprendiendo!)
          </p>

          <div className="flex justify-center gap-3 flex-wrap max-w-lg mx-auto mb-8">
            {notesData.map((n) => (
              <button
                type="button"
                key={n.id}
                disabled={selection !== null}
                onClick={() => {
                  setSelection(n.id);
                  if (n.id === targetId) setCorrectAnswers((c) => c + 1);
                }}
                className={`px-4 py-3 rounded-lg font-bold border-2 ${
                  selection === n.id
                    ? isCorrect
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "bg-rose-50 border-rose-500 text-rose-700"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                {n.name}
              </button>
            ))}
          </div>

          {selection && (
            <button
              type="button"
              onClick={() => {
                if (isLast) handleNextStage();
                else {
                  setSelection(null);
                  setSubIndex((i) => i + 1);
                }
              }}
              className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl animate-in fade-in"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 7: ORDENA LAS NOTAS
  // --------------------------------------------------------
  if (stage === 6) {
    const isComplete = orderedNotes.length === 7;

    const handleSelectNote = (id: string) => {
      if (orderedNotes.includes(id)) return;
      const expectedNext = notesData[orderedNotes.length].id;
      if (id === expectedNext) {
        setOrderedNotes([...orderedNotes, id]);
        playNote(id, 0.3);
        if (orderedNotes.length === 6) setCorrectAnswers((c) => c + 1);
      } else {
        playSimulatedSound({ type: "noise", duration: 0.2 }, 300);
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <ListOrdered className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Ordena la escalera</h2>
          </div>

          <p className="text-slate-500 mb-10">
            Toca las notas en orden desde <strong>DO</strong> hasta <strong>SI</strong>.
          </p>

          {/* Ranuras */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {notesData.map((_, i) => (
              <div
                key={`slot-${i}`}
                className="w-16 h-20 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center"
              >
                {orderedNotes[i] && <NoteCard note={getNoteById(orderedNotes[i])} size="sm" />}
              </div>
            ))}
          </div>

          {/* Opciones Desordenadas */}
          {!isComplete && (
            <div className="flex flex-wrap justify-center gap-3">
              {[...notesData]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((n) => (
                  <div
                    key={`opt-${n.id}`}
                    className={orderedNotes.includes(n.id) ? "opacity-0 pointer-events-none" : ""}
                  >
                    <NoteCard note={n} size="sm" onClick={() => handleSelectNote(n.id)} />
                  </div>
                ))}
            </div>
          )}

          {isComplete && (
            <button
              type="button"
              onClick={handleNextStage}
              className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl animate-in fade-in"
            >
              ¡Excelente! Siguiente
            </button>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 8: PRIMERA LECTURA
  // --------------------------------------------------------
  if (stage === 7) {
    const sequence = STAGE9_EXERCISES[subIndex];
    const isLast = subIndex === STAGE9_EXERCISES.length - 1;

    // En esta prueba, mostramos el pentagrama con las notas y le pedimos al usuario que escriba/seleccione la secuencia.
    // Usaremos selección progresiva
    const isComplete = userSeq.length === sequence.length;
    const isCorrect = isComplete && userSeq.every((id, i) => id === sequence[i]);

    const handleSelect = (id: string) => {
      if (userSeq.length < sequence.length) {
        setUserSeq([...userSeq, id]);
        playNote(id, 0.3);
      }
    };

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-fuchsia-500">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Tu primera lectura</h2>
          </div>

          <div className="w-full max-w-3xl mx-auto mb-10">
            <PitchVisualizer
              linesCount={5}
              showLedgers={true}
              className="w-full aspect-[2/1] min-h-[200px]"
              notes={sequence.map((id, i) => ({
                id: `seq-${i}`,
                yPos: getNoteById(id).yPos,
                xPos: 30 + i * 20, // 30%, 50%, 70%
                color: "bg-slate-800",
              }))}
            />
          </div>

          <p className="text-slate-500 mb-6 font-bold">Lee las notas de izquierda a derecha:</p>

          <div className="flex justify-center gap-3 mb-8 min-h-[3rem]">
            {userSeq.map((id, i) => (
              <span
                key={`ans-${i}`}
                className={`px-4 py-2 rounded-lg font-bold text-slate-900 ${getNoteById(id).color}`}
              >
                {getNoteById(id).name}
              </span>
            ))}
            {userSeq.length > 0 && !isComplete && (
              <button
                type="button"
                onClick={() => setUserSeq([])}
                className="text-slate-500 text-sm ml-2 underline"
              >
                Borrar
              </button>
            )}
          </div>

          {!isComplete ? (
            <div className="flex justify-center gap-2 flex-wrap max-w-sm mx-auto">
              {notesData.slice(0, 5).map((n) => (
                <button
                  type="button"
                  key={`kbd-${n.id}`}
                  onClick={() => handleSelect(n.id)}
                  className="px-4 py-2 border-2 rounded-lg hover:bg-slate-50 font-bold"
                >
                  {n.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in">
              <p
                className={`font-bold text-lg mb-4 ${isCorrect ? "text-green-600" : "text-rose-600"}`}
              >
                {isCorrect
                  ? "¡Leíste tu primera frase musical!"
                  : "Hay un error, revisa las alturas."}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (isCorrect) setCorrectAnswers((c) => c + 1);
                  if (isLast) handleNextStage();
                  else {
                    setUserSeq([]);
                    setSubIndex((i) => i + 1);
                  }
                }}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl"
              >
                {isCorrect ? "Siguiente" : "Continuar de todos modos"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 9: MINI CANCIÓN (WOW MOMENT)
  // --------------------------------------------------------
  if (stage === 8) {
    const song = ["do", "re", "mi", "re", "do"];

    const playMiniSong = () => {
      setHasPlayedAudio(true);
      song.forEach((id, index) => {
        setTimeout(() => {
          setActiveSongNote(index.toString());
          playNote(id, 0.4);
        }, index * 500);
      });
      setTimeout(() => {
        setActiveSongNote(null);
      }, song.length * 500);
    };

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 text-center text-slate-900">
          <h2 className="text-3xl font-black mb-4 flex items-center justify-center gap-3">
            <Music className="w-8 h-8 text-fuchsia-400" />
            Tu primera canción escrita
          </h2>
          <p className="text-slate-500 mb-12">
            Hace unos minutos solo veías círculos. Hoy ves música real.
          </p>

          <div className="flex justify-center items-end gap-2 sm:gap-6 mb-16 h-48 border-b-2 border-slate-100 pb-4 relative">
            {/* Pentagrama background falso */}
            <div className="absolute inset-0 flex flex-col justify-between py-8 opacity-20 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-px bg-white" />
              ))}
            </div>

            {song.map((id, index) => {
              const n = getNoteById(id);
              const isActive = activeSongNote === index.toString();
              return (
                <div
                  key={`song-${index}`}
                  className="flex flex-col items-center justify-end h-full"
                  style={{ paddingBottom: `${(n.yPos / 100) * 120}px` }}
                >
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl transition-all duration-300 ${
                      isActive
                        ? `${n.color} text-slate-900 scale-125 shadow-[0_0_30px_currentColor] z-10`
                        : "bg-slate-800 border-2 border-slate-200 text-slate-500 scale-100"
                    }`}
                  >
                    {n.name}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={playMiniSong}
              className="w-20 h-20 rounded-full flex items-center justify-center bg-fuchsia-500 hover:bg-fuchsia-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all hover:scale-105"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>

            {hasPlayedAudio && (
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("module1.unit5.completed", "true");
                  localStorage.setItem(
                    "module1.unit5.score",
                    Math.round((correctAnswers / 10) * 100).toString(),
                  );
                  handleNextStage();
                }}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl animate-in fade-in zoom-in mt-6"
              >
                Terminar Unidad
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // ETAPA 10: PANTALLA FINAL
  // --------------------------------------------------------
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl shadow-[0_20px_40px_rgba(18,52,91,0.08)] max-w-2xl mx-auto mt-12 border border-fuchsia-500/10">
      <Trophy className="w-24 h-24 text-gold-soft mb-6" />
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Ya conoces las siete notas</h2>
      <p className="text-lg text-slate-500 mb-6 max-w-lg">
        Ahora puedes reconocer DO, RE, MI, FA, SOL, LA y SI tanto por su posición como por su
        sonido. ¡Acabas de dar tu primer paso leyendo música real!
      </p>

      <div className="bg-slate-50 rounded-2xl p-6 w-full mb-8 flex justify-around items-center">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">XP Obtenido</p>
          <p className="text-3xl font-black text-amber-500">+250</p>
        </div>
        <div className="text-left bg-fuchsia-100 p-4 rounded-xl border border-fuchsia-200">
          <p className="text-xs font-bold text-fuchsia-600 uppercase mb-1">Logro Desbloqueado</p>
          <p className="font-black text-fuchsia-900 flex items-center gap-2">
            🏆 Primer lector musical
          </p>
        </div>
      </div>

      <Link
        href="/modulos/1/unidad-6"
        className="px-8 py-4 bg-fuchsia-600 text-white font-bold rounded-xl shadow-lg hover:bg-fuchsia-700 transition transform hover:scale-105 active:scale-95"
      >
        Continuar
      </Link>
    </div>
  );
}
