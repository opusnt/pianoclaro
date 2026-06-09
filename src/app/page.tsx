"use client";

import { ArrowRight, Sparkles, BookOpen, Music, Trophy, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMastery } from "@/lib/masteryStore";

export default function HomePage() {
  const { stats } = useMastery();
  
  // Calculate a generic level based on XP, just for the badge
  const level = Math.floor(stats.totalXP / 100) + 1;

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-200 relative overflow-hidden pb-12">
      {/* Background Image / Mesh */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero_bg.png"
          alt="Abstract Background"
          fill
          className="object-cover opacity-60 mix-blend-screen"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070b14]/80 to-[#070b14]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[40svh] items-end px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl bg-white/5 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 blur-[60px] rounded-full -mr-20 -mt-20 opacity-50 pointer-events-none" />
            
            <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-sm border border-cyan-500/30">
                <Sparkles className="w-4 h-4" />
                <span>Nivel {level}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-sm border border-amber-500/30">
                <Trophy className="w-4 h-4" />
                <span>{stats.totalXP} XP</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-black leading-[1.1] text-white sm:text-5xl tracking-tight relative z-10">
              Tu Hub Musical
            </h1>
            <p className="mt-4 text-lg text-slate-400 relative z-10">
              Aprende teoría, desbloquea partituras con tus puntos y compite en el ranking global.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Teoría */}
            <Link href="/teoria" className="group flex flex-col bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-xl p-8 transition-all hover:bg-white/10 relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/30 rounded-full blur-[80px] transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 shrink-0 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-300 mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">Ruta Teórica</h3>
                <p className="text-slate-400 text-lg mb-8 flex-1">
                  Aprende el lenguaje musical desde cero, acordes, ritmo y lectura.
                </p>
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  Explorar módulos <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Repertorio */}
            <Link href="/repertorio" className="group flex flex-col bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-xl p-8 transition-all hover:bg-white/10 relative overflow-hidden">
              <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-fuchsia-600/30 rounded-full blur-[80px] transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 shrink-0 bg-fuchsia-500/20 rounded-2xl flex items-center justify-center text-fuchsia-300 mb-6 border border-fuchsia-500/30 group-hover:scale-110 transition-transform">
                  <Music className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">El Repertorio</h3>
                <p className="text-slate-400 text-lg mb-8 flex-1">
                  Toca partituras en el modo Arcade y desbloquea nuevas canciones con XP.
                </p>
                <div className="flex items-center gap-2 text-fuchsia-400 font-bold">
                  Tocar partituras <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Perfil */}
            <Link href="/perfil" className="group flex flex-col bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-xl p-8 transition-all hover:bg-white/10 relative overflow-hidden">
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-600/30 rounded-full blur-[80px] transition-opacity group-hover:opacity-100 opacity-40 pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 shrink-0 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-300 mb-6 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Tu Perfil</h3>
                <p className="text-slate-400 mb-6 flex-1">
                  Analiza tus habilidades en el radar interactivo.
                </p>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  Ver estadísticas <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Ranking */}
            <Link href="/ranking" className="group flex flex-col bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-xl p-8 transition-all hover:bg-white/10 relative overflow-hidden">
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-600/30 rounded-full blur-[80px] transition-opacity group-hover:opacity-100 opacity-40 pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 shrink-0 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-300 mb-6 border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Salón de la Fama</h3>
                <p className="text-slate-400 mb-6 flex-1">
                  Compara tu puntaje con los mejores alumnos.
                </p>
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  Ver Top 10 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>
    </main>
  );
}
