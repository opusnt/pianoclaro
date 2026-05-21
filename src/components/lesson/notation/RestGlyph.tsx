import type { NoteDuration } from "@/types/music";

type RestGlyphProps = {
  x: number;
  y: number;
  duration: NoteDuration;
};

export function RestGlyph({ x, y, duration }: RestGlyphProps) {
  const labelByDuration: Record<NoteDuration, string> = {
    redonda: "𝄻",
    blanca: "𝄼",
    negra: "𝄽",
    corchea: "𝄾",
  };

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="34"
      fontWeight="700"
      fill="#12345b"
      opacity="0.9"
    >
      {labelByDuration[duration]}
    </text>
  );
}
