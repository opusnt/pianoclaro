import type { Metadata } from "next";
import { Unit2SoundDetective } from "@/components/modules/module-1/units/unit-2/Unit2SoundDetective";

export const metadata: Metadata = {
  title: "Unidad 2: Detective del sonido | Piano Claro",
  description: "Entrena tu oído y descubre las 4 propiedades principales de todo sonido musical.",
};

export default function Module1Unit2Page() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <Unit2SoundDetective />
    </div>
  );
}
