import type { Metadata } from "next";
import { Unit4AccidentalNotation } from "@/components/modules/module-2/units/unit-4/Unit4AccidentalNotation";

export const metadata: Metadata = {
  title: "Unidad 4: Alteraciones accidentales | Piano Claro",
  description: "Aprende a leer y tocar alteraciones que aparecen temporalmente en un compás.",
};

export default function Unit4Page() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Unit4AccidentalNotation />
    </div>
  );
}
