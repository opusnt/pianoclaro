import type { ReactNode } from "react";

import { ModuleChordInversionsScreen } from "@/components/modules/chord-inversions/ModuleChordInversionsScreen";
import { ModuleChordsScreen } from "@/components/modules/chords/ModuleChordsScreen";
import { ModuleFirstFiveNotesScreen } from "@/components/modules/first-five-notes/ModuleFirstFiveNotesScreen";
import { ModuleHarmonicFieldScreen } from "@/components/modules/harmonic-field/ModuleHarmonicFieldScreen";
import { ModuleIntervalsScreen } from "@/components/modules/intervals/ModuleIntervalsScreen";
import { ModuleKeySignaturesScreen } from "@/components/modules/key-signature/ModuleKeySignaturesScreen";
import { ModuleMajorScaleScreen } from "@/components/modules/major-scale/ModuleMajorScaleScreen";
import { ModuleMinorScaleScreen } from "@/components/modules/minor-scale/ModuleMinorScaleScreen";
import { ModulePentatonicScreen } from "@/components/modules/pentatonic/ModulePentatonicScreen";
import { ModuleRhythmBasicsScreen } from "@/components/modules/rhythm/ModuleRhythmBasicsScreen";
import { chordInversionModule } from "@/data/chord-inversions";
import { chordModule } from "@/data/chords";
import { harmonicFieldModule } from "@/data/harmonic-field";
import { intervalModule } from "@/data/intervals";
import { keySignatureModule } from "@/data/key-signatures";
import { firstFiveNotesModuleId, keyboardNotesLessonSlug } from "@/data/learning-slugs";
import { getLessonBySlug } from "@/data/lessons";
import { majorScaleModule } from "@/data/major-scale";
import { minorScaleModule } from "@/data/minor-scale";
import { keyboardNotesModule } from "@/data/modules/keyboard-notes-module";
import { pentatonicModule } from "@/data/pentatonic";
import { rhythmModule } from "@/data/rhythm-basics";
import type { DetailedLearningModule } from "@/types/curriculum";

const firstNotesTheoryLesson = getLessonBySlug(keyboardNotesLessonSlug);

export const playableModuleIds = [
  firstFiveNotesModuleId,
  "basic-rhythm",
  "intervals",
  "major-scale",
  "minor-scales",
  "key-signatures",
  "pentatonic-scale",
  "chord-construction",
  "chord-inversions",
  "harmonic-field",
] as const;

export type PlayableModuleId = (typeof playableModuleIds)[number];

export type PlayableModuleRegistration = {
  id: PlayableModuleId;
  render: (module: DetailedLearningModule) => ReactNode;
};

export const playableModuleRegistry: Record<PlayableModuleId, PlayableModuleRegistration> = {
  [firstFiveNotesModuleId]: {
    id: firstFiveNotesModuleId,
    render: () => (
      <ModuleFirstFiveNotesScreen
        module={keyboardNotesModule}
        sourceLesson={firstNotesTheoryLesson!}
      />
    ),
  },
  "basic-rhythm": {
    id: "basic-rhythm",
    render: () => <ModuleRhythmBasicsScreen module={rhythmModule} />,
  },
  intervals: {
    id: "intervals",
    render: () => <ModuleIntervalsScreen module={intervalModule} />,
  },
  "major-scale": {
    id: "major-scale",
    render: () => <ModuleMajorScaleScreen module={majorScaleModule} />,
  },
  "minor-scales": {
    id: "minor-scales",
    render: () => <ModuleMinorScaleScreen module={minorScaleModule} />,
  },
  "key-signatures": {
    id: "key-signatures",
    render: () => <ModuleKeySignaturesScreen module={keySignatureModule} />,
  },
  "pentatonic-scale": {
    id: "pentatonic-scale",
    render: () => <ModulePentatonicScreen module={pentatonicModule} />,
  },
  "chord-construction": {
    id: "chord-construction",
    render: () => <ModuleChordsScreen module={chordModule} />,
  },
  "chord-inversions": {
    id: "chord-inversions",
    render: () => <ModuleChordInversionsScreen module={chordInversionModule} />,
  },
  "harmonic-field": {
    id: "harmonic-field",
    render: () => <ModuleHarmonicFieldScreen module={harmonicFieldModule} />,
  },
};

export function isPlayableModuleId(moduleId: string): moduleId is PlayableModuleId {
  return playableModuleIds.includes(moduleId as PlayableModuleId);
}

export function getPlayableModuleRegistration(moduleId: string) {
  if (!isPlayableModuleId(moduleId)) {
    return undefined;
  }

  return playableModuleRegistry[moduleId];
}
