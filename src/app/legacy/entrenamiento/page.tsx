"use client";

import { ArrowLeft, Box, CircleDot, Clock, Dices, Link2, Music, Target, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  BadgeGallery,
  PracticeStats,
  SkillProgressBar,
  TrainingModeCard,
} from "@/components/training/MasteryUI";
import { TrainingArena, type TrainingMode } from "@/components/training/TrainingArena";
import { useMastery } from "@/lib/masteryStore";

export default function TrainingDashboardPage() {
  const { mastery, stats, badges } = useMastery();
  const [activeMode, setActiveMode] = useState<TrainingMode | null>(null);

  if (activeMode !== null) {
    return (
      <main className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6">
        <TrainingArena mode={activeMode} onExit={() => setActiveMode(null)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/modulo-1">
            <button
              type="button"
              className="p-3 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-500" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Centro de Entrenamiento</h1>
            <p className="text-slate-500 font-medium">
              Practica cualquier habilidad antes de continuar tu viaje musical.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna Izquierda: Stats y Maestría */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <PracticeStats stats={stats} />

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100">
              <h2 className="text-xl font-black text-slate-800 mb-6">Tu Dominio</h2>
              <SkillProgressBar name="Reconocimiento de Notas" value={mastery.notes} icon={Music} />
              <SkillProgressBar name="Clave de Sol" value={mastery.trebleClef} icon={Target} />
              <SkillProgressBar name="Ritmo y Duración" value={mastery.rhythm} icon={Clock} />
              <SkillProgressBar name="Compases" value={mastery.measures} icon={Box} />
              <SkillProgressBar name="Ligaduras" value={mastery.ties} icon={Link2} />
              <SkillProgressBar name="Puntillos" value={mastery.dottedNotes} icon={CircleDot} />
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100">
              <h2 className="text-xl font-black text-slate-800 mb-6">Logros</h2>
              <BadgeGallery earnedBadges={badges} />
            </div>
          </div>

          {/* Columna Derecha: Modos de Juego */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
            <TrainingModeCard
              title="1. Notas al vuelo"
              subtitle="Reconocimiento rápido"
              icon={Music}
              colorClass="text-sky-500"
              onClick={() => setActiveMode(1)}
            />
            <TrainingModeCard
              title="2. Pentagrama"
              subtitle="Lectura en Clave de Sol"
              icon={Target}
              colorClass="text-indigo-500"
              onClick={() => setActiveMode(2)}
            />
            <TrainingModeCard
              title="3. Ritmo"
              subtitle="Identifica figuras"
              icon={Clock}
              colorClass="text-emerald-500"
              onClick={() => setActiveMode(3)}
            />
            <TrainingModeCard
              title="4. Compases"
              subtitle="Construye en 4/4"
              icon={Box}
              colorClass="text-amber-500"
              onClick={() => setActiveMode(4)}
            />
            <TrainingModeCard
              title="5. Ligaduras"
              subtitle="Separadas vs Fusionadas"
              icon={Link2}
              colorClass="text-fuchsia-500"
              onClick={() => setActiveMode(5)}
            />
            <TrainingModeCard
              title="6. Puntillos"
              subtitle="Comparativas de audio"
              icon={CircleDot}
              colorClass="text-rose-500"
              onClick={() => setActiveMode(6)}
            />
            <TrainingModeCard
              title="7. Desafío Aleatorio"
              subtitle="Adaptado a tus debilidades"
              icon={Dices}
              colorClass="text-slate-800"
              onClick={() => setActiveMode(7)}
            />
            <TrainingModeCard
              title="8. Arcade (60s)"
              subtitle="Entrenamiento contrarreloj"
              icon={Zap}
              colorClass="text-orange-500"
              onClick={() => setActiveMode(8)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
