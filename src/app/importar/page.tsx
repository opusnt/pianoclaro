"use client";

import { FileUp, Music2 } from "lucide-react";
import { useRef, useState } from "react";
import { LessonLayout } from "@/components/lesson/LessonLayout";
import { parseMusicXml } from "@/lib/music/musicxml-parser";
import type { ScoreMock } from "@/types/lesson";

export default function ImportXmlPage() {
  const [score, setScore] = useState<ScoreMock | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.name.endsWith(".xml") && !file.name.endsWith(".musicxml")) {
      setError("Por favor, sube un archivo .xml o .musicxml válido.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseMusicXml(text);
        setScore(parsed);
      } catch (_err) {
        setError("Ocurrió un error al leer la partitura. Asegúrate de que es un MusicXML válido.");
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-4xl font-bold text-blue-deep">
          <Music2 className="h-10 w-10 text-gold-soft" />
          Importador MusicXML
        </h1>
        <p className="mt-3 text-muted">
          Trae tus propias partituras desde MuseScore, Sibelius o Finale y pruébalas en nuestro
          motor de renderizado inteligente.
        </p>
      </div>

      {!score ? (
        // biome-ignore lint/a11y/useSemanticElements: Needs to be a div because it wraps an input type="file"
        <div
          className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-16 transition-colors ${
            isDragging
              ? "border-gold-soft bg-gold-soft/10"
              : "border-blue-deep/20 bg-white/50 hover:bg-white/80"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              fileInputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
        >
          <FileUp className="mb-4 h-16 w-16 text-blue-deep/50" />
          <h3 className="text-xl font-bold text-blue-deep">Arrastra tu archivo MusicXML aquí</h3>
          <p className="mt-2 text-sm text-muted">
            O haz clic para explorar en tu computadora (.xml, .musicxml)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xml,.musicxml"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          {error && <p className="mt-4 font-semibold text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="mx-auto max-w-7xl">
          <LessonLayout
            lesson={{
              slug: "import",
              moduleId: "import",
              order: 1,
              title: score.title,
              subtitle: "Partitura importada desde MusicXML",
              level: "Avanzado",
              estimatedMinutes: 5,
              tempoBpm: 120,
              objective: "Tocar la partitura importada.",
              pedagogy: [],
              concepts: [],
              notes: [],
              practiceModes: [
                {
                  id: "practicar",
                  label: "Práctica libre",
                  description: "Toca las notas libremente.",
                },
              ],
              score: score,
              steps: [
                {
                  id: "all",
                  title: "Practicar Todo",
                  description: "Toca la partitura de inicio a fin.",
                  instruction: "Sigue las notas",
                },
              ],
            }}
            navigationBasePath="/importar"
            navigationItemLabel="Partitura"
            completionReturnHref="/importar"
            completionReturnLabel="Importar otra"
          />
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setScore(null)}
              className="rounded-xl bg-blue-soft px-6 py-3 font-bold text-blue-deep shadow-soft transition hover:bg-blue-soft/80"
            >
              Importar otro archivo
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
