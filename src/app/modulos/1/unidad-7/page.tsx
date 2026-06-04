import type { Metadata } from "next";
import { Unit7TimeAndRhythm } from "@/components/modules/module-1/units/unit-7/Unit7TimeAndRhythm";

export const metadata: Metadata = {
  title: "Unidad 7: El tiempo de las notas | Piano Claro",
  description:
    "Descubre el pulso, y aprende a leer figuras rítmicas como redondas, blancas y negras.",
};

export default function Module1Unit7Page() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <Unit7TimeAndRhythm />
    </div>
  );
}
