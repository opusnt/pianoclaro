"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { AudioSettings } from "@/components/lesson/AudioSettings";
import { ComputerKeyboardToggle } from "@/components/lesson/ComputerKeyboardToggle";
import { MicrophoneToggle } from "@/components/lesson/MicrophoneToggle";
import { PianoKeyboard } from "@/components/lesson/PianoKeyboard";
import { PracticeModeSelector } from "@/components/lesson/PracticeModeSelector";
import type { SharpNoteName } from "@/lib/music/notes";
import type { Lesson, NoteName, PracticeMode } from "@/types/lesson";

type LessonToolsPanelProps = {
  lesson: Lesson;
  activeNotes: NoteName[];
  activeBlackNotes: SharpNoteName[];
  computerKeyboardEnabled: boolean;
  microphoneEnabled: boolean;
  selectedPracticeMode: PracticeMode;
  volume: number;
  isMuted: boolean;
  metronomeEnabled: boolean;
  onNaturalKeyPress: (note: NoteName) => void;
  onSharpKeyPress: (note: SharpNoteName) => void;
  onComputerKeyboardChange: (enabled: boolean) => void;
  onMicrophoneChange: (enabled: boolean) => void;
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
  microphoneEnabled,
  selectedPracticeMode,
  volume,
  isMuted,
  metronomeEnabled,
  onNaturalKeyPress,
  onSharpKeyPress,
  onComputerKeyboardChange,
  onMicrophoneChange,
  onPracticeModeChange,
  onVolumeChange,
  onMutedChange,
  onMetronomeChange,
}: LessonToolsPanelProps) {
  const [showNoteLabels, setShowNoteLabels] = useState(false);

  return (
    <details className="rounded-2xl border border-blue-deep/10 bg-white/75 p-5 shadow-[0_12px_30px_rgba(18,52,91,0.08)]">
      <summary className="cursor-pointer text-sm font-bold text-blue-deep">
        Herramientas: teclado completo, modo y audio
      </summary>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <PianoKeyboard
          activeNotes={activeNotes}
          activeBlackNotes={activeBlackNotes}
          showLabels={showNoteLabels}
          showComputerKeys={computerKeyboardEnabled}
          onKeyPress={onNaturalKeyPress}
          onBlackKeyPress={onSharpKeyPress}
        />
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => setShowNoteLabels((current) => !current)}
            className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-blue-deep/10 bg-white px-4 py-3 text-sm font-bold text-blue-deep transition hover:bg-blue-soft/35"
          >
            {showNoteLabels ? (
              <EyeOff aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Eye aria-hidden="true" className="h-4 w-4" />
            )}
            {showNoteLabels ? "Ocultar notas" : "Ver notas"}
          </button>
          <ComputerKeyboardToggle
            enabled={computerKeyboardEnabled}
            onChange={onComputerKeyboardChange}
          />
          <MicrophoneToggle
            enabled={microphoneEnabled}
            onChange={onMicrophoneChange}
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
