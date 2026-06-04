import type { ModuleMastery } from "../masteryStore";

export type ModuleMasterySkill = keyof ModuleMastery;

export interface TrainingQuestion {
  id: string;
  skill: ModuleMasterySkill;
  question: string;
  type: "text" | "clef" | "rhythm_visual" | "builder" | "audio_compare";
  payload: any;
  options: string[];
  correctIndex: number;
}

const NOTES = ["DO", "RE", "MI", "FA", "SOL", "LA", "SI"];
const PITCHES = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

export function generateNotesQuestion(): TrainingQuestion {
  const noteIndex = Math.floor(Math.random() * NOTES.length);
  const correctNote = NOTES[noteIndex];

  // Audio recognition
  return {
    id: `notes-${Date.now()}-${Math.random()}`,
    skill: "notes",
    question: "¿Qué nota es esta?",
    type: "text",
    payload: { audioPitch: PITCHES[noteIndex] },
    options: NOTES,
    correctIndex: noteIndex,
  };
}

export function generateClefQuestion(): TrainingQuestion {
  const yPositions = { C4: 50, D4: 45, E4: 40, F4: 35, G4: 30, A4: 25, B4: 20, C5: 15 };
  const pitchIndex = Math.floor(Math.random() * PITCHES.length);
  const pitchName = PITCHES[pitchIndex];
  const noteName = NOTES[pitchIndex % 7];

  const options = [...NOTES].sort(() => 0.5 - Math.random()).slice(0, 4);
  if (!options.includes(noteName)) {
    options[0] = noteName;
    options.sort(() => 0.5 - Math.random());
  }

  return {
    id: `clef-${Date.now()}-${Math.random()}`,
    skill: "trebleClef",
    question: "¿Qué nota está en el pentagrama?",
    type: "clef",
    payload: {
      notes: [
        {
          id: "n1",
          yPos: yPositions[pitchName as keyof typeof yPositions],
          xPos: 50,
          rhythm: "quarter",
        },
      ],
    },
    options: options,
    correctIndex: options.indexOf(noteName),
  };
}

export function generateRhythmQuestion(): TrainingQuestion {
  const figures = [
    { id: "whole", name: "Redonda", val: 4 },
    { id: "half", name: "Blanca", val: 2 },
    { id: "quarter", name: "Negra", val: 1 },
  ];
  const target = figures[Math.floor(Math.random() * figures.length)];

  const options = ["Redonda", "Blanca", "Negra"];
  return {
    id: `rhythm-${Date.now()}-${Math.random()}`,
    skill: "rhythm",
    question: "¿Qué figura musical es esta?",
    type: "rhythm_visual",
    payload: { figureId: target.id },
    options: options,
    correctIndex: options.indexOf(target.name),
  };
}

export function generateMeasuresQuestion(): TrainingQuestion {
  return {
    id: `measures-${Date.now()}-${Math.random()}`,
    skill: "measures",
    question: "Construye un compás de 4 tiempos.",
    type: "builder",
    payload: { targetDuration: 4, options: ["quarter", "half", "whole"] },
    options: [],
    correctIndex: -1, // Validated interactively
  };
}

export function generateTiesQuestion(): TrainingQuestion {
  const isTied = Math.random() > 0.5;
  return {
    id: `ties-${Date.now()}-${Math.random()}`,
    skill: "ties",
    question: "¿Estas notas se tocan separadas o fusionadas?",
    type: "clef",
    payload: {
      notes: [
        { id: "n1", yPos: 35, xPos: 40, rhythm: "quarter", tieNext: isTied },
        { id: "n2", yPos: 35, xPos: 80, rhythm: "quarter" },
      ],
    },
    options: ["Separadas", "Fusionadas (Una nota larga)"],
    correctIndex: isTied ? 1 : 0,
  };
}

export function generateDottedNotesQuestion(): TrainingQuestion {
  // Compare regular vs dotted
  return {
    id: `dotted-${Date.now()}-${Math.random()}`,
    skill: "dottedNotes",
    question: "¿Cuál suena más larga?",
    type: "audio_compare",
    payload: {
      audioA: { pitch: "G4", durationMs: 2000 },
      audioB: { pitch: "G4", durationMs: 3000 },
    },
    options: ["Opción A", "Opción B"],
    correctIndex: 1,
  };
}

export function generateRandomQuestion(weakestSkill?: ModuleMasterySkill): TrainingQuestion {
  const generators: Record<ModuleMasterySkill, () => TrainingQuestion> = {
    notes: generateNotesQuestion,
    trebleClef: generateClefQuestion,
    rhythm: generateRhythmQuestion,
    measures: generateMeasuresQuestion,
    ties: generateTiesQuestion,
    dottedNotes: generateDottedNotesQuestion,
  };

  if (weakestSkill && Math.random() > 0.4) {
    return generators[weakestSkill]();
  }

  const keys = Object.keys(generators) as ModuleMasterySkill[];
  const randomSkill = keys[Math.floor(Math.random() * keys.length)];
  return generators[randomSkill]();
}
