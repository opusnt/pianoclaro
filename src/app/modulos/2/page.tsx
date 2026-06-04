import { ArrowLeft, BookOpen, GraduationCap, Music, PlayCircle } from "lucide-react";
import Link from "next/link";
import { module2Config } from "@/components/modules/module-2/moduleConfig";
import { SiteHeader } from "@/components/SiteHeader";

export default function Modulo2Index() {
  const { title, description, units } = module2Config;

  const getIcon = (id: string) => {
    if (id === "unit-1" || id === "unit-10") return PlayCircle;
    if (id === "unit-2" || id === "unit-3") return BookOpen;
    return Music;
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <main className="pt-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/modulos"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Volver a Módulos
          </Link>

          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-800 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl -mr-20 -mt-20 opacity-60" />
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-950 text-emerald-400 font-bold text-sm mb-4">
                Módulo 2
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6">{title}</h1>
              <p className="text-lg text-slate-400 max-w-2xl mb-8">{description}</p>
              <Link
                href="/modulos/2/unidad-1"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-2xl transition-transform active:scale-95 shadow-lg"
              >
                <PlayCircle className="w-5 h-5 fill-current" />
                Comenzar Módulo 2
              </Link>
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-6 px-2">Unidades del Módulo</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {units.map((unit, index) => {
              const Icon = getIcon(unit.id);
              const unitNum = index + 1;
              const isAvailable = unit.isAvailable;

              if (unitNum === 10) return null; // Render final project separately

              return (
                <Link
                  key={unit.id}
                  href={isAvailable ? `/modulos/2/unidad-${unitNum}` : "#"}
                  className={`bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-start gap-4 transition-all
                    ${isAvailable ? "hover:shadow-md hover:border-slate-700 group cursor-pointer" : "opacity-50 grayscale pointer-events-none"}
                  `}
                >
                  <div
                    className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-colors
                    ${isAvailable ? "bg-slate-800 text-slate-500 group-hover:bg-emerald-950 group-hover:text-emerald-400" : "bg-slate-800/50 text-slate-600"}
                  `}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-600 mb-1">Unidad {unitNum}</div>
                    <h3 className="font-bold text-white text-lg mb-1">{unit.title}</h3>
                    <p className="text-sm text-slate-400 leading-snug">{unit.description}</p>
                    {!isAvailable && (
                      <span className="inline-block mt-3 text-xs font-bold text-slate-500 uppercase">
                        Próximamente
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mastery Review Highlight */}
          <Link
            href={units[9].isAvailable ? "/modulos/2/unidad-10" : "#"}
            className={`block w-full bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-[2rem] p-8 md:p-10 shadow-xl transition-all relative overflow-hidden group
            ${units[9].isAvailable ? "hover:shadow-2xl hover:scale-[1.01]" : "opacity-50 grayscale cursor-not-allowed"}
          `}
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white max-w-xl">
                <div className="flex items-center gap-2 mb-3 opacity-90">
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-wide uppercase">
                    Unidad 10 • {units[9].title}
                  </span>
                </div>
                <h2 className="text-3xl font-black mb-3">Pieza a dos manos</h2>
                <p className="text-emerald-100 text-lg">{units[9].description}</p>
                {!units[9].isAvailable && (
                  <span className="inline-block mt-4 text-sm font-bold text-emerald-500/50 uppercase tracking-widest bg-emerald-950/50 px-3 py-1 rounded-full">
                    Próximamente
                  </span>
                )}
              </div>
              {units[9].isAvailable && (
                <div className="shrink-0 bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center text-white font-bold group-hover:bg-white group-hover:text-emerald-600 transition-colors">
                  Ir al Proyecto →
                </div>
              )}
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
