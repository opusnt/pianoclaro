import type { ModuleMastery } from "../masteryStore";
import type { PitchNote } from "@/components/shared/visualizers/PitchVisualizer";

export type ModuleMasterySkill = keyof ModuleMastery;

export interface TrainingQuestion {
  id: string;
  skill: ModuleMasterySkill;
  question: string;
  type: "text" | "clef" | "rhythm_visual" | "builder" | "audio_compare" | "audio_identify";
  payload: any;
  options: string[];
  correctIndex: number;
}

const NOTES = ["DO", "RE", "MI", "FA", "SOL", "LA", "SI"];
const PITCHES = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

export function generateNotesQuestion(): TrainingQuestion {
  const noteIndex = Math.floor(Math.random() * NOTES.length);
  const _correctNote = NOTES[noteIndex];

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

const CHORDS = [
  { name: "Do Mayor", notes: ["C4", "E4", "G4"] },
  { name: "Do Menor", notes: ["C4", "Eb4", "G4"] },
  { name: "Re Menor", notes: ["D4", "F4", "A4"] },
  { name: "Sol Mayor", notes: ["G4", "B4", "D5"] },
  { name: "Fa Mayor", notes: ["F4", "A4", "C5"] },
  { name: "La Menor", notes: ["A4", "C5", "E5"] },
];

const noteToIndex: Record<string, number> = {
  "C": 0, "D": 1, "E": 2, "F": 3, "G": 4, "A": 5, "B": 6
};

function pitchToPitchNote(pitch: string, xPos: number = 50) {
  const match = pitch.match(/^([A-G])([b#]?)([0-9])$/);
  if (!match) return null;
  const [_, note, accidental, octaveStr] = match;
  const octave = parseInt(octaveStr);
  
  const baseIndex = noteToIndex[note];
  const totalIndex = baseIndex + (octave - 4) * 7;
  const yPos = 5 + totalIndex * 7.5;
  
  let acc: "sharp" | "flat" | undefined;
  if (accidental === "b") acc = "flat";
  if (accidental === "#") acc = "sharp";
  
  return {
    id: pitch,
    yPos,
    xPos,
    rhythm: "whole",
    accidental: acc
  };
}

export function generateChordsQuestion(): TrainingQuestion {
  const isVisual = Math.random() > 0.5;
  const correctChord = CHORDS[Math.floor(Math.random() * CHORDS.length)];
  
  const optionsSet = new Set<string>();
  optionsSet.add(correctChord.name);
  while(optionsSet.size < 3) {
    optionsSet.add(CHORDS[Math.floor(Math.random() * CHORDS.length)].name);
  }
  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
  const correctIndex = options.indexOf(correctChord.name);

  const pitchNotes = correctChord.notes.map(pitch => pitchToPitchNote(pitch)).filter(Boolean);

  return {
    id: `chords-${Date.now()}`,
    skill: "chords",
    question: isVisual ? "¿Qué acorde ves en el pentagrama?" : `¿Qué acorde forman las notas: ${correctChord.notes.join(" - ")}?`,
    type: isVisual ? "clef" : "text",
    payload: isVisual 
      ? { notes: pitchNotes } 
      : { notes: correctChord.notes },
    options,
    correctIndex
  };
}

export function generateEarTrainingQuestion(): TrainingQuestion {
  const isChord = Math.random() > 0.5;

  if (isChord) {
    // Escuchar un acorde y decir si es Mayor o Menor
    const isMajor = Math.random() > 0.5;
    const basePitch = PITCHES[Math.floor(Math.random() * (PITCHES.length - 2))]; // Evitar tonos muy agudos
    
    // Convertir nota base a índice cromático simplificado para sacar 3ras
    const match = basePitch.match(/^([A-G])([b#]?)([0-9])$/);
    let chordNotes = [basePitch];
    let chordName = "";

    // Mapeo crudo para Ear Training (Do Mayor, Do Menor, etc)
    const baseChords = [
      { name: "Do Mayor", notes: ["C4", "E4", "G4"], type: "Mayor" },
      { name: "Do Menor", notes: ["C4", "Eb4", "G4"], type: "Menor" },
      { name: "Re Menor", notes: ["D4", "F4", "A4"], type: "Menor" },
      { name: "Sol Mayor", notes: ["G4", "B4", "D5"], type: "Mayor" },
      { name: "Fa Mayor", notes: ["F4", "A4", "C5"], type: "Mayor" },
      { name: "La Menor", notes: ["A4", "C5", "E5"], type: "Menor" },
    ];

    const filtered = baseChords.filter(c => c.type === (isMajor ? "Mayor" : "Menor"));
    const selected = filtered[Math.floor(Math.random() * filtered.length)];

    return {
      id: `ear-${Date.now()}`,
      skill: "earTraining",
      question: "Escucha el acorde. ¿Es Mayor o Menor?",
      type: "audio_identify",
      payload: {
        audioPitches: selected.notes,
        durationMs: 2000
      },
      options: ["Mayor", "Menor"],
      correctIndex: isMajor ? 0 : 1
    };
  } else {
    // Intervalos
    const intervals = [
      { name: "Tercera Mayor", notes: ["C4", "E4"] },
      { name: "Quinta Justa", notes: ["C4", "G4"] },
      { name: "Octava", notes: ["C4", "C5"] }
    ];
    const selected = intervals[Math.floor(Math.random() * intervals.length)];

    const optionsSet = new Set<string>();
    optionsSet.add(selected.name);
    while(optionsSet.size < 3) {
      optionsSet.add(intervals[Math.floor(Math.random() * intervals.length)].name);
    }
    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return {
      id: `ear-${Date.now()}`,
      skill: "earTraining",
      question: "Escucha las notas simultáneas. ¿Qué intervalo forman?",
      type: "audio_identify",
      payload: {
        audioPitches: selected.notes,
        durationMs: 1500
      },
      options,
      correctIndex: options.indexOf(selected.name)
    };
  }
}

export function generateScaleQuestion(): TrainingQuestion {
  // Escalas simples para Módulo 4: C, G, F
  const scales = [
    { name: "Do Mayor", root: "C4", notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"] },
    { name: "Sol Mayor", root: "G4", notes: ["G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5"] },
    { name: "Fa Mayor", root: "F4", notes: ["F4", "G4", "A4", "Bb4", "C5", "D5", "E5", "F5"] }
  ];

  const targetScale = scales[Math.floor(Math.random() * scales.length)];
  
  // Create Visual notes with xPos spaced evenly
  const visualNotes = targetScale.notes.map((pitch, i) => {
    const p = pitchToPitchNote(pitch) as PitchNote | null;
    if (p) {
      p.xPos = 15 + (i * 10);
    }
    return p;
  }).filter((p): p is PitchNote => p !== null);

  const optionsSet = new Set<string>();
  optionsSet.add(targetScale.name);
  while(optionsSet.size < 3) {
    optionsSet.add(scales[Math.floor(Math.random() * scales.length)].name);
  }
  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  return {
    id: `scale-${Date.now()}`,
    skill: "scales",
    question: "¿Qué escala musical está escrita en el pentagrama?",
    type: "clef",
    payload: {
      notes: visualNotes,
    },
    options,
    correctIndex: options.indexOf(targetScale.name)
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
    chords: generateChordsQuestion,
    earTraining: generateEarTrainingQuestion,
    scales: generateScaleQuestion,
  };

  if (weakestSkill && Math.random() > 0.4) {
    return generators[weakestSkill]();
  }

  const keys = Object.keys(generators) as ModuleMasterySkill[];
  const randomSkill = keys[Math.floor(Math.random() * keys.length)];
  return generators[randomSkill]();
}
