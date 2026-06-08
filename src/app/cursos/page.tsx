import { ArrowRight, GraduationCap, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { COURSES_MOCK } from "@/lib/data/courses";

export default function CoursesCatalogPage() {
  return (
    <main className="min-h-screen bg-[#070b14] text-slate-200 pb-24 md:pb-12">
      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-cyan-900/20 to-transparent">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-sm mb-4 border border-cyan-500/30">
            <GraduationCap className="w-4 h-4" />
            <span>Academia de Piano</span>
          </div>
          <h1 className="text-4xl font-black text-white sm:text-5xl tracking-tight mb-4">
            Entrenamiento de Piano
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Sigue caminos de práctica estructurados para desarrollar tu técnica. Desde tu primera
            nota hasta acompañamientos complejos en el motor Arcade.
          </p>
        </div>
      </section>

      {/* Catálogo de Práctica */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-white mb-6">Niveles de Práctica</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES_MOCK.map((course) => (
              <Link
                href={`/cursos/${course.id}`}
                key={course.id}
                className="group flex flex-col bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-900/20"
              >
                {/* Image Container */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay Play Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white opacity-80" />
                  </div>
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-slate-300 border border-slate-700/50">
                    {course.lessons.length} Lecciones
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">{course.description}</p>

                  <div className="mt-auto flex items-center text-cyan-500 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                    Ver Detalles <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
