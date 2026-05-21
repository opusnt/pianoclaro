export type UnitCountQuestion = {
  expectedNotes?: string[];
  expectedMidiNotes?: number[];
};

export function getQuestionUnitCount(question: UnitCountQuestion) {
  return question.expectedNotes?.length ?? 1;
}

export function getCompletedUnits<TQuestion extends UnitCountQuestion>({
  questions,
  currentIndex,
  currentQuestion,
  currentPlayedNotes,
  currentAnswer,
}: {
  questions: TQuestion[];
  currentIndex: number;
  currentQuestion?: TQuestion;
  currentPlayedNotes: string[];
  currentAnswer: unknown;
}) {
  const previousUnits = questions
    .slice(0, currentIndex)
    .reduce((total, question) => total + getQuestionUnitCount(question), 0);

  if (!currentQuestion) return 0;
  if (currentQuestion.expectedNotes) return previousUnits + currentPlayedNotes.length;
  return previousUnits + (currentAnswer ? 1 : 0);
}

export function getCurrentScaleStepIndex({
  expectedMidiNotes,
  tonicMidi,
  playedCount,
}: {
  expectedMidiNotes?: number[];
  tonicMidi?: number;
  playedCount: number;
}) {
  if (!expectedMidiNotes || typeof tonicMidi !== "number") return 0;

  const sequenceStartsOnTonic = expectedMidiNotes[0] === tonicMidi;
  const nextStep = sequenceStartsOnTonic ? playedCount - 1 : playedCount;
  return Math.max(0, Math.min(6, nextStep));
}

export function getCompletedScaleStepCount({
  expectedMidiNotes,
  tonicMidi,
  playedCount,
}: {
  expectedMidiNotes?: number[];
  tonicMidi?: number;
  playedCount: number;
}) {
  if (!expectedMidiNotes || typeof tonicMidi !== "number") return 0;

  const sequenceStartsOnTonic = expectedMidiNotes[0] === tonicMidi;
  const completed = sequenceStartsOnTonic ? playedCount - 1 : playedCount;
  return Math.max(0, Math.min(7, completed));
}
