"use client";

import { useEffect, useRef } from "react";
import type { ScoreNoteSelection } from "@/components/lesson/notation/types";

type OsmdRendererProps = {
  xmlData: string;
  activeNotePosition?: { measureNumber: number; noteIndex: number } | null;
  onNoteSelect?: (selection: ScoreNoteSelection) => void;
  onReady?: (osmd: any) => void;
  disableCursorSync?: boolean;
  zoom?: number;
};

export function OsmdRenderer({ xmlData, activeNotePosition, onNoteSelect, onReady, disableCursorSync, zoom = 1.0 }: OsmdRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;

    const setup = async () => {
      // Import dinámico para que Next.js no falle en SSR
      const { OpenSheetMusicDisplay } = await import("opensheetmusicdisplay");

      if (!isMounted) return;

      const osmd = new OpenSheetMusicDisplay(containerRef.current!, {
        autoResize: true,
        backend: "svg",
        drawTitle: false,
        drawSubtitle: false,
        drawComposer: false,
        drawLyricist: false,
        drawCredits: false,
        drawPartNames: false,
        drawPartAbbreviations: false,
      });

      osmdRef.current = osmd;

      try {
        await osmd.load(xmlData);
        if (isMounted) {
          osmd.zoom = zoom;
          osmd.render();
          osmd.cursor.show(); // Mostrar el cursor por defecto
          if (onReady) {
            onReady(osmd);
          }
        }
      } catch (error) {
        console.error("OSMD Error loading XML:", error);
      }
    };

    void setup();

    return () => {
      isMounted = false;
      if (osmdRef.current) {
        try {
          osmdRef.current.clear();
        } catch (e) {
          console.warn("OSMD clear error:", e);
        }
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [xmlData, onReady, zoom]);

  // Efecto para sincronizar el cursor
  useEffect(() => {
    if (disableCursorSync) return;

    if (!osmdRef.current || !activeNotePosition) {
      if (osmdRef.current) {
        osmdRef.current.cursor.hide();
      }
      return;
    }

    const osmd = osmdRef.current;
    osmd.cursor.show();
    osmd.cursor.reset();

    // En OSMD, el cursor avanza por "eventos" de tiempo.
    // Una aproximación simple es avanzar el cursor tantas veces como el noteIndex global.
    // Como activeNotePosition tiene measureNumber y noteIndex local,
    // podemos avanzar iterativamente hasta llegar a ese compás.
    try {
      while (
        !osmd.cursor.Iterator.EndReached &&
        osmd.cursor.Iterator.CurrentMeasureIndex + 1 < activeNotePosition.measureNumber
      ) {
        osmd.cursor.next();
      }
      // Ahora estamos en el compás correcto. Avanzamos dentro del compás.
      for (let i = 0; i < activeNotePosition.noteIndex; i++) {
        if (!osmd.cursor.Iterator.EndReached) {
          osmd.cursor.next();
        }
      }
    } catch (e) {
      console.warn("Error sincronizando cursor OSMD", e);
    }
  }, [activeNotePosition]);

  const handleClick = (e: React.MouseEvent) => {
    if (!osmdRef.current || !onNoteSelect) return;
    const osmd = osmdRef.current;

    try {
      const svgElement = containerRef.current?.querySelector("svg");
      if (!svgElement) return;

      // Transformar a coordenadas SVG
      const pt = svgElement.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const screenCTM = svgElement.getScreenCTM();
      if (!screenCTM) return;
      const svgP = pt.matrixTransform(screenCTM.inverse());

      // OSMD maneja coordenadas divididas por 10 (unitInPixels)
      const unit = 10.0;
      const clickPoint = { x: svgP.x / unit, y: svgP.y / unit };

      // Buscar la nota más cercana en un radio de 5 unidades OSMD
      const nearestNote = osmd.GraphicSheet.GetNearestNote(clickPoint, { x: 5, y: 5 });

      if (nearestNote?.sourceNote) {
        const sourceNote = nearestNote.sourceNote;
        const measureNumber =
          sourceNote.SourceMeasure?.MeasureNumber ||
          sourceNote.ParentStaffEntry?.ParentMeasure?.MeasureNumber ||
          sourceNote.VoiceEntry?.ParentVoiceEntry?.ParentStaffEntry?.ParentMeasure?.MeasureNumber ||
          1;

        let noteName = "C";
        const pitch = sourceNote.Pitch;
        if (pitch !== undefined && pitch !== null) {
          const stepArray = ["C", "D", "E", "F", "G", "A", "B"];
          if (typeof pitch.Step === "number") {
            noteName = stepArray[pitch.Step] || "C";
          } else {
            noteName = pitch.Step.toString();
          }
        }

        // OSMD no nos da el índice exacto tan fácil, así que lo mandamos al inicio del compás
        // o tratamos de mantener el índice actual si ya estábamos ahí
        const currentNoteIndex =
          activeNotePosition && activeNotePosition.measureNumber === measureNumber
            ? activeNotePosition.noteIndex
            : 0;

        onNoteSelect({
          measureNumber: measureNumber,
          noteIndex: currentNoteIndex,
          note: noteName as any,
        });
      } else {
        // Fallback genérico si no encontró nota cerca
        if (activeNotePosition) {
          onNoteSelect(activeNotePosition as any);
        }
      }
    } catch (err) {
      console.warn("No se pudo resolver la nota desde OSMD:", err);
      // Fallback
      if (activeNotePosition) onNoteSelect(activeNotePosition as any);
    }
  };

  return (
    <div className="w-full rounded-xl bg-white p-4 relative cursor-pointer" onClick={handleClick}>
      <div ref={containerRef} className="w-full min-h-[200px]" />
    </div>
  );
}
