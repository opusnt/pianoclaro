const fs = require("fs");
const path = require("path");

const unitsDir = path.join(__dirname, "src/components/modules/module-1/units");

const replacements = [
  { from: /bg-slate-900\/60/g, to: "bg-slate-100/60" },
  { from: /bg-slate-900/g, to: "bg-white" },
  { from: /bg-slate-950/g, to: "bg-slate-50" },
  { from: /border-slate-800/g, to: "border-slate-100" },
  { from: /border-slate-700/g, to: "border-slate-200" },
  { from: /text-slate-400/g, to: "text-slate-500" },
  { from: /text-slate-300/g, to: "text-slate-600" },
  { from: /text-slate-200/g, to: "text-slate-800" },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      let modified = false;

      // RUN ON UNITS 1, 2, 3 ONLY NOW, just to fix their leftovers.
      if (
        fullPath.includes("unit-1") ||
        fullPath.includes("unit-2") ||
        fullPath.includes("unit-3")
      ) {
        for (const { from, to } of replacements) {
          if (from.test(content)) {
            content = content.replace(from, to);
            modified = true;
          }
        }

        if (modified) {
          fs.writeFileSync(fullPath, content, "utf8");
          console.log(`Fixed leftovers: ${fullPath}`);
        }
      }
    }
  }
}

processDir(unitsDir);
console.log("Done fixing leftovers for Units 1-3!");
