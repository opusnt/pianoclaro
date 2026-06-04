import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

const SOURCE_ROOTS = ["src/app", "src/components"];

const DIRECT_OVERFLOW_ALLOWLIST = new Set(["src/components/SiteHeader.tsx"]);

const LARGE_MIN_WIDTH_ALLOWLIST = new Set([
  "src/components/lesson/notation/renderers/PianoClaroSvgRenderer.tsx",
]);

const RAW_FIXED_ALLOWLIST = new Set(["src/components/lesson/LessonCompleteModal.tsx"]);

function getTsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return getTsxFiles(fullPath);
    }

    return fullPath.endsWith(".tsx") ? [fullPath] : [];
  });
}

const files = SOURCE_ROOTS.flatMap(getTsxFiles).map((file) => ({
  path: relative(process.cwd(), file),
  source: readFileSync(file, "utf8"),
}));

test("las superficies nuevas no usan overflow-x-auto fuera del patrón responsive", () => {
  const offenders = files
    .filter(({ source }) => source.includes("overflow-x-auto"))
    .map(({ path }) => path)
    .filter((path) => !DIRECT_OVERFLOW_ALLOWLIST.has(path));

  assert.deepEqual(
    offenders,
    [],
    `Usar .responsive-scroll en lugar de overflow-x-auto directo: ${offenders.join(", ")}`,
  );
});

test("los anchos mínimos grandes viven dentro de una superficie responsive", () => {
  const offenders = files
    .filter(({ source }) => /min-w-\[(\d{3,})px\]/.test(source))
    .filter(
      ({ source, path }) =>
        !source.includes("responsive-scroll") && !LARGE_MIN_WIDTH_ALLOWLIST.has(path),
    )
    .map(({ path }) => path);

  assert.deepEqual(
    offenders,
    [],
    `Los min-w grandes deben estar dentro de .responsive-scroll: ${offenders.join(", ")}`,
  );
});

test("no se agregan layouts sticky/fixed globales sin revisión responsive", () => {
  const stickyOffenders = files
    .filter(
      ({ source, path }) =>
        source.includes("sticky top-") && path !== "src/components/SiteHeader.tsx",
    )
    .map(({ path }) => path);

  const fixedOffenders = files
    .filter(({ source }) => source.includes("fixed inset"))
    .map(({ path }) => path)
    .filter((path) => !RAW_FIXED_ALLOWLIST.has(path));

  assert.deepEqual(
    stickyOffenders,
    [],
    `Sticky global no permitido antes de revisar mobile: ${stickyOffenders.join(", ")}`,
  );
  assert.deepEqual(
    fixedOffenders,
    [],
    `Fixed global requiere allowlist responsive: ${fixedOffenders.join(", ")}`,
  );
});

test("no se usa h-screen en experiencias educativas largas", () => {
  const offenders = files
    .filter(({ source }) => source.includes("h-screen"))
    .map(({ path }) => path);

  assert.deepEqual(
    offenders,
    [],
    `Usar min-h-screen o layout flexible en vez de h-screen: ${offenders.join(", ")}`,
  );
});

test("las lecciones no pasan a layout de escritorio en iPad landscape", () => {
  const lessonLayout = files.find(({ path }) => path === "src/components/lesson/LessonLayout.tsx");
  const lessonSidebar = files.find(
    ({ path }) => path === "src/components/lesson/LessonSidebar.tsx",
  );

  assert.ok(lessonLayout, "No se encontró LessonLayout.tsx");
  assert.ok(lessonSidebar, "No se encontró LessonSidebar.tsx");
  assert.equal(
    lessonLayout.source.includes("lg:grid-cols-[280px_minmax(0,1fr)]"),
    false,
    "Las lecciones deben apilarse en tablet; usar xl:grid-cols para sidebar + práctica.",
  );
  assert.equal(
    lessonSidebar.source.includes("lg:sticky"),
    false,
    "El sidebar sticky de lecciones debe activarse desde xl, no desde lg.",
  );
});
