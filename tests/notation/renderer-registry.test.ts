import assert from "node:assert/strict";
import test from "node:test";

import { getNotationRenderer } from "@/components/lesson/notation/renderer-registry";
import { PianoClaroSvgRenderer } from "@/components/lesson/notation/renderers/PianoClaroSvgRenderer";

test("usa el renderer SVG actual como implementación por defecto", () => {
  assert.equal(getNotationRenderer(), PianoClaroSvgRenderer);
});
