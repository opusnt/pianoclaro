import { useEffect, useRef, useState } from "react";
import { NoteGlyph } from "@/components/lesson/notation/NoteGlyph";
import { RestGlyph } from "@/components/lesson/notation/RestGlyph";
import type { NotationRendererProps, ScoreNoteSelection } from "@/components/lesson/notation/types";
import { getMeasureEvents } from "@/lib/music/notation";
import { getPositionedMeasureEvents, isPositionedNoteEvent } from "@/lib/music/notation-layout";
import { getStaffPosition } from "@/lib/music/staff-position";
import type { NoteName, ScoreMock } from "@/types/lesson";

const rowHeight = 12;
const staffTopOffset = 80;

const keyboardHintNotes: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];

const solfegeByNote: Record<NoteName, string> = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};

export function PianoClaroSvgRenderer({
  score,
  activeNotes = [],
  activeMeasure,
  activePhrase,
  activeNotePosition,
  hintNotePosition,
  onNoteSelect,
}: NotationRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(960);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const systemHeight = 250;
  const leftPadding = 126;
  const rightPadding = 34;
  const availableWidth = containerWidth - leftPadding - rightPadding;
  const minMeasureWidth = 220;

  let measuresPerSystem = Math.floor(availableWidth / minMeasureWidth);
  measuresPerSystem = Math.max(1, Math.min(measuresPerSystem, score.measures.length, 4));

  const scoreWidth = containerWidth;
  const measureWidth = availableWidth / measuresPerSystem;
  const systemCount = Math.ceil(score.measures.length / measuresPerSystem);
  const scoreHeight = systemCount * systemHeight + 20;

  let activeCursorX: number | null = null;
  let activeCursorY: number | null = null;

  if (activeNotePosition) {
    const measureIndex = score.measures.findIndex(
      (m) => m.number === activeNotePosition.measureNumber,
    );
    if (measureIndex !== -1) {
      const measure = score.measures[measureIndex];
      const systemIndex = Math.floor(measureIndex / measuresPerSystem);
      const positionInSystem = measureIndex % measuresPerSystem;
      const systemTop = systemIndex * systemHeight;
      const measureStart = leftPadding + positionInSystem * measureWidth;

      const positionedEvents = getPositionedMeasureEvents({ measure, measureStart, measureWidth });
      const activeEvent = positionedEvents.find(
        (e) => e.noteIndex === activeNotePosition.noteIndex,
      );
      if (activeEvent) {
        activeCursorX = activeEvent.x;
        activeCursorY = systemTop + 68;
      }
    }
  }

  return (
    <div ref={containerRef} className="w-full">
      <svg
        role="img"
        aria-label={`Partitura mock ${score.title}`}
        viewBox={`0 0 ${scoreWidth} ${scoreHeight}`}
        className="h-auto w-full rounded-2xl bg-ivory"
      >
        <rect width={scoreWidth} height={scoreHeight} rx="18" fill="#fbf8ef" />

        {Array.from({ length: systemCount }).map((_, systemIndex) => {
          const systemTop = systemIndex * systemHeight;
          const staffLines = [80, 104, 128, 152, 176].map((y) => y + systemTop);
          const systemMeasures = score.measures.slice(
            systemIndex * measuresPerSystem,
            systemIndex * measuresPerSystem + measuresPerSystem,
          );
          const lastMeasureX = leftPadding + Math.max(systemMeasures.length, 1) * measureWidth - 18;

          return (
            <g key={`system-${systemIndex}`}>
              {staffLines.map((y) => (
                <line
                  key={y}
                  x1="88"
                  x2={lastMeasureX}
                  y1={y}
                  y2={y}
                  stroke="#12345b"
                  strokeOpacity="0.34"
                />
              ))}

              <text x="28" y={systemTop + 168} fontSize="78" fill="#12345b" opacity="0.88">
                {score.clef === "treble" ? "𝄞" : "𝄢"}
              </text>
              <text x="82" y={systemTop + 123} fontSize="30" fill="#12345b" fontWeight="700">
                {score.timeSignature.split("/")[0]}
              </text>
              <text x="82" y={systemTop + 158} fontSize="30" fill="#12345b" fontWeight="700">
                {score.timeSignature.split("/")[1]}
              </text>
            </g>
          );
        })}

        {score.measures.map((measure, measureIndex) => {
          const systemIndex = Math.floor(measureIndex / measuresPerSystem);
          const positionInSystem = measureIndex % measuresPerSystem;
          const systemTop = systemIndex * systemHeight;
          const measureStart = leftPadding + positionInSystem * measureWidth;
          const measureEnd = measureStart + measureWidth - 18;
          const isMeasureActive = activeMeasure === measure.number;
          const isPhraseActive = activePhrase && measure.phrase === activePhrase;
          const positionedEvents = getPositionedMeasureEvents({
            measure,
            measureStart,
            measureWidth,
          });
          const rhythmSummary = Array.from(
            new Set(getMeasureEvents(measure).map((event) => event.duration)),
          ).join(" · ");

          return (
            <g key={measure.number}>
              {isMeasureActive || isPhraseActive ? (
                <rect
                  x={measureStart - 8}
                  y={systemTop + 54}
                  width={measureWidth - 8}
                  height="154"
                  rx="14"
                  fill={isMeasureActive ? "#d7b46a" : "#dbe9f7"}
                  opacity={isMeasureActive ? "0.28" : "0.42"}
                />
              ) : null}

              <line
                x1={measureEnd}
                x2={measureEnd}
                y1={systemTop + 68}
                y2={systemTop + 196}
                stroke="#12345b"
                strokeOpacity="0.38"
              />
              <text
                x={measureStart}
                y={systemTop + 38}
                fontSize="14"
                fontWeight="700"
                fill={activeMeasure === measure.number ? "#77561a" : "#627083"}
              >
                Compás {measure.number}
                {measure.phrase ? ` · Frase ${measure.phrase}` : ""}
              </text>

              {positionedEvents.map((positionedEvent) => {
                if (!isPositionedNoteEvent(positionedEvent)) {
                  return (
                    <RestGlyph
                      key={`${measure.number}-rest-${positionedEvent.eventIndex}`}
                      x={positionedEvent.x}
                      y={systemTop + 139}
                      duration={positionedEvent.event.duration}
                    />
                  );
                }

                const { event, noteIndex, x } = positionedEvent;
                const note = event.pitch.note;
                const staffPosition = getStaffPosition({
                  note,
                  clef: score.clef,
                  staffTopY: systemTop + staffTopOffset,
                  rowHeight,
                });
                const y = staffPosition.y;
                const isPlaybackNote =
                  activeNotePosition?.measureNumber === measure.number &&
                  activeNotePosition.noteIndex === noteIndex;
                const isNoteActive = activeNotePosition
                  ? isPlaybackNote
                  : activeNotes.includes(note);

                return (
                  <g
                    key={`${measure.number}-${noteIndex}-${note}`}
                    role="button"
                    aria-label={`Pista ${measure.solfege[noteIndex]} compás ${measure.number} tiempo ${positionedEvent.startsAtBeat}`}
                    data-testid={`score-note-${measure.number}-${noteIndex + 1}-${note}`}
                    tabIndex={0}
                    className="cursor-pointer outline-none"
                    onClick={() =>
                      onNoteSelect?.({
                        measureNumber: measure.number,
                        noteIndex,
                        note,
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        onNoteSelect?.({
                          measureNumber: measure.number,
                          noteIndex,
                          note,
                        });
                      }
                    }}
                  >
                    {staffPosition.needsLedgerLine ? (
                      <line
                        x1={x - 24}
                        x2={x + 24}
                        y1={staffPosition.ledgerY}
                        y2={staffPosition.ledgerY}
                        stroke="#12345b"
                        strokeOpacity="0.46"
                      />
                    ) : null}
                    <NoteGlyph
                      x={x}
                      y={y}
                      duration={event.duration}
                      active={isNoteActive}
                      playback={isPlaybackNote}
                    />
                    <text
                      x={x}
                      y={systemTop + 228}
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="700"
                      fill={isNoteActive ? "#77561a" : "#627083"}
                    >
                      {measure.solfege[noteIndex]}
                    </text>
                  </g>
                );
              })}

              <text
                x={measureStart}
                y={systemTop + 246}
                fontSize="11"
                fontWeight="700"
                fill="#8a7451"
              >
                Ritmo: {rhythmSummary || "negra"}
              </text>
            </g>
          );
        })}

        {activeCursorX !== null && activeCursorY !== null && (
          <line
            style={{
              transform: `translate(${activeCursorX}px, ${activeCursorY}px)`,
              transition: "transform 250ms linear",
            }}
            x1={0}
            x2={0}
            y1={-14}
            y2={140}
            stroke="#d7b46a"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
        )}

        {hintNotePosition ? (
          <KeyboardHint
            score={score}
            scoreWidth={scoreWidth}
            selection={hintNotePosition}
            measuresPerSystem={measuresPerSystem}
            measureWidth={measureWidth}
            leftPadding={leftPadding}
          />
        ) : null}
      </svg>
    </div>
  );
}

function KeyboardHint({
  score,
  scoreWidth,
  selection,
  measuresPerSystem,
  measureWidth,
  leftPadding,
}: {
  score: ScoreMock;
  scoreWidth: number;
  selection: ScoreNoteSelection;
  measuresPerSystem: number;
  measureWidth: number;
  leftPadding: number;
}) {
  const systemIndex = Math.floor((selection.measureNumber - 1) / measuresPerSystem);
  const positionInSystem = (selection.measureNumber - 1) % measuresPerSystem;
  const measure = score.measures.find((currentMeasure) => {
    return currentMeasure.number === selection.measureNumber;
  });
  const measureStart = leftPadding + positionInSystem * measureWidth;
  const noteX = measure
    ? (getPositionedMeasureEvents({ measure, measureStart, measureWidth }).find(
        (event) => event.noteIndex === selection.noteIndex,
      )?.x ?? measureStart + 38)
    : measureStart + 38;
  const noteYPosition = getStaffPosition({
    note: selection.note,
    clef: score.clef,
    staffTopY: systemIndex * 250 + staffTopOffset,
    rowHeight,
  }).y;
  const hintWidth = 280;
  const hintHeight = 82;
  const hintX = Math.max(110, Math.min(noteX - 88, scoreWidth - hintWidth - 24));
  const hintY = Math.max(18, noteYPosition - 138);

  return (
    <g>
      <rect
        x={hintX}
        y={hintY}
        width={hintWidth}
        height={hintHeight}
        rx="14"
        fill="#dbe9f7"
        opacity="0.95"
      />
      <polygon
        points={`${noteX - 14},${hintY + hintHeight} ${noteX + 14},${hintY + hintHeight} ${noteX},${noteYPosition - 24}`}
        fill="#dbe9f7"
        opacity="0.95"
      />
      <text x={hintX + 14} y={hintY + 22} fontSize="13" fontWeight="800" fill="#12345b">
        Pista: {solfegeByNote[selection.note]} en el teclado
      </text>
      {keyboardHintNotes.map((note, index) => {
        const keyWidth = 34;
        const keyX = hintX + 14 + index * keyWidth;
        const isActive = note === selection.note;

        return (
          <g key={note}>
            <rect
              x={keyX}
              y={hintY + 34}
              width={keyWidth}
              height="34"
              fill={isActive ? "#d7b46a" : "#ffffff"}
              stroke="#12345b"
              strokeOpacity="0.28"
            />
            <text
              x={keyX + keyWidth / 2}
              y={hintY + 58}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={isActive ? "#543b12" : "#12345b"}
            >
              {solfegeByNote[note]}
            </text>
          </g>
        );
      })}
      {[
        { label: "Do#", x: 39 },
        { label: "Re#", x: 73 },
        { label: "Fa#", x: 141 },
        { label: "Sol#", x: 175 },
        { label: "La#", x: 209 },
      ].map((key) => (
        <rect
          key={key.label}
          x={hintX + key.x}
          y={hintY + 34}
          width="18"
          height="22"
          rx="3"
          fill="#142033"
        />
      ))}
    </g>
  );
}
