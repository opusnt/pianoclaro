"use client";

import { AudioSettings } from "@/components/lesson/AudioSettings";
import { ComputerKeyboardToggle } from "@/components/lesson/ComputerKeyboardToggle";
import { PianoKeyboard } from "@/components/lesson/PianoKeyboard";
import { PracticeModeSelector } from "@/components/lesson/PracticeModeSelector";
import type { SharpNoteName } from "@/lib/music/notes";
import type { Lesson, NoteName, PracticeMode } from "@/types/lesson";

type LessonToolsPanelProps = {
  lesson: Lesson;
  activeNotes: NoteName[];
  activeBlackNotes: SharpNoteName[];
  computerKeyboardEnabled: boolean;
  selectedPracticeMode: PracticeMode;
  volume: number;
  isMuted: boolean;
  metronomeEnabled: boolean;
  onNaturalKeyPress: (note: NoteName) => void;
  onSharpKeyPress: (note: SharpNoteName) => void;
  onComputerKeyboardChange: (enabled: boolean) => void;
  onPracticeModeChange: (mode: PracticeMode) => void;
  onVolumeChange: (volume: number) => void;
  onMutedChange: (isMuted: boolean) => void;
  onMetronomeChange: (enabled: boolean) => void;
};

export function LessonToolsPanel({
  lesson,
  activeNotes,
  activeBlackNotes,
  computerKeyboardEnabled,
  selectedPracticeMode,
  volume,
  isMuted,
  metronomeEnabled,
  onNaturalKeyPress,
  onSharpKeyPress,
  onComputerKeyboardChange,
  onPracticeModeChange,
  onVolumeChange,
  onMutedChange,
  onMetronomeChange,
}: LessonToolsPanelProps) {
  return (
    <details className="rounded-2xl border border-blue-deep/10 bg-white/75 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <summary className="cursor-pointer text-sm font-bold text-blue-deep">
        Herramientas: teclado completo, modo y audio
      </summary>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <PianoKeyboard
          activeNotes={activeNotes}
          activeBlackNotes={activeBlackNotes}
          showLabels
          showComputerKeys={computerKeyboardEnabled}
          onKeyPress={onNaturalKeyPress}
          onBlackKeyPress={onSharpKeyPress}
        />
        <div className="space-y-5">
          <ComputerKeyboardToggle
            enabled={computerKeyboardEnabled}
            onChange={onComputerKeyboardChange}
          />
          <PracticeModeSelector
            modes={lesson.practiceModes}
            selectedPracticeMode={selectedPracticeMode}
            onChange={onPracticeModeChange}
          />
          <AudioSettings
            volume={volume}
            isMuted={isMuted}
            metronomeEnabled={metronomeEnabled}
            onVolumeChange={onVolumeChange}
            onMutedChange={onMutedChange}
            onMetronomeChange={onMetronomeChange}
          />
        </div>
      </div>
    </details>
  );
}
