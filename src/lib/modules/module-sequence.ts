export type ModuleSequenceItem = {
  id: string;
  order: number;
  title: string;
  shortGoal: string;
  href: string;
};

export const moduleSequence: ModuleSequenceItem[] = [
  {
    id: "keyboard-notes",
    order: 1,
    title: "El teclado y las notas",
    shortGoal: "ubicarse en el piano sin depender de etiquetas",
    href: "/modulos/keyboard-notes",
  },
  {
    id: "basic-rhythm",
    order: 2,
    title: "Ritmo básico",
    shortGoal: "tocar en el momento correcto",
    href: "/modulos/basic-rhythm",
  },
  {
    id: "intervals",
    order: 3,
    title: "Intervalos",
    shortGoal: "entender la distancia entre dos notas",
    href: "/modulos/intervals",
  },
  {
    id: "major-scale",
    order: 4,
    title: "Escala mayor",
    shortGoal: "construir el patrón mayor completo",
    href: "/modulos/major-scale",
  },
  {
    id: "minor-scales",
    order: 5,
    title: "Escalas menores",
    shortGoal: "comparar menor natural, armónica y melódica",
    href: "/modulos/minor-scales",
  },
  {
    id: "key-signatures",
    order: 6,
    title: "Armaduras y tonalidades",
    shortGoal: "leer alteraciones fijas y relativas",
    href: "/modulos/key-signatures",
  },
  {
    id: "pentatonic-scale",
    order: 7,
    title: "Escala pentatónica",
    shortGoal: "crear frases simples con cinco notas",
    href: "/modulos/pentatonic-scale",
  },
  {
    id: "chord-construction",
    order: 8,
    title: "Construcción de acordes",
    shortGoal: "formar tríadas por tónica, tercera y quinta",
    href: "/modulos/chord-construction",
  },
  {
    id: "chord-inversions",
    order: 9,
    title: "Inversiones de acordes",
    shortGoal: "usar las mismas notas con otro bajo",
    href: "/modulos/chord-inversions",
  },
  {
    id: "harmonic-field",
    order: 10,
    title: "Campo armónico",
    shortGoal: "conectar escala, grados y acordes",
    href: "/modulos/harmonic-field",
  },
];

export function getNextModule(currentModuleId: string) {
  const currentIndex = moduleSequence.findIndex((module) => module.id === currentModuleId);

  if (currentIndex < 0) {
    return undefined;
  }

  return moduleSequence[currentIndex + 1];
}
