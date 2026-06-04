import { ArrowRight, GraduationCap, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070b14] text-slate-200 relative overflow-hidden">
      {/* Background Image / Mesh */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero_bg.png"
          alt="Abstract Background"
          fill
          className="object-cover opacity-60 mix-blend-screen"
          priority
        />
        {/* Gradients to fade out the image at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070b14]/80 to-[#070b14]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[45svh] items-end px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl bg-white/5 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-sm mb-6 border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
              <span>Tu progreso te espera</span>
            </div>
            <h1 className="text-4xl font-black leading-[1.1] text-white sm:text-5xl tracking-tight">
              Bienvenido de vuelta a Piano Claro
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Continúa tu aprendizaje donde lo dejaste. Tu ruta recomendada está lista y
              esperándote.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              Tu Ruta Actual
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Módulo Principal (Módulo 1) */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8 transition-all hover:bg-white/10 group relative overflow-hidden h-full flex flex-col justify-between">
                {/* Glow Effect */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-fuchsia-600/30 rounded-full blur-[100px] transition-opacity group-hover:opacity-100 opacity-60" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-600/30 rounded-full blur-[100px] transition-opacity group-hover:opacity-100 opacity-60" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 font-bold text-sm border border-fuchsia-500/30">
                          Módulo 1
                        </span>
                        <span className="text-slate-400 font-semibold text-sm">9 Unidades</span>
                      </div>

                      <h3 className="text-4xl font-black text-white mb-4 tracking-tight">
                        Fundamentos del Piano
                      </h3>

                      <p className="text-slate-400 text-lg max-w-xl">
                        Descubre cómo funciona el sonido, aprende a leer el pentagrama de forma
                        intuitiva y toca tus primeras notas conectando ritmo y altura.
                      </p>
                    </div>

                    {/* 3D Icon Piano */}
                    <div className="shrink-0 w-32 h-32 md:w-48 md:h-48 relative drop-shadow-[0_0_30px_rgba(236,72,153,0.3)] group-hover:scale-105 transition-transform duration-500 ease-out">
                      <Image
                        src="/icon_piano.png"
                        alt="Piano Keys"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <Link
                      href="/modulos/1/unidad-1"
                      className="inline-flex flex-1 items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] text-lg"
                    >
                      <span>Comenzar Módulo</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      href="/modulos/1/unidad-9"
                      className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all active:scale-95"
                    >
                      <GraduationCap className="w-5 h-5 text-fuchsia-400" />
                      Entrenamiento Final
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / Próximos pasos */}
            <div className="flex flex-col gap-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[50px] -mr-10 -mt-10" />
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 shrink-0 relative drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Image
                      src="/icon_sheet.png"
                      alt="Sheet Music"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-cyan-300 text-sm mb-1 uppercase tracking-wider">
                      Módulo 2
                    </h3>
                    <h4 className="font-black text-white text-xl">Acordes y Armonía</h4>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Aprende a acompañar canciones usando tríadas mayores y menores.
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider border border-white/10">
                  Próximamente
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-fuchsia-500/20 blur-[50px] -mr-10 -mb-10" />
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 shrink-0 relative drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                    <Image
                      src="/icon_metronome.png"
                      alt="Metronome"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-fuchsia-300 text-sm mb-1 uppercase tracking-wider">
                      Catálogo
                    </h3>
                    <h4 className="font-black text-white text-xl">Material Antiguo</h4>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Explora prototipos, minijuegos y lecciones sueltas que sirvieron como base.
                </p>
                <Link
                  href="/legacy/rutas"
                  className="inline-flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-300 font-bold text-sm transition-colors"
                >
                  Explorar Legacy <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
