import assert from "node:assert/strict";
import test from "node:test";

import { getStaffPosition } from "@/lib/music/staff-position";

const staffTopY = 40;
const rowHeight = 10;

test("ubica Mi en la primera línea inferior de clave de sol", () => {
  const mi = getStaffPosition({ note: "E", clef: "treble", staffTopY, rowHeight });

  assert.equal(mi.rowOffset, 8);
  assert.equal(mi.y, 120);
  assert.equal(mi.needsLedgerLine, false);
});

test("ubica Do central bajo el pentagrama con línea adicional", () => {
  const doCentral = getStaffPosition({ note: "C", clef: "treble", staffTopY, rowHeight });

  assert.equal(doCentral.rowOffset, 10);
  assert.equal(doCentral.y, 140);
  assert.equal(doCentral.needsLedgerLine, true);
  assert.equal(doCentral.ledgerY, 140);
});
