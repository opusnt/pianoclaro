import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Piano Claro - Aprende piano leyendo música";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(to bottom right, #0F172A, #1E3A8A)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "sans-serif",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "80px",
          fontWeight: "bold",
          letterSpacing: "-0.05em",
          marginBottom: "20px",
          color: "#FCD34D", // text-gold-soft
        }}
      >
        Piano Claro
      </h1>
      <p
        style={{
          fontSize: "40px",
          textAlign: "center",
          maxWidth: "800px",
          lineHeight: 1.4,
          color: "#E2E8F0",
        }}
      >
        Aprende piano leyendo música desde el primer día
      </p>
    </div>,
    {
      ...size,
    },
  );
}
