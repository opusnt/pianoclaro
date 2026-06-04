import type { Metadata } from "next";
import { Unit1SoundVsNoise } from "@/components/modules/module-1/units/unit-1/Unit1SoundVsNoise";

export const metadata: Metadata = {
  title: "Unidad 1: ¿Qué es la música? | Piano Claro",
  description:
    "Aprende a distinguir entre sonido musical y ruido en tu primer paso hacia el mundo de la música.",
};

export default function Module1Unit1Page() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <Unit1SoundVsNoise />
    </div>
  );
}
