import { solfegeByNote } from "@/lib/music/notes";
import type { MeasureMock, ScoreMock } from "@/types/lesson";
import type { MeasureEvent, NoteDuration, NoteName, NotatedNoteEvent } from "@/types/music";

export function parseMusicXml(xmlText: string): ScoreMock {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");

  const title = xml.querySelector("work-title")?.textContent ?? "Partitura Importada";

  let timeSignature = "4/4";
  const beats = xml.querySelector("time > beats")?.textContent;
  const beatType = xml.querySelector("time > beat-type")?.textContent;
  if (beats && beatType) {
    timeSignature = `${beats}/${beatType}`;
  }

  let clef: "treble" | "bass" = "treble";
  const clefSign = xml.querySelector("clef > sign")?.textContent;
  if (clefSign === "F") clef = "bass";

  const keyFifths = Number.parseInt(xml.querySelector("key > fifths")?.textContent ?? "0", 10);
  const keyMap: Record<number, string> = {
    "-7": "Cb", "-6": "Gb", "-5": "Db", "-4": "Ab", "-3": "Eb", "-2": "Bb", "-1": "F",
    "0": "C", "1": "G", "2": "D", "3": "A", "4": "E", "5": "B", "6": "F#", "7": "C#",
  };
  const keySignature = keyMap[keyFifths] ?? "C";

  const measuresNodes = xml.querySelectorAll("measure");
  const measures: MeasureMock[] = Array.from(measuresNodes).map((measureNode, idx) => {
    const noteNodes = measureNode.querySelectorAll("note");
    const events: MeasureEvent[] = [];

    Array.from(noteNodes).forEach((noteNode) => {
      const isRest = noteNode.querySelector("rest") !== null;
      const isChord = noteNode.querySelector("chord") !== null;
      const type = noteNode.querySelector("type")?.textContent;

      let duration: NoteDuration = "negra";
      if (type === "whole") duration = "redonda";
      if (type === "half") duration = "blanca";
      if (type === "quarter") duration = "negra";
      if (type === "eighth") duration = "corchea";

      if (isRest) {
        events.push({ kind: "rest", duration });
      } else {
        const step = noteNode.querySelector("pitch > step")?.textContent as NoteName;
        if (step) {
          events.push({
            kind: "note",
            pitch: { note: step },
            duration,
            isChord: isChord || undefined,
          });
        }
      }
    });

    const justNotes = events.filter((e): e is NotatedNoteEvent => e.kind === "note");
    const notes = justNotes.map((e) => e.pitch.note);
    const rhythm = justNotes.map((e) => e.duration);
    const solfege = notes.map((n) => solfegeByNote[n] || "Do");

    return {
      number: Number.parseInt(measureNode.getAttribute("number") || `${idx + 1}`, 10),
      notes,
      rhythm,
      solfege,
      events,
    };
  });

  return {
    title,
    timeSignature,
    keySignature,
    clef,
    measures,
    xmlData: xmlText,
  };
}
