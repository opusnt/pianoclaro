export type NoteName = "C" | "D" | "E" | "F" | "G" | "A" | "B";

export type SolfegeName = "Do" | "Re" | "Mi" | "Fa" | "Sol" | "La" | "Si";

export type NoteDuration = "redonda" | "blanca" | "negra" | "corchea";

export type Accidental = "natural" | "sharp" | "flat";

export type NotatedPitch = {
  note: NoteName;
  accidental?: Accidental;
  octave?: number;
};

export type NotatedNoteEvent = {
  kind: "note";
  pitch: NotatedPitch;
  duration: NoteDuration;
  isChord?: boolean;
};

export type NotatedRestEvent = {
  kind: "rest";
  duration: NoteDuration;
};

export type MeasureEvent = NotatedNoteEvent | NotatedRestEvent;
