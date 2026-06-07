import { useState, useCallback, useRef, useEffect } from "react";
import { useMicrophonePitchDetection } from "@/components/lesson/hooks/useMicrophonePitchDetection";
import type { NoteName } from "@/types/lesson";

type UseSightReadingGameOptions = {
  osmd: any | null; // The OSMD instance
  enabled: boolean;
  onFinish?: (finalScore: number) => void;
};

export function useSightReadingGame({ osmd, enabled, onFinish }: UseSightReadingGameOptions) {
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [lastDetectedNote, setLastDetectedNote] = useState<string | null>(null);
  const [expectedNote, setExpectedNote] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState({ rms: 0, pitch: 0 as number | null });
  const isFinishedRef = useRef(false);

  // We use this to prevent processing identical consecutive valid notes as double points
  const [lastProcessedTimestamp, setLastProcessedTimestamp] = useState<number>(0);

  // Restart game if OSMD or enabled changes
  useEffect(() => {
    if (enabled && osmd) {
      setScore(0);
      setIsFinished(false);
      setLastDetectedNote(null);
      isFinishedRef.current = false;
      osmd.cursor.reset();
      
      // Delay cursor show slightly to ensure SVG is ready
      setTimeout(() => {
        if (osmd && osmd.cursor) {
           osmd.cursor.show();
           osmd.cursor.update(); // Force visual update
        }
      }, 100);
      
      // Setup initial expected note
      try {
        const notes = osmd.cursor.NotesUnderCursor();
        if (notes && notes.length > 0 && notes[0].Pitch) {
           const chromaticToDiatonic: Record<number, string> = {
             0: "C", 2: "D", 4: "E", 5: "F", 7: "G", 9: "A", 11: "B"
           };
           let name = "C";
           if (typeof notes[0].Pitch.fundamentalNote === "number") {
             name = chromaticToDiatonic[notes[0].Pitch.fundamentalNote] || "C";
           }
           // Accidentals
           if (notes[0].Pitch.accidentalHalfTones === 1) name += "#";
           else if (notes[0].Pitch.accidentalHalfTones === -1) name += "b";
           
           setExpectedNote(name);
        }
      } catch (e) {}
    }
  }, [enabled, osmd]);

  const handleNotePlayed = useCallback((notePlayed: string) => { // "C", "C#", etc
    if (!osmd || !enabled || isFinishedRef.current) return;
    
    try {
      if (osmd.cursor.Iterator.EndReached) {
        if (!isFinishedRef.current) {
          isFinishedRef.current = true;
          setIsFinished(true);
          onFinish?.(score);
        }
        return;
      }

      const notes = osmd.cursor.NotesUnderCursor();
      if (!notes || notes.length === 0) return;

      const targetNote = notes[0];

      // Automatically skip rests
      if (targetNote.isRest()) {
        osmd.cursor.next();
        return;
      }

      const pitch = targetNote.Pitch;
      if (!pitch) return;

      // Extract Note name from OSMD
      const chromaticToDiatonic: Record<number, string> = {
        0: "C", 2: "D", 4: "E", 5: "F", 7: "G", 9: "A", 11: "B"
      };
      let targetName = "C";
      
      if (typeof pitch.fundamentalNote === "number") {
        targetName = chromaticToDiatonic[pitch.fundamentalNote] || "C";
      }
      
      const acc = pitch.accidentalHalfTones;
      if (acc === 1) targetName += "#";
      else if (acc === -1) targetName += "b";

      setLastDetectedNote(notePlayed);
      setExpectedNote(targetName);

      // If the played note matches the expected target name (ignoring octave for beginner sight reading)
      if (targetName === notePlayed) {
        // Prevent double processing the same cursor event
        const now = Date.now();
        if (now - lastProcessedTimestamp < 300) return; // 300ms debounce for same note advancement
        setLastProcessedTimestamp(now);

        // Optional: Color the note green (using undocumented/internal but safe property)
        try {
          if (typeof targetNote.NoteheadColor !== "undefined") {
            targetNote.NoteheadColor = "#22c55e"; // Tailwind green-500
          }
        } catch (e) {
            // Ignore color errors
        }

        // Advance the game
        setScore(s => s + 10);
        osmd.cursor.next();
        osmd.cursor.show(); // Ensure cursor stays visible after moving

        // Update expected note for UI
        try {
          const nextNotes = osmd.cursor.NotesUnderCursor();
          if (nextNotes && nextNotes.length > 0 && nextNotes[0].Pitch) {
            let nextName = "C";
            const chromaticToDiatonic: Record<number, string> = {
              0: "C", 2: "D", 4: "E", 5: "F", 7: "G", 9: "A", 11: "B"
            };
            if (typeof nextNotes[0].Pitch.fundamentalNote === "number") {
              nextName = chromaticToDiatonic[nextNotes[0].Pitch.fundamentalNote] || "C";
            }
            if (nextNotes[0].Pitch.accidentalHalfTones === 1) nextName += "#";
            else if (nextNotes[0].Pitch.accidentalHalfTones === -1) nextName += "b";
            setExpectedNote(nextName);
          }
        } catch (e) {}

        // Check if finished
        if (osmd.cursor.Iterator.EndReached) {
          isFinishedRef.current = true;
          setIsFinished(true);
          onFinish?.(score + 10); // +10 because score state update is async
        }
      }
    } catch (e) {
      console.warn("Sight reading game error:", e);
    }
  }, [osmd, enabled, score, onFinish, lastProcessedTimestamp]);

  useMicrophonePitchDetection({
    enabled: enabled && !isFinished,
    onNaturalKeyPress: (note) => handleNotePlayed(note),
    onSharpKeyPress: (note) => handleNotePlayed(note),
    onError: (err) => setMicError(err),
    onDebug: (rms, pitch) => setDebugInfo({ rms, pitch })
  });

  return {
    score,
    isFinished,
    micError,
    lastDetectedNote,
    expectedNote,
    debugInfo,
    resetGame: () => {
      setScore(0);
      setIsFinished(false);
      isFinishedRef.current = false;
      if (osmd) {
        osmd.cursor.reset();
        osmd.cursor.show();
      }
    }
  };
}
