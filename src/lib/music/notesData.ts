export type NoteData = {
  id: string; // do, re, mi...
  name: string; // DO, RE, MI...
  pitch: string; // C4, D4, E4...
  frequency: number; // Hz
  yPos: number; // Posición vertical (0-100) en el PitchVisualizer
  color: string; // Clase de Tailwind para el background
  textColor: string; // Clase de Tailwind para el texto
};

export const notesData: NoteData[] = [
  {
    id: "do",
    name: "DO",
    pitch: "C4",
    frequency: 261.63,
    yPos: 5, // Línea adicional inferior
    color: "bg-red-500",
    textColor: "text-slate-900",
  },
  {
    id: "re",
    name: "RE",
    pitch: "D4",
    frequency: 293.66,
    yPos: 12.5, // Espacio justo debajo de la primera línea
    color: "bg-orange-500",
    textColor: "text-slate-900",
  },
  {
    id: "mi",
    name: "MI",
    pitch: "E4",
    frequency: 329.63,
    yPos: 20, // Primera línea
    color: "bg-yellow-400",
    textColor: "text-slate-900",
  },
  {
    id: "fa",
    name: "FA",
    pitch: "F4",
    frequency: 349.23,
    yPos: 27.5, // Primer espacio
    color: "bg-green-500",
    textColor: "text-slate-900",
  },
  {
    id: "sol",
    name: "SOL",
    pitch: "G4",
    frequency: 392.0,
    yPos: 35, // Segunda línea
    color: "bg-sky-400",
    textColor: "text-slate-900",
  },
  {
    id: "la",
    name: "LA",
    pitch: "A4",
    frequency: 440.0,
    yPos: 42.5, // Segundo espacio
    color: "bg-indigo-600",
    textColor: "text-slate-900",
  },
  {
    id: "si",
    name: "SI",
    pitch: "B4",
    frequency: 493.88,
    yPos: 50, // Tercera línea
    color: "bg-fuchsia-600",
    textColor: "text-slate-900",
  },
];

export const getNoteById = (id: string): NoteData => {
  return notesData.find((n) => n.id === id) || notesData[0];
};
