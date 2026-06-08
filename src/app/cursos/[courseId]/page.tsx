"use client";

import { BookOpen, CheckCircle2, ChevronLeft, Lock, Music, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProgress } from "@/hooks/useProgress";
import { COURSES_MOCK } from "@/lib/data/courses";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = COURSES_MOCK.find((c) => c.id === courseId);
  const { isLoaded, isLessonCompleted } = useProgress();

  if (!course) {
    return <div className="p-12 text-center text-white">Curso no encontrado</div>;
  }

  // Lógica simple de gating: si la anterior está completada, esta está desbloqueada.
  // La primera siempre está desbloqueada.
  const getLessonStatus = (index: number, id: string) => {
    const completed = isLessonCompleted(id);
    const locked = index > 0 ? !isLessonCompleted(course.lessons[index - 1].id) : false;
    return { completed, locked };
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-200 pb-24 md:pb-12">
      {/* Navbar de Detalle */}
      <div className="sticky top-0 z-30 bg-[#070b14]/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex items-center">
        <Link
          href="/cursos"
          className="flex items-center text-cyan-400 hover:text-cyan-300 font-bold gap-1"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Catálogo</span>
        </Link>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header del Curso */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 items-center md:items-start">
          <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-3xl overflow-hidden relative shadow-2xl shadow-cyan-900/20 border border-white/10">
            <Image src={course.image} alt={course.title} fill className="object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-slate-400 mb-6">{course.description}</p>
            <div className="inline-flex px-4 py-2 bg-slate-800 rounded-full border border-slate-700 text-sm font-bold text-slate-300">
              {course.lessons.length} Lecciones
            </div>
          </div>
        </div>

        {/* Lista de Lecciones de Práctica */}
        <div className="space-y-4">
          {isLoaded &&
            course.lessons.map((lesson, index) => {
              const { completed, locked } = getLessonStatus(index, lesson.id);

              return (
                <Link
                  key={lesson.id}
                  href={locked ? "#" : lesson.href}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    locked
                      ? "bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed"
                      : completed
                        ? "bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                        : "bg-slate-800 border-fuchsia-500/30 hover:border-fuchsia-500/50 hover:bg-slate-800/80 shadow-[0_0_15px_rgba(217,70,239,0.15)]"
                  }`}
                >
                  {/* Thumbnail miniatura */}
                  <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-700 relative overflow-hidden border border-slate-600 flex items-center justify-center">
                    <span className="relative z-10 text-xl font-black text-fuchsia-400/50">🎹</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-bold leading-tight ${locked ? "text-slate-500" : "text-white"}`}
                    >
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {locked ? "Bloqueado" : completed ? "Superado" : "¡A tocar!"}
                    </p>
                  </div>

                  {/* Status Icon */}
                  <div className="shrink-0 pl-2">
                    {completed ? (
                      <CheckCircle2 className="w-8 h-8 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    ) : locked ? (
                      <Lock className="w-6 h-6 text-slate-600" />
                    ) : (
                      <PlayCircle className="w-8 h-8 text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] animate-pulse" />
                    )}
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </main>
  );
}
