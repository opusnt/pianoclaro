import type { NoteDuration } from "@/types/music";

type NoteGlyphProps = {
  x: number;
  y: number;
  duration: NoteDuration;
  active?: boolean;
  playback?: boolean;
};

const normalFill = "#12345b";
const activeFill = "#d7b46a";
const activeStroke = "#77561a";

export function NoteGlyph({ x, y, duration, active = false, playback = false }: NoteGlyphProps) {
  const fill = active ? activeFill : normalFill;
  const shapeStroke = active ? activeStroke : fill;
  const shapeStrokeWidth = active ? 2 : 0;
  const glyph = noteGlyphs[duration];

  return (
    <g transform={`translate(${x} ${y})`}>
      {playback ? <circle cx="0" cy="0" r="24" fill={activeFill} opacity="0.28" /> : null}

      <g transform={`translate(0 ${glyph.anchorOffsetY ?? 0})`}>
        <path
          d={glyph.path}
          fill={fill}
          fillRule="evenodd"
          stroke={shapeStroke}
          strokeWidth={shapeStrokeWidth}
          strokeLinejoin="round"
          transform={glyph.transform}
        />
      </g>
    </g>
  );
}

const wholeNotePath = [
  "M -34 -4",
  "C -38 -16 -25 -29 -6 -34",
  "C 13 -39 31 -33 35 -20",
  "C 39 -8 26 6 7 12",
  "C -13 18 -31 10 -34 -4",
  "Z",
  "M -23 -5",
  "C -21 2 -10 4 3 0",
  "C 17 -4 26 -12 24 -19",
  "C 22 -25 10 -27 -3 -23",
  "C -17 -19 -25 -11 -23 -5",
  "Z",
].join(" ");

const halfNotePath = [
  "M 11 -72",
  "C 11 -75 13 -77 16 -77",
  "L 20 -77",
  "C 22 -77 24 -75 24 -72",
  "L 24 -11",
  "C 24 -5 20 0 14 4",
  "C 8 10 -2 15 -13 16",
  "C -30 18 -42 10 -44 -3",
  "C -46 -15 -33 -28 -14 -33",
  "C -1 -37 11 -31 14 -21",
  "L 14 -72",
  "Z",
  "M -33 -4",
  "C -31 4 -19 7 -5 3",
  "C 10 -1 21 -10 20 -19",
  "C 18 -27 5 -30 -10 -25",
  "C -25 -20 -35 -11 -33 -4",
  "Z",
].join(" ");

const quarterNotePath =
  "M258 96 H273 V442 C273 470 253 499 221 516 C180 538 139 533 130 506 C121 480 147 446 188 427 C221 412 248 416 258 430 Z";

const eighthNotePath =
  "M256 86 C256 84 258 83 260 83 L270 83 C273 83 275 85 275 88 L275 112 C277 139 287 159 306 177 C324 194 348 211 363 233 C389 271 386 325 359 391 C355 400 350 408 345 416 C343 419 339 419 337 417 C335 415 335 412 337 409 C354 372 361 335 356 304 C351 270 333 245 305 224 C292 214 281 206 275 196 L275 421 C275 449 255 478 221 496 C184 516 143 515 125 494 C112 479 112 457 125 438 C137 421 157 408 181 402 C213 394 244 401 256 421 Z";

const noteGlyphs: Record<
  NoteDuration,
  { path: string; transform: string; anchorOffsetY?: number }
> = {
  redonda: { path: wholeNotePath, transform: "scale(0.72 0.82)" },
  blanca: { path: halfNotePath, transform: "scale(0.68 0.86) translate(10 16)" },
  negra: {
    path: quarterNotePath,
    transform: "scale(0.22) translate(-196 -482)",
    anchorOffsetY: 2,
  },
  corchea: {
    path: eighthNotePath,
    transform: "scale(0.22) translate(-196 -462)",
    anchorOffsetY: 2,
  },
};
