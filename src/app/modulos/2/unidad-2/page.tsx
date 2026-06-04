import { Unit2MusicalDistances } from "@/components/modules/module-2/units/unit-2/Unit2MusicalDistances";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unidad 2: Las distancias musicales | Piano Claro",
  description:
    "Aprende qué es un tono y un semitono, y cómo medir las distancias entre las teclas del piano.",
};

export default function Module2Unit2Page() {
  return (
    <div className="min-h-screen pb-20">
      <main className="pt-24 px-4 max-w-7xl mx-auto">
        <Unit2MusicalDistances />
      </main>
    </div>
  );
}
