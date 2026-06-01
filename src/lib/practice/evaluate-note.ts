import type { PianoNoteName } from "@/lib/music/notes";
import { pianoLabelByNote } from "@/lib/music/notes";
import type { NoteName } from "@/types/lesson";

export type NoteInputEvaluation = {
  status: "correct" | "incorrect" | "explore";
  playedNote: PianoNoteName;
  expectedNotes: NoteName[];
  message: string;
};

export function evaluateNoteInput({
  playedNote,
  expectedNotes,
}: {
  playedNote: PianoNoteName;
  expectedNotes: NoteName[];
}): NoteInputEvaluation {
  if (expectedNotes.length === 0) {
    return {
      status: "explore",
      playedNote,
      expectedNotes,
      message: `Tocaste ${pianoLabelByNote[playedNote]}. Escucha su color y compáralo con la partitura.`,
    };
  }

  if (expectedNotes.includes(playedNote as NoteName)) {
    return {
      status: "correct",
      playedNote,
      expectedNotes,
      message: `Correcto: tocaste ${pianoLabelByNote[playedNote]}. Sigue leyendo desde la partitura.`,
    };
  }

  const expectedLabels = expectedNotes.map((note) => pianoLabelByNote[note]).join(", ");

  return {
    status: "incorrect",
    playedNote,
    expectedNotes,
    message: `Escuchaste ${pianoLabelByNote[playedNote]}, pero la partitura espera ${expectedLabels}. Mira la posición antes de tocar.`,
  };
}
