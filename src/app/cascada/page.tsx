"use client";

import { Gamepad2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LessonLayout } from "@/components/lesson/LessonLayout";
import { parseMusicXml } from "@/lib/music/musicxml-parser";
import type { ScoreMock } from "@/types/lesson";

export default function CascadaDemoPage() {
  const [score, setScore] = useState<ScoreMock | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDemo() {
      try {
        const res = await fetch("/twinkle-twinkle.musicxml");
        if (!res.ok) throw new Error("No se pudo cargar el archivo");
        const text = await res.text();
        const parsed = parseMusicXml(text);
        setScore(parsed);
      } catch (err) {
        setError("Error cargando la demo: " + err);
      }
    }
    void loadDemo();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-4xl font-bold text-blue-deep">
          <Gamepad2 className="h-10 w-10 text-sky-400" />
          Modo Cascada (Synthesia)
        </h1>
        <p className="mt-3 text-muted">
          Este es el motor de renderizado WebGL/Canvas de alto rendimiento. Presiona Reproducir y disfruta.
        </p>
      </div>

      {!score ? (
        <div className="flex h-[400px] items-center justify-center rounded-3xl border-2 border-dashed border-sky-400/30 bg-white/50">
          {error ? (
            <p className="text-red-500 font-bold">{error}</p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
              <p className="text-muted font-bold animate-pulse">Cargando motor gráfico...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto max-w-7xl">
          <LessonLayout
            lesson={{
              slug: "cascada-demo",
              moduleId: "cascada",
              order: 1,
              title: "Twinkle Twinkle Little Star",
              subtitle: "Demo técnica del Motor Cascada",
              level: "Avanzado",
              estimatedMinutes: 5,
              tempoBpm: 120,
              objective: "Disfrutar del nuevo modo de juego.",
              pedagogy: [],
              concepts: [],
              notes: [],
              practiceModes: [
                {
                  id: "jugar",
                  label: "Modo Juego",
                  description: "Intenta acertar las notas cuando lleguen al fondo.",
                },
              ],
              score: score,
              steps: [
                {
                  id: "all",
                  title: "Jugar Partitura",
                  description: "Toca las notas sincronizadas.",
                  instruction: "¡Prepárate!",
                },
              ],
            }}
            navigationBasePath="/cascada"
            navigationItemLabel="Juego"
            initialViewMode="waterfall"
          />
        </div>
      )}
    </main>
  );
}
