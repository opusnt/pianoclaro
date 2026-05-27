import { getNotationRenderer } from "@/components/lesson/notation/renderer-registry";
import type { NotationRendererProps } from "@/components/lesson/notation/types";

export function NotationViewer(props: NotationRendererProps) {
  const Renderer = getNotationRenderer();

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
