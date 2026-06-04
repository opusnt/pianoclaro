import type { Metadata } from "next";
import { Unit9ExtendedNotes } from "@/components/modules/module-1/units/unit-9/Unit9ExtendedNotes";

export const metadata: Metadata = {
  title: "Unidad 9: Notas que duran más | Piano Claro",
  description:
    "Descubre cómo extender la duración de las notas musicales usando ligaduras y puntillos. Incluye el Proyecto Final del Módulo 1.",
};

export default function Unit9Page() {
  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6">
      <Unit9ExtendedNotes />
    </main>
  );
}
