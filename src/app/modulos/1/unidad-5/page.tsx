import type { Metadata } from "next";
import { Unit5MeetTheNotes } from "@/components/modules/module-1/units/unit-5/Unit5MeetTheNotes";

export const metadata: Metadata = {
  title: "Unidad 5: Las notas musicales | Piano Claro",
  description: "Conoce a DO, RE, MI, FA, SOL, LA y SI de forma visual e interactiva.",
};

export default function Module1Unit5Page() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <Unit5MeetTheNotes />
    </div>
  );
}
