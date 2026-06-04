import type { Metadata } from "next";
import { Unit3Accidentals } from "@/components/modules/module-2/units/unit-3/Unit3Accidentals";

export const metadata: Metadata = {
  title: "Unidad 3: Notas que se mueven | Piano Claro",
  description:
    "Descubre qué son los sostenidos, bemoles y becuadros y cómo cambian el sonido en el teclado.",
};

export default function Unit3Page() {
  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 md:px-8">
      <Unit3Accidentals />
    </div>
  );
}
