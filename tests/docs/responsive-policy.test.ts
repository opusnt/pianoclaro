import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const policy = readFileSync("docs/responsive-policy.md", "utf8");
const globals = readFileSync("src/app/globals.css", "utf8");

test("la política responsive documenta las reglas operativas", () => {
  [
    "mobile first",
    ".responsive-scroll",
    "scroll horizontal global",
    "teclas negras",
    "390px",
    "document.documentElement.scrollWidth <= window.innerWidth + 2",
    "No depender solo del color",
    "tests/responsive/static-responsive-guards.test.ts",
    "overflow-x-auto",
    "min-w-[...]",
  ].forEach((requiredText) => {
    assert.equal(
      policy.includes(requiredText),
      true,
      `Falta en responsive-policy: ${requiredText}`,
    );
  });
});

test("la base CSS expone las defensas responsive globales", () => {
  [
    "overflow-x: clip",
    "text-size-adjust: 100%",
    ".responsive-scroll",
    "overscroll-behavior-x: contain",
    "-webkit-overflow-scrolling: touch",
  ].forEach((requiredText) => {
    assert.equal(globals.includes(requiredText), true, `Falta en globals.css: ${requiredText}`);
  });
});
