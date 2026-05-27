"use client";

import { useState } from "react";
import { LessonCompleteModal } from "@/components/lesson/LessonCompleteModal";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { LessonNavigation } from "@/components/lesson/LessonNavigation";
import { LessonPracticeStatus } from "@/components/lesson/LessonPracticeStatus";
import { LessonSidebar } from "@/components/lesson/LessonSidebar";
import { LessonToolsPanel } from "@/components/lesson/LessonToolsPanel";
import { NotationViewer } from "@/components/lesson/NotationViewer";
import { StudyRoutineStrip } from "@/components/lesson/StudyRoutineStrip";
import { useComputerKeyboardInput } from "@/components/lesson/hooks/useComputerKeyboardInput";
import { useLessonPractice } from "@/components/lesson/hooks/useLessonPractice";
import { useLessonProgress } from "@/components/lesson/hooks/useLessonProgress";
import { PracticeSequenceStrip } from "@/components/lesson/PracticeSequenceStrip";
import { PracticeSessionPanel } from "@/components/lesson/PracticeSessionPanel";
import { PracticeSongSummary } from "@/components/lesson/PracticeSongSummary";
import { ProgressIndicator } from "@/components/lesson/ProgressIndicator";
import type { Lesson, PracticeMode } from "@/types/lesson";

type LessonNavItem = Pick<Lesson, "slug" | "title" | "order">;

type LessonLayoutProps = {
  lesson: Lesson;
  previousLesson?: LessonNavItem;
  nextLesson?: LessonNavItem;
  navigationBasePath?: string;
  navigationItemLabel?: string;
  completionReturnHref?: string;
  completionReturnLabel?: string;
};

const fallbackPracticeMode: PracticeMode = {
  id: "leer",
  label: "Leer primero",
  description: "Primero mira la partitura. Luego toca.",
};

export function LessonLayout({
  lesson,
  previousLesson,
  nextLesson,
  navigationBasePath = "/lecciones",
  navigationItemLabel = "Lección",
  completionReturnHref,
  completionReturnLabel,
}: LessonLayoutProps) {
  const [selectedPracticeMode, setSelectedPracticeMode] = useState<PracticeMode>(
    lesson.practiceModes[0] ?? fallbackPracticeMode,
  );
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const {
    activeStepIndex,
    setActiveStepIndex,
    isLessonCompleted,
    setIsLessonCompleted,
    completedStepIds,
    setCompletedStepIds,
  } = useLessonProgress({
    lessonSlug: lesson.slug,
    stepCount: lesson.steps.length,
  });
  const [computerKeyboardEnabled, setComputerKeyboardEnabled] = useState(true);
  const activeStep = lesson.steps[activeStepIndex] ?? lesson.steps[0];
  const {
    activeNotes,
    activeBlackNotes,
    activeMeasure,
    activePhrase,
    activeNotePosition,
    hintNotePosition,
    isPlaying,
    tempoMode,
    setTempoMode,
    loopFocusEnabled,
    setLoopFocusEnabled,
    expectedEventIndex,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    metronomeEnabled,
    setMetronomeEnabled,
    practiceMessage,
    audioMessage,
    lastFeedback,
    attemptCount,
    correctCount,
    streak,
    practiceSong,
    activeFocus,
    studyRoutine,
    practiceSessionSummary,
    playGuidedPractice,
    stopGuidedPractice,
    repeatFocus,
    handleKeyboardPress,
    handleBlackKeyboardPress,
    handleScoreNoteSelect,
  } = useLessonPractice({
    lesson,
    activeStep,
    onStepComplete: markStepComplete,
  });

  useComputerKeyboardInput({
    enabled: computerKeyboardEnabled,
    onNaturalKeyPress: handleKeyboardPress,
    onSharpKeyPress: handleBlackKeyboardPress,
  });

  function markStepComplete(stepId: string) {
    setCompletedStepIds((current) =>
      current.includes(stepId) ? current : [...current, stepId],
    );
  }

  function goToPreviousStep() {
    setActiveStepIndex((current) => Math.max(0, current - 1));
  }

  function goToNextStep() {
    markStepComplete(activeStep.id);
    setActiveStepIndex((current) => Math.min(lesson.steps.length - 1, current + 1));
  }

  function completeLesson() {
    const allStepIds = lesson.steps.map((step) => step.id);
    stopGuidedPractice("Lección completada. Puedes seguir practicando o avanzar cuando quieras.");
    setCompletedStepIds(allStepIds);
    setActiveStepIndex(lesson.steps.length - 1);
    setIsLessonCompleted(true);
    setIsCompleteModalOpen(true);
  }

  return (
    <>
      <div className="space-y-5">
        <LessonHeader lesson={lesson} />

        <ProgressIndicator
          currentStep={isLessonCompleted ? lesson.steps.length : activeStepIndex + 1}
          totalSteps={lesson.steps.length}
        />

        <StudyRoutineStrip items={studyRoutine} />

        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <LessonSidebar
            lesson={lesson}
            activeStep={activeStep}
            activeStepIndex={activeStepIndex}
            completedStepIds={completedStepIds}
            isLessonCompleted={isLessonCompleted}
            isPlaying={isPlaying}
            tempoMode={tempoMode}
            loopFocusEnabled={loopFocusEnabled}
            onStepChange={setActiveStepIndex}
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
            onPlay={() => {
              void playGuidedPractice();
            }}
            onPause={() => stopGuidedPractice()}
            onRepeat={repeatFocus}
            onLoopFocusChange={setLoopFocusEnabled}
            onTempoChange={setTempoMode}
            onCompleteLesson={completeLesson}
          />

          <main className="min-w-0 space-y-5">
            <NotationViewer
              score={lesson.score}
              practiceSong={practiceSong}
              activeNotes={activeNotes}
              activeMeasure={activeMeasure}
              activePhrase={activePhrase}
              activeNotePosition={activeNotePosition}
              hintNotePosition={hintNotePosition}
              onNoteSelect={handleScoreNoteSelect}
            />

            <PracticeSessionPanel
              summary={practiceSessionSummary}
              isLoopEnabled={loopFocusEnabled}
            />

            <PracticeSequenceStrip
              events={activeFocus.events}
              activeIndex={expectedEventIndex}
            />

            <PracticeSongSummary song={practiceSong} />

            <LessonPracticeStatus
              practiceMessage={practiceMessage}
              audioMessage={audioMessage}
              activeNotes={activeNotes}
              activeBlackNotes={activeBlackNotes}
              activeMeasure={activeMeasure}
              activePhrase={activePhrase}
              feedback={lastFeedback}
              attemptCount={attemptCount}
              correctCount={correctCount}
              streak={streak}
            />

            <LessonToolsPanel
              lesson={lesson}
              activeNotes={activeNotes}
              activeBlackNotes={activeBlackNotes}
              computerKeyboardEnabled={computerKeyboardEnabled}
              selectedPracticeMode={selectedPracticeMode}
              volume={volume}
              isMuted={isMuted}
              metronomeEnabled={metronomeEnabled}
              onNaturalKeyPress={handleKeyboardPress}
              onSharpKeyPress={handleBlackKeyboardPress}
              onComputerKeyboardChange={setComputerKeyboardEnabled}
              onPracticeModeChange={setSelectedPracticeMode}
              onVolumeChange={setVolume}
              onMutedChange={setIsMuted}
              onMetronomeChange={setMetronomeEnabled}
            />

            <LessonNavigation
              previousLesson={previousLesson}
              nextLesson={nextLesson}
              navigationBasePath={navigationBasePath}
              navigationItemLabel={navigationItemLabel}
            />
          </main>
        </div>
      </div>

      <LessonCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        returnHref={completionReturnHref}
        returnLabel={completionReturnLabel}
      />
    </>
  );
}
