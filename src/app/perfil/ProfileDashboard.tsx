"use client";

import { useMastery } from "@/lib/masteryStore";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Flame, Trophy, CalendarDays, Award, Star, Activity } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export function ProfileDashboard() {
  const { stats, badges, isLoaded } = useMastery();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUserEmail(session?.user?.email ?? null);
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!isLoaded) return <div className="p-8 text-center animate-pulse">Cargando perfil...</div>;

  const level = Math.floor(stats.totalXP / 100) + 1;
  const xpToNextLevel = 100 - (stats.totalXP % 100);

  // Generate last 30 days for heatmap
  const today = new Date();
  const historySet = new Set(stats.practiceHistory || []);
  const heatmapDays = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];
    return { date: dateStr, studied: historySet.has(dateStr) };
  });

  const availableBadges = [
    { id: "streak-7", title: "Racha de Hierro", desc: "Estudia 7 días seguidos", icon: Flame },
    { id: "sessions-10", title: "Constante", desc: "Completa 10 sesiones", icon: CalendarDays },
    { id: "xp-1000", title: "Maestro del XP", desc: "Acumula 1000 XP", icon: Star },
    { id: "mastery-all", title: "Perfeccionista", desc: "90% en todo el progreso", icon: Trophy },
  ];

  const { mastery } = useMastery();
  const radarData = [
    { subject: "Lectura", A: (mastery.notes + mastery.trebleClef) / 2, fullMark: 100 },
    { subject: "Ritmo", A: (mastery.rhythm + mastery.measures + mastery.ties + mastery.dottedNotes) / 4, fullMark: 100 },
    { subject: "Armonía", A: (mastery.chords + mastery.scales) / 2, fullMark: 100 },
    { subject: "Oído", A: mastery.earTraining, fullMark: 100 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-fuchsia-500 to-sky-500 p-1 flex-shrink-0">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white">
            <User className="w-12 h-12 text-slate-300" />
          </div>
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-slate-800">{userEmail?.split("@")[0] || "Pianista Estelar"}</h1>
          <p className="text-slate-500 mb-4">{userEmail || "Invitado"}</p>
          
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl w-max mx-auto md:mx-0">
            <div className="bg-sky-100 text-sky-600 font-black text-2xl w-12 h-12 flex items-center justify-center rounded-xl">
              {level}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-700">Nivel Actual</div>
              <div className="text-xs text-slate-500">{stats.totalXP} XP Total ({xpToNextLevel} para Nivel {level + 1})</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Streaks & Heatmap */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              Constancia
            </h2>
            <div className="text-right">
              <div className="text-2xl font-black text-orange-500">{stats.currentStreak} días</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Racha Actual</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Últimos 30 días</div>
            <div className="grid grid-cols-[repeat(10,minmax(0,1fr))] gap-2">
              {heatmapDays.map((day, i) => (
                <div 
                  key={i} 
                  title={day.date}
                  className={`aspect-square rounded-md ${
                    day.studied ? 'bg-orange-400' : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="text-sm text-slate-500 text-center font-medium">
            Mejor Racha Histórica: <strong className="text-slate-700">{stats.bestStreak} días</strong>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-fuchsia-500" />
            Vitrina de Medallas
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {availableBadges.map((badge) => {
              const isUnlocked = badges.includes(badge.id);
              const Icon = badge.icon;
              return (
                <div 
                  key={badge.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isUnlocked 
                      ? 'border-fuchsia-100 bg-gradient-to-b from-fuchsia-50 to-white' 
                      : 'border-slate-100 bg-slate-50 opacity-60 grayscale'
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${isUnlocked ? 'text-fuchsia-500' : 'text-slate-400'}`} />
                  <div className="font-bold text-slate-800 text-sm mb-1">{badge.title}</div>
                  <div className="text-xs text-slate-500">{badge.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-emerald-500" />
          Análisis de Habilidades
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Habilidad" dataKey="A" stroke="#0ea5e9" strokeWidth={3} fill="#0ea5e9" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
