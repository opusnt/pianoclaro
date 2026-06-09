import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default function TeoriaIndexPage() {
  return (
    <main className="min-h-screen bg-[#070b14] text-slate-200 pb-24 md:pb-12">
      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-blue-900/20 to-transparent">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-sm mb-4 border border-blue-500/30">
            <BookOpen className="w-4 h-4" />
            <span>Fundamentos de la Música</span>
          </div>
          <h1 className="text-4xl font-black text-white sm:text-5xl tracking-tight mb-4">
            Módulos de Teoría
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Aprende a leer y comprender el lenguaje musical. Aquí no evaluamos tu destreza técnica
            en el teclado, sino tu comprensión de los conceptos.
          </p>
        </div>
      </section>

      {/* Lista de Módulos */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Módulo 1 */}
          <Link
            href="/teoria/1"
            className="block group relative overflow-hidden bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 rounded-[2.5rem] p-8 md:p-10 transition-all shadow-2xl hover:-translate-y-1"
          >
            {/* Glow Effects */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] transition-opacity group-hover:opacity-100 opacity-60" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-600/30 rounded-full blur-[100px] transition-opacity group-hover:opacity-100 opacity-60" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Ícono 3D / Gran Número */}
              <div className="w-28 h-28 shrink-0 bg-blue-500/20 backdrop-blur-md rounded-3xl border border-blue-500/30 flex items-center justify-center text-blue-300 group-hover:bg-blue-500/30 group-hover:scale-105 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <span className="text-5xl font-black">1</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-sm border border-blue-500/30">
                    Módulo 1
                  </span>
                  <span className="text-slate-400 font-semibold text-sm">9 Unidades</span>
                </div>

                <h2 className="text-3xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors tracking-tight">
                  Fundamentos de la Música
                </h2>

                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                  Descubre cómo funciona el sonido, aprende a leer el pentagrama de forma intuitiva
                  y conecta el ritmo con la altura.
                </p>
              </div>

              <div className="shrink-0 mt-6 md:mt-0">
                <div className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-2xl font-black group-hover:from-blue-400 group-hover:to-sky-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] text-lg">
                  Entrar{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Módulo 2 */}
          <Link
            href="/teoria/2"
            className="block group relative overflow-hidden bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 rounded-[2.5rem] p-8 md:p-10 transition-all shadow-2xl hover:-translate-y-1"
          >
            {/* Glow Effects */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] transition-opacity group-hover:opacity-100 opacity-60" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-fuchsia-600/30 rounded-full blur-[100px] transition-opacity group-hover:opacity-100 opacity-60" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Ícono 3D / Gran Número */}
              <div className="w-28 h-28 shrink-0 bg-purple-500/20 backdrop-blur-md rounded-3xl border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:bg-purple-500/30 group-hover:scale-105 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <span className="text-5xl font-black">2</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-sm border border-purple-500/30">
                    Módulo 2
                  </span>
                  <span className="text-slate-400 font-semibold text-sm">8 Unidades</span>
                </div>

                <h2 className="text-3xl font-black text-white mb-3 group-hover:text-purple-300 transition-colors tracking-tight">
                  Moverse por el teclado
                </h2>

                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                  Conecta la lectura musical con la ejecución física. Entiende la topografía del
                  piano, tonos, semitonos y alteraciones.
                </p>
              </div>

              <div className="shrink-0 mt-6 md:mt-0">
                <div className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-2xl font-black group-hover:from-purple-400 group-hover:to-fuchsia-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] text-lg">
                  Entrar{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
