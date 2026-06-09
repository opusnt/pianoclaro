import os

os.makedirs('src/lib/modules', exist_ok=True)
os.makedirs('src/app/teoria/[moduleId]/unidad/[unitId]', exist_ok=True)
os.makedirs('src/data', exist_ok=True)

# 1. theory-registry.tsx
with open('src/lib/modules/theory-registry.tsx', 'w') as f:
    f.write("""import type { ReactNode } from "react";
import { Unit1SoundVsNoise } from "@/components/modules/module-1/units/unit-1/Unit1SoundVsNoise";
import { Unit2SoundDetective } from "@/components/modules/module-1/units/unit-2/Unit2SoundDetective";
import { Unit3MusicPillars } from "@/components/modules/module-1/units/unit-3/Unit3MusicPillars";
import { Unit4MusicMap } from "@/components/modules/module-1/units/unit-4/Unit4MusicMap";
import { Unit5MeetTheNotes } from "@/components/modules/module-1/units/unit-5/Unit5MeetTheNotes";
import { Unit6TrebleClef } from "@/components/modules/module-1/units/unit-6/Unit6TrebleClef";
import { Unit7TimeAndRhythm } from "@/components/modules/module-1/units/unit-7/Unit7TimeAndRhythm";
import { Unit8Measures } from "@/components/modules/module-1/units/unit-8/Unit8Measures";
import { Unit9ExtendedNotes } from "@/components/modules/module-1/units/unit-9/Unit9ExtendedNotes";

import { Unit1KeyboardMap } from "@/components/modules/module-2/units/unit-1/Unit1KeyboardMap";
import { Unit2MusicalDistances } from "@/components/modules/module-2/units/unit-2/Unit2MusicalDistances";
import { Unit3Accidentals } from "@/components/modules/module-2/units/unit-3/Unit3Accidentals";
import { Unit4AccidentalNotation } from "@/components/modules/module-2/units/unit-4/Unit4AccidentalNotation";

export const THEORY_REGISTRY: Record<string, Record<string, () => ReactNode>> = {
  "1": {
    "1": () => <Unit1SoundVsNoise />,
    "2": () => <Unit2SoundDetective />,
    "3": () => <Unit3MusicPillars />,
    "4": () => <Unit4MusicMap />,
    "5": () => <Unit5MeetTheNotes />,
    "6": () => <Unit6TrebleClef />,
    "7": () => <Unit7TimeAndRhythm />,
    "8": () => <Unit8Measures />,
    "9": () => <Unit9ExtendedNotes />,
  },
  "2": {
    "1": () => <Unit1KeyboardMap />,
    "2": () => <Unit2MusicalDistances />,
    "3": () => <Unit3Accidentals />,
    "4": () => <Unit4AccidentalNotation />,
  }
};
""")

# 2. Dynamic Route for Unit
with open('src/app/teoria/[moduleId]/unidad/[unitId]/page.tsx', 'w') as f:
    f.write("""import { THEORY_REGISTRY } from "@/lib/modules/theory-registry";
import { notFound } from "next/navigation";

export default function TheoryUnitPage({ params }: { params: { moduleId: string; unitId: string } }) {
  const moduleRegistry = THEORY_REGISTRY[params.moduleId];
  if (!moduleRegistry) return notFound();

  const UnitComponent = moduleRegistry[params.unitId];
  if (!UnitComponent) return notFound();

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <UnitComponent />
    </div>
  );
}
""")

# 3. Data for Theory Modules index pages
with open('src/data/theory-modules.ts', 'w') as f:
    f.write("""import { Music, BookOpen, PlayCircle, GraduationCap } from "lucide-react";

export const THEORY_MODULES = {
  "1": {
    title: "Fundamentos de la Música",
    description: "Tu viaje musical comienza aquí. Desde entender la diferencia entre ruido y sonido, hasta leer tus primeras notas y ritmos en el pentagrama.",
    theme: "sky",
    finalProject: {
      id: "9",
      title: "Entrenamiento y Ligaduras",
      description: "Consolida todo lo aprendido: altura, ritmo, notas, silencios y ligaduras en ejercicios prácticos e interactivos.",
      icon: GraduationCap,
      href: "/teoria/1/unidad-9"
    },
    units: [
      { id: 1, title: "Sonido Musical y Ruido", desc: "Aprende a diferenciar ruido de música.", icon: Music },
      { id: 2, title: "Propiedades del Sonido", desc: "Altura, intensidad, duración y timbre.", icon: BookOpen },
      { id: 3, title: "Melodía, Armonía y Ritmo", desc: "Los tres pilares fundamentales de la música.", icon: PlayCircle },
      { id: 4, title: "El Pentagrama", desc: "Tu mapa musical de 5 líneas.", icon: BookOpen },
      { id: 5, title: "Las Notas Musicales", desc: "Conoce el abecedario musical.", icon: Music },
      { id: 6, title: "Clave de Sol", desc: "Lectura básica en el pentagrama.", icon: PlayCircle },
      { id: 7, title: "Duración y Pulso", desc: "Figuras rítmicas y el latido de la música.", icon: BookOpen },
      { id: 8, title: "Compases", desc: "Organización temporal de la música.", icon: Music },
    ]
  },
  "2": {
    title: "Moverse por el teclado",
    description: "Conecta la lectura musical con la ejecución física. Entiende la topografía del piano, tonos, semitonos y alteraciones.",
    theme: "purple",
    finalProject: null,
    units: [
      { id: 1, title: "El mapa del teclado", desc: "Explora la topografía de teclas blancas y negras.", icon: Music },
      { id: 2, title: "Las distancias musicales", desc: "Descubre los semitonos y tonos de forma práctica.", icon: BookOpen },
      { id: 3, title: "Notas que se mueven", desc: "Introducción interactiva a las alteraciones.", icon: PlayCircle },
      { id: 4, title: "Alteraciones en la partitura", desc: "Aprende a leer alteraciones en el pentagrama.", icon: BookOpen },
    ]
  }
} as const;
""")

# 4. Dynamic Route for Module Index
with open('src/app/teoria/[moduleId]/page.tsx', 'w') as f:
    f.write("""import { THEORY_MODULES } from "@/data/theory-modules";
import { ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function TheoryModuleIndex({ params }: { params: { moduleId: string } }) {
  const moduleData = THEORY_MODULES[params.moduleId as keyof typeof THEORY_MODULES];
  if (!moduleData) return notFound();

  const isSky = moduleData.theme === "sky";
  const themeColors = isSky ? {
    bgLight: "bg-sky-900/20",
    textLight: "text-sky-400",
    bgDark: "bg-sky-950",
    hoverIcon: "group-hover:bg-sky-950 group-hover:text-sky-400",
  } : {
    bgLight: "bg-purple-900/20",
    textLight: "text-purple-400",
    bgDark: "bg-purple-950",
    hoverIcon: "group-hover:bg-purple-950 group-hover:text-purple-400",
  };

  return (
    <main className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/teoria"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Volver al Hub de Teoría
        </Link>

        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-800 mb-10 relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-96 h-96 ${themeColors.bgLight} rounded-full blur-3xl -mr-20 -mt-20 opacity-60`} />
          <div className="relative z-10">
            <span className={`inline-block px-4 py-1.5 rounded-full ${themeColors.bgDark} ${themeColors.textLight} font-bold text-sm mb-4`}>
              Módulo {params.moduleId}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              {moduleData.title}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mb-8">
              {moduleData.description}
            </p>
            <Link
              href={`/teoria/${params.moduleId}/unidad-1`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-2xl transition-transform active:scale-95 shadow-lg"
            >
              <PlayCircle className="w-5 h-5 fill-current" />
              Comenzar desde cero
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-black text-white mb-6 px-2">Unidades del Módulo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {moduleData.units.map((unit) => {
            const Icon = unit.icon;
            return (
              <Link
                key={unit.id}
                href={`/teoria/${params.moduleId}/unidad/${unit.id}`}
                className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 transition-all group flex items-start gap-4"
              >
                <div className={`w-12 h-12 shrink-0 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 transition-colors ${themeColors.hoverIcon}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-600 mb-1">Unidad {unit.id}</div>
                  <h3 className="font-bold text-white text-lg mb-1">{unit.title}</h3>
                  <p className="text-sm text-slate-400 leading-snug">{unit.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {moduleData.finalProject && (
          <Link
            href={moduleData.finalProject.href}
            className="block w-full bg-gradient-to-br from-fuchsia-900 to-fuchsia-950 rounded-[2rem] p-8 md:p-10 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white max-w-xl">
                <div className="flex items-center gap-2 mb-3 opacity-90">
                  <moduleData.finalProject.icon className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-wide uppercase">
                    Unidad {moduleData.finalProject.id} • Proyecto Final
                  </span>
                </div>
                <h2 className="text-3xl font-black mb-3">{moduleData.finalProject.title}</h2>
                <p className="text-fuchsia-100 text-lg">
                  {moduleData.finalProject.description}
                </p>
              </div>
              <div className="shrink-0 bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center text-white font-bold group-hover:bg-white group-hover:text-fuchsia-600 transition-colors">
                Ir al Entrenamiento →
              </div>
            </div>
          </Link>
        )}
      </div>
    </main>
  );
}
""")

print("Dynamic routes created successfully")
