import type { Metadata } from "next";
import { Unit3MusicPillars } from "@/components/modules/module-1/units/unit-3/Unit3MusicPillars";

export const metadata: Metadata = {
  title: "Unidad 3: Los tres pilares | Piano Claro",
  description: "Descubre los tres pilares de la música: melodía, armonía y ritmo.",
};

export default function Module1Unit3Page() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <Unit3MusicPillars />
    </div>
  );
}
