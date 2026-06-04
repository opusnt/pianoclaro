import type { Metadata } from "next";
import { Unit8Measures } from "@/components/modules/module-1/units/unit-8/Unit8Measures";

export const metadata: Metadata = {
  title: "Unidad 8: Las cajas del ritmo | Piano Claro",
  description:
    "Descubre cómo la música se organiza temporalmente en compases, y aprende a construir un compás de 4/4.",
};

export default function Module1Unit8Page() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <Unit8Measures />
    </div>
  );
}
