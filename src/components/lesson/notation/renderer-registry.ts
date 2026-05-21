import { PianoClaroSvgRenderer } from "@/components/lesson/notation/renderers/PianoClaroSvgRenderer";
import type { NotationRenderer } from "@/components/lesson/notation/types";

export type NotationRendererKind = "piano-claro-svg";

const notationRenderers: Record<NotationRendererKind, NotationRenderer> = {
  "piano-claro-svg": PianoClaroSvgRenderer,
};

export function getNotationRenderer(kind: NotationRendererKind = "piano-claro-svg") {
  return notationRenderers[kind];
}
