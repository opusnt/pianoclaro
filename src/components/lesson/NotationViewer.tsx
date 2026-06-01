import { getNotationRenderer } from "@/components/lesson/notation/renderer-registry";
import { OsmdRenderer } from "@/components/lesson/notation/renderers/OsmdRenderer";
import { WaterfallRenderer } from "@/components/lesson/notation/renderers/WaterfallRenderer";
import type { NotationRendererProps } from "@/components/lesson/notation/types";
import { useState } from "react";

type NotationViewerProps = NotationRendererProps & {
  initialViewMode?: "professional" | "didactic" | "waterfall";
};

export function NotationViewer(props: NotationViewerProps) {
  const Renderer = getNotationRenderer();
  const [viewMode, setViewMode] = useState<"professional" | "didactic" | "waterfall">(props.initialViewMode || "professional");

  if (props.score.xmlData) {
    return (
      <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-3 shadow-[0_12px_30px_rgba(18,52,91,0.08)] sm:p-5">
        <div className="flex flex-col gap-4 border-b border-blue-deep/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-muted">Laboratorio de Partituras</p>
            <h2 className="text-xl font-bold text-blue-deep sm:text-2xl">{props.score.title}</h2>
          </div>
          
          <div className="flex bg-slate-100 rounded-lg p-1 self-start sm:self-auto overflow-x-auto max-w-full">
            <button 
              onClick={() => setViewMode("professional")}
              className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors whitespace-nowrap ${viewMode === "professional" ? "bg-white text-blue-deep shadow-sm" : "text-muted hover:text-blue-deep"}`}
            >
              OSMD
            </button>
            <button 
              onClick={() => setViewMode("didactic")}
              className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors whitespace-nowrap ${viewMode === "didactic" ? "bg-white text-blue-deep shadow-sm" : "text-muted hover:text-blue-deep"}`}
            >
              Didáctica
            </button>
            <button 
              onClick={() => setViewMode("waterfall")}
              className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors whitespace-nowrap ${viewMode === "waterfall" ? "bg-white text-blue-deep shadow-sm" : "text-muted hover:text-blue-deep"}`}
            >
              Cascada 🎮
            </button>
          </div>
        </div>
        <div className="mt-4">
          {viewMode === "professional" ? (
            <OsmdRenderer 
              xmlData={props.score.xmlData} 
              activeNotePosition={props.activeNotePosition}
              onNoteSelect={props.onNoteSelect}
            />
          ) : viewMode === "waterfall" ? (
            <WaterfallRenderer {...props} />
          ) : (
            <div className="responsive-scroll">
              <Renderer {...props} />
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-blue-deep/10 bg-white/85 p-3 shadow-[0_12px_30px_rgba(18,52,91,0.08)] sm:p-5">
      <div className="flex flex-col gap-2 border-b border-blue-deep/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-muted">Partitura guiada</p>
          <h2 className="text-xl font-bold text-blue-deep sm:text-2xl">{props.score.title}</h2>
        </div>
        <p className="text-sm font-bold text-muted">
          {props.score.keySignature} · {props.score.timeSignature}
          {props.practiceSong ? ` · ${props.practiceSong.config.tempoBpm} BPM` : ""}
        </p>
      </div>

      <div className="responsive-scroll mt-4">
        {/* TODO: agregar VexFlowRenderer y seleccionarlo desde esta frontera cuando se implemente notación real. */}
        <Renderer {...props} />
      </div>
    </section>
  );
}
