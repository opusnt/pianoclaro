import type { ReactNode } from "react";
import { Unit1SoundVsNoise } from "@/components/modules/module-1/units/unit-1/Unit1SoundVsNoise";
import { Unit2SoundDetective } from "@/components/modules/module-1/units/unit-2/Unit2SoundDetective";
import { Unit3MusicPillars } from "@/components/modules/module-1/units/unit-3/Unit3MusicPillars";
import { Unit4MusicMap } from "@/components/modules/module-1/units/unit-4/Unit4MusicMap";
import { Unit5MeetTheNotes } from "@/components/modules/module-1/units/unit-5/Unit5MeetTheNotes";
import { Unit6TrebleClef } from "@/components/modules/module-1/units/unit-6/Unit6TrebleClef";
import { Unit7TimeAndRhythm } from "@/components/modules/module-1/units/unit-7/Unit7TimeAndRhythm";
import { Unit8Measures } from "@/components/modules/module-1/units/unit-8/Unit8Measures";
import { Unit9ExtendedNotes } from "@/components/modules/module-1/units/unit-9/Unit9ExtendedNotes";

import { Unit1KeyboardMap } from "@/components/modules/module-2/units/unit-1/Unit1KeyboardMap";
import { Unit2MusicalDistances } from "@/components/modules/module-2/units/unit-2/Unit2MusicalDistances";
import { Unit3Accidentals } from "@/components/modules/module-2/units/unit-3/Unit3Accidentals";
import { Unit4AccidentalNotation } from "@/components/modules/module-2/units/unit-4/Unit4AccidentalNotation";

export const THEORY_REGISTRY: Record<string, Record<string, () => ReactNode>> = {
  "1": {
    "1": () => <Unit1SoundVsNoise />,
    "2": () => <Unit2SoundDetective />,
    "3": () => <Unit3MusicPillars />,
    "4": () => <Unit4MusicMap />,
    "5": () => <Unit5MeetTheNotes />,
    "6": () => <Unit6TrebleClef />,
    "7": () => <Unit7TimeAndRhythm />,
    "8": () => <Unit8Measures />,
    "9": () => <Unit9ExtendedNotes />,
  },
  "2": {
    "1": () => <Unit1KeyboardMap />,
    "2": () => <Unit2MusicalDistances />,
    "3": () => <Unit3Accidentals />,
    "4": () => <Unit4AccidentalNotation />,
  }
};
