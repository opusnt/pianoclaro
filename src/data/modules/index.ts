import { basicRhythmDetailedModule } from "@/data/modules/basic-rhythm-module";
import { chordsDetailedModule } from "@/data/modules/chords-module";
import { chordInversionsDetailedModule } from "@/data/modules/chord-inversions-module";
import { harmonicFieldDetailedModule } from "@/data/modules/harmonic-field-module";
import { intervalsDetailedModule } from "@/data/modules/intervals-module";
import { keySignaturesDetailedModule } from "@/data/modules/key-signatures-module";
import { keyboardNotesModule } from "@/data/modules/keyboard-notes-module";
import { majorScaleDetailedModule } from "@/data/modules/major-scale-module";
import { minorScaleDetailedModule } from "@/data/modules/minor-scale-module";
import { pentatonicDetailedModule } from "@/data/modules/pentatonic-module";
import type { DetailedLearningModule } from "@/types/curriculum";

export const detailedLearningModules: DetailedLearningModule[] = [
  keyboardNotesModule,
  basicRhythmDetailedModule,
  intervalsDetailedModule,
  majorScaleDetailedModule,
  minorScaleDetailedModule,
  keySignaturesDetailedModule,
  pentatonicDetailedModule,
  chordsDetailedModule,
  chordInversionsDetailedModule,
  harmonicFieldDetailedModule,
];

export function getDetailedLearningModuleById(id: string) {
  return detailedLearningModules.find((module) => module.id === id);
}
