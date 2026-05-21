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

export function NoteGlyph({
  x,
  y,
  duration,
  active = false,
  playback = false,
}: NoteGlyphProps) {
  const fill = active ? activeFill : normalFill;
  const headStroke = active ? activeStroke : normalFill;
  const isOpenHead = duration === "redonda" || duration === "blanca";
  const hasStem = duration !== "redonda";

  return (
    <g transform={`translate(${x} ${y})`}>
      {playback ? <circle cx="0" cy="0" r="24" fill={activeFill} opacity="0.28" /> : null}

      {hasStem ? (
        <path
          d={[
            "M 11 -68",
            "L 16 -68",
            "L 16 -5",
            "C 14 -2 12 0 10 1",
            "L 10 -7",
            "C 10 -8 10 -9 11 -10",
            "Z",
          ].join(" ")}
          fill={fill}
        />
      ) : null}

      <ellipse
        cx="-4"
        cy="0"
        rx="18"
        ry="12"
        transform="rotate(-18 -4 0)"
        fill={isOpenHead ? "#fbf8ef" : fill}
        stroke={headStroke}
        strokeWidth={isOpenHead ? "4" : "1.8"}
      />

      {duration === "corchea" ? (
        <path d="M 15 -67 C 31 -58 31 -39 16 -27" fill="none" stroke={fill} strokeWidth="5" />
      ) : null}
    </g>
  );
}
