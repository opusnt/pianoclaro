import type { Metadata } from "next";
import { Unit4MusicMap } from "@/components/modules/module-1/units/unit-4/Unit4MusicMap";

export const metadata: Metadata = {
  title: "Unidad 4: El mapa de la música | Piano Claro",
  description:
    "Descubre el pentagrama de forma interactiva y cómo la altura visual representa el sonido.",
};

export default function Module1Unit4Page() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <Unit4MusicMap />
    </div>
  );
}
