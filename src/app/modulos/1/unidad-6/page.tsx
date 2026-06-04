import type { Metadata } from "next";
import { Unit6TrebleClef } from "@/components/modules/module-1/units/unit-6/Unit6TrebleClef";

export const metadata: Metadata = {
  title: "Unidad 6: La Clave de Sol | Piano Claro",
  description: "Aprende para qué sirve la Clave de Sol y úsala como mapa.",
};

export default function Module1Unit6Page() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <Unit6TrebleClef />
    </div>
  );
}
